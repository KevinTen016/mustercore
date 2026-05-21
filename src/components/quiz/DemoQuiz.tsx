'use client';

import { useState } from 'react';
import { BRANCHEN } from '@/data/branchen';

// ── Types ──────────────────────────────────────────────────────────────
interface QuizData {
  branche: string;
  brancheCustom: string;
  name: string;
  firma: string;
  email: string;
  telefon: string;
  stil: string;
  stilCustom: string;
  features: string[];
  featuresCustom: string;
  statusWebsite: string;
  statusWebsiteCustom: string;
}

const EMPTY: QuizData = {
  branche: '', brancheCustom: '',
  name: '', firma: '', email: '', telefon: '',
  stil: '', stilCustom: '',
  features: [], featuresCustom: '',
  statusWebsite: '', statusWebsiteCustom: '',
};

const STILE = [
  { key: 'modern',     label: 'Modern & Minimalistisch', desc: 'Klare Linien, viel Weißraum, zeitlos' },
  { key: 'klassisch',  label: 'Klassisch & Seriös',      desc: 'Vertrauensvoll, professionell, bewährt' },
  { key: 'lebendig',   label: 'Frisch & Lebendig',       desc: 'Farbenfroh, einladend, ausdrucksstark' },
];

const FEATURES_LIST = [
  'Online-Terminbuchung',
  'Kontaktformular',
  'Galerie / Portfolio',
  'Blog / Neuigkeiten',
  'Preisliste',
  'Mehrere Standorte',
];

const STATUS_LIST = [
  { key: 'kein',    label: 'Noch keine Website',    desc: 'Wir starten komplett von vorne' },
  { key: 'selbst',  label: 'Ja, selbst erstellt',   desc: 'Baukastensystem oder WordPress' },
  { key: 'agentur', label: 'Ja, von einer Agentur', desc: 'Professionell, aber veraltet oder zu teuer' },
];

const TOTAL = 5;

// ── Component ──────────────────────────────────────────────────────────
export default function DemoQuiz() {
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState<QuizData>(EMPTY);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  function patch<K extends keyof QuizData>(key: K, value: QuizData[K]) {
    setData(prev => ({ ...prev, [key]: value }));
    setError('');
  }

  function toggleFeature(f: string) {
    setData(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));
  }

  function validate(): string {
    if (step === 1) {
      if (!data.branche) return 'Bitte wählen Sie Ihre Branche aus.';
      if (data.branche === '__andere__' && !data.brancheCustom.trim()) return 'Bitte beschreiben Sie Ihre Branche.';
    }
    if (step === 2) {
      if (!data.name.trim())  return 'Bitte geben Sie Ihren Namen ein.';
      if (!data.firma.trim()) return 'Bitte geben Sie den Firmennamen ein.';
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      if (!data.telefon.trim()) return 'Bitte geben Sie Ihre Telefonnummer ein.';
    }
    if (step === 3) {
      if (!data.stil) return 'Bitte wählen Sie einen Stil aus.';
      if (data.stil === '__andere__' && !data.stilCustom.trim()) return 'Bitte beschreiben Sie den gewünschten Stil.';
    }
    if (step === 5) {
      if (!data.statusWebsite) return 'Bitte wählen Sie eine Option aus.';
    }
    return '';
  }

  function next() {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => Math.min(s + 1, TOTAL));
  }

  function back() {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  }

  async function submit() {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/demo-anfragen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ───────────────────────────────────────────────────
  if (done) {
    return (
      <div style={card}>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-muted)', border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.4rem' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Anfrage eingegangen!
          </h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '40ch', margin: '0 auto', lineHeight: 1.65, fontSize: '0.95rem' }}>
            Wir erstellen Ihre persönliche Demo-Website und melden uns{' '}
            <strong style={{ color: 'var(--text)' }}>innerhalb von 24 Stunden</strong> bei Ihnen.
          </p>
        </div>
      </div>
    );
  }

  const progress = ((step - 1) / (TOTAL - 1)) * 100;

  return (
    <div style={card}>
      {/* Progress bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
          <span style={meta}>Schritt {step} von {TOTAL}</span>
          <span style={meta}>{Math.round((step / TOTAL) * 100)} %</span>
        </div>
        <div style={{ height: 4, background: 'var(--line)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 99, transition: 'width 0.35s ease' }} />
        </div>
      </div>

      {/* ── Step 1 — Branche ── */}
      {step === 1 && (
        <div>
          <h2 style={heading}>Welche Art von Unternehmen haben Sie?</h2>
          <p style={sub}>Wir passen Ihre Demo genau auf die Branche an.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(138px, 1fr))', gap: '0.6rem', marginTop: '1.5rem' }}>
            {BRANCHEN.map(b => (
              <button key={b.slug} type="button" onClick={() => patch('branche', b.slug)} style={tileStyle(data.branche === b.slug)}>
                <svg viewBox="0 0 16 16" fill="currentColor" width="18" height="18" style={{ flexShrink: 0 }}>
                  <path d={b.icon} />
                </svg>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.3 }}>{b.name}</span>
              </button>
            ))}
            <button type="button" onClick={() => patch('branche', '__andere__')} style={tileStyle(data.branche === '__andere__')}>
              <span style={{ fontSize: '1rem' }}>✏</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>Andere</span>
            </button>
          </div>
          {data.branche === '__andere__' && (
            <input
              type="text"
              placeholder="Beschreiben Sie Ihre Branche …"
              value={data.brancheCustom}
              onChange={e => patch('brancheCustom', e.target.value)}
              style={{ ...input, marginTop: '0.75rem' }}
            />
          )}
        </div>
      )}

      {/* ── Step 2 — Kontaktdaten ── */}
      {step === 2 && (
        <div>
          <h2 style={heading}>Wie können wir Sie erreichen?</h2>
          <p style={sub}>Die Demo senden wir direkt an Ihre E-Mail-Adresse.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
              <label style={labelStyle}>
                Ihr Name *
                <input type="text" placeholder="Max Mustermann" value={data.name} onChange={e => patch('name', e.target.value)} style={input} />
              </label>
              <label style={labelStyle}>
                Firmenname *
                <input type="text" placeholder="Salon Beispiel" value={data.firma} onChange={e => patch('firma', e.target.value)} style={input} />
              </label>
            </div>
            <label style={labelStyle}>
              E-Mail-Adresse *
              <input type="email" placeholder="max@firma.de" value={data.email} onChange={e => patch('email', e.target.value)} style={input} />
            </label>
            <label style={labelStyle}>
              Telefonnummer *
              <input type="tel" placeholder="+49 151 …" value={data.telefon} onChange={e => patch('telefon', e.target.value)} style={input} />
            </label>
          </div>
        </div>
      )}

      {/* ── Step 3 — Stil ── */}
      {step === 3 && (
        <div>
          <h2 style={heading}>Welcher Stil spricht Sie an?</h2>
          <p style={sub}>Wir richten das Design der Demo danach aus.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
            {STILE.map(s => (
              <button key={s.key} type="button" onClick={() => patch('stil', s.key)} style={rowStyle(data.stil === s.key)}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 2 }}>{s.desc}</div>
                </div>
                {data.stil === s.key && <span style={{ color: 'var(--accent)', fontSize: '0.85rem', flexShrink: 0 }}>✓</span>}
              </button>
            ))}
            <button type="button" onClick={() => patch('stil', '__andere__')} style={rowStyle(data.stil === '__andere__')}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Etwas anderes</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 2 }}>Ich beschreibe es selbst</div>
              </div>
              {data.stil === '__andere__' && <span style={{ color: 'var(--accent)', fontSize: '0.85rem', flexShrink: 0 }}>✓</span>}
            </button>
          </div>
          {data.stil === '__andere__' && (
            <input
              type="text"
              placeholder="Beschreiben Sie den Stil …"
              value={data.stilCustom}
              onChange={e => patch('stilCustom', e.target.value)}
              style={{ ...input, marginTop: '0.75rem' }}
            />
          )}
        </div>
      )}

      {/* ── Step 4 — Features ── */}
      {step === 4 && (
        <div>
          <h2 style={heading}>Welche Funktionen brauchen Sie?</h2>
          <p style={sub}>Mehrere Auswahlen möglich.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
            {FEATURES_LIST.map(f => {
              const on = data.features.includes(f);
              return (
                <button key={f} type="button" onClick={() => toggleFeature(f)} style={checkStyle(on)}>
                  <span style={checkBox(on)}>{on && '✓'}</span>
                  <span style={{ fontSize: '0.87rem', color: 'var(--text)', fontWeight: on ? 500 : 400 }}>{f}</span>
                </button>
              );
            })}
            {/* Andere */}
            {(() => {
              const on = data.features.includes('__andere__');
              return (
                <button type="button" onClick={() => toggleFeature('__andere__')} style={checkStyle(on)}>
                  <span style={checkBox(on)}>{on && '✓'}</span>
                  <span style={{ fontSize: '0.87rem', color: 'var(--text)' }}>Etwas anderes</span>
                </button>
              );
            })()}
          </div>
          {data.features.includes('__andere__') && (
            <input
              type="text"
              placeholder="Welche Funktion fehlt?"
              value={data.featuresCustom}
              onChange={e => patch('featuresCustom', e.target.value)}
              style={{ ...input, marginTop: '0.75rem' }}
            />
          )}
        </div>
      )}

      {/* ── Step 5 — Status Website ── */}
      {step === 5 && (
        <div>
          <h2 style={heading}>Haben Sie bereits eine Website?</h2>
          <p style={sub}>Das hilft uns, den richtigen Startpunkt zu finden.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
            {STATUS_LIST.map(s => (
              <button key={s.key} type="button" onClick={() => patch('statusWebsite', s.key)} style={rowStyle(data.statusWebsite === s.key)}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 2 }}>{s.desc}</div>
                </div>
                {data.statusWebsite === s.key && <span style={{ color: 'var(--accent)', fontSize: '0.85rem', flexShrink: 0 }}>✓</span>}
              </button>
            ))}
            <button type="button" onClick={() => patch('statusWebsite', '__andere__')} style={rowStyle(data.statusWebsite === '__andere__')}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Sonstiges</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 2 }}>Ich beschreibe es selbst</div>
              </div>
              {data.statusWebsite === '__andere__' && <span style={{ color: 'var(--accent)', fontSize: '0.85rem', flexShrink: 0 }}>✓</span>}
            </button>
          </div>
          {data.statusWebsite === '__andere__' && (
            <input
              type="text"
              placeholder="Kurze Beschreibung …"
              value={data.statusWebsiteCustom}
              onChange={e => patch('statusWebsiteCustom', e.target.value)}
              style={{ ...input, marginTop: '0.75rem' }}
            />
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ marginTop: '1rem', color: 'var(--red)', fontSize: '0.83rem', fontWeight: 500 }}>{error}</p>
      )}

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}>
        {step > 1
          ? <button type="button" onClick={back} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.84rem', cursor: 'pointer', padding: '0.5rem 0', fontFamily: 'var(--font-body)' }}>← Zurück</button>
          : <span />
        }
        {step < TOTAL
          ? <button type="button" onClick={next} className="btn btn-primary">Weiter →</button>
          : <button type="button" onClick={submit} disabled={loading} className="btn btn-primary" style={{ opacity: loading ? 0.65 : 1 }}>
              {loading ? 'Wird gesendet …' : 'Demo anfragen →'}
            </button>
        }
      </div>
    </div>
  );
}

// ── Style constants ────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius-lg)',
  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
  maxWidth: 640,
  marginInline: 'auto',
};

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.25rem, 2.5vw, 1.55rem)',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: 'var(--text)',
  marginBottom: '0.3rem',
};

const sub: React.CSSProperties = {
  fontSize: '0.87rem',
  color: 'var(--text-dim)',
  lineHeight: 1.55,
  maxWidth: 'none',
  marginBottom: 0,
};

const meta: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-sub)',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const input: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '0.6rem 0.85rem',
  background: 'var(--bg-input)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontSize: '0.88rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-dim)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

function tileStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.9rem 0.6rem',
    background: active ? 'var(--accent-muted)' : 'var(--bg-input)',
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    color: active ? 'var(--accent)' : 'var(--text)',
    transition: 'all 0.18s',
    textAlign: 'center',
  };
}

function rowStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    background: active ? 'var(--accent-muted)' : 'var(--bg-input)',
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.18s',
  };
}

function checkStyle(on: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.7rem 1rem',
    background: on ? 'var(--accent-muted)' : 'transparent',
    border: `1px solid ${on ? 'var(--accent)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.18s',
  };
}

function checkBox(on: boolean): React.CSSProperties {
  return {
    width: 18,
    height: 18,
    borderRadius: 4,
    border: `2px solid ${on ? 'var(--accent)' : 'var(--line)'}`,
    background: on ? 'var(--accent)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--bg)',
    transition: 'all 0.18s',
  };
}
