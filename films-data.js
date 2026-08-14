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
    title: 'Trainwreck: Poop Cruise',
    year: 2025,
    slug: 'trainwreck-poop-cruise',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/3/6/0/9/7/9/1360979-trainwreck-poop-cruise-0-600-0-900-crop.jpg?v=af68ee74a8',
    vodDate: '2025-06-24',
    platform: 'Netflix',
    estimated: false,
    imdbRating: 6.0,
    runtime: 55,
  },
  {
    title: 'Star Wars: Visions Presents - The Ninth Jedi',
    year: 2026,
    slug: 'star-wars-visions-presents-the-ninth-jedi',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/6/0/9/7/0/2/1609702-star-wars-visions-presents-the-ninth-jedi-0-230-0-345-crop.jpg?v=ede94747bd',
    vodDate: '2026-08-05',
    platform: 'Disney+',
    estimated: false,
    imdbRating: 7.0,
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'The End of Oak Street',
    year: 2026,
    slug: 'the-end-of-oak-street',
    poster: 'https://a.ltrbxd.com/resized/film-poster/9/9/2/9/6/2/992962-the-end-of-oak-street-0-600-0-900-crop.jpg?v=b06dbfb4c9',
    vodDate: '2026-08-14',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 14 Aug 2026 (Warner Bros) · VOD est. follows once released (~45-day window)',
    runtime: 100,
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'Insidious: Out of the Further',
    year: 2026,
    slug: 'insidious-out-of-the-further',
    plexSlug: 'insidious-out-of-the-further-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/7/4/1/5/7/1174157-insidious-out-of-the-further-0-600-0-900-crop.jpg?v=b6c81c5505',
    vodDate: '2026-08-21',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 21 Aug 2026 (Sony) · VOD est. follows once released (~45-day window)',
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'Mutiny',
    year: 2026,
    slug: 'mutiny-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/7/1/6/8/9/1171689-mutiny-2026-0-600-0-900-crop.jpg?v=ff413ceded',
    vodDate: '2026-08-21',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 21 Aug 2026 (Lionsgate) · VOD est. follows once released (~45-day window)',
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'The Dog Stars',
    year: 2026,
    slug: 'the-dog-stars',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/2/6/9/2/8/7/1269287-the-dog-stars-0-600-0-900-crop.jpg?v=b44af504b0',
    vodDate: '2026-08-26',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 26 Aug 2026 (20th Century) · VOD est. follows once released (~45-day window)',
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens. Festival IMDb score set.
    title: 'Colony',
    year: 2026,
    slug: 'colony-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/2/6/2/1/7/0/1262170-colony-2026-0-600-0-900-crop.jpg?v=10448d0145',
    vodDate: '2026-08-28',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 28 Aug 2026 (Well Go USA) · VOD est. follows once released (~45-day window)',
    imdbRating: 6.5,
  },
  {
    // Pre-theatrical: date below is the CINEMA release. Switch to a Tuesday-
    // snapped VOD estimate (~45-day window) once it opens.
    title: 'Cliffhanger',
    year: 2026,
    slug: 'cliffhanger-2026',
    lbSlug: 'cliffhanger-2027',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/0/0/9/9/3/3/1009933-cliffhanger-2026-0-600-0-900-crop.jpg?v=f866b04974',
    vodDate: '2026-08-28',
    platform: null,
    estimated: true,
    cinema: true,
    note: 'Cinema release 28 Aug 2026 (Decal) — but Letterboxd now lists it as 2027; possible slip to Q1 2027 (Neon). VOD est. follows once released (~45-day window)',
  },

  {
    title: 'I Want Your Sex',
    year: 2026,
    slug: 'i-want-your-sex',
    plexSlug: 'i-want-your-sex-2026',
    poster: 'https://a.ltrbxd.com/resized/film-poster/1/1/7/0/9/5/4/1170954-i-want-your-sex-0-600-0-900-crop.jpg?v=c13a0c57b7',
    vodDate: '2026-09-01',
    platform: 'Digital',
    estimated: false,
    imdbRating: 6.4,
  },
  {
    title: 'Ice Cream Man',
    year: 2026,
    slug: 'ice-cream-man-2026',
    poster: 'https://image.tmdb.org/t/p/w342/c987gxFjXqYOxZEZKcTkS1ONTWH.jpg',
    vodDate: '2026-09-01',
    platform: null,
    estimated: true,
    note: 'Est. — Eli Roth horror (wide 7 Aug), quick digital pivot (late Aug/early Sep per WhenToStream 8/7), Tuesday drop',
    imdbRating: 3.8,
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
  { title: 'Scary Movie', vodDate: '2026-07-21', imdbRating: 5.6 },
  { title: 'Carolina Caroline', vodDate: '2026-06-23', imdbRating: 7.1 },
  { title: 'Supergirl', vodDate: '2026-07-28', imdbRating: 6.1 },
  { title: 'The Death of Robin Hood', vodDate: '2026-07-28', imdbRating: 7.6 },
  { title: 'Leviticus', vodDate: '2026-07-28', imdbRating: 5.3 },
  { title: 'Spider-Man: Brand New Day', vodDate: '2026-07-29', imdbRating: 8.3 },
  { title: 'Evil Dead Burn', vodDate: '2026-08-04', imdbRating: 6.8 },
  { title: 'Jackass: Best and Last', vodDate: '2026-08-11', imdbRating: 6.9 },
  { title: 'The Invite', vodDate: '2026-08-11', imdbRating: 6.2 },
];
