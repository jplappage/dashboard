# Dashboard Full Refresh

Run all phases in order. Within each phase, do everything listed simultaneously.

---

## Phase 1 — Load (all at once)

- Read `watchlist-dashboard.html` → note every film in FILMS array (title, vodDate, estimated, imdbRating)
- Read `show-log.html` → note every ongoing show and its `next` field
- Read `retro-watchlist.html` → note the scrape cutoff date in the LETTERBOXD comment
- Fetch `https://letterboxd.com/zidanejp/watchlist/` → full current watchlist
- Fetch `https://letterboxd.com/zidanejp/films/diary/` → diary entries after the retro cutoff date

---

## Phase 2 — Diff (no web searches needed)

Run these comparisons immediately from the data loaded in Phase 1:

**Films watchlist**
- New films on Letterboxd not in FILMS → queue for Phase 3 (need poster + IMDb check)
- Films in FILMS not on Letterboxd → mark for archiving (remove from FILMS, add to `generate_ics.py`)
- Films with `vodDate: null` or `estimated: true` → queue for Phase 3 (need streaming date)
- Films with no `imdbRating` → queue for Phase 3 (need IMDb check)

**Show log**
- Any `next` field with a specific date that has now passed → increment `aired`, update `next` to null or next known info
- Any `next` field that is vague → queue for Phase 3 (need premiere date search)

**Retro watchlist**
- Any diary entry after the cutoff date that matches a FILMS title → queue as new watch (need to add to LETTERBOXD + MY_RATINGS)

**Before moving to Phase 3, write out explicit lists:**
- Films to search (streaming date): [list every title]
- Films to search (IMDb): [list every title]
- Shows to search (vague next): [list every show name + current next value]

Do not proceed until all three lists are complete. The show list must account for every entry in the SHOWS array — go through it line by line.

---

## Phase 3 — Research (all searches at once)

Fire all searches simultaneously. Use the lists from Phase 2 — do not rely on memory.

**For each film needing an IMDb check:**
Search `https://www.imdb.com/find/?q=[title]` — does it have a rating? Yes = released, add `imdbRating`. No = leave null.

**For each film needing a streaming date:**
WebSearch `site:whentostream.com "[title]"` — confirmed date = set `vodDate` + `platform` + `estimated: false`. Estimate only = set `estimated: true` + add `note`. Nothing = leave as-is.

**For each new film from Letterboxd:**
Fetch the film's Letterboxd page to get the poster `<img>` src URL and the slug from the URL.
Then verify both the Letterboxd and Plex slugs:
- Fetch `https://letterboxd.com/film/{slug}/` — if it 404s, find the correct slug and set `lbSlug: 'correct-slug'`
- Fetch `https://watch.plex.tv/en-GB/movie/{slug}/` — if it 404s or returns the wrong film, try `{slug}-{year}` and set `plexSlug: 'correct-slug'` if different

**For each show with a vague `next` field:**
WebSearch `"[show name]" season [N] premiere date 2026` — confirmed date = update `next`. Still vague = leave or refine the window.

**For each retro film newly watched:**
The watched date comes from the diary (already loaded). Personal rating comes from the diary entry.

**Before moving to Phase 4, verify:**
- [ ] Every film with `vodDate: null` or `estimated: true` was searched
- [ ] Every film with no `imdbRating` was searched
- [ ] Every show with a vague `next` field was searched (check count against Phase 2 list)
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
- Update `next` for shows with newly confirmed premiere dates

**`retro-watchlist.html`**
- Add new entries to `LETTERBOXD` object: `id: "YYYY-MM-DD"`
- Add entries to `MY_RATINGS` object: `id: X.X`
- Update the scrape cutoff date comment to today

---

## Finally

Run `push.bat` to deploy.

---

## Reference

- Letterboxd watchlist: `https://letterboxd.com/zidanejp/watchlist/`
- Letterboxd diary: `https://letterboxd.com/zidanejp/films/diary/`
- Live dashboard: `https://jplappage.github.io/dashboard/`
- Plex links: `https://watch.plex.tv/en-GB/movie/{slug}` — use `plexSlug` field to override when Plex slug differs from Letterboxd slug (e.g. Plex adds a year suffix like `fuze-2026`)
- Letterboxd links: `https://letterboxd.com/film/{slug}/` — use `lbSlug` field to override when needed (e.g. `deep-water-1`)
- JP is in **GB** — UK platforms preferred, but US digital dates count
- `whentostream.com` is sandbox-blocked — always use WebSearch instead
- Retro watchlist scrape cutoff: check the comment above `const LETTERBOXD` in `retro-watchlist.html`

## Data rules

**VOD dates:** Confirmed = streaming now or specific announced date. Pre-order or "coming soon" = do not set `vodDate`.
**IMDb ratings:** Only from the film's actual IMDb page. No guesses.
**Estimated dates:** Set `estimated: true` and add a `note` string explaining the expected window.
**Platform names:** `'Prime Video'` · `'Netflix'` · `'Disney+'` · `'Apple TV+'` · `'MUBI'` · `'Sky Cinema / NOW'` · `'Paramount+'` · multiple: `'Prime Video / Apple TV+'`
**Show log `next` field:** Specific confirmed dates only — not rumours. Format: `"S3 · 14 Sep 2026"`.
