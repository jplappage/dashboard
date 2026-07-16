# Dashboard Full Refresh

Run all phases in order. Within each phase, do everything listed simultaneously.

---

## Phase 1 — Load (all at once)

- **Gist backup:** copy the main gist into the backup gist entirely within the Chrome tab (content must not pass through tool results — a data filter blocks it). Token comes from `gist-token.txt`:
  ```js
  const K='TOKEN_FROM_FILE',H={'Content-Type':'application/json','Authorization':'token '+K,'Accept':'application/vnd.github.v3+json'};
  (async()=>{const m=await (await fetch('https://api.github.com/gists/5411ac8d12fdc31aa3fa73e4d66f6377',{headers:H,cache:'no-store'})).json();const r=await fetch('https://api.github.com/gists/eb36ba9936a6a43b2d3bf4ff437ed015',{method:'PATCH',headers:H,body:JSON.stringify({files:{'watchlist-backup.json':{content:m.files['watchlist.json'].content}}})});return r.status})()
  ```
  Expect `200`. The backup gist keeps revision history, so older copies are recoverable there.
- Read `films-data.js` → note every film in FILMS array (title, vodDate, estimated, imdbRating, note with cinema date)
- Read `shows-data.js` → note every ongoing show, its `next` field, and its `recheck` field (if any)
- Read `retro-data.js` → note the scrape cutoff date in the RETRO_LETTERBOXD comment
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
- Films in FILMS not on Letterboxd → mark for archiving (move from FILMS to the WATCHED list, both in `films-data.js` — this keeps it on the page calendar and in watchlist.ics)
- Films with `vodDate: null` or `estimated: true` → queue for Phase 3 (need streaming date), **except pre-theatrical films (see skip rule below)**
- Films with no `imdbRating` → queue for Phase 3 (need IMDb check), **except pre-theatrical films**
- Films with a **confirmed** `vodDate` (`estimated: false`) that is still in the future → queue for Phase 3 **re-verification**. A confirmed date is NOT locked: studios push already-announced dates, and once a film has a date it drops off WhenToStream's weekly report, so a per-film re-check is the only way to catch a slip. (Past miss: *The Death of Robin Hood* moved 21 Jul → 4 Aug and was skipped because it already had a firm date.)

**Pre-theatrical skip rule:** a film whose cinema release date (in its `note`) has NOT yet passed cannot have a VOD date or an IMDb rating. Skip both searches for it, but list it under "Skipped (pre-theatrical)" so the Phase 3 verification can account for every film.

**Show log**

> **TVmaze automation note:** `update-show-dates.yml` runs every 6 hours and auto-confirms premiere dates via TVmaze for ONGOING shows with a vague `next` (it sets `next` to the confirmed date and drops `recheck` when TVmaze has episode 1 of the next season scheduled). So manual Phase 3 searches are a *fallback* — they mainly catch dates TVmaze doesn't have yet (renewal announcements without scheduled episodes). Still list every vague show below, but expect many to resolve themselves between refreshes.

- Any `next` field with a specific date that has now passed → increment `aired`, update `next` to null or next known info, AND set `airing:"S<N> · <weekday>s"` + `airingUntil:"YYYY-MM-DD"` (search for the confirmed finale date; these power the hub-page teaser). **Use the UK viewing day** — US Sunday-night shows land Monday in the UK, so label them Mondays and set `airingUntil` to the day after the US finale.
- Any `airingUntil` date that has now passed → remove the `airing` and `airingUntil` fields from that show
- Any `next` field that is vague → queue for Phase 3 (need premiere date search), **unless its `recheck` field defers it (see below)**

**Recheck rule (avoids re-searching shows multiple times in the same week):** a show entry may carry `recheck:"YYYY-MM-DD"`. If today's date is *before* that value, skip the search and list the show under "Skipped (recheck not due)". If today is ≥ the value (or there is no `recheck` field), search as normal. Shows still without a confirmed date after a search get a `recheck` set one week ahead in Phase 4.

**Retro watchlist**
- Any diary entry after the cutoff date that matches a FILMS title → queue as new watch (need to add to LETTERBOXD + MY_RATINGS)

**Before moving to Phase 3, write out explicit lists:**
- Films to search (streaming date): [list every title]
- Films to search (IMDb): [list every title]
- Films to re-verify (confirmed future vodDate): [every film with `estimated: false` and a future `vodDate`]
- Shows to search (vague next): [list every show name + current next value]
- Skipped (pre-theatrical): [films with future cinema dates]
- Skipped (recheck not due): [shows + their recheck date]

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
Navigate directly to `https://whentostream.com/[slug]-[year]/` via Chrome MCP and `get_page_text` — **do not rely solely on the weekly tracker**, which only shows estimates and often lags behind confirmed per-film announcements. The per-film page shows the actual confirmed `VOD Release Date` field. If the page 404s, fall back to WebSearch `site:whentostream.com "[title]"` to find the correct URL. Confirmed date = set `vodDate` + `platform` + `estimated: false` + remove any `note`. Estimate only = set `estimated: true` + update `note`. Nothing = leave as-is.

**For each film with a confirmed future `vodDate` (re-verification — catches delays):**
Navigate to `https://whentostream.com/[slug]-[year]/` via Chrome MCP and read the `VOD Release Date` field (fall back to WebSearch `"[title]" digital streaming release date` if the page 404s or the scrape returns nothing). If the confirmed date has **moved**, update `vodDate` to the new date. If it still matches, leave as-is. Note WhenToStream per-film pages sometimes show only the later free-SVOD date and read as "nodate" for the PVOD/digital window — when in doubt, confirm the buy/rent digital date with a quick WebSearch before changing anything.

**For each new film from Letterboxd:**
Fetch the film's Letterboxd page to get the poster `<img>` src URL and the slug from the URL.
Then verify both the Letterboxd and Plex slugs:
- Fetch `https://letterboxd.com/film/{slug}/` — if it 404s, find the correct slug and set `lbSlug: 'correct-slug'`
- Fetch `https://watch.plex.tv/en-GB/movie/{slug}/` — if it 404s or returns the wrong film, try `{slug}-{year}` and set `plexSlug: 'correct-slug'` if different

**For each show with a vague `next` field (and recheck due or absent):**
WebSearch `"[show name]" season [N] premiere date 2026` — confirmed date = update `next` and remove any `recheck`. Still vague = leave or refine the window, and set `recheck` to one week ahead (`"YYYY-MM-DD"`), aligned to a Friday — most release-date announcements cluster midweek and WhenToStream's tracker rounds them up on Fridays.

**For each retro film newly watched:**
The watched date comes from the diary (already loaded). Personal rating comes from the diary entry.

To get the personal rating, navigate to `https://letterboxd.com/zidanejp/film/{slug}/` and extract the `rated-N` CSS class from the DOM:
```js
[...document.querySelectorAll('[class*="rated-"]')].map(el=>el.className.toString())
```
**Do NOT infer the rating from `rated-N` alone** — the class value does not reliably map to star count without visual confirmation. Instead, also extract the `aria-label` which contains the plain-English rating:
```js
[...document.querySelectorAll('[aria-label*="star"], [aria-label*="rating"], .rating[aria-label]')].map(el=>el.getAttribute('aria-label'))
```
If `aria-label` is unavailable, take a screenshot of the page and count the filled stars visually. The review page header shows stars like `★★` or `★★½` — use that as the source of truth. Previous errors have come from misreading `rated-5` as 2.5 stars when the actual rating was 2.0 stars.

**Before moving to Phase 4, verify:**
- [ ] Every film with `vodDate: null` or `estimated: true` was searched OR listed as skipped (pre-theatrical)
- [ ] Every film with no `imdbRating` was searched OR listed as skipped (pre-theatrical)
- [ ] Every film with a confirmed future `vodDate` was re-verified against WhenToStream (date unchanged or updated)
- [ ] Every show with a vague `next` field was searched OR listed as skipped (recheck not due) — check counts against Phase 2 lists
- [ ] All results have been applied or explicitly noted as no-change

---

## Phase 4 — Write (all edits at once)

Apply everything found in Phases 2–3 in a single editing pass per file:

**`films-data.js`** (single source of truth — do NOT edit film data in the HTML or python files)
- Add new film entries (with poster, slug, imdbRating if known, vodDate if known, lbSlug if different from slug, plexSlug if different from slug)
- Remove archived films from FILMS and append them to the `WATCHED` array (title + vodDate + imdbRating) so they stay on the calendar
- Update `vodDate`, `platform`, `estimated` for any films with new streaming dates
- Add/update `imdbRating` for newly released films

**`watchlist-dashboard.html`** — no manual edits. The footer (`Last updated` + refresh #) auto-stamps via `.github/workflows/stamp-last-updated.yml` whenever a data file is pushed.

**`watchlist.ics`** — do NOT regenerate locally. GitHub rebuilds it automatically whenever `films-data.js` is pushed (see `.github/workflows/rebuild-calendar.yml`).

**`shows-data.js`** (single source of truth for the SHOWS array)
- Increment `aired` and update `next` for shows whose season has started
- Update `next` for shows with newly confirmed premiere dates (and remove their `recheck`)
- Set/update `recheck:"YYYY-MM-DD"` (one week ahead, aligned to a Friday) on shows searched but still without a confirmed date

**`show-log.html`** — no manual edits. `LAST_UPDATED` auto-stamps via the same workflow.

**`retro-data.js`** (single source of truth for RETRO_FILMS / RETRO_LETTERBOXD / RETRO_RATINGS — do NOT edit retro film data in the HTML; the page footer auto-stamps)
- Add new entries to `RETRO_LETTERBOXD` object: `id: "YYYY-MM-DD"` — this is a bootstrap fallback only. The live source of truth is the GitHub Gist, so also patch it directly via the Chrome MCP javascript_tool (use the tab with the retro watchlist open, or any tab):
  The token is NOT in this file (it's a secret — never commit it). Read it from `gist-token.txt` in the project root (gitignored) and substitute it for `TOKEN_FROM_FILE` below:
  ```js
  const GIST_ID='5411ac8d12fdc31aa3fa73e4d66f6377', GIST_KEY='TOKEN_FROM_FILE', GIST_FILE='watchlist.json', H={'Content-Type':'application/json','Authorization':`token ${GIST_KEY}`,'Accept':'application/vnd.github.v3+json'};
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
**Show log `next` field:** Only a full **day + month + year** counts as a confirmed date (e.g. `"S3 · 14 Sep 2026"`). A month+year alone (e.g. `"Oct 2026"`) is an estimate — the show-log page files it under *Awaiting Date*, not *Date Announced*. Format for confirmed: `"S3 · 14 Sep 2026"`.

**3-month reliability rule:** A premiere/VOD date more than **3 months** in the future is not dependable yet — treat it as an estimate only, even if officially announced. For shows: still store the real date in `next` (e.g. `"S3 · 11 Nov 2026"`); the show-log page automatically keeps it in *Awaiting Date* until it falls within the 3-month window, then promotes it to *Date Announced*. For films: don't set a firm `vodDate` for a date >3 months out — keep `estimated: true` with a `note` describing the window.
