/* Throughline board runtime. Copied into each project at docs/artifacts/_kit/ and published beside every board. */
(() => {
  const LETTERS = 'ABCDEFGH';
  const STRENGTHS = [['loved', 'Love it'], ['fine', 'It’s fine'], ['not-quite', 'Not quite']];
  const RATINGS = [['loved', 'Sounds right'], ['fine', 'Close'], ['not-quite', 'Not it']];
  const CHECKS = [['pass', 'Works'], ['fail', 'Needs work'], ['na', 'Skip']];

  function el(tag, attrs = {}, kids = []) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'text') n.textContent = v; else if (k === 'html') n.innerHTML = v; else n.setAttribute(k, v === true ? '' : v);
    }
    for (const k of [].concat(kids)) if (k) n.append(k);
    return n;
  }
  function linkify(text) {
    return text.split(/(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/).map((part, i) => (i % 2 ? el('a', { href: part, target: '_blank', rel: 'noopener', text: part }) : part));
  }
  function chip(type, name, value, label, id) {
    return el('label', { class: 'rb-chip' }, [el('input', { type, name, value, id }), el('span', { text: label })]);
  }
  function content(x, ...args) {
    if (x == null) return null;
    if (typeof x === 'function') return content(x(...args));
    if (typeof x === 'string') return el('div', { html: x });
    return x;
  }
  function fit(t) {
    if (!t.offsetParent) return;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 2 + 'px';
  }

  function mount(spec) {
    const root = typeof spec.root === 'string' ? document.querySelector(spec.root) : spec.root || document.getElementById('rb');
    const owner = spec.owner || 'the person who sent this';
    if (spec.type) document.documentElement.dataset.rbType = spec.type;
    const collection = spec.collection || 'responses';
    const items = (spec.items || []).filter(it => it.id);
    const earlierItems = (spec.earlier || []).filter(it => it.id);
    const all = [...items, ...earlierItems];
    const byId = Object.fromEntries(all.map(it => [it.id, it]));
    const els = {}, meta = {}, timers = {}, inflight = {}, pending = {}, dirty = {};
    const order = {};
    let db = null, readOnly = false, me = null;
    const mock = spec.mockup;
    let mockView = null, mockSlots = [], cur = null, noScroll = false;

    const banner = el('div', { class: 'rb-banner', role: 'status', hidden: true });
    const progress = el('p', { class: 'rb-progress', 'aria-live': 'polite' });
    const board = el('div', { class: 'rb-board', id: 'rb-board' });
    root.append(banner, progress, board);
    if (spec.report) root.append(el('p', { class: 'rb-how rb-report' }, [el('a', { href: spec.report, target: '_blank', rel: 'noopener', text: 'Report a problem' }), document.createTextNode(' with the project, any time.')]));

    function opts(it) { return it.options || []; }

    function render(it) {
      const status = el('span', { class: 'rb-status', 'aria-live': 'polite' });
      const badge = el('span', { class: 'rb-badge', text: 'Draft', hidden: true });
      const head = el('div', { class: 'rb-head' }, [el('h2', { id: `h-${it.id}`, text: it.title }), el('span', { class: 'rb-head-right' }, [badge, status])]);
      const kids = [head];
      if (it.ask) kids.push(el('p', { class: 'rb-ask', text: it.ask }));
      if (it.quote) kids.push(el('blockquote', { text: it.quote }));
      if (it.body) kids.push(content(it.body, it));
      const t = it.type || 'choice';

      if (t === 'choice') {
        kids.push(el('div', { class: 'rb-options', role: 'radiogroup', 'aria-labelledby': `h-${it.id}` }, opts(it).map((o, i) => {
          const L = LETTERS[i];
          const card = [
            el('input', { type: 'radio', name: it.id, value: L, id: `f-${it.id}-${L}` }),
            el('span', { class: 'rb-opt-label' }, [el('span', { class: 'rb-letter', text: L, 'aria-hidden': 'true' }), el('span', { class: 'rb-opt-name', text: `${L} · ${o.name}` })]),
          ];
          if (o.idea) card.push(el('p', { class: 'rb-idea', text: o.idea }));
          if (o.preview) card.push(el('div', { class: 'rb-preview' }, [content(o.preview, o, it)]));
          if (o.why || o.cost) card.push(el('dl', {}, [
            o.why ? el('div', {}, [el('dt', { text: 'Why it fits' }), el('dd', { text: o.why })]) : null,
            o.cost ? el('div', {}, [el('dt', { text: 'What it gives up' }), el('dd', { text: o.cost })]) : null,
          ]));
          if (mockSectionIndex(it.id) >= 0) {
            const v = el('a', { class: 'rb-view', href: '#', text: 'View in mock-up' });
            v.addEventListener('click', e => { e.preventDefault(); openMock(it.id, L); });
            card.push(v);
          }
          return el('label', { class: 'rb-opt' }, card);
        })));
        const respond = [el('fieldset', { class: 'rb-row' }, [chip('radio', it.id, 'none', 'None of these', `f-${it.id}-none`)])];
        if (it.strength !== false) respond.push(el('fieldset', { class: 'rb-row' }, [el('legend', { text: 'How strongly?' }), ...STRENGTHS.map(([v, l]) => chip('radio', `${it.id}-strength`, v, l, `f-${it.id}-s-${v}`))]));
        kids.push(el('div', { class: 'rb-respond' }, respond));
      }

      if (t === 'approve') {
        if (it.href) kids.push(el('a', { class: 'rb-view', href: it.href, target: '_blank', rel: 'noopener', text: it.hrefLabel || 'Open the preview' }));
        kids.push(el('fieldset', { class: 'rb-row' }, [
          chip('radio', it.id, 'approve', it.approveLabel || 'Approve as is', `f-${it.id}-approve`),
          chip('radio', it.id, 'changes', it.changesLabel || 'Needs changes', `f-${it.id}-changes`),
        ]));
      }

      if (t === 'rank') {
        order[it.id] = opts(it).map((_, i) => LETTERS[i]);
        kids.push(el('ol', { class: 'rb-rank', 'aria-label': `Ranking for ${it.title}` }));
      }

      if (t === 'checklist') {
        kids.push(el('div', { class: 'rb-checks' }, it.checks.map(c => el('div', { class: 'rb-check' }, [
          el('span', { class: 'rb-check-label' }, [el('b', { text: c.label }), c.hint ? el('small', {}, linkify(c.hint)) : null, c.test ? el('small', { class: 'rb-auto', text: 'Automated test: ' + c.test }) : null]),
          el('div', { class: 'rb-chips', role: 'radiogroup', 'aria-label': c.label }, CHECKS.map(([v, l]) => chip('radio', `${it.id}-${c.id}`, v, l, `f-${it.id}-${c.id}-${v}`))),
        ]))));
      }

      if (t === 'question') {
        const q = it.input || 'long';
        if (q === 'text') kids.push(el('input', { type: 'text', id: `f-${it.id}`, 'aria-labelledby': `h-${it.id}` }));
        if (q === 'long') kids.push(el('textarea', { id: `f-${it.id}`, 'aria-labelledby': `h-${it.id}` }));
        if (q === 'radio' || q === 'check') kids.push(el('div', { class: 'rb-chips', role: q === 'radio' ? 'radiogroup' : 'group', 'aria-labelledby': `h-${it.id}` }, it.options.map((o, i) => chip(q === 'radio' ? 'radio' : 'checkbox', it.id, o, o, `f-${it.id}-${i}`))));
        if (q === 'rating') kids.push(el('div', { class: 'rb-chips', role: 'radiogroup', 'aria-labelledby': `h-${it.id}` }, RATINGS.map(([v, l]) => chip('radio', it.id, v, l, `f-${it.id}-${v}`))));
        if (q === 'scale') kids.push(el('div', { class: 'rb-checks' }, it.rows.map(([key, label]) => el('div', { class: 'rb-check' }, [
          el('span', { class: 'rb-check-label', text: label }),
          el('div', { class: 'rb-chips', role: 'radiogroup', 'aria-label': label }, it.options.map((o, i) => chip('radio', `${it.id}-${key}`, o, o, `f-${it.id}-${key}-${i}`))),
        ]))));
      }

      const q = t === 'question' ? (it.input || 'long') : null;
      if (q ? q === 'rating' || (it.comment && q !== 'text' && q !== 'long') : true) {
        const ph = it.comment || (q ? 'Why? (optional)' : t === 'comment' ? 'Your thoughts (optional)' : t === 'approve' ? 'What should change? (optional)' : 'Anything to keep, change, or combine? (optional)');
        kids.push(el('textarea', { class: 'rb-comment', id: `f-${it.id}-comment`, placeholder: ph, 'aria-label': `${ph} — ${it.title}` }));
      }

      const btn = el('button', { type: 'button', class: 'rb-review-btn', text: 'Mark reviewed', hidden: true });
      btn.addEventListener('click', () => toggleReviewed(it));
      kids.push(el('div', { class: 'rb-foot' }, [el('span', { class: 'rb-source', hidden: true }), el('span', { class: 'rb-foot-right' }, [el('span', { class: 'rb-reviewed-tag' }), btn])]));

      const card = el('section', { class: 'rb-item', id: it.id, 'aria-labelledby': `h-${it.id}` }, kids);
      els[it.id] = { card, status };
      if (t === 'rank') renderRank(it);
      card.addEventListener('input', e => { if (e.target.tagName === 'TEXTAREA') fit(e.target); schedule(it); });
      card.addEventListener('change', () => schedule(it));
      return card;
    }

    function renderRank(it) {
      const list = els[it.id].card.querySelector('.rb-rank');
      const locked = meta[it.id]?.status === 'reviewed' || readOnly;
      list.replaceChildren(...order[it.id].map((L, pos) => {
        const o = opts(it)[LETTERS.indexOf(L)];
        const move = (d) => {
          const a = order[it.id], j = pos + d;
          if (j < 0 || j >= a.length) return;
          [a[pos], a[j]] = [a[j], a[pos]];
          renderRank(it);
          list.children[j].querySelector(d < 0 ? '.up' : '.down')?.focus();
          schedule(it);
        };
        const up = el('button', { type: 'button', class: 'up', 'aria-label': `Move ${o.name} up`, text: '↑', disabled: pos === 0 || locked });
        const down = el('button', { type: 'button', class: 'down', 'aria-label': `Move ${o.name} down`, text: '↓', disabled: pos === order[it.id].length - 1 || locked });
        up.addEventListener('click', () => move(-1));
        down.addEventListener('click', () => move(1));
        return el('li', {}, [el('span', { class: 'rb-letter', text: L, 'aria-hidden': 'true' }), el('span', { class: 'rb-rank-name' }, [el('b', { text: o.name }), o.idea ? el('small', { text: o.idea }) : null]), up, down]);
      }));
    }

    function read(it) {
      const c = els[it.id].card;
      const val = name => c.querySelector(`input[name="${name}"]:checked`)?.value ?? '';
      const comment = c.querySelector(`#f-${it.id}-comment`)?.value ?? '';
      const t = it.type || 'choice';
      if (t === 'choice') return { choice: val(it.id), strength: val(`${it.id}-strength`), comment };
      if (t === 'approve') return { choice: val(it.id), comment };
      if (t === 'rank') return { order: order[it.id].slice(), comment };
      if (t === 'checklist') return { checks: Object.fromEntries(it.checks.map(k => [k.id, val(`${it.id}-${k.id}`)])), comment };
      if (t === 'question') {
        const q = it.input || 'long';
        if (q === 'text' || q === 'long') return { value: c.querySelector(`#f-${it.id}`).value, comment };
        if (q === 'check') return { value: [...c.querySelectorAll(`input[name="${it.id}"]:checked`)].map(i => i.value), comment };
        if (q === 'scale') return { value: Object.fromEntries(it.rows.map(([k]) => [k, val(`${it.id}-${k}`)])), comment };
        return { value: val(it.id), comment };
      }
      return { comment };
    }

    function write(it, d) {
      const c = els[it.id].card;
      const set = (name, v) => c.querySelectorAll(`input[name="${name}"]`).forEach(i => { i.checked = Array.isArray(v) ? v.includes(i.value) : i.value === v; });
      const text = (sel, v) => { const f = c.querySelector(sel); if (f && document.activeElement !== f) { f.value = v ?? ''; fit(f); } };
      text(`#f-${it.id}-comment`, d.comment);
      const t = it.type || 'choice';
      if (t === 'choice') { set(it.id, d.choice); set(`${it.id}-strength`, d.strength); }
      if (t === 'approve') set(it.id, d.choice);
      if (t === 'rank' && Array.isArray(d.order) && d.order.length === order[it.id].length) { order[it.id] = d.order.slice(); renderRank(it); }
      if (t === 'checklist') for (const k of it.checks) set(`${it.id}-${k.id}`, d.checks?.[k.id]);
      if (t === 'question') {
        const q = it.input || 'long';
        if (q === 'text' || q === 'long') text(`#f-${it.id}`, d.value);
        else if (q === 'scale') for (const [k] of it.rows) set(`${it.id}-${k}`, d.value?.[k]);
        else set(it.id, d.value);
      }
    }

    function setStatus(id, text, cls = '') { els[id].status.textContent = text; els[id].status.className = 'rb-status ' + cls; }
    function schedule(it) {
      if (!db || readOnly) return;
      dirty[it.id] = true;
      setStatus(it.id, 'Editing…');
      clearTimeout(timers[it.id]);
      timers[it.id] = setTimeout(() => save(it), 800);
      if (mockView && !mockView.hidden) applyMock();
    }
    async function save(it) {
      if (inflight[it.id]) { pending[it.id] = true; return; }
      inflight[it.id] = true;
      setStatus(it.id, 'Saving…');
      try {
        const m = meta[it.id] || {};
        const extra = {};
        if (m.source) extra.source = m.source;
        if (m.status) extra.status = m.status;
        if (m.status === 'reviewed') extra.reviewedAt = m.reviewedAt;
        if (me) extra.by = me;
        await db.doc(`${collection}/${it.id}`).set({ ...read(it), ...extra, updatedAt: new Date().toISOString() });
        if (!pending[it.id]) dirty[it.id] = false;
        setStatus(it.id, 'Saved', 'saved');
      } catch (e) {
        if (e?.code === 'invalid_argument' || e?.code === 'permission_denied' || e?.code === 'not_granted') setReadOnly();
        else setStatus(it.id, 'Not saved', 'error');
      } finally {
        inflight[it.id] = false;
        if (pending[it.id]) { pending[it.id] = false; save(it); }
      }
    }
    function applyMeta(it) {
      const { card } = els[it.id];
      const m = meta[it.id] || {};
      const reviewed = m.status === 'reviewed';
      card.classList.toggle('reviewed', reviewed);
      card.querySelectorAll('input, textarea').forEach(i => { i.disabled = reviewed || readOnly; });
      if ((it.type || 'choice') === 'rank') renderRank(it);
      card.querySelector('.rb-badge').hidden = !(m.source && !reviewed);
      const src = card.querySelector('.rb-source');
      src.hidden = !m.source;
      src.textContent = m.source ? 'Drafted from ' + m.source : '';
      card.querySelector('.rb-reviewed-tag').textContent = reviewed
        ? '✓ Reviewed ' + new Date(m.reviewedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
      const btn = card.querySelector('.rb-review-btn');
      btn.hidden = !db || readOnly;
      btn.textContent = reviewed ? 'Reopen' : 'Mark reviewed';
    }
    function updateProgress() {
      const n = items.filter(it => meta[it.id]?.status === 'reviewed').length;
      progress.textContent = items.length ? (n === items.length ? `All ${n} reviewed` : `${n} of ${items.length} reviewed`) : '';
      progress.classList.toggle('complete', n === items.length && n > 0);
    }
    function toggleReviewed(it) {
      if (!db || readOnly) return;
      const m = { ...(meta[it.id] || {}) };
      if (m.status === 'reviewed') { if (m.source) m.status = 'draft'; else delete m.status; delete m.reviewedAt; }
      else { m.status = 'reviewed'; m.reviewedAt = new Date().toISOString(); }
      meta[it.id] = m;
      clearTimeout(timers[it.id]);
      dirty[it.id] = true;
      applyMeta(it);
      updateProgress();
      save(it);
    }
    function setReadOnly() {
      readOnly = true;
      all.forEach(applyMeta);
      all.forEach(it => setStatus(it.id, ''));
      banner.textContent = `Your answers can’t be saved from this view. Ask ${owner} to share this page with your email address as an Editor.`;
      banner.hidden = false;
    }

    function renderList(list, into) {
      let target = into;
      for (const it of list) {
        if (it.group) {
          target = el('div', { class: 'rb-group' }, [el('h2', { class: 'rb-group-title', text: it.group }), it.intro ? el('p', { class: 'rb-ask', text: it.intro }) : null]);
          into.append(target);
        } else if (it.id) target.append(render(it));
      }
    }
    renderList(spec.items || [], board);
    if (earlierItems.length) {
      const fold = el('details', { class: 'rb-earlier' }, [el('summary', { text: spec.earlierLabel || 'Earlier rounds' })]);
      const body = el('div', { class: 'rb-earlier-body' });
      renderList(spec.earlier, body);
      fold.append(body);
      fold.addEventListener('toggle', () => fold.querySelectorAll('textarea').forEach(fit));
      board.append(fold);
    }

    /* Mock-up: the whole page with an option switch above every section that maps to a choice item. */
    function mockSectionIndex(id) { return mock ? mock.sections.findIndex(s => s.item === id) : -1; }
    function chosen(id) { return els[id]?.card.querySelector(`input[name="${id}"]:checked`)?.value; }
    function picks() {
      return mock.sections.map(s => {
        if (!s.item) return '-';
        const v = chosen(s.item);
        return v && v !== 'none' && opts(byId[s.item])[LETTERS.indexOf(v)] ? v : 'A';
      });
    }
    function hashFor(p, target) { return `#mockup/${p.join('')}/${target}`; }
    function openMock(itemId, L) {
      const p = picks();
      p[mockSectionIndex(itemId)] = L;
      location.hash = hashFor(p, itemId);
    }
    /* Every switch lives in one sticky bar at the top: a labelled, rounded group per choice item, then any custom controls. */
    function seg(label, names, onPick) {
      const note = el('small');
      const btns = el('div', { class: 'rb-seg-btns' }, names.map((n, i) => {
        const b = el('button', { type: 'button', text: n.short, 'aria-label': n.long, title: n.long });
        b.addEventListener('click', () => onPick(i));
        return b;
      }));
      const g = el('div', { class: 'rb-seg', role: 'group', 'aria-label': label }, [el('span', {}, [label, note]), btns]);
      return { g, btns, note, press: i => btns.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))) };
    }
    function revealSection(id) {
      const a = document.getElementById(`rb-sec-${id}`);
      if (!a) return;
      const top = a.getBoundingClientRect().top, barH = mockView.querySelector('.rb-bar').offsetHeight;
      if (top < barH || top > window.innerHeight * 0.6) a.scrollIntoView({ block: 'start' });
    }
    let customs = [];
    if (mock) {
      const back = el('a', { href: '#rb-board', class: 'rb-back', text: '← Back to choices' });
      const controls = el('div', { class: 'rb-controls' });
      const bar = el('div', { class: 'rb-bar' }, [el('div', { class: 'rb-bar-in' }, [back, controls])]);
      const sections = el('div', { class: 'rb-mock-sections' });
      mockView = el('div', { class: 'rb-mock', hidden: true }, [bar, sections]);
      root.after(mockView);
      mockSlots = mock.sections.map((s, si) => {
        const holder = el('div');
        if (!s.item) { sections.append(holder); return { s, holder }; }
        const sg = seg(s.name || byId[s.item]?.title, opts(byId[s.item]).map((o, i) => ({ short: LETTERS[i], long: `${LETTERS[i]} · ${o.name}` })), i => {
          const p = cur.p.slice(); p[si] = LETTERS[i]; noScroll = true; location.hash = hashFor(p, s.item);
        });
        controls.append(sg.g);
        sections.append(el('span', { class: 'rb-sec-anchor', id: `rb-sec-${s.item}` }), holder);
        return { s, holder, ...sg };
      });
      customs = (mock.controls || []).map(c => {
        let v = c.value || 0;
        const sg = seg(c.name, c.options.map(n => ({ short: n, long: n })), i => { v = i; sg.press(i); c.onChange(i); });
        sg.press(v);
        controls.append(sg.g);
        return sg;
      });
      const top = mock.trigger && document.querySelector(mock.trigger);
      top?.addEventListener('click', e => { e.preventDefault(); location.hash = hashFor(picks(), mock.sections.find(s => s.item)?.item || 'top'); });
    }
    function applyMock() {
      mockSlots.forEach((slot, si) => {
        if (!slot.s.item) { slot.holder.replaceChildren(content(slot.s.render) || ''); return; }
        const it = byId[slot.s.item];
        const i = Math.max(0, LETTERS.indexOf(cur.p[si]));
        const o = opts(it)[i] || opts(it)[0];
        slot.holder.replaceChildren(slot.s.render(o, LETTERS[i]));
        slot.press(i);
        const c = chosen(it.id);
        slot.note.textContent = c && c !== 'none' ? (c === LETTERS[i] ? ' · your pick' : ` · you picked ${c}`) : '';
      });
    }
    function route() {
      if (!mock) return;
      const m = /^#mockup\/([A-H-]+)\/([\w-]+)$/.exec(location.hash);
      const on = !!m && m[1].length === mock.sections.length;
      const first = mockView.hidden;
      root.hidden = on;
      mockView.hidden = !on;
      document.body.classList.toggle('rb-mocking', on);
      if (on) {
        cur = { p: m[1].split(''), target: m[2] };
        applyMock();
        if (first) {
          if (mock.sections.findIndex(s => s.item) === mock.sections.findIndex(s => s.item === m[2])) window.scrollTo(0, 0);
          else document.getElementById(`rb-sec-${m[2]}`)?.scrollIntoView({ block: 'start' });
        } else if (noScroll) revealSection(m[2]);
      }
      noScroll = false;
    }
    window.addEventListener('hashchange', route);
    route();
    updateProgress();

    (async () => {
      db = await window.claude?.use?.('db');
      if (!db) {
        banner.textContent = `Saving isn’t available in this view. Open the link while signed in to Claude, or ask ${owner} for help.`;
        banner.hidden = false;
        return;
      }
      const user = await window.claude.use('user');
      if (user && (await user.can('data.write')) === false) setReadOnly();
      try { me = (await user?.id?.()) || null; } catch { me = null; }
      all.forEach(applyMeta);
      const loading = setTimeout(() => { banner.textContent = 'Still loading earlier answers…'; banner.hidden = false; }, 10000);
      db.collection(collection).onSnapshot(snap => {
        clearTimeout(loading);
        if (!snap.metadata?.fromCache && !readOnly) banner.hidden = true;
        for (const d of snap.docs) {
          const it = byId[d.id];
          if (it && !dirty[it.id]) {
            const data = d.data();
            meta[it.id] = { status: data.status, reviewedAt: data.reviewedAt, source: data.source };
            write(it, data);
            applyMeta(it);
          }
        }
        updateProgress();
        if (cur && !mockView.hidden) applyMock();
      });
    })();

    return { el, picks: () => (mock ? picks() : []), chosen };
  }

  window.ReviewBoard = { mount, el };
})();
