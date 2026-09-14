/* RDM Accountants — site behaviour.
   Two moments of motion on the whole site, plus the counter. Nothing else.
   Everything here is progressive: without JS the pages read and work. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Mobile navigation ------------------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  var close = document.querySelector('.nav-close');

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    } else {
      toggle.focus();
    }
  }

  if (toggle && nav) {
    // Only collapse the nav once we know JS can reopen it.
    if (window.matchMedia('(max-width: 900px)').matches) nav.hidden = true;

    toggle.addEventListener('click', function () {
      setNav(nav.hidden);
    });
    if (close) close.addEventListener('click', function () { setNav(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden && window.matchMedia('(max-width: 900px)').matches) {
        setNav(false);
      }
    });

    window.matchMedia('(max-width: 900px)').addEventListener('change', function (e) {
      nav.hidden = e.matches;
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* --- Hero entry -------------------------------------------------------- */

  var stagger = document.querySelector('[data-stagger]');
  if (stagger) {
    requestAnimationFrame(function () { stagger.classList.add('is-in'); });
  }

  /* --- Viewport-triggered, once each --------------------------------------
     The quote drifts in once. The counter counts up once, then holds. */

  function onceVisible(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { io.disconnect(); fn(); }
      });
    }, { threshold: 0.35 });
    io.observe(el);
  }

  var quote = document.querySelector('[data-quote]');
  if (quote) {
    onceVisible(quote, function () { quote.classList.add('is-in'); });
  }

  var counter = document.querySelector('[data-counter]');
  if (counter) {
    var target = parseInt(counter.getAttribute('data-count-to'), 10) || 0;
    var format = function (n) { return n.toLocaleString('nl-BE'); };

    if (reduced) {
      counter.textContent = format(target);
    } else {
      counter.textContent = format(0);
      onceVisible(counter, function () {
        var start = null;
        var dur = 1600;
        function tick(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          // ease-out, so the figure settles rather than stopping dead
          var eased = 1 - Math.pow(1 - p, 3);
          counter.textContent = format(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  }

  /* --- Map, loaded on request ---------------------------------------------
     The embed is a third-party request that discloses the visitor's IP, so it
     is not made until they ask for it. */

  var map = document.querySelector('[data-map]');
  if (map) {
    var loadBtn = map.querySelector('[data-map-load]');
    loadBtn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = map.getAttribute('data-src');
      frame.title = map.getAttribute('data-title');
      frame.loading = 'lazy';
      frame.width = '100%';
      frame.height = '380';
      frame.referrerPolicy = 'no-referrer';
      map.innerHTML = '';
      map.appendChild(frame);
      frame.focus();
    });
  }

  /* --- Contact form -------------------------------------------------------
     Submits for real. Without JS the browser posts natively to /bedankt.html;
     with JS it posts in the background and confirms in place. Messages say
     what to do, not that a field is invalid. */

  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var messages = {
      naam: 'Vul je naam in, dan weten we wie we terugbellen.',
      mail: 'Vul een mailadres in waarop we je kunnen bereiken, bijvoorbeeld jan@bedrijf.be.',
      onderwerp: 'Kies een onderwerp, dan komt je bericht meteen bij de juiste persoon.',
      bericht: 'Schrijf kort waarover het gaat.'
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;

      Object.keys(messages).forEach(function (name) {
        var input = form.elements[name];
        var slot = document.getElementById(name + '-error');
        var ok = input.value.trim() !== '' &&
                 (name !== 'mail' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        slot.textContent = ok ? '' : messages[name];
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        input.setAttribute('aria-describedby', name + '-error');
        if (!ok && !firstBad) firstBad = input;
      });

      if (firstBad) { firstBad.focus(); return; }

      var confirmation = document.getElementById('contact-confirmation');
      var button = form.querySelector('button[type="submit"]');
      button.setAttribute('aria-disabled', 'true');
      button.textContent = 'Bezig met versturen…';

      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.hidden = true;
        confirmation.hidden = false;
        confirmation.focus();
      }).catch(function () {
        // Never swallow a failed send: the visitor must know it did not arrive.
        button.removeAttribute('aria-disabled');
        button.textContent = 'Verstuur je bericht';
        var slot = document.getElementById('bericht-error');
        slot.textContent = 'Versturen lukte niet. Probeer opnieuw, of mail ons rechtstreeks op info@rdmaccountants.be.';
        slot.focus();
      });
    });
  }

  /* --- Reveal on scroll ----------------------------------------------------
     Sections fade up once as they enter the viewport. Without JS, or with
     reduced motion, everything is simply visible. */

  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-revealed'); });
    } else {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            rio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { rio.observe(el); });
    }
  }

  /* --- Footer year -------------------------------------------------------- */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
