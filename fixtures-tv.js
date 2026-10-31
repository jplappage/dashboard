// ═══════════════════════════════════════════════════════════════════════════
// FIXTURE TV CHANNELS — Liverpool + France, exact UK channel per game
// Read by index.html (Lineup Builder card): when the next game's UK date and
// team match an entry here, the card shows "📺 <channel>" under the fixture.
// Updated on every /refresh (see REFRESH_INSTRUCTIONS.md, Phase 3 "TV channels").
// date = UK date (YYYY-MM-DD) · ko = UK kick-off · confirmed:false = only the
// broadcaster is known so far (exact channel not yet allocated) → shown as "(TBC)".
// Source: live-footballontv.com (Liverpool) · Prime Video holds UK rights to
// Nations League games not involving the home nations (France).
// Last checked: 31 Oct 2026
// ═══════════════════════════════════════════════════════════════════════════

const FIXTURE_TV = [
  { date: '2026-11-01', team: 'liverpool', ko: '16:30', match: 'Liverpool v Arsenal',          channel: 'Sky Sports Main Event', confirmed: true },
  { date: '2026-11-04', team: 'liverpool', ko: '17:45', match: 'Fenerbahçe v Liverpool',       channel: 'TNT Sports 1',          confirmed: true },
  { date: '2026-11-08', team: 'liverpool', ko: '14:00', match: 'Crystal Palace v Liverpool',   channel: 'Sky Sports Main Event', confirmed: true },
  { date: '2026-11-12', team: 'france',    ko: '19:45', match: 'Italy v France',               channel: 'Prime Video',           confirmed: false },
  { date: '2026-11-15', team: 'france',    ko: '19:45', match: 'France v Türkiye',             channel: 'Prime Video',           confirmed: false },
  { date: '2026-11-22', team: 'liverpool', ko: '16:30', match: 'Liverpool v Manchester United', channel: 'Sky Sports Main Event', confirmed: true },
  { date: '2026-11-25', team: 'liverpool', ko: '20:00', match: 'Club Brugge v Liverpool',      channel: 'TNT Sports 2',          confirmed: true },
  { date: '2026-11-29', team: 'liverpool', ko: '12:00', match: 'Everton v Liverpool',          channel: 'TNT Sports 1',          confirmed: true },
  { date: '2026-12-02', team: 'liverpool', ko: '19:30', match: 'Liverpool v Sunderland',       channel: 'Sky Sports',            confirmed: false },
  { date: '2026-12-05', team: 'liverpool', ko: '12:30', match: 'Chelsea v Liverpool',          channel: 'TNT Sports 1',          confirmed: true },
  { date: '2026-12-09', team: 'liverpool', ko: '20:00', match: 'Liverpool v FC Porto',         channel: 'TNT Sports',            confirmed: false },
  { date: '2026-12-19', team: 'liverpool', ko: '17:30', match: 'Liverpool v Tottenham Hotspur', channel: 'Sky Sports Main Event', confirmed: true },
  { date: '2026-12-26', team: 'liverpool', ko: '17:30', match: 'Hull City v Liverpool',        channel: 'Sky Sports Main Event', confirmed: true },
  { date: '2026-12-30', team: 'liverpool', ko: '20:15', match: 'Aston Villa v Liverpool',      channel: 'Sky Sports Football',   confirmed: true },
  { date: '2027-01-05', team: 'liverpool', ko: '20:15', match: 'Sunderland v Liverpool',       channel: 'Sky Sports Premier League', confirmed: true },
];
