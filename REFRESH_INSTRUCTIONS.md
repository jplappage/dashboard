# Watchlist VOD Dashboard — Refresh Instructions

## Step 1 — Check Letterboxd for film changes
→ `https://letterboxd.com/zidanejp/watchlist/`

Compare the watchlist against the FILMS array in `watchlist-dashboard.html`.
- **Added** films: note them for Step 3
- **Removed** films: note them for Step 4

## Step 2 — Check IMDB for TV show changes
→ `https://www.imdb.com/user/p.ddabjmjar4tan4zozpsg3dpe7a/watchlist/`

Compare against the TV_SHOWS array in `watchlist-dashboard.html`.
- **Added** shows: note them for Step 3
- **Removed** shows: note them for Step 4
- For each existing show, check for upcoming season/premiere/finale dates and update `streamDate`, `finaleDate`, `note`, `isNew` as needed

## Step 3 — Add new films and shows
For each new film from Step 1:
```js
{
  title: '',
  year: 2026,
  slug: '',           // letterboxd slug (from the film's letterboxd URL)
  poster: '',         // https://a.ltrbxd.com/resized/film-poster/...
  vodDate: null,
  platform: null,
  estimated: false,
  imdbRating: 7.5,    // only if the film has been released and is rated on imdb.com
}
```
For each new TV show from Step 2:
```js
{
  title: '',
  season: 1,
  slug: '',
  poster: '',
  streamDate: 'YYYY-MM-DD',
  finaleDate: null,
  platform: '',
  note: '',
  isNew: true,
  imdbRating: 8.0,
}
```

## Step 4 — Archive removed films and shows
For any film/show no longer on the Letterboxd or IMDB watchlist:
- Check `https://letterboxd.com/zidanejp/films/diary/` to confirm it was watched
- Remove it from the FILMS or TV_SHOWS array in the dashboard
- Add it to the `WATCHED` list in `generate_ics.py` with the watched date if known

## Step 5 — Look up streaming dates
For every film/show with `vodDate: null` or `estimated: true`:
- Search for a confirmed streaming date
- **Only update if the film is confirmed as actually streaming** — not pre-order, not "coming soon" listings
- Verify on the platform's own website (e.g. sky.com/watch, primevideo.com, mubi.com)
- Update `vodDate`, `platform`, and set `estimated: false` if now confirmed

---

## Finally
- Update the footer: `Last updated: DD Mon YYYY (refresh #N)`
- The ICS calendar regenerates and deploys automatically on save

---

## Data Quality Rules

**VOD dates:**
- Pre-order ≠ available. Only mark `vodDate` if it is streaming right now.
- Always verify on the platform's own site, not search results or aggregators.

**IMDB ratings:**
- Only add `imdbRating` if the film has been released and has a rating on its IMDB page.
- Films releasing today or in future will not have a real rating yet.

**Platform names — use consistent formatting:**
`'Prime Video'` · `'Netflix'` · `'Disney+'` · `'Apple TV+'` · `'MUBI'` · `'Sky Cinema / NOW'` · `'Paramount+'`
For multiple: `'Prime Video / Apple TV+'`

---

## Reference
- JP is based in **GB** — use UK streaming platforms and dates
- Cinema release dates are irrelevant — VOD/streaming only
- Live site: `https://jplappage.github.io/dashboard/`
- Letterboxd: `https://letterboxd.com/zidanejp/watchlist/`
- Plex links: `https://watch.plex.tv/en-GB/movie/{letterboxd-slug}`
- `whentostream.com` is blocked in the sandbox — use WebSearch instead
