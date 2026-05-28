'use strict';

const TAB_META = {
  stats:       { title: 'Übersicht',      meta: 'Kennzahlen & Aktivität' },
  kunden:      { title: 'Kunden',         meta: 'Aktive Abonnenten verwalten' },
  demos:       { title: 'Demo-Anfragen',  meta: 'Eingehende Leads' },
  nachrichten: { title: 'Nachrichten',    meta: 'Kontaktformular-Eingänge' },
  sicherheit:  { title: 'Sicherheit',     meta: '2FA & IP-Whitelist' },
};

// ═══ DATA (server-backed) ═════════════════════════
let KUNDEN       = [];
let DEMOS        = [];
let NACHRICHTEN  = [];
let SETTINGS     = { totpEnabled: false, totpConfigured: false, ipWhitelistEnabled: false, ipWhitelist: [], myIp: '' };

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
let _mfaToken = '';

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('login-pass').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
document.getElementById('mfa-btn').addEventListener('click', submitMfa);
document.getElementById('mfa-code').addEventListener('keydown', e => { if (e.key === 'Enter') submitMfa(); });
document.getElementById('mfa-back').addEventListener('click', () => {
  document.getElementById('mfa-box').style.display = 'none';
  document.querySelector('.login-box').style.display = '';
  document.getElementById('login-error').textContent = '';
  _mfaToken = '';
});

async function login() {
  const u   = document.getElementById('login-user').value.trim();
  const p   = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  err.textContent = '';

  let res, data;
  try {
    res  = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p }),
    });
    data = await res.json().catch(() => ({}));
  } catch {
    err.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
    return;
  }

  if (!res.ok) {
    err.textContent = data.error || 'Benutzername oder Passwort falsch.';
    return;
  }

  if (data.requiresMfa) {
    _mfaToken = data.mfaToken || '';
    document.querySelector('.login-box').style.display = 'none';
    document.getElementById('mfa-box').style.display = '';
    document.getElementById('mfa-code').value = '';
    document.getElementById('mfa-error').textContent = '';
    setTimeout(() => document.getElementById('mfa-code').focus(), 50);
    return;
  }

  await loadData();
  showApp();
}

async function submitMfa() {
  const code = document.getElementById('mfa-code').value.replace(/\s/g, '');
  const err  = document.getElementById('mfa-error');
  err.textContent = '';
  if (!code) { err.textContent = 'Bitte Code eingeben.'; return; }

  let res, data;
  try {
    res  = await fetch('/api/auth/mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaToken: _mfaToken, code }),
    });
    data = await res.json().catch(() => ({}));
  } catch {
    err.textContent = 'Verbindungsfehler. Bitte erneut versuchen.';
    return;
  }

  if (!res.ok) {
    err.textContent = data.error || 'Ungültiger Code.';
    if (res.status === 401 && (data.error || '').includes('neu anmelden')) {
      setTimeout(() => {
        document.getElementById('mfa-box').style.display = 'none';
        document.querySelector('.login-box').style.display = '';
        _mfaToken = '';
      }, 2000);
    }
    return;
  }

  await loadData();
  showApp();
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
  if (tabId === 'sicherheit')  renderSicherheit();
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

// ═══ SICHERHEIT ═══════════════════════════════════

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) SETTINGS = await res.json();
  } catch {
    toast('Einstellungen konnten nicht geladen werden.', 'error');
  }
}

async function renderSicherheit() {
  await loadSettings();
  renderTotpSection();
  renderIpSection();
}

// ── 2FA ────────────────────────────────────────────
function renderTotpSection() {
  const badge = document.getElementById('totp-status-badge');
  const el    = document.getElementById('totp-section');
  if (!el) return;

  if (SETTINGS.totpEnabled) {
    badge.innerHTML = '<span class="badge badge--aktiv">Aktiv</span>';
    el.innerHTML = `
      <p style="font-size:0.86rem;color:var(--white-dim);margin-bottom:1rem;">
        Zwei-Faktor-Authentifizierung ist <strong style="color:var(--green);">aktiv</strong>.
        Beim nächsten Login wird nach dem Passwort ein 6-stelliger Code aus Ihrer Authenticator-App abgefragt.
      </p>
      <div class="form-group" style="max-width:240px;">
        <label class="form-label">Aktueller Code zum Deaktivieren</label>
        <input class="form-control" type="text" id="totp-disable-code" placeholder="000000"
          inputmode="numeric" maxlength="6" style="letter-spacing:0.15em;text-align:center;" />
      </div>
      <button class="btn btn-danger" id="btn-totp-disable">2FA deaktivieren</button>`;
    el.querySelector('#btn-totp-disable').addEventListener('click', disableTotp);
  } else {
    badge.innerHTML = '<span class="badge badge--inaktiv">Deaktiviert</span>';
    el.innerHTML = `
      <p style="font-size:0.86rem;color:var(--white-dim);margin-bottom:1rem;">
        Zwei-Faktor-Authentifizierung ist <strong style="color:var(--white-dim);">deaktiviert</strong>.
        Aktivieren Sie TOTP, um Ihren Admin-Zugang mit einem zweiten Faktor zu schützen.
      </p>
      <button class="btn btn-beige" id="btn-totp-setup">2FA einrichten</button>
      <div id="totp-setup-area"></div>`;
    el.querySelector('#btn-totp-setup').addEventListener('click', startTotpSetup);
  }
}

async function startTotpSetup() {
  const area = document.getElementById('totp-setup-area');
  area.innerHTML = '<p style="margin-top:1rem;font-size:0.82rem;color:var(--white-dim);">QR-Code wird generiert…</p>';

  let data;
  try {
    const res = await fetch('/api/settings/totp', { method: 'POST' });
    data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Fehler');
  } catch (e) {
    area.innerHTML = `<p style="color:var(--red);margin-top:1rem;font-size:0.82rem;">Fehler: ${esc(e.message)}</p>`;
    return;
  }

  area.innerHTML = `
    <div class="totp-setup-box">
      <p style="font-size:0.86rem;color:var(--white-dim);margin-bottom:1rem;">
        Scannen Sie den QR-Code mit Ihrer Authenticator-App (z.B. Google Authenticator, Authy).
      </p>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start;margin-bottom:1.25rem;">
        <img src="${data.qrDataUrl}" alt="QR-Code" width="160" height="160"
          style="border:4px solid white;border-radius:8px;background:white;" />
        <div style="flex:1;min-width:180px;">
          <div class="form-label" style="margin-bottom:0.4rem;">Manueller Schlüssel</div>
          <div class="totp-secret" id="totp-secret-text">${esc(data.secret)}</div>
          <p style="font-size:0.72rem;color:var(--white-dim);margin-top:0.5rem;">
            Tippen Sie diesen Schlüssel ein, falls der QR-Scan nicht funktioniert.
          </p>
        </div>
      </div>
      <div class="form-group" style="max-width:240px;">
        <label class="form-label">Code aus der App eingeben</label>
        <input class="form-control" type="text" id="totp-verify-code" placeholder="000000"
          inputmode="numeric" maxlength="6" style="letter-spacing:0.15em;text-align:center;" />
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-beige" id="btn-totp-activate">2FA aktivieren</button>
        <button class="btn btn-ghost" id="btn-totp-cancel">Abbrechen</button>
      </div>
    </div>`;

  area.querySelector('#btn-totp-activate').addEventListener('click', activateTotp);
  area.querySelector('#btn-totp-cancel').addEventListener('click', () => {
    area.innerHTML = '';
  });
}

async function activateTotp() {
  const code = document.getElementById('totp-verify-code')?.value?.replace(/\s/g, '') || '';
  if (!code) { toast('Bitte Code eingeben.', 'error'); return; }

  let res, data;
  try {
    res  = await fetch('/api/settings/totp/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    data = await res.json();
  } catch {
    toast('Verbindungsfehler.', 'error');
    return;
  }

  if (!res.ok) {
    toast(data.error || 'Aktivierung fehlgeschlagen.', 'error');
    return;
  }

  SETTINGS.totpEnabled = true;
  SETTINGS.totpConfigured = true;
  toast('2FA erfolgreich aktiviert!', 'success');
  renderTotpSection();
}

async function disableTotp() {
  const code = document.getElementById('totp-disable-code')?.value?.replace(/\s/g, '') || '';
  if (!code) { toast('Bitte aktuellen Code eingeben.', 'error'); return; }

  let res, data;
  try {
    res  = await fetch('/api/settings/totp', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    data = await res.json();
  } catch {
    toast('Verbindungsfehler.', 'error');
    return;
  }

  if (!res.ok) {
    toast(data.error || 'Deaktivierung fehlgeschlagen.', 'error');
    return;
  }

  SETTINGS.totpEnabled = false;
  SETTINGS.totpConfigured = false;
  toast('2FA deaktiviert.', 'info');
  renderTotpSection();
}

// ── IP Whitelist ────────────────────────────────────
function renderIpSection() {
  const el = document.getElementById('ip-section');
  if (!el) return;

  const list = SETTINGS.ipWhitelist || [];
  const enabled = SETTINGS.ipWhitelistEnabled;
  const myIp = SETTINGS.myIp || '';

  el.innerHTML = `
    <div class="toggle-row">
      <div>
        <div class="toggle-label">IP-Whitelist aktivieren</div>
        <div class="toggle-sub">
          Wenn aktiv, darf nur von den unten eingetragenen IP-Adressen auf den Admin zugegriffen werden.
          Localhost (127.0.0.1 / ::1) ist immer erlaubt.
        </div>
      </div>
      <label class="toggle">
        <input type="checkbox" id="toggle-whitelist" ${enabled ? 'checked' : ''} />
        <span class="toggle-slider"></span>
      </label>
    </div>

    ${!enabled && list.length === 0 ? `
    <div style="margin:0.75rem 0;padding:0.75rem 1rem;background:rgba(224,96,96,0.07);border:1px solid rgba(224,96,96,0.2);border-radius:var(--radius);font-size:0.78rem;color:var(--red);">
      ⚠ Tragen Sie Ihre IP-Adresse ein, <strong>bevor</strong> Sie die Whitelist aktivieren — sonst sperren Sie sich aus.
    </div>` : ''}

    <div style="margin-top:1rem;">
      <div class="form-label" style="margin-bottom:0.6rem;">Erlaubte IP-Adressen</div>
      <div id="ip-tag-list" style="display:flex;flex-wrap:wrap;gap:0.4rem;min-height:2rem;margin-bottom:0.75rem;">
        ${list.length ? list.map(ip => `
          <span class="ip-tag">
            ${esc(ip)}
            <button data-ip="${esc(ip)}" title="Entfernen" aria-label="IP entfernen">×</button>
          </span>`).join('') : `<span style="font-size:0.78rem;color:var(--white-dim);align-self:center;">Keine IPs eingetragen</span>`}
      </div>

      ${myIp ? `<p style="font-size:0.74rem;color:var(--white-dim);margin-bottom:0.6rem;">
        Ihre aktuelle IP: <code style="background:var(--surface-3);padding:0.1em 0.4em;border-radius:3px;font-family:monospace;">${esc(myIp)}</code>
        <button class="btn btn-ghost btn-sm" id="btn-add-my-ip" style="margin-left:0.5rem;font-size:0.72rem;padding:0.2rem 0.5rem;">Hinzufügen</button>
      </p>` : ''}

      <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
        <input class="form-control" type="text" id="ip-input"
          placeholder="z.B. 1.2.3.4 oder 1.2.3.0/24"
          style="width:220px;padding:0.5rem 0.75rem;font-size:0.84rem;font-family:monospace;" />
        <button class="btn btn-ghost" id="btn-add-ip">+ Hinzufügen</button>
      </div>
    </div>`;

  el.querySelector('#toggle-whitelist').addEventListener('change', async e => {
    const checked = e.target.checked;
    if (checked && list.length === 0) {
      toast('Keine IPs eingetragen — bitte erst IPs hinzufügen.', 'error');
      e.target.checked = false;
      return;
    }
    await patchIpSettings({ ipWhitelistEnabled: checked });
  });

  el.querySelectorAll('.ip-tag button[data-ip]').forEach(btn =>
    btn.addEventListener('click', () => removeIp(btn.dataset.ip)));

  el.querySelector('#btn-add-ip')?.addEventListener('click', addIpFromInput);
  el.querySelector('#ip-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') addIpFromInput(); });
  el.querySelector('#btn-add-my-ip')?.addEventListener('click', () => {
    if (myIp) addIp(myIp);
  });
}

async function addIpFromInput() {
  const input = document.getElementById('ip-input');
  const ip = (input?.value || '').trim();
  if (!ip) { toast('Bitte IP-Adresse eingeben.', 'error'); return; }
  await addIp(ip);
  if (input) input.value = '';
}

async function addIp(ip) {
  if ((SETTINGS.ipWhitelist || []).includes(ip)) {
    toast('Diese IP ist bereits eingetragen.', 'info');
    return;
  }
  const newList = [...(SETTINGS.ipWhitelist || []), ip];
  await patchIpSettings({ ipWhitelist: newList });
}

async function removeIp(ip) {
  const newList = (SETTINGS.ipWhitelist || []).filter(x => x !== ip);
  if (SETTINGS.ipWhitelistEnabled && newList.length === 0) {
    toast('Whitelist deaktiviert, da keine IPs mehr vorhanden.', 'info');
    await patchIpSettings({ ipWhitelist: newList, ipWhitelistEnabled: false });
  } else {
    await patchIpSettings({ ipWhitelist: newList });
  }
}

async function patchIpSettings(updates) {
  let res, data;
  try {
    res  = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    data = await res.json();
  } catch {
    toast('Verbindungsfehler.', 'error');
    return;
  }

  if (!res.ok) {
    toast(data.error || 'Fehler beim Speichern.', 'error');
    return;
  }

  SETTINGS = { ...SETTINGS, ...data };
  toast('Einstellungen gespeichert.', 'success');
  renderIpSection();
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
