/* RDM Accountants — price simulator.
   Implements 06-price-simulator-spec.md.

   ==========================================================================
   THE FIGURES BELOW ARE INVENTED. They are a demo rule set, not RDM's
   tariffs.

   Replace every number in "The rule set" with RDM's real tariffs, then set
   PRICES_CONFIRMED to true. That flag does two things: it removes the
   "Demo — indicatieve cijfers" badge from the result screen, and it is what
   tools/preflight.py checks before allowing a deploy. Leaving it false is
   what stops invented prices reaching a real client's website.
   ========================================================================== */

(function () {
  'use strict';

  var PRICES_CONFIRMED = false;

  var root = document.querySelector('[data-sim]');
  if (!root) return;

  root.hidden = false;

  var form = document.getElementById('sim-form');
  var panels = {};
  form.querySelectorAll('[data-panel]').forEach(function (p) {
    panels[p.getAttribute('data-panel')] = p;
  });

  var progress = document.querySelector('[data-progress]');
  var nav = document.querySelector('[data-nav]');
  var nextBtn = document.querySelector('[data-next]');
  var backBtn = document.querySelector('[data-back]');
  var reason = document.querySelector('[data-reason]');
  var rail = document.querySelector('[data-rail]');
  var running = document.querySelector('[data-running]');
  var announce = document.querySelector('[data-announce]');
  var figure = document.querySelector('[data-result-figure]');
  var covers = document.querySelector('[data-covers]');

  /* --- The rule set ------------------------------------------------------- */

  var BASE = { eenmanszaak: 145, vzw: 165, vennootschap: 245 };
  var TURNOVER = { t75: 0, t150: 30, t350: 75, t750: 140, t1500: 230 };
  var DOCS = { d25: 0, d75: 35, d150: 85, d300: 160 };
  var VAT = { vrijgesteld: -15, kwartaal: 0, maand: 45 };
  var PER_EMPLOYEE = 40;
  var PERSONAL_TAX = 15;
  var PAPERLESS = 10;
  var STARTER = 0.80;
  var ANNUAL = 0.95;
  var FLOOR = 125;

  function round5(n) { return Math.round(n / 5) * 5; }

  function calculate(s) {
    var subtotal = BASE[s.vorm]
      + (TURNOVER[s.omzet] || 0)
      + (DOCS[s.docs] || 0)
      + (VAT[s.btw] || 0)
      + (s.wn * PER_EMPLOYEE)
      + (s.pb ? PERSONAL_TAX : 0);

    var afterPaperless = subtotal - (s.digitaal ? PAPERLESS : 0);
    var afterStarter = afterPaperless * (isStarter(s) ? STARTER : 1);
    var afterAnnual = afterStarter * (s.jaar ? ANNUAL : 1);

    return Math.max(FLOOR, round5(afterAnnual));
  }

  function isStarter(s) {
    return s.start === 'op-te-starten' || s.start === 'minder-1';
  }

  function isTerminal(s) {
    return s.omzet === 'boven' || s.docs === 'boven' || s.wn21;
  }

  /* --- State -------------------------------------------------------------- */

  var REQUIRED = {
    1: [
      { name: 'vorm', label: 'je ondernemingsvorm' },
      { name: 'start', label: 'hoe lang je actief bent' }
    ],
    2: [
      { name: 'omzet', label: 'je jaaromzet' },
      { name: 'docs', label: 'het aantal documenten per maand' },
      { name: 'btw', label: 'je btw-regime' }
    ],
    3: []
  };

  var step = 1; // 1 | 2 | 3 | 'result' | 'terminal'

  function radio(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function readState() {
    var wn = parseInt(form.elements.wn.value, 10);
    if (isNaN(wn) || wn < 0) wn = 0;
    if (wn > 20) wn = 20;
    return {
      vorm: radio('vorm'),
      start: radio('start'),
      sector: form.elements.sector.value,
      vtype: radio('vtype'),
      omzet: radio('omzet'),
      docs: radio('docs'),
      btw: radio('btw'),
      wn: wn,
      wn21: form.elements.wn21.checked,
      pb: form.elements.pb.checked,
      digitaal: form.elements.digitaal.checked,
      jaar: form.elements.jaar.checked
    };
  }

  function missing(n) {
    return REQUIRED[n].filter(function (f) { return !radio(f.name); });
  }

  /* --- URL ---------------------------------------------------------------- */

  function writeUrl(s) {
    var q = new URLSearchParams();
    if (s.vorm) q.set('vorm', s.vorm);
    if (s.start) q.set('start', s.start);
    if (s.sector) q.set('sector', s.sector);
    if (s.vtype) q.set('vtype', s.vtype);
    if (s.omzet) q.set('omzet', s.omzet);
    if (s.docs) q.set('docs', s.docs);
    if (s.btw) q.set('btw', s.btw);
    if (s.wn) q.set('wn', String(s.wn));
    if (s.wn21) q.set('wn21', '1');
    if (s.pb) q.set('pb', '1');
    if (!s.digitaal) q.set('digitaal', '0');
    if (s.jaar) q.set('jaar', '1');
    q.set('stap', String(step));
    try {
      history.replaceState(null, '', location.pathname + '?' + q.toString());
    } catch (err) {
      // Browsers block history writes on file:// URLs. Opened from disk the
      // simulator still works; the result just cannot be bookmarked.
    }
  }

  function readUrl() {
    var q = new URLSearchParams(location.search);

    ['vorm', 'vtype', 'start', 'omzet', 'docs', 'btw'].forEach(function (name) {
      var v = q.get(name);
      if (!v) return;
      var el = form.querySelector('input[name="' + name + '"][value="' + v + '"]');
      if (el) el.checked = true;
    });

    if (q.get('sector')) form.elements.sector.value = q.get('sector');
    if (q.get('wn')) form.elements.wn.value = String(Math.min(20, Math.max(0, parseInt(q.get('wn'), 10) || 0)));
    form.elements.wn21.checked = q.get('wn21') === '1';
    form.elements.pb.checked = q.get('pb') === '1';
    form.elements.digitaal.checked = q.get('digitaal') !== '0';
    form.elements.jaar.checked = q.get('jaar') === '1';

    var stap = q.get('stap');
    if (stap === 'result' || stap === 'terminal') {
      step = stap;
    } else if (stap === '2' || stap === '3') {
      step = parseInt(stap, 10);
    }

    // A step the answers do not support falls back to the first gap.
    if (step === 'result' || step === 'terminal' || step === 3) {
      if (missing(1).length) step = 1;
      else if (missing(2).length) step = 2;
    } else if (step === 2 && missing(1).length) {
      step = 1;
    }
    if (step === 'result' && isTerminal(readState())) step = 'terminal';
  }

  /* --- Rendering ----------------------------------------------------------- */

  var euro = function (n) { return '€ ' + n.toLocaleString('nl-BE'); };

  var lastPrice = null;
  var announceTimer = null;

  function renderPrice(s) {
    if (isTerminal(s)) {
      running.textContent = 'Maatwerk';
      lastPrice = null;
      return;
    }
    if (!s.vorm) return;

    var price = calculate(s);
    running.textContent = euro(price);

    if (lastPrice !== null && lastPrice !== price) {
      running.classList.add('is-changing');
      setTimeout(function () { running.classList.remove('is-changing'); }, 400);
      clearTimeout(announceTimer);
      announceTimer = setTimeout(function () {
        announce.textContent = 'Je richtprijs is nu ' + price + ' euro per maand.';
      }, 700);
    }
    lastPrice = price;
  }

  function buildCovers(s) {
    var items = ['Verwerking van je aankoop- en verkoopfacturen'];

    if (s.btw === 'kwartaal') items.push('Btw-aangiftes per kwartaal');
    if (s.btw === 'maand') items.push('Btw-aangiftes per maand');
    if (s.btw === 'vrijgesteld') items.push('Opvolging van je btw-vrijstelling als kleine onderneming');

    if (s.vorm === 'vennootschap') {
      // A small VOF or CommV is not always required to file with the NBB, so
      // the filing is only promised where it applies.
      items.push(s.vtype === 'vof' || s.vtype === 'commv'
        ? 'Jaarrekening, en neerlegging bij de Nationale Bank waar dat verplicht is'
        : 'Jaarrekening en neerlegging bij de Nationale Bank');
      items.push('Aangifte vennootschapsbelasting');
    }
    if (s.vorm === 'vzw') items.push('Jaarrekening voor je vzw');
    if (s.pb) items.push('Je aangifte personenbelasting');
    if (s.wn > 0) items.push('Loonverwerking voor ' + s.wn + (s.wn === 1 ? ' medewerker' : ' medewerkers'));
    if (isStarter(s)) items.push('Begeleiding bij je opstart');
    if (s.digitaal) items.push('Digitale aanlevering via mail of Peppol');

    items.push('Fiscaal advies, zonder aparte factuur');
    items.push('Eén vast aanspreekpunt');

    covers.innerHTML = '';
    items.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      covers.appendChild(li);
    });
  }

  function renderStep() {
    Object.keys(panels).forEach(function (k) {
      panels[k].hidden = String(k) !== String(step);
    });

    var numeric = (step === 1 || step === 2 || step === 3);

    progress.querySelectorAll('li').forEach(function (li) {
      var n = parseInt(li.getAttribute('data-step'), 10);
      li.removeAttribute('aria-current');
      li.classList.remove('is-done');
      if (numeric && n === step) li.setAttribute('aria-current', 'step');
      else if (!numeric || n < step) li.classList.add('is-done');
    });

    nav.hidden = !numeric;
    backBtn.hidden = step === 1;
    nextBtn.textContent = step === 3 ? 'Bereken je tarief' : 'Volgende';

    // The rail appears from step two onward, once there is a figure to show.
    rail.hidden = !(step === 2 || step === 3);
    document.querySelector('[data-sim-root]').classList.toggle('has-rail', !rail.hidden);

    renderGate();
  }

  function renderGate() {
    if (step !== 1 && step !== 2) {
      nextBtn.removeAttribute('aria-disabled');
      reason.textContent = '';
      return;
    }
    var gaps = missing(step);
    if (gaps.length === 0) {
      nextBtn.removeAttribute('aria-disabled');
      reason.textContent = '';
      return;
    }
    nextBtn.setAttribute('aria-disabled', 'true');
    var labels = gaps.map(function (f) { return f.label; });
    var text = labels.length === 1
      ? labels[0]
      : labels.slice(0, -1).join(', ') + ' en ' + labels[labels.length - 1];
    reason.textContent = 'Kies eerst ' + text + '.';
  }

  function syncVtype() {
    var box = document.querySelector('[data-vtype]');
    if (box) box.hidden = radio('vorm') !== 'vennootschap';
  }

  function sync() {
    syncVtype();
    var s = readState();
    renderPrice(s);
    renderGate();
    writeUrl(s);
  }

  /* --- Navigation ---------------------------------------------------------- */

  function goto(next) {
    step = next;
    renderStep();
    var s = readState();
    if (step === 'result') {
      figure.textContent = euro(calculate(s));
      buildCovers(s);
    }
    writeUrl(s);

    if (step === 'result' || step === 'terminal') {
      panels[step].focus();
    } else {
      var heading = panels[String(step)].querySelector('h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
    if (window.scrollY > 240) window.scrollTo({ top: 120, behavior: 'auto' });
  }

  nextBtn.addEventListener('click', function () {
    var gaps = missing(step);
    if (gaps.length) {
      renderGate();
      var first = form.querySelector('input[name="' + gaps[0].name + '"]');
      if (first) first.focus();
      return;
    }
    if (isTerminal(readState())) { goto('terminal'); return; }
    goto(step === 3 ? 'result' : step + 1);
  });

  backBtn.addEventListener('click', function () {
    goto(Math.max(1, step - 1));
  });

  document.querySelectorAll('[data-restart]').forEach(function (b) {
    b.addEventListener('click', function () { goto(1); });
  });

  /* --- Inputs -------------------------------------------------------------- */

  form.addEventListener('change', function (e) {
    if (e.target.name === 'mailme') return;
    sync();
    // Selecting a terminal option while already past it should not strand
    // the visitor on a price screen.
    if (step === 'result' && isTerminal(readState())) goto('terminal');
  });

  form.elements.wn.addEventListener('input', function () {
    var v = parseInt(form.elements.wn.value, 10);
    if (isNaN(v)) return;
    if (v < 0) form.elements.wn.value = '0';
    if (v > 20) form.elements.wn.value = '20';
    sync();
  });

  document.querySelector('[data-step-down]').addEventListener('click', function () {
    var el = form.elements.wn;
    el.value = String(Math.max(0, (parseInt(el.value, 10) || 0) - 1));
    sync();
  });

  document.querySelector('[data-step-up]').addEventListener('click', function () {
    var el = form.elements.wn;
    el.value = String(Math.min(20, (parseInt(el.value, 10) || 0) + 1));
    sync();
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* --- "Stuur me dit per mail" — asked for after the value is delivered --- */

  var mailForm = document.querySelector('[data-mailme]');
  if (mailForm) {
    mailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('mailme');
      var slot = document.getElementById('mailme-error');
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!ok) {
        slot.textContent = 'Vul een mailadres in waarop we je berekening kunnen sturen.';
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', 'mailme-error');
        input.focus();
        return;
      }
      slot.textContent = '';
      input.removeAttribute('aria-invalid');

      // Send the answers and the figure, not just the address.
      var st = readState();
      mailForm.querySelector('[data-mailme-state]').value = JSON.stringify({
        prijs: isTerminal(st) ? 'maatwerk' : calculate(st),
        antwoorden: st,
        url: location.href
      });

      var send = mailForm.querySelector('button[type="submit"]');
      send.setAttribute('aria-disabled', 'true');
      send.textContent = 'Bezig…';

      fetch(mailForm.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(mailForm)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        mailForm.hidden = true;
        document.querySelector('[data-mailme-done]').hidden = false;
      }).catch(function () {
        send.removeAttribute('aria-disabled');
        send.textContent = 'Stuur me dit';
        slot.textContent = 'Versturen lukte niet. Probeer opnieuw, of mail ons op info@rdmaccountants.be.';
      });
    });
  }

  /* --- Start --------------------------------------------------------------- */

  var demoFlag = document.querySelector('[data-demo-flag]');
  if (demoFlag) demoFlag.hidden = PRICES_CONFIRMED;

  readUrl();
  syncVtype();
  renderStep();
  var initial = readState();
  if (initial.vorm) { lastPrice = isTerminal(initial) ? null : calculate(initial); }
  renderPrice(initial);
  if (step === 'result') {
    figure.textContent = euro(calculate(initial));
    buildCovers(initial);
  }
  writeUrl(initial);
})();
