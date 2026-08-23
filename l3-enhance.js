(function () {
  const BASE = '/Lvl-3-Media/';
  const REDS = ['#ff4938', '#FF4938', '#b82318', '#B82318', 'rgb(255, 73, 56)', 'rgb(255,73,56)'];

  function isPlanView() {
    const q = new URLSearchParams(location.search);
    return q.get('view') === 'plan' || /plan/i.test(location.hash);
  }

  function paintMonochrome(root) {
    const walk = (node) => {
      if (!node || node.nodeType !== 1) return;
      const st = node.getAttribute && node.getAttribute('style');
      if (st) {
        let next = st;
        REDS.forEach((r) => { next = next.split(r).join('#ffffff'); });
        if (next !== st) node.setAttribute('style', next);
      }
      ['fill', 'stroke'].forEach((attr) => {
        const v = node.getAttribute && node.getAttribute(attr);
        if (!v) return;
        const low = v.toLowerCase();
        if (low.includes('ff4938') || low.includes('b82318') || low.includes('255, 73, 56') || low.includes('255,73,56')) {
          node.setAttribute(attr, '#ffffff');
        }
      });
      try {
        const cs = getComputedStyle(node);
        const c = cs.color;
        if (c && c.startsWith('rgb')) {
          const m = c.match(/\d+/g);
          if (m) {
            const r = +m[0], g = +m[1], b = +m[2];
            if (r > 200 && g < 120 && b < 100) node.style.color = '#ffffff';
          }
        }
        const bg = cs.backgroundColor;
        if (bg && bg.startsWith('rgb')) {
          const m = bg.match(/\d+/g);
          if (m) {
            const r = +m[0], g = +m[1], b = +m[2], a = m[3] !== undefined ? +m[3] : 1;
            if (r > 200 && g < 120 && b < 100 && a > 0.05) {
              if (a > 0.85) {
                node.style.backgroundColor = '#ffffff';
                node.style.color = '#0a0a0a';
                node.classList.add('l3-mono-fill');
              } else {
                node.style.backgroundColor = 'rgba(255,255,255,' + Math.min(a * 1.2, 0.35) + ')';
              }
            }
          }
        }
        if (node.classList && /rounded-full/.test(node.className || '')) {
          const bg2 = getComputedStyle(node).backgroundColor;
          const m2 = bg2 && bg2.match(/\d+/g);
          if (m2) {
            const r = +m2[0], g = +m2[1], b = +m2[2];
            if (g > 140 && r < 120 && b < 120) {
              node.style.backgroundColor = '#ffffff';
              node.classList.add('l3-status-dot');
            }
          }
        }
      } catch (e) {}
      for (let i = 0; i < node.children.length; i++) walk(node.children[i]);
    };
    walk(root || document.getElementById('root') || document.body);
  }

  function staggerIn() {
    const root = document.getElementById('root');
    if (!root) return;
    const kids = root.querySelectorAll('h1, h2, p, section, article');
    let n = 0;
    kids.forEach((el) => {
      if (el.closest('#l3-dock') || el.closest('#l3-choice')) return;
      if (el.dataset.l3Anim) return;
      el.dataset.l3Anim = '1';
      el.classList.add('l3-animate-in');
      el.classList.add('l3-animate-in-delay-' + Math.min(4, (n % 5)));
      n++;
    });
  }

  const ICONS = {
    home: '<svg class="l3-ico" viewBox="0 0 24 24"><path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/><circle cx="12" cy="12.5" r="1.2"/></svg>',
    work: '<svg class="l3-ico" viewBox="0 0 24 24"><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="3" y="13" width="7" height="7" rx="1.5"/><rect x="14" y="13" width="7" height="7" rx="1.5"/></svg>',
    plan: '<svg class="l3-ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 9.5h8M8 12h8M8 14.5h8"/></svg>',
    saved: '<svg class="l3-ico" viewBox="0 0 24 24"><path d="M12 4.5c-2-2.2-6-1.8-7.4 1C2.8 9 5.2 13.2 12 19c6.8-5.8 9.2-10 7.4-13.5-1.4-2.8-5.4-3.2-7.4-1z"/></svg>',
    studio: '<svg class="l3-ico" viewBox="0 0 24 24"><path d="M4 8v8M8 6v12M12 4v16M16 7v10M20 9v6"/><path d="M3 12h18"/></svg>'
  };

  function mountDock() {
    if (document.getElementById('l3-dock')) return;
    const dock = document.createElement('div');
    dock.id = 'l3-dock';
    dock.innerHTML =
      '<a href="' + BASE + '" data-tab="home" class="l3-tab">' + ICONS.home + '<span>Home</span></a>' +
      '<a href="' + BASE + '?view=work" data-tab="work" class="l3-tab">' + ICONS.work + '<span>Work</span></a>' +
      '<button type="button" class="l3-plan-btn" id="l3-plan-trigger" aria-label="Plan">' + ICONS.plan + '</button>' +
      '<a href="' + BASE + '?view=saved" data-tab="saved" class="l3-tab">' + ICONS.saved + '<span>Saved</span></a>' +
      '<a href="' + BASE + '?view=studio" data-tab="studio" class="l3-tab">' + ICONS.studio + '<span>Studio</span></a>';
    document.body.appendChild(dock);
    document.body.classList.add('l3-docked');

    const view = new URLSearchParams(location.search).get('view') || 'home';
    dock.querySelectorAll('.l3-tab').forEach((a) => {
      if (a.dataset.tab === view) a.classList.add('l3-active');
      if (!location.search && a.dataset.tab === 'home') a.classList.add('l3-active');
    });

    document.getElementById('l3-plan-trigger').addEventListener('click', function (e) {
      e.preventDefault();
      openChoice();
    });
  }

  function openChoice() {
    var el = document.getElementById('l3-choice');
    if (!el) {
      el = document.createElement('div');
      el.id = 'l3-choice';
      el.innerHTML =
        '<div class="sheet">' +
        '<h2>How do you want to book?</h2>' +
        '<p class="sub">Pick the flow that fits. Both get your project to the studio.</p>' +
        '<a class="opt primary" href="' + BASE + 'book.html">' +
        '<strong>Easy chat</strong>' +
        '<span>Talk it through like a text. Get a quote, make an account, message the owner, and lock a time.</span>' +
        '</a>' +
        '<a class="opt" href="' + BASE + '?view=plan&flow=builder">' +
        '<strong>Project builder</strong>' +
        '<span>Step by step brief. Format, budget, timeline, and details saved on this device.</span>' +
        '</a>' +
        '<button type="button" class="dismiss" id="l3-choice-dismiss">Not now</button>' +
        '</div>';
      document.body.appendChild(el);
      el.addEventListener('click', function (e) { if (e.target === el) closeChoice(); });
      el.querySelector('#l3-choice-dismiss').addEventListener('click', closeChoice);
    }
    el.classList.add('open');
  }

  function closeChoice() {
    var el = document.getElementById('l3-choice');
    if (el) el.classList.remove('open');
  }

  function hideNativeNav() {
    document.querySelectorAll('nav, footer, div').forEach(function (n) {
      if (n.id === 'l3-dock' || n.closest('#l3-dock') || n.closest('#l3-choice')) return;
      var cs = getComputedStyle(n);
      if (cs.position === 'fixed' && parseInt(cs.bottom, 10) <= 24 && n.offsetHeight < 130 && n.offsetWidth > 200) {
        if (n.querySelector('button,a') && /home|work|plan|saved|studio/i.test(n.textContent || '')) {
          n.style.opacity = '0';
          n.style.pointerEvents = 'none';
          n.setAttribute('data-l3-hidden-nav', '1');
        }
      }
    });
  }

  function boot() {
    paintMonochrome();
    staggerIn();
    mountDock();
    hideNativeNav();
    if (isPlanView() && !new URLSearchParams(location.search).get('flow')) {
      setTimeout(openChoice, 350);
    }
  }

  var obs = new MutationObserver(function () {
    paintMonochrome();
    hideNativeNav();
  });

  function start() {
    boot();
    var root = document.getElementById('root') || document.body;
    obs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    function wrap(fn) {
      return function () {
        var r = fn.apply(this, arguments);
        setTimeout(function () {
          paintMonochrome();
          hideNativeNav();
          if (isPlanView() && !new URLSearchParams(location.search).get('flow')) openChoice();
        }, 80);
        return r;
      };
    }
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', function () { setTimeout(boot, 50); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 120); });
  } else {
    setTimeout(start, 120);
  }
})();
