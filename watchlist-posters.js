// ═══════════════════════════════════════════════════════════════════════════
// WATCHLIST POSTERS — text-free posters for the TV poster display
// Read by poster-display/index.html. Keys are the film slugs in films-data.js.
// tmdb = TMDB movie id · poster = file name of a "No Language" poster on TMDB
// (served from https://image.tmdb.org/t/p/original/<poster>).
// During a refresh, add an entry for every new film (see REFRESH_INSTRUCTIONS.md,
// "Text-free posters"). Entries for archived films can stay — they do no harm.
// ═══════════════════════════════════════════════════════════════════════════

const WATCHLIST_POSTERS = {
  'the-weight-2026': { tmdb: 1433583, poster: 'qvq82aNmGD4fyE9kK1YJV91sC7K.jpg' },
  'the-dog-stars': { tmdb: 1384216, poster: 'o3TY0dc236CM7eMwAsyghcXIzBL.jpg' },
  'forgotten-island-2026': { tmdb: 1465063, poster: 'ahpuDhrazxYkpmzRqbPZAZdiFuA.jpg' },
  'verity-2026': { tmdb: 1283515, poster: 'iT72Y5FgZxU8hEiwGP9Wb2xLtm9.jpg' },
  'ali-g-who-iz-i': { tmdb: 1727734, poster: 'wzoz6SDhcTyHJCZmG5pjvwRF2Dj.jpg' },
  'primetime-2026': { tmdb: 1375441, poster: 'CZEiZZn9yYD0zybwCIitDWM0nq.jpg' },
  'resident-evil-2026': { tmdb: 1423191, poster: '9YzsMLLSpCbAiDiEXlwkZr3m5Ri.jpg' },
  'bad-apples-2025': { tmdb: 1198654, poster: 'lCNO4GjKuLRKRgMqobHJ7d2N2qF.jpg' },
  'digger-2026': { tmdb: 1248832, poster: 'giPJSxvIdNVfNacwIhmM5WFXvDj.jpg' },
  'other-mommy': { tmdb: 1400837, poster: 'lA8kKIWLouCn4OHjeIOtP46F3aZ.jpg' },
  'heart-of-the-beast-2026': { tmdb: 1263337, poster: '4RLhArdnymkf2WpQ5R2RxbUC21e.jpg' },
  'your-mother-your-mother-your-mother': { tmdb: 1437396, poster: '3x66cnqi9koCEaoBEEggy3w3CZA.jpg' },
  'the-social-reckoning': { tmdb: 1281331, poster: '79Tk3eivIt67JRJgo8y1GQbTrOj.jpg' },
  'clayface': { tmdb: 1400940, poster: 'N02mrzHOb7ZUiLQiZ1rZgZhOFx.jpg' },
  'fjord-2026': { tmdb: 1401459, poster: 'bhCoJRGYPh33ThNKGxRXi2vGQjt.jpg' },
  'wildwood-2026': { tmdb: 791523, poster: '5t8QRBpdq5SmCPKX55obifa0jdT.jpg' },
  'klara-and-the-sun': { tmdb: 858035, poster: 'ac41my7b3oy5YAZzRyATS7RgsSS.jpg' },
  'wicker': { tmdb: 1195803, poster: 'kv7HtOVHuJ8ZhEffSAoZwfShOR3.jpg' },
  'street-fighter-2026': { tmdb: 1153576, poster: 'mjdWojP3rMpu83Idxp1KSa9mFKY.jpg' },
  'you-can-see-everything': { tmdb: 1765072, poster: 'gH5580ALwx5aEVjl2gYr58RE6Af.jpg' },
  'whalefall': { tmdb: 1255833, poster: 'jlmhrUgJ4oigabcysbEkfgR4QUu.jpg' },
};
