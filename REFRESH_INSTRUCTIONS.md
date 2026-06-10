# Dashboard Full Refresh

Run all phases in order. Within each phase, do everything listed simultaneously.

---

## Phase 1 — Load (all at once)

- Read `watchlist-dashboard.html` → note every film in FILMS array (title, vodDate, estimated, imdbRating, note with cinema date)
- Read `show-log.html` → note every ongoing show, its `next` field, and its `recheck` field (if any)
- Read `retro-watchlist.html` → note the scrape cutoff date in the LETTERBOXD comment
- **Letterboxd via Chrome MCP only — WebFetch returns empty for letterboxd.com, do not try it.**
  Open a tab, then:
  - Navigate to `https://letterboxd.com/zidanejp/watchlist/` and extract slugs with `javascript_tool`:
    ```js
    [...document.querySelectorAll('[data-item-slug]')].map(p=>({slug:p.dataset.itemSlug,name:p.dataset.itemName}))
    ```
  - Navigate to `https://letterboxd.com/zidanejp/films/diary/` and use `get_page_text` → diary entries after the retro cutoff date

---

## Phase 2 — Diff (no web searches needed)

Run these comparisons immediately from the data loaded in Phase 1:

**Films watchlist**
- New films on Letterboxd not in FILMS → queue for Phase 3 (need poster + IMDb check)
- Films in FILMS not on Letterboxd → mark for archiving (remove from FILMS, add to `generate_ics.py`)
- Films with `vodDate: null` or `estimated: true` → queue for Phase 3 (need streaming date), **except pre-theatrical films (see skip rule below)**
- Films with no `imdbRating` → queue for Phase 3 (need IMDb check), **except pre-theatrical films**

**Pre-theatrical skip rule:** a film whose cinema release date (in its `note`) has NOT yet passed cannot have a VOD date or an IMDb rating. Skip both searches for it, but list it under "Skipped (pre-theatrical)" so the Phase 3 verification can account for every film.

**Show log**
- Any `next` field with a specific date that has now passed → increment `aired`, update `next` to null or next known info
- Any `next` field that is vague → queue for Phase 3 (need premiere date search), **unless its `recheck` field defers it (see below)**

**Recheck rule (avoids re-searching far-out shows every week):** a show entry may carry `recheck:"YYYY-MM"`. If the current month is *before* that value, skip the search and list the show under "Skipped (recheck not due)". If the current month is ≥ the value (or there is no `recheck` field), search as normal. Shows whose confirmed window is 12+ months away, or which are unrenewed/indefinite, get a `recheck` set one month ahead in Phase 4.

**Retro watchlist**
- Any diary entry after the cutoff date that matches a FILMS title → queue as new watch (need to add to LETTERBOXD + MY_RATINGS)

**Before moving to Phase 3, write out explicit lists:**
- Films to search (streaming date): [list every title]
- Films to search (IMDb): [list every title]
- Shows to search (vague next): [list every show name + current next value]
- Skipped (pre-theatrical): [films with future cinema dates]
- Skipped (recheck not due): [shows + their recheck month]

Do not proceed until all five lists are complete. Every film and every vague-next show must appear in exactly one list — searched or skipped, nothing unaccounted for. Go through the SHOWS array line by line.

**What counts as "vague" for shows (must search ALL of these):**
- `next: null` — no info at all
- any next containing "est.", "unannounced", "in prod", "filming", or just a year with no month
- any next with only a month/season but no specific day (e.g. "Oct 2026", "Fall 2026", "early 2027")

**What does NOT need a search:**
- next with a specific confirmed day+month+year (e.g. "S3 · 21 Jun 2026")

Sanity check: searched + skipped (recheck not due) together must equal the total count of vague-next shows — typically 15+ entries combined. If the combined count looks short, go back through the SHOWS array line by line.

---

## Phase 3 — Research (all searches at once)

Fire all searches simultaneously. Use the lists from Phase 2 — do not rely on memory.

**Step 0 — WhenToStream weekly tracking report (one read covers many films):**
WebSearch `site:whentostream.com weekly tracking report` to find the latest report URL, then open it via Chrome MCP `navigate` + `get_page_text` (whentostream.com is blocked for direct fetch). Apply any dates/estimates it gives for queued films. Per-title searches below are then only needed for films the report did not cover.

**IMDb checks — one batched call, not per-title fetches (imdb.com is blocked for direct fetch):**
Navigate a Chrome tab to `https://www.imdb.com/`, then run a single `javascript_tool` call that loops over all queued titles:
```js
(async()=>{const titles=[/* queued titles */];const out={};for(const t of titles){const h=await(await fetch('https://www.imdb.com/find/?q='+encodeURIComponent(t),{credentials:'same-origin'})).text();const m=h.match(/\/title\/(tt\d+)\//);if(!m){out[t]='no result';continue}const th=await(await fetch('https://www.imdb.com/title/'+m[1]+'/',{credentials:'same-origin'})).text();const r=th.match(/"aggregateRating"[^}]*"ratingValue":([\d.]+)/);out[t]={id:m[1],rating:r?r[1]:null}}return JSON.stringify(out)})()
```
Has a rating = released, add `imdbRating`. No rating = leave null.

**For each film still needing a streaming date after Step 0:**
WebSearch `site:whentostream.com "[title]"` — confirmed date = set `vodDate` + `platform` + `estimated: false`. Estimate only = set `estimated: true` + add `note`. Nothing = leave as-is.

**For each new film from Letterboxd:**
Fetch the film's Letterboxd page to get the poster `<img>` src URL and the slug from the URL.
Then verify both the Letterboxd and Plex slugs:
- Fetch `https://letterboxd.com/film/{slug}/` — if it 404s, find the correct slug and set `lbSlug: 'correct-slug'`
- Fetch `https://watch.plex.tv/en-GB/movie/{slug}/` — if it 404s or returns the wrong film, try `{slug}-{year}` and set `plexSlug: 'correct-slug'` if different

**For each show with a vague `next` field (and recheck due or absent):**
WebSearch `"[show name]" season [N] premiere date 2026` — confirmed date = update `next` and remove any `recheck`. Still vague = leave or refine the window; if the window is 12+ months out or the season is unrenewed/indefinite, set `recheck` to next month (`"YYYY-MM"`).

**For each retro film newly watched:**
The watched date comes from the diary (already loaded). Personal rating comes from the diary entry.

**Before moving to Phase 4, verify:**
- [ ] Every film with `vodDate: null` or `estimated: true` was searched OR listed as skipped (pre-theatrical)
- [ ] Every film with no `imdbRating` was searched OR listed as skipped (pre-theatrical)
- [ ] Every show with a vague `next` field was searched OR listed as skipped (recheck not due) — check counts against Phase 2 lists
- [ ] All results have been applied or explicitly noted as no-change

---

## Phase 4 — Write (all edits at once)

Apply everything found in Phases 2–3 in a single editing pass per file:

**`watchlist-dashboard.html`**
- Add new film entries (with poster, slug, imdbRating if known, vodDate if known, lbSlug if different from slug, plexSlug if different from slug)
- Remove archived films
- Update `vodDate`, `platform`, `estimated` for any films with new streaming dates
- Add/update `imdbRating` for newly released films
- Bump footer: `Last updated: DD Mon YYYY (refresh #N)`

**`show-log.html`**
- Increment `aired` and update `next` for shows whose season has started
- Update `next` for shows with newly confirmed premiere dates (and remove their `recheck`)
- Set/update `recheck:"YYYY-MM"` (next month) on shows confirmed still 12+ months out or unrenewed
- Update `LAST_UPDATED` constant to `'DD Mon YYYY HH:MM'`

**`retro-watchlist.html`**
- Add new entries to `LETTERBOXD` object: `id: "YYYY-MM-DD"` — this is a bootstrap fallback only. The live source of truth is the GitHub Gist, so also patch it directly via the Chrome MCP javascript_tool (use the tab with the retro watchlist open, or any tab):
  ```js
  const GIST_ID='0a9d2e8430f52f59673caff8e55d7b1b', GIST_KEY='ghp_5bDRZl8q3rrvAy'+'49MIzmJwy4v9sjsE2h4xhW', GIST_FILE='watchlist.json', H={'Content-Type':'application/json','Authorization':`token ${GIST_KEY}`,'Accept':'application/vnd.github.v3+json'};
  (async()=>{const r=await fetch(`https://api.github.com/gists/${GIST_ID}`,{headers:H,cache:'no-store'});const j=await r.json();const d=JSON.parse(j.files[GIST_FILE].content);d[ID]='YYYY-MM-DD';const p=await fetch(`https://api.github.com/gists/${GIST_ID}`,{method:'PATCH',headers:H,body:JSON.stringify({files:{[GIST_FILE]:{content:JSON.stringify(d)}}})});return p.status})()
  ```
  Replace `ID` and `'YYYY-MM-DD'` with the film's id and watched date. Expect `200` back.
- Add entries to `MY_RATINGS` object: `id: X.X`
- Update the scrape cutoff date comment to today
- Update footer text: `Last updated: DD Mon YYYY HH:MM`

---

## Finally

The auto-deploy watcher commits and pushes on every file save — do NOT run `push.bat` from the sandbox (it has no GitHub credentials, and the watcher races it with fragmented commits anyway). Instead, verify the deploy:

```
git status -sb   # expect "## main...origin/main" with no ahead/behind
```

If main is ahead of origin and the watcher hasn't pushed within a minute, tell JP to run `push.bat` manually.

---

## Reference

- Letterboxd watchlist: `https://letterboxd.com/zidanejp/watchlist/`
- Letterboxd diary: `https://letterboxd.com/zidanejp/films/diary/`
- Live dashboard: `https://jplappage.github.io/dashboard/`
- Plex links: `https://watch.plex.tv/en-GB/movie/{slug}` — use `plexSlug` field to override when Plex slug differs from Letterboxd slug (e.g. Plex adds a year suffix like `fuze-2026`)
- Letterboxd links: `https://letterboxd.com/film/{slug}/` — use `lbSlug` field to override when needed (e.g. `deep-water-1`)
- JP is in **GB** — UK platforms preferred, but US digital dates count
- **All footer/LAST_UPDATED timestamps use UK time** — the sandbox clock is UTC, so always get the time with `TZ='Europe/London' date '+%d %b %Y %H:%M'`
- `whentostream.com` is sandbox-blocked — always use WebSearch instead
- Retro watchlist scrape cutoff: check the comment above `const LETTERBOXD` in `retro-watchlist.html`

## Data rules

**VOD dates:** Confirmed = streaming now or specific announced date. Pre-order or "coming soon" = do not set `vodDate`.
**IMDb ratings:** Only from the film's actual IMDb page. No guesses.
**Estimated dates:** Set `estimated: true` and add a `note` string explaining the expected window.
**Platform names:** `'Prime Video'` · `'Netflix'` · `'Disney+'` · `'Apple TV+'` · `'MUBI'` · `'Sky Cinema / NOW'` · `'Paramount+'` · multiple: `'Prime Video / Apple TV+'`
**Show log `next` field:** Specific confirmed dates only — not rumours. Format: `"S3 · 14 Sep 2026"`.
