/* Verifies the shipped rule set in simulator.js against the three worked
   examples in 06-price-simulator-spec.md. Extracts the real code rather than
   reimplementing it, so a drift in the file fails the test. */

const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(
  path.join(__dirname, '..', 'site', 'assets', 'js', 'simulator.js'), 'utf8');

const start = src.indexOf('var BASE =');
const end = src.indexOf("/* --- State");
if (start < 0 || end < 0) { console.error('FAIL: could not locate rule set'); process.exit(1); }

const block = src.slice(start, end);
const mod = new Function(block + '\nreturn { calculate, isStarter, isTerminal, round5, FLOOR };')();

const cases = [
  {
    name: 'A — Freelance consultant',
    state: { vorm: 'eenmanszaak', start: 'langer-1', omzet: 't150', docs: 'd75',
             btw: 'kwartaal', wn: 0, pb: true, digitaal: true, jaar: false, wn21: false },
    expect: 215
  },
  {
    name: 'B — Growing company',
    state: { vorm: 'vennootschap', start: 'langer-1', omzet: 't750', docs: 'd150',
             btw: 'maand', wn: 3, pb: false, digitaal: true, jaar: true, wn21: false },
    expect: 595
  },
  {
    name: 'C — Starter, floor applied',
    state: { vorm: 'eenmanszaak', start: 'op-te-starten', omzet: 't75', docs: 'd25',
             btw: 'vrijgesteld', wn: 0, pb: true, digitaal: true, jaar: false, wn21: false },
    expect: 125
  },
  {
    name: 'D — paperless off costs the client 10 (A with paper)',
    state: { vorm: 'eenmanszaak', start: 'langer-1', omzet: 't150', docs: 'd75',
             btw: 'kwartaal', wn: 0, pb: true, digitaal: false, jaar: false, wn21: false },
    expect: 225
  },
  {
    name: 'E — floor is never undercut by stacked discounts',
    state: { vorm: 'eenmanszaak', start: 'minder-1', omzet: 't75', docs: 'd25',
             btw: 'vrijgesteld', wn: 0, pb: false, digitaal: true, jaar: true, wn21: false },
    expect: 125
  }
];

let failed = 0;
for (const c of cases) {
  const got = mod.calculate(c.state);
  const ok = got === c.expect;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}: expected ${c.expect}, got ${got}`);
}

// Terminal routing
const terminals = [
  ['turnover above 1.5M', { omzet: 'boven', docs: 'd25', wn21: false }],
  ['more than 300 documents', { omzet: 't75', docs: 'boven', wn21: false }],
  ['more than 20 employees', { omzet: 't75', docs: 'd25', wn21: true }]
];
for (const [label, s] of terminals) {
  const ok = mod.isTerminal(s) === true;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  terminal: ${label}`);
}
const notTerminal = mod.isTerminal({ omzet: 't1500', docs: 'd300', wn21: false }) === false;
if (!notTerminal) failed++;
console.log(`${notTerminal ? 'PASS' : 'FAIL'}  not terminal: top non-terminal bands`);

// A vzw with employees is valid and must not be blocked.
const vzw = mod.calculate({ vorm: 'vzw', start: 'langer-1', omzet: 't150', docs: 'd75',
  btw: 'kwartaal', wn: 2, pb: false, digitaal: true, jaar: false, wn21: false });
console.log(`INFO  vzw with 2 employees: EUR ${vzw}/month (165+30+35+0+80-10 = 300)`);
if (vzw !== 300) { failed++; console.log('FAIL  vzw with employees'); }

// No combination may fall below the floor.
const forms = ['eenmanszaak', 'vzw', 'vennootschap'];
const omzetten = ['t75', 't150', 't350', 't750', 't1500'];
const docsets = ['d25', 'd75', 'd150', 'd300'];
const btws = ['vrijgesteld', 'kwartaal', 'maand'];
let min = Infinity, sweep = 0;
for (const vorm of forms) for (const omzet of omzetten) for (const docs of docsets)
for (const btw of btws) for (const wn of [0, 1, 20]) for (const pb of [false, true])
for (const digitaal of [false, true]) for (const jaar of [false, true])
for (const st of ['op-te-starten', 'minder-1', 'langer-1']) {
  const p = mod.calculate({ vorm, start: st, omzet, docs, btw, wn, pb, digitaal, jaar, wn21: false });
  sweep++;
  if (p < min) min = p;
  if (p % 5 !== 0) { failed++; console.log('FAIL  not rounded to 5:', p); }
}
const floorOk = min >= mod.FLOOR;
if (!floorOk) failed++;
console.log(`${floorOk ? 'PASS' : 'FAIL'}  floor holds across ${sweep} combinations (lowest: EUR ${min})`);

console.log(failed === 0 ? '\nAll checks passed.' : `\n${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
