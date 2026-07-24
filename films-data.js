// ═══════════════════════════════════════════════════════════════════════════
// FILMS WATCHLIST DATA — the single source of truth
// Loaded by watchlist-dashboard.html and read by generate_ics.py.
// During a refresh, edit THIS file only — not the HTML, not the python script.
// (Saving this file also triggers an automatic watchlist.ics rebuild on GitHub.)
// ═══════════════════════════════════════════════════════════════════════════

const FILMS = [
  // Sorted by vodDate. estimated:false = confirmed · estimated:true = best-guess
  // actual date (release window + films usually drop on a Tuesday) — see note.
  {
    title: 'Scary Movie',
    year: 2026,
    slug: 'scary-movie-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/5/6/9/1/0/1156910-scary-movie-2026-0-230-0-345-crop.jpg?v=b50abf5b96',
    vodDate: '2026-07-21',
    platform: 'Digital',
    estimated: false,
    imdbRating: 5.6,
  },
  {
    title: 'Supergirl',
    year: 2026,
    slug: 'supergirl-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/9/7/4/2/8/6/974286-supergirl-2026-0-230-0-345-crop.jpg?v=16179d9c14',
    vodDate: '2026-07-28',
    platform: 'Digital',
    estimated: false,
    imdbRating: 6.1,
  },
  {
    title: 'The Death of Robin Hood',
    year: 2026,
    slug: 'the-death-of-robin-hood',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/6/7/8/5/8/1167858-the-death-of-robin-hood-0-230-0-345-crop.jpg?v=39347a2edd',
    vodDate: '2026-07-28',
    platform: 'Digital',
    estimated: false,
    imdbRating: 7.6,
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (Sony ~45-day window) once it opens.
    title: 'Spider-Man: Brand New Day',
    year: 2026,
    slug: 'spider-man-brand-new-day',
    plexSlug: 'spider-man-brand-new-day-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/8/7/2/8/7/1/872871-spider-man-brand-new-day-0-600-0-900-crop.jpg?v=c4e8aa418f',
    vodDate: '2026-07-29',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 29 Jul 2026 (UK) · VOD est. follows once released (~45-day window)',
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'Ice Cream Man',
    year: 2026,
    slug: 'ice-cream-man-2026',
    poster: 'https://image.tmdb.org/t/p/w342/c987gxFjXqYOxZEZKcTkS1ONTWH.jpg',
    vodDate: '2026-08-07',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 7 Aug 2026 · VOD est. follows once released (~45-day window)',
  },
  {
    title: 'Jackass: Best and Last',
    year: 2026,
    slug: 'jackass-best-and-last',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/4/8/1/8/5/1/1481851-jackass-best-and-last-0-230-0-345-crop.jpg?v=42485392b4',
    vodDate: '2026-08-11',
    platform: 'Paramount+',
    estimated: true,
    note: 'Est. — cinemas Jun 26 + Paramount 45-day mandate (10 Aug), Tuesday drop',
    imdbRating: 6.9,
  },
  {
    title: 'The Invite',
    year: 2026,
    slug: 'the-invite-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/8/5/4/8/3/1/854831-the-invite-2026-0-230-0-345-crop.jpg?v=ee72905e48',
    vodDate: '2026-08-11',
    platform: null,
    estimated: true,
    note: 'Est. — A24, ~month after 10 Jul wide expansion, Tuesday drop',
    imdbRating: 6.2,
  },
  {
    title: 'Evil Dead Burn',
    year: 2026,
    slug: 'evil-dead-burn',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/0/9/7/0/2/2/1097022-evil-dead-burn-0-600-0-900-crop.jpg?v=398ff82d46',
    vodDate: '2026-08-11',
    platform: null,
    estimated: true,
    note: 'Est. — cinemas 10 Jul + WB 30-day window (WTS: 30-ish likelier than 45), Tuesday drop',
    imdbRating: 6.8,
  },
];

// ── WATCHED ARCHIVE ──────────────────────────────────────────────────────────
// Films removed from FILMS after watching, but kept on the calendar
// (both the page calendar and watchlist.ics).
// Add an entry here whenever a film is archived during a refresh.
// Permanent record: never update or re-check these entries.
const WATCHED = [
  { title: 'Wuthering Heights', vodDate: '2026-03-31', imdbRating: 6.2 },
  { title: 'Lord of the Flies', vodDate: '2026-05-04', imdbRating: 6.7 },
  { title: 'Ready or Not 2: Here I Come', vodDate: '2026-05-05', imdbRating: 7.8 },
  { title: 'Gary', vodDate: '2026-05-05', imdbRating: 7.7 },
  { title: 'The Punisher: One Last Kill', vodDate: '2026-05-12', imdbRating: 5.7 },
  { title: 'Faces of Death', vodDate: '2026-05-12', imdbRating: 6.8 },
  { title: 'Swapped', vodDate: '2026-05-01', imdbRating: 7.3 },
  { title: 'Star Wars: The Mandalorian & Grogu', vodDate: '2026-07-21', imdbRating: 7.1 },
  { title: 'The Magic Faraway Tree', vodDate: '2026-05-18', imdbRating: 6.8 },
  { title: 'In the Grey', vodDate: '2026-06-02', imdbRating: 7.1 },
  { title: 'Mortal Kombat II', vodDate: '2026-06-09', imdbRating: 7.0 },
  { title: 'Kevin Bridges: In Search of the Beautiful Game', vodDate: '2026-06-07', imdbRating: 7.4 },
  { title: 'Is God Is', vodDate: '2026-06-02' },
  { title: 'Deep Water', vodDate: '2026-06-16', imdbRating: 7.5 },
  { title: 'I Love Boosters', vodDate: '2026-06-23', imdbRating: 7.2 },
  { title: 'Tuner', vodDate: '2026-06-23', imdbRating: 7.3 },
  { title: 'Power Ballad', vodDate: '2026-06-23', imdbRating: 7.4 },
  { title: 'The Sheep Detectives', vodDate: '2026-06-24', imdbRating: 7.7 },
  { title: 'Obsession', vodDate: '2026-06-30', imdbRating: 7.4 },
  { title: 'Toy Story 5', vodDate: '2026-07-04', imdbRating: 7.7 },
  { title: 'The Furious', vodDate: '2026-07-07', imdbRating: 7.7 },
  { title: 'The Selfish Giant', vodDate: '2026-07-07', imdbRating: 7.3 },
  { title: 'Moana', vodDate: '2026-07-12', imdbRating: 5.8 },
  { title: "California Schemin'", vodDate: '2026-07-06', imdbRating: 7.2 },
  { title: 'Backrooms', vodDate: '2026-07-14', imdbRating: 7.2 },
  { title: 'The Odyssey', vodDate: '2026-07-18', imdbRating: 8.4 },
  { title: 'Disclosure Day', vodDate: '2026-07-21', imdbRating: 6.9 },
  { title: 'Masters of the Universe', vodDate: '2026-07-22', imdbRating: 7.1 },
];
