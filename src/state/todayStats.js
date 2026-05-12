const r2 = require('../network/r2Writer');

const state = {
  ships: new Map(),  // typeID → count
  date: null,
};

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

async function prime() {
  state.date = todayUTC();
  try {
    const saved = await r2.get(`day-stats/${state.date}.json`);
    if (saved?.ships) {
      state.ships = new Map(
        Object.entries(saved.ships).map(([k, v]) => [parseInt(k), v])
      );
      console.log(`[TODAY] Recovered ${state.ships.size} ship types from R2`);
    } else {
      console.log(`[TODAY] No snapshot for ${state.date} — starting fresh`);
    }
  } catch (err) {
    console.error(`[TODAY] Recovery failed: ${err.message}`);
  }
}

function increment(shipTypeID) {
  if (!shipTypeID) return;
  state.ships.set(shipTypeID, (state.ships.get(shipTypeID) || 0) + 1);
}

async function snapshot() {
  if (!state.date) return;
  try {
    await r2.put(`day-stats/${state.date}.json`, {
      date: state.date,
      updatedAt: new Date().toISOString(),
      ships: Object.fromEntries(state.ships),
    });
  } catch (err) {
    console.warn(`[TODAY] Snapshot failed: ${err.message}`);
  }
}

async function rotateIfNeeded() {
  const today = todayUTC();
  if (today === state.date) return;
  console.log(`[TODAY] Day rolled ${state.date} -> ${today}. Sealing.`);
  await snapshot();
  state.ships.clear();
  state.date = today;
}

function topN(n = 25) {
  return [...state.ships.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, n);
}

module.exports = { prime, increment, snapshot, rotateIfNeeded, topN };