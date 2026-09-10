/* LEVEL 3 — owner layer
   ============================================================
   Two jobs, and they are deliberately in one file so a visitor and the
   owner load the same script and only one of them sees a difference:

   1. EVERY visitor gets the published copy. Content the owner has
      published lives on the McCluster plane (orgs.settings.site_content,
      read through /v1/public/level-3-media/content) and is applied to the
      page on load. Nothing here writes to the page unless the plane says
      so, so a visitor sees the site exactly as published.

   2. THE OWNER gets a backend. When a McCluster session belongs to an
      owner of this tenant, the site puts a bar across the top, marks the
      page as his, and lets him rewrite the words and swap the media in
      place — draft first, then publish when he means it.

   The homepage is a compiled bundle with no source in this repository, so
   editing binds to a positional selector rather than to markup we control.
   That survives copy changes and CSS changes; it does NOT survive the
   homepage being rebuilt with a different structure. When that happens the
   binding is dropped rather than applied to the wrong element — see
   applyContent().
   ============================================================ */
(function () {
  'use strict';

  var API = 'https://api.mccluster.org';
  var SB = 'https://zmnhbrjyhxzhkxmhkexs.supabase.co';
  var KEY = 'sb_publishable_kr5NujBZ1n518IUMDoa2dQ_tqQAJef4';
  var SLUG = 'level-3-media';
  var SESSION = 'mccdb_session';
  var DESK = '/Lvl-3-Media/dashboard.html';

  var drafts = {};
  var editing = false;

  function session() {
    try { return JSON.parse(localStorage.getItem(SESSION) || 'null'); } catch (e) { return null; }
  }

  function saveSession(s) {
    if (s && !s.expires_at) s.expires_at = Math.floor(Date.now() / 1000) + (s.expires_in || 3600);
    try { localStorage.setItem(SESSION, JSON.stringify(s)); } catch (e) {}
  }

  /* Same refresh the desk does. Without it the bar disappears an hour into
     the day and the owner concludes the site "logged him out again". */
  function fresh() {
    var s = session();
    if (!s || !s.refresh_token) return Promise.resolve(s);
    if (s.expires_at && s.expires_at > (Date.now() / 1000) + 60) return Promise.resolve(s);
    return fetch(SB + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token })
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.access_token) { saveSession(d); return d; } return null; })
      .catch(function () { return null; });
  }

  function api(path, opts) {
    opts = opts || {};
    return fresh().then(function (s) {
      var headers = { 'content-type': 'application/json' };
      if (s && s.access_token) headers.authorization = 'Bearer ' + s.access_token;
      return fetch(API + path, {
        method: opts.method || 'GET',
        headers: headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined
      }).then(function (r) {
        return r.text().then(function (t) {
          var d = null;
          try { d = t ? JSON.parse(t) : null; } catch (e) { d = t; }
          if (!r.ok) throw Object.assign(new Error((d && (d.error || d.message)) || r.statusText), { status: r.status });
          return d;
        });
      });
    });
  }

  /* ---------- binding an element to a content key ---------- */

  function selectorFor(el) {
    var parts = [];
    var node = el;
    while (node && node.nodeType === 1 && node !== document.body && parts.length < 8) {
      var tag = node.tagName.toLowerCase();
      var parent = node.parentNode;
      if (!parent) break;
      var same = Array.prototype.filter.call(parent.children, function (c) { return c.tagName === node.tagName; });
      parts.unshift(same.length > 1 ? tag + ':nth-of-type(' + (same.indexOf(node) + 1) + ')' : tag);
      node = parent;
    }
    return 'body ' + parts.join(' > ');
  }

  /* A content key must be [a-z0-9-]. Hash the selector so the same element
     resolves to the same key on every visit and every device. */
  function keyFor(selector) {
    var h = 5381;
    for (var i = 0; i < selector.length; i++) h = ((h << 5) + h + selector.charCodeAt(i)) >>> 0;
    var page = (location.pathname.split('/').pop() || 'index').replace(/[^a-z0-9]+/gi, '').toLowerCase().slice(0, 20) || 'index';
    return ('t-' + page + '-' + h.toString(36)).slice(0, 64);
  }

  function applyRecord(record) {
    if (!record || !record.selector) return false;
    var el;
    try { el = document.querySelector(record.selector); } catch (e) { el = null; }
    /* Binding lost to a rebuild: drop it. Writing the owner's headline into
       whatever element now sits in that position would be worse than not
       applying it at all. */
    if (!el) return false;
    if (record.src != null && (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'SOURCE')) {
      el.setAttribute('src', record.src);
      if (el.tagName === 'VIDEO') el.load && el.load();
    } else if (record.text != null) {
      el.textContent = record.text;
    }
    return true;
  }

  function applyContent() {
    return fetch(API + '/v1/public/' + SLUG + '/content')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var content = (d && d.content) || {};
        Object.keys(content).forEach(function (k) { applyRecord(content[k]); });
        return content;
      })
      .catch(function () { return {}; });
  }

  /* ---------- the owner bar ---------- */

  function styles() {
    var css = document.createElement('style');
    css.textContent = [
      '.l3own{position:fixed;top:0;left:0;right:0;z-index:2147483000;display:flex;align-items:center;gap:12px;',
      'padding:10px 14px;background:#0b0b0c;color:#f4efe6;border-bottom:1px solid #2a2a2a;',
      'font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)}',
      '.l3own b{font-weight:600}',
      '.l3own .who{display:flex;align-items:center;gap:8px;min-width:0;flex:1}',
      '.l3own .dot{width:8px;height:8px;border-radius:50%;background:#43d17c;flex:0 0 auto}',
      '.l3own .em{color:#9a9a9a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.l3own button,.l3own a.b{appearance:none;border:1px solid #333;background:#151516;color:#f4efe6;',
      'border-radius:999px;padding:7px 13px;font:inherit;cursor:pointer;text-decoration:none;white-space:nowrap}',
      '.l3own button.on{background:#f4efe6;color:#0b0b0c;border-color:#f4efe6}',
      '.l3own .count{background:#43d17c;color:#04240f;border-radius:999px;padding:1px 7px;font-weight:600;margin-left:6px}',
      'body.l3-owner{border-top:3px solid #43d17c}',
      'body.l3-owner-pad{padding-top:52px!important}',
      'body.l3-editing [data-l3-hot]{outline:2px dashed rgba(67,209,124,.7);outline-offset:3px;cursor:text}',
      'body.l3-editing [data-l3-hot]:hover{outline-color:#43d17c;background:rgba(67,209,124,.08)}',
      '.l3own .msg{color:#9a9a9a}',
      '@media(max-width:620px){.l3own{flex-wrap:wrap;gap:8px}.l3own .who{flex:1 0 100%}}'
    ].join('');
    document.head.appendChild(css);
  }

  function bar(me) {
    var el = document.createElement('div');
    el.className = 'l3own';
    el.innerHTML =
      '<div class="who"><span class="dot"></span><b>Owner mode</b>' +
      '<span class="em">' + (me.user && me.user.email ? me.user.email : SLUG) + '</span></div>' +
      '<button type="button" id="l3edit">Edit page</button>' +
      '<button type="button" id="l3publish" hidden>Publish</button>' +
      '<a class="b" id="l3desk" href="' + DESK + '">Desk<span class="count" id="l3count" hidden>0</span></a>' +
      '<button type="button" id="l3out">Sign out</button>' +
      '<span class="msg" id="l3msg"></span>';
    document.body.appendChild(el);
    document.body.classList.add('l3-owner', 'l3-owner-pad');
    return el;
  }

  function say(text) {
    var m = document.getElementById('l3msg');
    if (!m) return;
    m.textContent = text || '';
    if (text) setTimeout(function () { if (m.textContent === text) m.textContent = ''; }, 4000);
  }

  /* ---------- editing ---------- */

  var EDITABLE = 'h1,h2,h3,h4,p,span,a,li,button,figcaption,blockquote,img,video';

  function markHot() {
    Array.prototype.forEach.call(document.querySelectorAll(EDITABLE), function (el) {
      if (el.closest('.l3own')) return;
      if (el.tagName === 'IMG' || el.tagName === 'VIDEO') { el.setAttribute('data-l3-hot', 'media'); return; }
      /* Only leaf text: editing a container would swallow its children. */
      if (el.children.length) return;
      if (!(el.textContent || '').trim()) return;
      el.setAttribute('data-l3-hot', 'text');
    });
  }

  function stageDraft(el, record) {
    var selector = el.getAttribute('data-l3-sel') || selectorFor(el);
    el.setAttribute('data-l3-sel', selector);
    var key = keyFor(selector);
    var draft = Object.assign({ selector: selector }, record);
    return api('/v1/clients/' + SLUG + '/content/' + key, { method: 'PATCH', body: { draft: draft } })
      .then(function () {
        drafts[key] = draft;
        document.getElementById('l3publish').hidden = false;
        say('Draft saved — press Publish to make it live.');
      })
      .catch(function (e) { say(e.message || 'Could not save that.'); });
  }

  function onClick(event) {
    if (!editing) return;
    var el = event.target.closest('[data-l3-hot]');
    if (!el || el.closest('.l3own')) return;
    event.preventDefault();
    event.stopPropagation();

    if (el.getAttribute('data-l3-hot') === 'media') {
      var current = el.getAttribute('src') || '';
      var next = window.prompt('Media URL for this ' + el.tagName.toLowerCase() + ':', current);
      if (next == null || next === current) return;
      el.setAttribute('src', next);
      if (el.tagName === 'VIDEO' && el.load) el.load();
      stageDraft(el, { src: next });
      return;
    }

    if (el.isContentEditable) return;
    var before = el.textContent;
    el.contentEditable = 'true';
    el.focus();
    var done = function () {
      el.contentEditable = 'false';
      el.removeEventListener('blur', done);
      el.removeEventListener('keydown', keys);
      var after = (el.textContent || '').trim();
      if (after === (before || '').trim()) return;
      stageDraft(el, { text: after });
    };
    var keys = function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') { el.textContent = before; el.blur(); }
    };
    el.addEventListener('blur', done);
    el.addEventListener('keydown', keys);
  }

  function publishAll() {
    var keys = Object.keys(drafts);
    if (!keys.length) { say('Nothing to publish.'); return; }
    say('Publishing…');
    var chain = Promise.resolve();
    var failed = 0;
    keys.forEach(function (k) {
      chain = chain.then(function () {
        return api('/v1/clients/' + SLUG + '/publish', { method: 'POST', body: { key: k } })
          .catch(function () { failed += 1; });
      });
    });
    return chain.then(function () {
      drafts = {};
      document.getElementById('l3publish').hidden = true;
      say(failed ? (failed + ' change(s) failed to publish.') : 'Live. Everyone sees this now.');
    });
  }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('l3-editing', on);
    var b = document.getElementById('l3edit');
    b.classList.toggle('on', on);
    b.textContent = on ? 'Done editing' : 'Edit page';
    if (on) { markHot(); say('Tap any text or image to change it.'); }
  }

  function countThreads() {
    api('/v1/clients/' + SLUG + '/threads').then(function (d) {
      var n = ((d && d.items) || []).length;
      if (!n) return;
      var c = document.getElementById('l3count');
      c.textContent = n;
      c.hidden = false;
    }).catch(function () {});
  }

  function signOut() {
    var s = session();
    try { localStorage.removeItem(SESSION); } catch (e) {}
    try { localStorage.removeItem('mcc_sess_keep'); } catch (e) {}
    if (s && s.access_token) {
      fetch(SB + '/auth/v1/logout?scope=local', {
        method: 'POST',
        headers: { apikey: KEY, authorization: 'Bearer ' + s.access_token }
      }).catch(function () {});
    }
    location.reload();
  }

  function boot() {
    applyContent();
    if (!session()) return;               /* a visitor sees no difference */

    api('/v1/clients/' + SLUG + '/me').then(function (me) {
      if (!me || !me.tenant || me.tenant.role !== 'owner') return;
      styles();
      bar(me);
      document.getElementById('l3edit').onclick = function () { setEditing(!editing); };
      document.getElementById('l3publish').onclick = publishAll;
      document.getElementById('l3out').onclick = signOut;
      document.addEventListener('click', onClick, true);
      countThreads();
    }).catch(function () { /* signed in elsewhere, not an owner here */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
