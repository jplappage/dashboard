// ═══════════════════════════════════════════════════════════════════════════
// RETRO WATCHLIST DATA — the single source of truth
// Loaded by retro-watchlist.html and index.html (hub teaser).
// During a refresh, edit THIS file only — not the HTML.
// RETRO_LETTERBOXD is the bootstrap fallback; the live watched state is the
// GitHub Gist (see REFRESH_INSTRUCTIONS.md Phase 4).
// ═══════════════════════════════════════════════════════════════════════════

// ── FILM DATA ──────────────────────────────────────────────
const RETRO_FILMS = [
  {id:1,  title:"Nosferatu",                          year:1922, decade:"1920s", genre:"Foreign",   runtime:94,  lbRating:3.8},
  {id:2,  title:"The Graduate",                       year:1967, decade:"1960s", genre:"Drama",     runtime:106, lbRating:4.0},
  {id:3,  title:"Breakfast at Tiffany's",             year:1961, decade:"1960s", genre:"Romance",   runtime:115, lbRating:3.9},
  {id:4,  title:"The Sound of Music",                 year:1965, decade:"1960s", genre:"Musical",   runtime:172, lbRating:4.1},
  {id:5,  title:"The Apartment",                      year:1960, decade:"1960s", genre:"Comedy",    runtime:125, lbRating:4.3},
  {id:6,  title:"The Birds",                          year:1963, decade:"1960s", genre:"Horror",    runtime:119, lbRating:3.8},
  {id:7,  title:"The Texas Chain Saw Massacre",       year:1974, decade:"1970s", genre:"Horror",    runtime:83,  lbRating:3.9},
  {id:8,  title:"The Rocky Horror Picture Show",      year:1975, decade:"1970s", genre:"Musical",   runtime:100, lbRating:3.8},
  {id:9,  title:"Suspiria 70",                        year:1977, decade:"1970s", genre:"Foreign",   runtime:99,  lbRating:4.1},
  {id:10, title:"The Holy Grail",                     year:1975, decade:"1970s", genre:"Comedy",    runtime:91,  lbRating:4.3},
  {id:11, title:"Life of Brian",                      year:1979, decade:"1970s", genre:"Comedy",    runtime:94,  lbRating:4.2},
  {id:12, title:"Mean Streets",                       year:1973, decade:"1970s", genre:"Crime",     runtime:112, lbRating:3.8},
  {id:13, title:"Rocky II",                           year:1979, decade:"1970s", genre:"Drama",     runtime:119, lbRating:3.5},
  {id:14, title:"Serpico",                            year:1973, decade:"1970s", genre:"Crime",     runtime:130, lbRating:3.9},
  {id:15, title:"American Graffiti",                  year:1973, decade:"1970s", genre:"Comedy",    runtime:110, lbRating:3.7},
  {id:16, title:"Dirty Harry",                        year:1971, decade:"1970s", genre:"Action",    runtime:102, lbRating:3.9},
  {id:17, title:"Superman",                           year:1978, decade:"1970s", genre:"Action",    runtime:143, lbRating:3.6},
  {id:18, title:"Dead Poets Society",                 year:1989, decade:"1980s", genre:"Drama",     runtime:128, lbRating:4.2},
  {id:19, title:"When Harry Met Sally…",              year:1989, decade:"1980s", genre:"Romance",   runtime:96,  lbRating:4.2},
  {id:20, title:"Grave of the Fireflies",             year:1988, decade:"1980s", genre:"Foreign",   runtime:89,  lbRating:4.4},
  {id:21, title:"My Neighbor Totoro",                 year:1988, decade:"1980s", genre:"Foreign",   runtime:86,  lbRating:4.3},
  {id:22, title:"Stand by Me",                        year:1986, decade:"1980s", genre:"Drama",     runtime:89,  lbRating:4.2},
  {id:23, title:"Blue Velvet",                        year:1986, decade:"1980s", genre:"Mystery",   runtime:120, lbRating:4.0},
  {id:24, title:"Kiki's Delivery Service",            year:1989, decade:"1980s", genre:"Foreign",   runtime:103, lbRating:4.1},
  {id:25, title:"Back to the Future Part II",         year:1989, decade:"1980s", genre:"Sci-Fi",    runtime:108, lbRating:3.9},
  {id:26, title:"The Evil Dead",                      year:1981, decade:"1980s", genre:"Horror",    runtime:85,  lbRating:3.8},
  {id:27, title:"Airplane",                           year:1980, decade:"1980s", genre:"Comedy",    runtime:88,  lbRating:4.1},
  {id:28, title:"The King of Comedy",                 year:1982, decade:"1980s", genre:"Comedy",    runtime:109, lbRating:4.1},
  {id:29, title:"Evil Dead II",                       year:1987, decade:"1980s", genre:"Horror",    runtime:84,  lbRating:4.0},
  {id:30, title:"Labyrinth",                          year:1986, decade:"1980s", genre:"Fantasy",   runtime:101, lbRating:3.9},
  {id:31, title:"Hellraiser",                         year:1987, decade:"1980s", genre:"Horror",    runtime:94,  lbRating:3.8},
  {id:32, title:"Beautiful Boy",                       year:2018, decade:"2010s", genre:"Drama",     runtime:120, lbRating:3.5},
  {id:33, title:"Girl, Interrupted",                  year:1999, decade:"1990s", genre:"Drama",     runtime:127, lbRating:3.7},
  {id:34, title:"Notting Hill",                       year:1999, decade:"1990s", genre:"Romance",   runtime:124, lbRating:3.8},
  {id:35, title:"Groundhog Day",                      year:1993, decade:"1990s", genre:"Comedy",    runtime:101, lbRating:4.3},
  {id:36, title:"Magnolia",                           year:1999, decade:"1990s", genre:"Drama",     runtime:188, lbRating:4.1},
  {id:37, title:"Dazed and Confused",                 year:1993, decade:"1990s", genre:"Comedy",    runtime:102, lbRating:3.9},
  {id:38, title:"Being John Malkovich",               year:1999, decade:"1990s", genre:"Comedy",    runtime:112, lbRating:4.0},
  {id:39, title:"The Talented Mr. Ripley",            year:1999, decade:"1990s", genre:"Thriller",  runtime:139, lbRating:3.9},
  {id:40, title:"The Iron Giant",                     year:1999, decade:"1990s", genre:"Animation", runtime:86,  lbRating:4.3},
  {id:41, title:"Thelma & Louise",                    year:1991, decade:"1990s", genre:"Drama",     runtime:130, lbRating:4.1},
  {id:42, title:"Back to the Future Part III",        year:1990, decade:"1990s", genre:"Sci-Fi",    runtime:118, lbRating:3.6},
  {id:43, title:"Fear and Loathing in Las Vegas",     year:1998, decade:"1990s", genre:"Comedy",    runtime:118, lbRating:3.9},
  {id:44, title:"Cure",                               year:1997, decade:"1990s", genre:"Foreign",   runtime:111, lbRating:4.1},
  {id:45, title:"You've Got Mail",                    year:1998, decade:"1990s", genre:"Romance",   runtime:119, lbRating:3.6},
  {id:46, title:"Unforgiven",                         year:1992, decade:"1990s", genre:"Western",   runtime:131, lbRating:4.2},
  {id:47, title:"Primal Fear",                        year:1996, decade:"1990s", genre:"Thriller",  runtime:129, lbRating:4.0},
  {id:48, title:"Meet Joe Black",                     year:1998, decade:"1990s", genre:"Romance",   runtime:178, lbRating:3.5},
  {id:49, title:"(500) Days of Summer",               year:2009, decade:"2000s", genre:"Romance",   runtime:95,  lbRating:3.8},
  {id:50, title:"Coraline",                           year:2009, decade:"2000s", genre:"Animation", runtime:100, lbRating:4.2},
  {id:51, title:"Howl's Moving Castle",               year:2004, decade:"2000s", genre:"Foreign",   runtime:119, lbRating:4.3},
  {id:52, title:"The Devil Wears Prada",              year:2006, decade:"2000s", genre:"Comedy",    runtime:109, lbRating:4.0},
  {id:53, title:"Pride & Prejudice",                  year:2005, decade:"2000s", genre:"Romance",   runtime:129, lbRating:4.3},
  {id:54, title:"Corpse Bride",                       year:2005, decade:"2000s", genre:"Animation", runtime:77,  lbRating:3.8},
  {id:55, title:"Almost Famous",                      year:2000, decade:"2000s", genre:"Drama",     runtime:122, lbRating:4.3},
  {id:56, title:"Erin Brockovich",                    year:2000, decade:"2000s", genre:"Drama",     runtime:131, lbRating:3.8},
  {id:57, title:"The Princess Diaries",               year:2001, decade:"2000s", genre:"Comedy",    runtime:115, lbRating:3.7},
  {id:58, title:"Thir13en Ghosts",                    year:2001, decade:"2000s", genre:"Horror",    runtime:91,  lbRating:2.8},
  {id:59, title:"Bend It Like Beckham",               year:2002, decade:"2000s", genre:"Comedy",    runtime:112, lbRating:3.8},
  {id:60, title:"About a Boy",                        year:2002, decade:"2000s", genre:"Comedy",    runtime:101, lbRating:3.8},
  {id:61, title:"Cabin Fever",                        year:2002, decade:"2000s", genre:"Horror",    runtime:94,  lbRating:2.9},
  {id:62, title:"Love Actually",                      year:2003, decade:"2000s", genre:"Romance",   runtime:135, lbRating:3.8},
  {id:63, title:"Dogville",                           year:2003, decade:"2000s", genre:"Drama",     runtime:178, lbRating:4.0},
  {id:64, title:"Monsters Ball",                      year:2001, decade:"2000s", genre:"Drama",     runtime:111, lbRating:3.6},
  {id:65, title:"Mean Girls",                         year:2004, decade:"2000s", genre:"Comedy",    runtime:97,  lbRating:4.0},
  {id:66, title:"Before Sunset",                      year:2004, decade:"2000s", genre:"Romance",   runtime:80,  lbRating:4.3},
  {id:67, title:"The Terminal",                       year:2004, decade:"2000s", genre:"Comedy",    runtime:128, lbRating:3.6},
  {id:68, title:"Million Dollar Baby",                year:2004, decade:"2000s", genre:"Drama",     runtime:132, lbRating:4.0},
  {id:69, title:"The Princess Diaries 2",             year:2004, decade:"2000s", genre:"Comedy",    runtime:113, lbRating:3.2},
  {id:70, title:"The Phantom of the Opera",           year:2004, decade:"2000s", genre:"Musical",   runtime:143, lbRating:3.5},
  {id:71, title:"Lady Vengeance",                     year:2005, decade:"2000s", genre:"Foreign",   runtime:112, lbRating:4.1},
  {id:72, title:"Memoirs of a Geisha",                year:2005, decade:"2000s", genre:"Drama",     runtime:145, lbRating:3.6},
  {id:73, title:"Capote",                             year:2005, decade:"2000s", genre:"Drama",     runtime:114, lbRating:3.8},
  {id:74, title:"The Devil's Rejects",                year:2005, decade:"2000s", genre:"Horror",    runtime:107, lbRating:3.9},
  {id:75, title:"Marie Antoinette",                   year:2006, decade:"2000s", genre:"Drama",     runtime:123, lbRating:3.6},
  {id:76, title:"The Holiday",                        year:2006, decade:"2000s", genre:"Romance",   runtime:138, lbRating:3.6},
  {id:77, title:"Rocky Balboa",                       year:2006, decade:"2000s", genre:"Drama",     runtime:102, lbRating:3.6},
  {id:78, title:"Bee Movie",                          year:2007, decade:"2000s", genre:"Animation", runtime:95,  lbRating:3.1},
  {id:79, title:"The Assassination of Jesse James",   year:2007, decade:"2000s", genre:"Drama",     runtime:160, lbRating:4.2},
  {id:80, title:"Synecdoche, New York",               year:2008, decade:"2000s", genre:"Drama",     runtime:124, lbRating:4.1},
  {id:81, title:"Let the Right One In",               year:2008, decade:"2000s", genre:"Foreign",   runtime:114, lbRating:4.3},
  {id:82, title:"Yes Man",                            year:2008, decade:"2000s", genre:"Comedy",    runtime:104, lbRating:3.3},
  {id:83, title:"Vicky Cristina Barcelona",           year:2008, decade:"2000s", genre:"Romance",   runtime:96,  lbRating:3.6},
  {id:84, title:"Milk",                               year:2008, decade:"2000s", genre:"Drama",     runtime:128, lbRating:4.0},
  {id:85, title:"Ip Man",                             year:2008, decade:"2000s", genre:"Foreign",   runtime:106, lbRating:4.0},
  {id:86, title:"Moon",                               year:2009, decade:"2000s", genre:"Sci-Fi",    runtime:97,  lbRating:4.2},
  {id:87, title:"Eat Pray Love",                      year:2010, decade:"2010s", genre:"Drama",     runtime:133, lbRating:3.1},
  {id:88, title:"Midnight in Paris",                  year:2011, decade:"2010s", genre:"Romance",   runtime:94,  lbRating:3.9},
  {id:89, title:"The Help",                           year:2011, decade:"2010s", genre:"Drama",     runtime:146, lbRating:3.9},
  {id:90, title:"Kung Fu Panda 2",                    year:2011, decade:"2010s", genre:"Animation", runtime:90,  lbRating:3.7},
  {id:91, title:"Moonrise Kingdom",                   year:2012, decade:"2010s", genre:"Comedy",    runtime:94,  lbRating:4.0},
  {id:92, title:"Les Misérables",                     year:2012, decade:"2010s", genre:"Musical",   runtime:158, lbRating:3.9},
  {id:93, title:"Frankenweenie",                      year:2012, decade:"2010s", genre:"Animation", runtime:87,  lbRating:3.5},
  {id:94, title:"About Time",                         year:2013, decade:"2010s", genre:"Romance",   runtime:123, lbRating:4.1},
  {id:95, title:"Before Midnight",                    year:2013, decade:"2010s", genre:"Romance",   runtime:109, lbRating:4.2},
  {id:96, title:"Inside Llewyn Davis",                year:2013, decade:"2010s", genre:"Drama",     runtime:104, lbRating:4.0},
  {id:97, title:"Evil Dead",                          year:2013, decade:"2010s", genre:"Horror",    runtime:91,  lbRating:3.4},
  {id:98, title:"Warm Bodies",                        year:2013, decade:"2010s", genre:"Comedy",    runtime:98,  lbRating:3.3},
  {id:99, title:"Nymphomaniac: Vol. I",               year:2013, decade:"2010s", genre:"Drama",     runtime:117, lbRating:3.6},
  {id:100,title:"How to Train Your Dragon 2",         year:2014, decade:"2010s", genre:"Animation", runtime:102, lbRating:3.9},
  {id:101,title:"Inherent Vice",                      year:2014, decade:"2010s", genre:"Comedy",    runtime:148, lbRating:3.7},
  {id:102,title:"Tusk",                               year:2014, decade:"2010s", genre:"Horror",    runtime:102, lbRating:2.8},
  {id:103,title:"The Lobster",                        year:2015, decade:"2010s", genre:"Comedy",    runtime:119, lbRating:3.9},
  {id:104,title:"Crimson Peak",                       year:2015, decade:"2010s", genre:"Horror",    runtime:119, lbRating:3.5},
  {id:105,title:"Me and Earl and the Dying Girl",     year:2015, decade:"2010s", genre:"Drama",     runtime:105, lbRating:3.7},
  {id:106,title:"Bone Tomahawk",                      year:2015, decade:"2010s", genre:"Horror",    runtime:132, lbRating:4.0},
  {id:107,title:"Paper Towns",                        year:2015, decade:"2010s", genre:"Romance",   runtime:109, lbRating:2.9},
  {id:108,title:"Joy",                                year:2015, decade:"2010s", genre:"Drama",     runtime:124, lbRating:3.2},
  {id:109,title:"The Handmaiden",                     year:2016, decade:"2010s", genre:"Foreign",   runtime:144, lbRating:4.4},
  {id:110,title:"Nocturnal Animals",                  year:2016, decade:"2010s", genre:"Thriller",  runtime:116, lbRating:4.0},
  {id:111,title:"Swiss Army Man",                     year:2016, decade:"2010s", genre:"Comedy",    runtime:97,  lbRating:3.8},
  {id:112,title:"Kung Fu Panda 3",                    year:2016, decade:"2010s", genre:"Animation", runtime:95,  lbRating:3.5},
  {id:113,title:"Alice Through the Looking Glass",    year:2016, decade:"2010s", genre:"Fantasy",   runtime:113, lbRating:2.8},
  {id:114,title:"Call Me by Your Name",               year:2017, decade:"2010s", genre:"Romance",   runtime:132, lbRating:4.1},
  {id:115,title:"Phantom Thread",                     year:2017, decade:"2010s", genre:"Drama",     runtime:130, lbRating:4.1},
  {id:116,title:"Murder on the Orient Express",       year:2017, decade:"2010s", genre:"Mystery",   runtime:114, lbRating:3.4},
  {id:117,title:"Suspiria",                           year:2018, decade:"2010s", genre:"Horror",    runtime:152, lbRating:3.7},
  {id:118,title:"The Lighthouse",                     year:2019, decade:"2010s", genre:"Horror",    runtime:109, lbRating:4.2},
  {id:119,title:"Mary Poppins Returns",               year:2018, decade:"2010s", genre:"Musical",   runtime:130, lbRating:3.2},
  {id:120,title:"Frozen II",                          year:2019, decade:"2010s", genre:"Animation", runtime:103, lbRating:3.2},
  {id:121,title:"The King",                           year:2019, decade:"2010s", genre:"Drama",     runtime:140, lbRating:3.8},
  {id:122,title:"How to Train Your Dragon 3",         year:2019, decade:"2010s", genre:"Animation", runtime:104, lbRating:3.8},
  {id:123,title:"Emma",                               year:2020, decade:"2020s", genre:"Romance",   runtime:124, lbRating:4.0},
  {id:124,title:"The Devil All the Time",             year:2020, decade:"2020s", genre:"Thriller",  runtime:138, lbRating:3.7},
  {id:125,title:"Licorice Pizza",                     year:2021, decade:"2020s", genre:"Comedy",    runtime:133, lbRating:3.9},
  {id:126,title:"The Power of the Dog",               year:2021, decade:"2020s", genre:"Drama",     runtime:126, lbRating:4.0},
  {id:127,title:"West Side Story",                    year:2021, decade:"2020s", genre:"Musical",   runtime:156, lbRating:3.8},
  {id:128,title:"House of Gucci",                     year:2021, decade:"2020s", genre:"Drama",     runtime:157, lbRating:3.3},
  {id:129,title:"Bo Burnham: Inside",                 year:2021, decade:"2020s", genre:"Comedy",    runtime:87,  lbRating:4.3},
  {id:130,title:"King Richard",                       year:2021, decade:"2020s", genre:"Drama",     runtime:144, lbRating:3.9},
  {id:131,title:"Elvis",                              year:2022, decade:"2020s", genre:"Drama",     runtime:159, lbRating:3.9},
  {id:132,title:"Triangle of Sadness",                year:2022, decade:"2020s", genre:"Comedy",    runtime:147, lbRating:3.8},
  {id:133,title:"TÁR",                               year:2022, decade:"2020s", genre:"Drama",     runtime:158, lbRating:4.0},
  {id:134,title:"The Fabelmans",                      year:2022, decade:"2020s", genre:"Drama",     runtime:151, lbRating:4.0},
  {id:135,title:"Fresh",                              year:2022, decade:"2020s", genre:"Horror",    runtime:114, lbRating:3.5},
  {id:136,title:"Death on the Nile",                  year:2022, decade:"2020s", genre:"Mystery",   runtime:127, lbRating:2.9},
  {id:137,title:"Cha Cha Real Smooth",                year:2022, decade:"2020s", genre:"Drama",     runtime:107, lbRating:3.5},
  {id:138,title:"Five Nights at Freddy's",            year:2023, decade:"2020s", genre:"Horror",    runtime:109, lbRating:2.8},
  {id:139,title:"All of Us Strangers",                year:2023, decade:"2020s", genre:"Drama",     runtime:105, lbRating:4.3},
  {id:140,title:"Maestro",                            year:2023, decade:"2020s", genre:"Drama",     runtime:129, lbRating:3.6},
  {id:141,title:"Totally Killer",                     year:2023, decade:"2020s", genre:"Horror",    runtime:106, lbRating:3.3},
  {id:142,title:"A Haunting in Venice",               year:2023, decade:"2020s", genre:"Mystery",   runtime:103, lbRating:3.2},
  {id:143,title:"Kinds of Kindness",                  year:2024, decade:"2020s", genre:"Drama",     runtime:164, lbRating:3.5},
  {id:144,title:"Mean Girls Remake",                  year:2024, decade:"2020s", genre:"Musical",   runtime:112, lbRating:3.1},
  {id:145,title:"Lisa Frankenstein",                  year:2024, decade:"2020s", genre:"Horror",    runtime:101, lbRating:3.4},
  {id:146,title:"A Different Man",                    year:2024, decade:"2020s", genre:"Drama",     runtime:112, lbRating:3.9},
  {id:147,title:"Kung Fu Panda 4",                    year:2024, decade:"2020s", genre:"Animation", runtime:94,  lbRating:3.2},
  {id:148,title:"Damsel",                             year:2024, decade:"2020s", genre:"Fantasy",   runtime:110, lbRating:2.9},
  {id:149,title:"The Count of Monte Cristo",          year:2024, decade:"2020s", genre:"Foreign",   runtime:178, lbRating:4.0},
  {id:150,title:"Fruitvale Station",                  year:2013, decade:"2010s", genre:"Drama",     runtime:85,  lbRating:4.0},
  {id:151,title:"Thief",                              year:1981, decade:"1980s", genre:"Crime",     runtime:123, lbRating:4.1},
  {id:152,title:"Holes",                              year:2003, decade:"2000s", genre:"Adventure", runtime:117, lbRating:3.9},
  {id:153,title:"Before Sunrise",                     year:1995, decade:"1990s", genre:"Romance",   runtime:101, lbRating:4.3},
  {id:154,title:"Fargo",                              year:1996, decade:"1990s", genre:"Crime",     runtime:98,  lbRating:4.4},
  {id:155,title:"Big Fish",                           year:2003, decade:"2000s", genre:"Fantasy",   runtime:125, lbRating:4.1},
  {id:156,title:"The Game",                           year:1997, decade:"1990s", genre:"Thriller",  runtime:129, lbRating:4.0},
  {id:157,title:"I, Tonya",                           year:2017, decade:"2010s", genre:"Drama",     runtime:119, lbRating:4.0},
  {id:158,title:"Terrifier",                          year:2016, decade:"2010s", genre:"Horror",    runtime:86,  lbRating:3.3},
  {id:159,title:"An American Werewolf in London",     year:1981, decade:"1980s", genre:"Horror",    runtime:97,  lbRating:3.9},
  {id:160,title:"Mystic River",                       year:2003, decade:"2000s", genre:"Drama",     runtime:138, lbRating:4.1},
  {id:161,title:"The Devil's Advocate",               year:1997, decade:"1990s", genre:"Thriller",  runtime:144, lbRating:3.9},
  {id:162,title:"Singin' in the Rain",                year:1952, decade:"1950s", genre:"Musical",   runtime:103, lbRating:4.3},
  {id:163,title:"Natural Born Killers",               year:1994, decade:"1990s", genre:"Crime",     runtime:118, lbRating:3.7},
  {id:164,title:"Crossroads",                         year:2002, decade:"2000s", genre:"Drama",     runtime:94,  lbRating:2.9},
  {id:165,title:"How to Lose a Guy in 10 Days",       year:2003, decade:"2000s", genre:"Comedy",    runtime:116, lbRating:3.5},
  {id:166,title:"The Cat in the Hat",                 year:2003, decade:"2000s", genre:"Comedy",    runtime:82,  lbRating:2.2},
  {id:167,title:"Walk the Line",                      year:2005, decade:"2000s", genre:"Drama",     runtime:136, lbRating:4.0},
  {id:168,title:"The Secret Life of Walter Mitty",    year:2013, decade:"2010s", genre:"Adventure", runtime:114, lbRating:3.8},
  {id:169,title:"The Princess Bride",                 year:1987, decade:"1980s", genre:"Adventure", runtime:98,  lbRating:4.4},
  {id:170,title:"Ferris Bueller's Day Off",           year:1986, decade:"1980s", genre:"Comedy",    runtime:103, lbRating:4.1}
];

// ── LETTERBOXD WATCHED DATA ────────────────────────────────
// Pre-populated from zidanejp's Letterboxd diary (scraped 23 Jul 2026)
const RETRO_LETTERBOXD = {

  130:"2026-07-18", // King Richard

  79: "2026-07-12", // The Assassination of Jesse James
  125:"2026-07-03", // Licorice Pizza
  80: "2026-06-28", // Synecdoche, New York
  129:"2026-06-26", // Bo Burnham: Inside
  141:"2026-06-23", // Totally Killer
  46: "2026-06-21", // Unforgiven
  38: "2026-06-19", // Being John Malkovich
  32: "2026-06-06", // Beautiful Boy
  2:  "2026-03-11", // The Graduate
  8:  "2026-01-24", // The Rocky Horror Picture Show
  9:  "2025-06-24", // Suspiria 70
  11: "2025-11-14", // Life of Brian
  12: "2026-05-18", // Mean Streets
  18: "2025-07-19", // Dead Poets Society
  19: "2026-05-24", // When Harry Met Sally…
  21: "2026-01-01", // My Neighbor Totoro
  22: "2025-12-07", // Stand by Me
  26: "2026-03-31", // The Evil Dead
  27: "2025-07-30", // Airplane
  33: "2026-03-30", // Girl, Interrupted
  34: "2026-04-10", // Notting Hill
  37: "2025-06-14", // Dazed and Confused
  39: "2026-01-21", // The Talented Mr. Ripley
  40: "2026-02-07", // The Iron Giant
  44: "2026-04-19", // Cure
  45: "2025-09-27", // You've Got Mail
  47: "2026-05-25", // Primal Fear
  49: "2025-07-16", // (500) Days of Summer
  52: "2026-01-17", // The Devil Wears Prada
  55: "2026-04-18", // Almost Famous
  58: "2026-05-19", // Thir13en Ghosts
  59: "2026-02-15", // Bend It Like Beckham
  60: "2025-08-10", // About a Boy
  61: "2025-06-23", // Cabin Fever
  62: "2025-12-22", // Love Actually
  64: "2025-10-04", // Monsters Ball
  68: "2025-07-20", // Million Dollar Baby
  74: "2025-09-25", // The Devil's Rejects
  75: "2025-09-18", // Marie Antoinette
  76: "2025-12-13", // The Holiday
  81: "2025-10-12", // Let the Right One In
  82: "2026-01-26", // Yes Man
  83: "2026-01-25", // Vicky Cristina Barcelona
  90: "2026-04-13", // Kung Fu Panda 2
  91: "2025-11-30", // Moonrise Kingdom
  94: "2025-09-14", // About Time
  96: "2026-01-22", // Inside Llewyn Davis
  98: "2025-09-19", // Warm Bodies
  100:"2026-01-18", // How to Train Your Dragon 2
  101:"2026-05-03", // Inherent Vice
  103:"2025-09-15", // The Lobster
  104:"2026-05-06", // Crimson Peak
  105:"2025-09-22", // Me and Earl and the Dying Girl
  106:"2026-02-10", // Bone Tomahawk
  107:"2026-02-05", // Paper Towns
  108:"2025-06-15", // Joy
  110:"2025-09-13", // Nocturnal Animals
  111:"2025-12-10", // Swiss Army Man
  113:"2026-01-02", // Alice Through the Looking Glass
  114:"2025-10-24", // Call Me by Your Name
  119:"2025-09-20", // Mary Poppins Returns
  120:"2025-09-28", // Frozen II
  121:"2026-04-06", // The King
  122:"2026-01-25", // How to Train Your Dragon 3
  124:"2025-07-23", // The Devil All the Time
  131:"2026-02-21", // Elvis
  135:"2026-02-13", // Fresh
  137:"2026-01-23", // Cha Cha Real Smooth
  150:"2025-05-15", // Fruitvale Station
  151:"2025-05-05", // Thief
  152:"2025-04-19", // Holes
  153:"2025-04-06", // Before Sunrise
  154:"2025-04-05", // Fargo
  155:"2025-04-03", // Big Fish
  156:"2025-04-01", // The Game
  157:"2025-03-29", // I, Tonya
  158:"2025-03-28", // Terrifier
  159:"2025-03-26", // An American Werewolf in London
  160:"2025-03-25", // Mystic River
  161:"2025-03-24", // The Devil's Advocate
  162:"2025-03-23", // Singin' in the Rain
  163:"2025-03-22", // Natural Born Killers
  164:"2025-03-18", // Crossroads
  165:"2025-03-16", // How to Lose a Guy in 10 Days
  166:"2025-03-15", // The Cat in the Hat
  167:"2025-03-14", // Walk the Line
  168:"2025-03-13", // The Secret Life of Walter Mitty
  169:"2025-03-13", // The Princess Bride
  170:"2025-02-16"  // Ferris Bueller's Day Off
};

// ── PERSONAL RATINGS (scraped from Letterboxd diary, May 2026) ─────────────
const RETRO_RATINGS = {
  130: 4.0,  // King Richard
  79:  3.0,  // The Assassination of Jesse James
  125: 3.0,  // Licorice Pizza
  80:  2.0,  // Synecdoche, New York
  129: 3.0,  // Bo Burnham: Inside
  141: 3.5,  // Totally Killer
  46:  3.0,  // Unforgiven
  38:  2.0,  // Being John Malkovich
  32:  4.0,  // Beautiful Boy
  2:   3.0,  // The Graduate
  8:   2.0,  // The Rocky Horror Picture Show
  9:   2.5,  // Suspiria 70
  11:  3.5,  // Life of Brian
  12:  3.0,  // Mean Streets
  18:  3.5,  // Dead Poets Society
  19:  3.5,  // When Harry Met Sally…
  21:  3.0,  // My Neighbor Totoro
  22:  3.5,  // Stand by Me
  26:  2.0,  // The Evil Dead
  27:  3.5,  // Airplane
  33:  3.0,  // Girl, Interrupted
  34:  3.5,  // Notting Hill
  37:  2.5,  // Dazed and Confused
  39:  3.5,  // The Talented Mr. Ripley
  40:  3.5,  // The Iron Giant
  44:  3.5,  // Cure
  45:  3.5,  // You've Got Mail
  47:  4.0,  // Primal Fear
  49:  3.5,  // (500) Days of Summer
  52:  2.5,  // The Devil Wears Prada
  55:  3.5,  // Almost Famous
  58:  2.0,  // Thir13en Ghosts
  59:  3.0,  // Bend It Like Beckham
  60:  3.5,  // About a Boy
  61:  2.5,  // Cabin Fever
  62:  4.0,  // Love Actually
  64:  2.5,  // Monster's Ball
  68:  3.5,  // Million Dollar Baby
  74:  2.5,  // The Devil's Rejects
  75:  3.0,  // Marie Antoinette
  76:  3.5,  // The Holiday
  81:  3.5,  // Let the Right One In
  82:  3.0,  // Yes Man
  83:  2.5,  // Vicky Cristina Barcelona
  90:  3.5,  // Kung Fu Panda 2
  91:  3.0,  // Moonrise Kingdom
  94:  4.5,  // About Time
  96:  4.5,  // Inside Llewyn Davis
  98:  3.0,  // Warm Bodies
  100: 4.0,  // How to Train Your Dragon 2
  101: 2.0,  // Inherent Vice
  103: 3.0,  // The Lobster
  104: 3.5,  // Crimson Peak
  105: 3.5,  // Me and Earl and the Dying Girl
  106: 4.5,  // Bone Tomahawk
  107: 3.0,  // Paper Towns
  108: 4.0,  // Joy
  110: 3.5,  // Nocturnal Animals
  111: 2.5,  // Swiss Army Man
  113: 3.0,  // Alice Through the Looking Glass
  114: 3.0,  // Call Me by Your Name
  119: 4.0,  // Mary Poppins Returns
  120: 4.0,  // Frozen II
  121: 4.0,  // The King
  122: 3.5,  // How to Train Your Dragon 3
  124: 3.0,  // The Devil All the Time
  131: 2.5,  // Elvis
  135: 3.5,  // Fresh
  137: 4.0,  // Cha Cha Real Smooth
  150: 3.5,  // Fruitvale Station
  151: 3.5,  // Thief
  152: 3.5,  // Holes
  153: 3.0,  // Before Sunrise
  154: 3.0,  // Fargo
  155: 3.0,  // Big Fish
  156: 4.0,  // The Game
  157: 2.5,  // I, Tonya
  158: 2.0,  // Terrifier
  159: 3.0,  // An American Werewolf in London
  160: 4.0,  // Mystic River
  161: 3.5,  // The Devil's Advocate
  162: 3.5,  // Singin' in the Rain
  163: 3.0,  // Natural Born Killers
  164: 2.0,  // Crossroads
  165: 4.0,  // How to Lose a Guy in 10 Days
  166: 2.5,  // The Cat in the Hat
  167: 3.5,  // Walk the Line
  168: 4.0,  // The Secret Life of Walter Mitty
  169: 3.5,  // The Princess Bride
  170: 3.0,  // Ferris Bueller's Day Off
};
