# Films Watchlist VOD Dashboard — Refresh Instructions

## Step 1 — Sync with Letterboxd

Fetch `https://letterboxd.com/zidanejp/watchlist/` and compare against the FILMS array in `watchlist-dashboard.html`.

- **New films** (on Letterboxd, not in FILMS array): add them — see Step 2
- **Removed films** (in FILMS array, not on Letterboxd): they've been watched — archive them — see Step 3

---

## Step 2 — Add new films

For each new film, add an entry to the FILMS array:

```js
{
  title: '',
  year: 2026,
  slug: '',           // from the film's Letterboxd URL
  poster: '',         // https://a.ltrbxd.com/resized/film-poster/...
  vodDate: null,
  platform: null,
  estimated: false,
  imdbRating: null,   // add only if found in Step 4 below
}
```

Get the poster URL from the film's Letterboxd page (inspect the poster `<img>` src).

---

## Step 3 — Archive removed films

For any film no longer on Letterboxd:
- Remove it from the FILMS array in `watchlist-dashboard.html`
- Add it to the `WATCHED` list in `generate_ics.py` with the watched date (check `https://letterboxd.com/zidanejp/films/diary/` if needed)

---

## Step 4 — IMDb ratings (determines released vs. not yet out)

For **every film** with no `imdbRating`, search IMDb directly:
`https://www.imdb.com/find/?q=[film+title]`

- If the film has a rating on its IMDb page → add `imdbRating: X.X` to the entry. This means the film has had a theatrical release.
- If the film has no rating yet → leave `imdbRating` as `null`. This means it hasn't been released.

This step is important — the dashboard uses the presence of `imdbRating` to distinguish "Not Out Yet" from "Waiting" (released but not yet on VOD).

---

## Step 5 — Streaming dates

For every film with `vodDate: null` or `estimated: true`, search for a confirmed digital release date.

**Primary source — whentostream.com:**
Search each film by name. `whentostream.com` is blocked in the sandbox, so use WebSearch with queries like:
`site:whentostream.com "[film title]"`

- If a confirmed date is found: set `vodDate: 'YYYY-MM-DD'`, `platform: '...'`, `estimated: false`
- If only an estimated/expected date is found: set `estimated: true` and add a `note` field explaining (e.g. `'Digital expected Jun 2026'`)
- US digital release dates are acceptable — JP can access US platforms (Amazon, Apple TV+, etc.)

**If whentostream has no result:**
Run a general web search: `"[film title]" digital release date rent buy`
Check the film's IMDb page — sometimes the streaming date appears there.

**Confirmed = streaming now or announced with a specific date. Estimated = expected window only.**

⚠️ Never use JustWatch as the sole source — its data can be weeks out of date.
⚠️ Pre-order ≠ available. Only mark `vodDate` if it is confirmed streaming now or on a specific announced date.

---

## Finally

- Update the footer in `watchlist-dashboard.html`: `Last updated: DD Mon YYYY (refresh #N)`
- Run `push.bat` to deploy

---

## Data Rules

**Platform names — use consistent formatting:**
`'Prime Video'` · `'Netflix'` · `'Disney+'` · `'Apple TV+'` · `'MUBI'` · `'Sky Cinema / NOW'` · `'Paramount+'`
For multiple platforms: `'Prime Video / Apple TV+'`

**IMDb ratings:** Only populate `imdbRating` from the film's actual IMDb page. Never guess or use aggregator estimates.

---

## Reference

- Letterboxd watchlist: `https://letterboxd.com/zidanejp/watchlist/`
- Letterboxd diary: `https://letterboxd.com/zidanejp/films/diary/`
- Live dashboard: `https://jplappage.github.io/dashboard/`
- Plex links use: `https://watch.plex.tv/en-GB/movie/{letterboxd-slug}`
- JP is based in **GB** but US digital platforms are accessible and dates count
