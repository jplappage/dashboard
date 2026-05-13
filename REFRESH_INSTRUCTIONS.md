# Watchlist VOD Dashboard — Refresh Instructions

When the user asks to refresh the watchlist dashboard (`watchlist-dashboard.html`), follow these steps in order:

## 1. Re-scrape the Letterboxd watchlist
```bash
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  "https://letterboxd.com/zidanejp/watchlist/" \
  | grep -o 'data-item-full-display-name="[^"]*"' \
  | sed 's/data-item-full-display-name="//;s/"//'
```
- Compare the result against the current FILMS array in `watchlist-dashboard.html`
- Note any **added** or **removed** films
- For newly added films, also fetch poster URLs:
  ```bash
  curl -s -A "Mozilla/5.0" "https://letterboxd.com/film/{slug}/" \
    | grep -o '"image":"https://a\.ltrbxd[^"]*"'
  ```

## 2. Check for VOD date updates
For any film currently showing `vodDate: null` (i.e. `??`), run WebSearch queries like:
> `"{Film Title}" {year} VOD digital release date streaming`

Priority sources (in order): WhenToStream, JustWatch, Bingebase, DreadCentral, ScreenRant.

Also re-check films with `estimated: true` — they may now have confirmed dates.

## 3. Highlight new release dates
In the updated HTML, mark any **newly discovered VOD dates** (dates that were previously `null` or estimated) with a `🆕` icon next to the date in the card body, e.g.:
```html
<div class="card-date date-soon">🆕 12 Jun 2026</div>
```
This highlight should persist in the file (it's just a visual marker — no auto-expiry needed).

## 4. Update the dashboard
- Add any new films (with poster, vodDate, platform, estimated fields)
- Remove any films no longer on the watchlist
- Update changed dates
- Update the `Last updated:` line at the bottom of the HTML

## TV Shows (IMDB Watchlist)
IMDB is blocked by the sandbox proxy so the watchlist cannot be scraped automatically. Instead, maintain the TV_SHOWS array manually in the HTML based on what the user tells you.

**Current TV shows to track:**
- The Boys (Prime Video) — check current season streaming status each refresh
- Spider-Noir (Prime Video) — Season 1 premieres May 27, 2026

**On each refresh, for each TV show:**
- WebSearch: `"{Show Title}" season {N} streaming {platform} 2026`
- Update `streamDate` if a new season has started
- Update `note` with episode count / finale date info
- Set `isNew: true` if the season just started since the last refresh
- If user tells you a show has been added/removed from their IMDB watchlist, add/remove it from the TV_SHOWS array

## Notes
- The user only cares about **VOD/digital/streaming** dates, NOT cinema release dates
- Plex links use the pattern: `https://watch.plex.tv/en-GB/movie/{letterboxd-slug}`
- `whentostream.com` is blocked by the sandbox proxy — use WebSearch instead
- `a.ltrbxd.com` poster images load fine in the browser but can't be curl-fetched from the sandbox
- Today's context: user is JP (jplappage@outlook.com), based in GB
