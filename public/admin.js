'use strict';

const TAB_META = {
  stats:        { title: 'Übersicht',      meta: 'Kennzahlen & Aktivität' },
  kunden:       { title: 'Kunden',         meta: 'Aktive Abonnenten verwalten' },
  demos:        { title: 'Demo-Anfragen',  meta: 'Eingehende Leads' },
  nachrichten:  { title: 'Nachrichten',    meta: 'Kontaktformular-Eingänge' },
};

// ═══ DATA (server-backed) ═════════════════════════
let KUNDEN       = [];
let DEMOS        = [];
let NACHRICHTEN  = [];

async function loadData() {
  const results = await Promise.allSettled([
    fetch('/api/kunden').then(r => { if (!r.ok) throw r.status; return r.json(); }),
    fetch('/api/demos').then(r => { if (!r.ok) throw r.status; return r.json(); }),
    fetch('/api/nachrichten').then(r => { if (!r.ok) throw r.status; return r.json(); }),
  ]);
  const [k, d, n] = results;

  // Session expired — reload so login screen appears.
  if ([k, d, n].some(r => r.status === 'rejected' && r.reason === 401)) {
    location.reload();
    return;
  }

  KUNDEN      = k.status === 'fulfilled' && Array.isArray(k.value) ? k.value : KUNDEN;
  DEMOS       = d.status === 'fulfilled' && Array.isArray(d.value) ? d.value : DEMOS;
  NACHRICHTEN = n.status === 'fulfilled' && Array.isArray(n.value) ? n.value : NACHRICHTEN;

  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed) toast(`${failed} Datensatz/-sätze konnten nicht geladen werden.`, 'error');
}

// ═══ AUTH ═════════════════════════════════════════
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

async function login() {
  const u   = document.getElementById('login-user').value.trim();
  const p   = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  err.textContent = '';

  let res;
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p }),
    });
  } catch {
    err.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
    return;
  }

  if (res.ok) {
    await loadData();
    showApp();
  } else {
    const data = await res.json().catch(() => ({}));
    err.textContent = data.error || 'Benutzername oder Passwort falsch.';
  }
}

document.getElementById('logout-btn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  location.reload();
});

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  document.getElementById('topbar-date').textContent =
    new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  renderAll();
}

// Check existing session on page load
(async () => {
  try {
    const res = await fetch('/api/auth/check');
    const { authenticated } = await res.json();
    if (authenticated) {
      await loadData();
      showApp();
    }
  } catch {
    // Network error — stay on login screen
  }
})();

// ═══ NAVIGATION ═══════════════════════════════════
document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Inline onclick replacements (removed from HTML to satisfy CSP without unsafe-inline)
document.getElementById('btn-alle-demos').addEventListener('click', () => switchTab('demos'));
document.getElementById('new-kunde-header').addEventListener('click', toggleNewKunde);
document.getElementById('btn-add-kunde').addEventListener('click', addKunde);

function switchTab(tabId) {
  if (window.innerWidth <= 768) closeSidebar();
  document.querySelectorAll('.nav-item[data-tab]').forEach(b =>
    b.classList.toggle('nav-item--active', b.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach(p =>
    p.classList.toggle('tab-panel--active', p.id === `tab-${tabId}`));
  const m = TAB_META[tabId];
  if (m) {
    document.getElementById('topbar-title').textContent = m.title;
    document.getElementById('topbar-meta').textContent  = m.meta;
  }
  if (tabId === 'kunden')      renderKunden();
  if (tabId === 'demos')       renderDemos();
  if (tabId === 'nachrichten') renderNachrichten();
}

// ═══ SIDEBAR MOBILE ═══════════════════════════════
function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').classList.add('visible'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('visible'); }
document.getElementById('topbar-burger').addEventListener('click', openSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

// ═══ RENDER ALL ═══════════════════════════════════
function renderAll() {
  renderStats();
  renderKunden();
  renderDemos();
  renderNachrichten();
  updateBadges();
}

// ═══ STATS / DASHBOARD ════════════════════════════
function renderStats() {
  const aktive = KUNDEN.filter(k => k.status === 'aktiv' || k.status === 'trial').length;
  const basis   = KUNDEN.filter(k => k.paket === 'BASIS'    && (k.status === 'aktiv' || k.status === 'trial')).length;
  const std     = KUNDEN.filter(k => k.paket === 'STANDARD' && (k.status === 'aktiv' || k.status === 'trial')).length;
  const prem    = KUNDEN.filter(k => k.paket === 'PREMIUM'  && (k.status === 'aktiv' || k.status === 'trial')).length;
  const mrr     = basis * 99 + std * 129 + prem * 149;
  const nachN   = NACHRICHTEN.filter(n => n.status === 'neu').length;

  document.getElementById('dash-kunden').textContent      = aktive;
  document.getElementById('dash-mrr').textContent         = `${mrr} €`;
  document.getElementById('dash-demos').textContent       = DEMOS.length;
  document.getElementById('dash-nachrichten').textContent = nachN;
  document.getElementById('dash-basis-count').textContent = basis;
  document.getElementById('dash-std-count').textContent   = std;
  document.getElementById('dash-prem-count').textContent  = prem;

  renderBarChart();
  renderPaketeChart(basis, std, prem);
  renderRecentDemos();
}

function renderBarChart() {
  const now = new Date();
  const labels = [];
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(d.toLocaleString('de-DE', { month: 'short' }));
    data.push(KUNDEN.filter(k => (k.since || '').startsWith(key)).length);
  }
  const max = Math.max(...data, 1);
  const currentLabel = new Date().toLocaleString('de-DE', { month: 'short' });
  document.getElementById('bar-chart').innerHTML = labels.map((l, i) => {
    const isNow = l === currentLabel;
    return `
      <div class="bar-group">
        <div class="bar-count">${data[i] || ''}</div>
        <div class="bar-wrap">
          <div class="bar-fill${isNow ? ' bar-fill--green' : ''}" style="height:${Math.round(data[i]/max*100)}%"></div>
        </div>
        <div class="bar-label" style="${isNow ? 'color:var(--green);' : ''}">${l}</div>
      </div>`;
  }).join('');
}

function renderPaketeChart(basis, std, prem) {
  const el = document.getElementById('chart-pakete');
  const total = basis + std + prem || 1;
  const rows = [
    { label: 'BASIS',    count: basis, color: 'var(--white-dim)' },
    { label: 'STANDARD', count: std,   color: 'var(--beige)' },
    { label: 'PREMIUM',  count: prem,  color: 'var(--green)' },
  ];
  el.innerHTML = `<div class="ratio-chart">${rows.map(r => {
    const pct = ((r.count / total) * 100).toFixed(1);
    return `
      <div class="ratio-row">
        <div class="ratio-label"><span class="ratio-dot" style="background:${r.color}"></span>${r.label}</div>
        <div class="ratio-bar-wrap"><div class="ratio-bar-fill" style="width:${pct}%;background:${r.color}"></div></div>
        <div class="ratio-num">${r.count}</div>
        <div class="ratio-pct">${pct}%</div>
      </div>`;
  }).join('')}</div>`;
}

function renderRecentDemos() {
  const el = document.getElementById('recent-demos-list');
  const recent = [...DEMOS].sort((a,b) => b.eingegangen.localeCompare(a.eingegangen)).slice(0, 5);
  if (!recent.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--white-dim);font-size:0.82rem;padding:1.25rem;">Keine Demo-Anfragen vorhanden.</p>';
    return;
  }
  el.innerHTML = recent.map(d => `
    <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem 1.5rem;border-bottom:1px solid var(--border-sub);">
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.88rem;font-weight:500;color:var(--white);">${esc(d.name)} — <span style="color:var(--beige);">${esc(d.firma)}</span></div>
        <div style="font-size:0.72rem;color:var(--white-dim);margin-top:0.1rem;">${esc(d.branche)} · ${esc(d.telefon)}</div>
      </div>
      <span class="badge badge--${d.status}">${d.status}</span>
      <span style="font-size:0.7rem;color:var(--white-dim);">${formatDate(d.eingegangen)}</span>
    </div>`).join('');
}

// ═══ KUNDEN ═══════════════════════════════════════
function renderKunden() {
  const listEl = document.getElementById('kunden-list');
  const search = document.getElementById('filter-k-search')?.value.toLowerCase() || '';
  const paket  = document.getElementById('filter-paket')?.value || '';
  const status = document.getElementById('filter-k-status')?.value || '';

  let list = KUNDEN.filter(k =>
    (!search || k.name.toLowerCase().includes(search) || (k.email||'').toLowerCase().includes(search)) &&
    (!paket  || k.paket === paket) &&
    (!status || k.status === status)
  );

  if (!list.length) {
    listEl.innerHTML = '<p style="text-align:center;color:var(--white-dim);font-size:0.82rem;padding:2rem;">Keine Kunden gefunden.</p>';
    return;
  }

  listEl.innerHTML = `
    <div class="kunde-row" style="padding:0.6rem 1.5rem;border-bottom:1px solid var(--border);background:var(--surface-2);">
      <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-dim);">Unternehmen</div>
      <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-dim);">Branche</div>
      <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-dim);">Paket</div>
      <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-dim);">Status</div>
      <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-dim);">Seit</div>
      <div></div>
    </div>
    ${list.map(k => `
    <div class="kunde-row">
      <div>
        <div class="kunde-row__name">${esc(k.name)}</div>
        <div class="kunde-row__meta">${esc(k.email || '—')}</div>
      </div>
      <div style="font-size:0.82rem;color:var(--white-dim);">${esc(k.branche || '—')}</div>
      <span class="badge badge--${k.paket.toLowerCase()}">${esc(k.paket)}</span>
      <span class="badge badge--${k.status}">${statusLabel(k.status)}</span>
      <div style="font-size:0.78rem;color:var(--white-dim);">${formatDate(k.since)}</div>
      <div style="display:flex;gap:0.3rem;">
        <button class="btn btn-ghost btn-sm" data-action="toggle-status" data-id="${k.id}" title="Status wechseln">⇄</button>
        <button class="btn btn-danger btn-sm" data-action="delete-kunde" data-id="${k.id}">—</button>
      </div>
    </div>`).join('')}`;

  listEl.querySelectorAll('[data-action="toggle-status"]').forEach(btn =>
    btn.addEventListener('click', () => toggleKundeStatus(btn.dataset.id)));
  listEl.querySelectorAll('[data-action="delete-kunde"]').forEach(btn =>
    btn.addEventListener('click', () => deleteKunde(btn.dataset.id)));
}

document.getElementById('filter-paket')?.addEventListener('change', renderKunden);
document.getElementById('filter-k-status')?.addEventListener('change', renderKunden);
let _ksTimer;
document.getElementById('filter-k-search')?.addEventListener('input', () => { clearTimeout(_ksTimer); _ksTimer = setTimeout(renderKunden, 300); });

function toggleNewKunde() {
  const f = document.getElementById('new-kunde-form');
  const a = document.getElementById('new-kunde-arrow');
  const open = f.style.display === 'none';
  f.style.display = open ? 'block' : 'none';
  a.textContent   = open ? '▾' : '▸';
}

async function addKunde() {
  const name    = document.getElementById('nk-name').value.trim();
  const branche = document.getElementById('nk-branche').value;
  const paket   = document.getElementById('nk-paket').value;
  const email   = document.getElementById('nk-email').value.trim();

  if (!name) { toast('Bitte Unternehmensname eingeben.', 'error'); return; }

  const res = await fetch('/api/kunden', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, branche, paket, email }),
  });

  if (res.ok) {
    const kunde = await res.json();
    KUNDEN.push(kunde);
    toast(`Kunde "${name}" angelegt.`, 'success');
    toggleNewKunde();
    renderStats(); renderKunden(); updateBadges();
    document.getElementById('nk-name').value  = '';
    document.getElementById('nk-email').value = '';
  } else {
    toast('Fehler beim Anlegen des Kunden.', 'error');
  }
}

async function toggleKundeStatus(id) {
  const k = KUNDEN.find(x => x.id === id);
  if (!k) return;
  const next = { aktiv: 'trial', trial: 'inaktiv', inaktiv: 'aktiv' };
  const newStatus = next[k.status] || 'aktiv';

  const res = await fetch(`/api/kunden/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });

  if (res.ok) {
    k.status = newStatus;
    renderStats(); renderKunden(); updateBadges();
    toast(`Status geändert: ${statusLabel(newStatus)}`, 'info');
  } else {
    toast('Fehler beim Statuswechsel.', 'error');
  }
}

async function deleteKunde(id) {
  if (!confirm('Kunden wirklich entfernen?')) return;

  const res = await fetch(`/api/kunden/${id}`, { method: 'DELETE' });
  if (res.ok) {
    KUNDEN = KUNDEN.filter(k => k.id !== id);
    renderStats(); renderKunden(); updateBadges();
    toast('Kunde entfernt.', 'success');
  } else {
    toast('Fehler beim Entfernen.', 'error');
  }
}

// ═══ DEMOS ════════════════════════════════════════
function renderDemos() {
  const el = document.getElementById('demos-list');
  const sf = document.getElementById('filter-d-status')?.value || '';
  const list = DEMOS.filter(d => !sf || d.status === sf);

  if (!list.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--white-dim);font-size:0.82rem;padding:2rem;">Keine Demo-Anfragen gefunden.</p>';
    return;
  }

  el.innerHTML = list.map(d => {
    const statusText = { neu: 'Neu', kontaktiert: 'Kontaktiert', demo_gesendet: 'Demo gesendet', abgesagt: 'Abgesagt' }[d.status] || esc(d.status);
    const quizTags = d.features && d.features.length
      ? d.features.map(f => `<span style="display:inline-block;padding:0.15rem 0.5rem;background:var(--white-sub);border:1px solid var(--border-sub);border-radius:4px;font-size:0.68rem;color:var(--white-dim);">${esc(f)}</span>`).join(' ')
      : '';
    return `
    <div class="demo-card">
      <div class="demo-card__info" style="flex:1;min-width:0;">
        <div class="demo-card__name">${esc(d.name)}</div>
        <div class="demo-card__firma">${esc(d.firma)}</div>
        <div class="demo-card__meta">
          ${esc(d.branche)} · <a href="mailto:${esc(d.email)}" style="color:var(--beige);">${esc(d.email)}</a> · ${esc(d.telefon)}<br>
          Eingegangen: ${formatDate(d.eingegangen)}
        </div>
        ${d.stil ? `<div style="font-size:0.74rem;color:var(--white-dim);margin-top:0.4rem;">Stil: <span style="color:var(--beige);">${esc(d.stil)}</span></div>` : ''}
        ${quizTags ? `<div style="margin-top:0.4rem;display:flex;flex-wrap:wrap;gap:0.3rem;">${quizTags}</div>` : ''}
        ${d.statusWebsite ? `<div style="font-size:0.74rem;color:var(--white-dim);margin-top:0.3rem;">Website: ${esc(d.statusWebsite)}</div>` : ''}
      </div>
      <div class="demo-card__actions">
        <span class="badge badge--${d.status}">${statusText}</span>
        ${d.status === 'neu' ? `<button class="btn btn-success btn-sm" data-action="demo-status" data-id="${d.id}" data-status="kontaktiert">Kontaktiert</button>` : ''}
        ${d.status === 'kontaktiert' ? `<button class="btn btn-success btn-sm" data-action="demo-status" data-id="${d.id}" data-status="demo_gesendet">Demo gesendet</button>` : ''}
        ${d.status !== 'abgesagt' ? `<button class="btn btn-ghost btn-sm" data-action="demo-status" data-id="${d.id}" data-status="abgesagt">Absagen</button>` : ''}
        <button class="btn btn-danger btn-sm" data-action="delete-demo" data-id="${d.id}">Löschen</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-action="demo-status"]').forEach(btn =>
    btn.addEventListener('click', () => setDemoStatus(btn.dataset.id, btn.dataset.status)));
  el.querySelectorAll('[data-action="delete-demo"]').forEach(btn =>
    btn.addEventListener('click', () => deleteDemo(btn.dataset.id)));
}

document.getElementById('filter-d-status')?.addEventListener('change', renderDemos);
document.getElementById('btn-refresh-demos')?.addEventListener('click', async () => {
  await loadData();
  renderDemos();
  updateBadges();
});

async function setDemoStatus(id, status) {
  const res = await fetch(`/api/demos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (res.ok) {
    const d = DEMOS.find(x => x.id === id);
    if (d) d.status = status;
    renderStats(); renderDemos(); updateBadges();
    toast('Demo-Status aktualisiert.', 'success');
  } else {
    toast('Fehler beim Aktualisieren.', 'error');
  }
}

async function deleteDemo(id) {
  if (!confirm('Anfrage löschen?')) return;
  const res = await fetch(`/api/demos/${id}`, { method: 'DELETE' });
  if (res.ok) {
    DEMOS = DEMOS.filter(d => d.id !== id);
    renderStats(); renderDemos(); updateBadges();
    toast('Anfrage gelöscht.', 'success');
  } else {
    toast('Fehler beim Löschen.', 'error');
  }
}

// ═══ NACHRICHTEN ══════════════════════════════════
function renderNachrichten() {
  const el = document.getElementById('nachrichten-list');
  const sf = document.getElementById('filter-n-status')?.value || '';
  const list = NACHRICHTEN.filter(n => !sf || n.status === sf);

  if (!list.length) {
    el.innerHTML = '<p style="text-align:center;color:var(--white-dim);font-size:0.82rem;padding:2rem;">Keine Nachrichten gefunden.</p>';
    return;
  }

  el.innerHTML = list.map(n => `
    <div class="msg-card ${n.status === 'neu' ? 'msg-card--unread' : ''}">
      <div class="msg-card__info" style="flex:1;">
        <div class="msg-card__name">${esc(n.name)} — <a href="mailto:${esc(n.email)}" style="color:var(--beige);font-size:0.82rem;">${esc(n.email)}</a></div>
        <div class="msg-card__betreff">${esc(n.betreff)}</div>
        ${n.text ? `<div style="font-size:0.76rem;color:var(--white-dim);margin-top:0.3rem;">${esc(n.text.slice(0,100))}${n.text.length > 100 ? '…' : ''}</div>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;flex-shrink:0;">
        <span style="font-size:0.7rem;color:var(--white-dim);">${formatDate(n.eingegangen)}</span>
        <span class="badge badge--${n.status}">${n.status === 'neu' ? 'Neu' : 'Gelesen'}</span>
        ${n.status === 'neu' ? `<button class="btn btn-ghost btn-sm" data-action="mark-gelesen" data-id="${n.id}">Als gelesen markieren</button>` : ''}
        <button class="btn btn-danger btn-sm" data-action="delete-nachricht" data-id="${n.id}">Löschen</button>
      </div>
    </div>`).join('');

  el.querySelectorAll('[data-action="mark-gelesen"]').forEach(btn =>
    btn.addEventListener('click', () => setNachrichtStatus(btn.dataset.id, 'gelesen')));
  el.querySelectorAll('[data-action="delete-nachricht"]').forEach(btn =>
    btn.addEventListener('click', () => deleteNachricht(btn.dataset.id)));
}

document.getElementById('filter-n-status')?.addEventListener('change', renderNachrichten);
document.getElementById('btn-refresh-nachrichten')?.addEventListener('click', async () => {
  await loadData();
  renderNachrichten();
  updateBadges();
});

async function setNachrichtStatus(id, status) {
  const res = await fetch(`/api/nachrichten/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (res.ok) {
    const n = NACHRICHTEN.find(x => x.id === id);
    if (n) n.status = status;
    renderStats(); renderNachrichten(); updateBadges();
  } else {
    toast('Fehler beim Aktualisieren.', 'error');
  }
}

async function deleteNachricht(id) {
  if (!confirm('Nachricht löschen?')) return;
  const res = await fetch(`/api/nachrichten/${id}`, { method: 'DELETE' });
  if (res.ok) {
    NACHRICHTEN = NACHRICHTEN.filter(n => n.id !== id);
    renderStats(); renderNachrichten(); updateBadges();
    toast('Nachricht gelöscht.', 'success');
  } else {
    toast('Fehler beim Löschen.', 'error');
  }
}

// ═══ BADGES ═══════════════════════════════════════
function updateBadges() {
  document.getElementById('badge-kunden').textContent      = KUNDEN.filter(k => k.status === 'aktiv' || k.status === 'trial').length;
  document.getElementById('badge-demos').textContent       = DEMOS.filter(d => d.status === 'neu').length;
  document.getElementById('badge-nachrichten').textContent = NACHRICHTEN.filter(n => n.status === 'neu').length;
}

// ═══ UTILS ════════════════════════════════════════
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function statusLabel(s) {
  return { aktiv: 'Aktiv', trial: 'Trial', inaktiv: 'Inaktiv' }[s] || s;
}

function toast(message, type = 'info', duration = 3500) {
  const c  = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className   = `toast toast--${type}`;
  el.textContent = message;
  c.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(12px)';
    setTimeout(() => el.remove(), 320);
  }, duration);
}
