'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { BRANCHEN } from '@/data/branchen';
import s from './Header.module.css';

const branchenIcons: Record<string, string> = {
  friseur: '✂️', praxis: '🩺', autowerkstatt: '🔧',
  physiotherapie: '💪', fitness: '🏃', tattoo: '🖋️',
};

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wc_theme') as 'dark' | 'light' | null;
    const initial = saved ?? 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';

      // Focus first focusable element in drawer
      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        )
      );
      focusable[0]?.focus();

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          setOpen(false);
          return;
        }
        if (e.key === 'Tab' && focusable.length > 0) {
          const first = focusable[0];
          const last  = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('wc_theme', next);
  }

  return (
    <>
      <header className={`${s.header}${scrolled ? ` ${s.scrolled}` : ''}`}>
        <div className={`container ${s.inner}`}>

          {/* Logo */}
          <Link href="/" className={s.logo} aria-label="WebCore — Startseite">
            <span className={s.logoMark}>WebCore</span>
            <span className={s.logoSub} aria-hidden="true">Website&nbsp;&amp;&nbsp;Buchung</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={s.nav} aria-label="Hauptnavigation">
            <Link href="/leistungen" className={`${s.navLink}${path === '/leistungen' ? ` ${s.active}` : ''}`}>
              Leistungen
            </Link>

            <div
              className={s.dropdown}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdownOpen(false);
              }}
            >
              <button
                className={s.navLink}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(v => !v)}
              >
                Branchen
                <svg className={s.navLinkCaret} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>
              <div className={s.dropdownMenu} role="menu">
                {BRANCHEN.map(b => (
                  <Link key={b.slug} href={`/branchen/${b.slug}`} className={s.dropdownItem} role="menuitem">
                    <span className={s.dropdownIcon} aria-hidden="true">{branchenIcons[b.slug]}</span>
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/preise" className={`${s.navLink}${path === '/preise' ? ` ${s.active}` : ''}`}>
              Preise
            </Link>
            <Link href="/ueber-uns" className={`${s.navLink}${path === '/ueber-uns' ? ` ${s.active}` : ''}`}>
              Über uns
            </Link>
          </nav>

          {/* Actions */}
          <div className={s.actions}>
            <button
              className={s.themeBtn}
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln'}
              title={theme === 'dark' ? 'Heller Modus' : 'Dunkler Modus'}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <Link href="/demo" className="btn btn-primary btn-sm">
              Demo anfragen
            </Link>

            <button
              className={s.burger}
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="14" x2="17" y2="14"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`${s.overlay}${open ? ` ${s.open}` : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <nav
        ref={drawerRef}
        id="mobile-drawer"
        className={`${s.drawer}${open ? ` ${s.open}` : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!open}
        aria-modal="true"
      >
        <button className={s.drawerClose} onClick={() => setOpen(false)} aria-label="Menü schließen">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/>
          </svg>
        </button>

        <Link href="/leistungen" className={s.drawerLink} onClick={() => setOpen(false)}>Leistungen</Link>
        <Link href="/preise"     className={s.drawerLink} onClick={() => setOpen(false)}>Preise</Link>
        <Link href="/ueber-uns"  className={s.drawerLink} onClick={() => setOpen(false)}>Über uns</Link>
        <Link href="/kontakt"    className={s.drawerLink} onClick={() => setOpen(false)}>Kontakt</Link>
        <Link href="/faq"        className={s.drawerLink} onClick={() => setOpen(false)}>FAQ</Link>

        <hr className={s.drawerDivider} />
        <div className={s.drawerLabel}>Branchen</div>

        {BRANCHEN.map(b => (
          <Link key={b.slug} href={`/branchen/${b.slug}`} className={s.drawerLink} onClick={() => setOpen(false)}>
            {branchenIcons[b.slug]} {b.name}
          </Link>
        ))}

        <hr className={s.drawerDivider} />

        <Link href="/demo" className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => setOpen(false)}>
          Demo anfragen
        </Link>
      </nav>
    </>
  );
}
