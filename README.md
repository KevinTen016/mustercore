# WebCore — Corporate Site

Website der Firma **WebCore** (Einzelunternehmen, Braunschweig).
Produkt: **Sitano** — Website + Online-Buchung + Admin-Panel für lokale Unternehmen.

---

## ⚠️ TODO VOR VERÖFFENTLICHUNG

### Pflichtfelder (ohne diese NICHT veröffentlichen!)

- [ ] **Impressum**: `src/data/firma.ts` — alle `[PLATZHALTER]` mit echten Daten füllen
- [ ] **USt-IdNr.** nach ELSTER-Fragebogen eintragen (nach Gewerbeanmeldung)
- [ ] **Steuernummer** nach ELSTER-Fragebogen eintragen
- [ ] **Datenschutzerklärung** durch Anwalt prüfen lassen (Vor Veröffentlichung!)
- [ ] **AGB** durch Anwalt erstellen/prüfen lassen
- [ ] **`NEXT_PUBLIC_BASE_URL`** auf echte Domain setzen (z.B. `https://webcore.de`)
- [ ] **Hosting-Provider** in `src/data/firma.ts` und Datenschutz eintragen
- [ ] **OG-Image** `public/og-image.png` erstellen (1200×630 px)
- [ ] **Favicon** `public/favicon.svg` erstellen

### Optionale Schritte

- [ ] Resend API-Key für Kontaktformular eintragen (`.env.local`)
- [ ] Plausible Analytics einrichten (DSGVO-konform)
- [ ] Blog-Artikel schreiben (MDX in `src/content/blog/`)
- [ ] Referenzen-Seite mit echten Projekten befüllen

---

## Lokale Entwicklung

```bash
# Ohne Docker
npm install
npm run dev
# → http://localhost:3000

# Mit Docker (Dev-Modus, Hot-Reload)
docker compose --profile dev up

# Mit Docker (Production-Build)
docker compose up --build
# → http://localhost:3000
```

---

## Projektstruktur

```
src/
├── app/              # Next.js App Router — alle Seiten
├── components/
│   ├── layout/       # Header, Footer, CookieBanner
│   └── ui/           # Wiederverwendbare UI-Elemente
├── data/             # Typisierte Inhaltsdaten
│   ├── pricing.ts    # ← Preise hier ändern (wirkt auf alle Seiten)
│   ├── add-ons.ts    # ← Zusatzleistungen
│   ├── branchen.ts   # ← Brancheninformationen
│   └── firma.ts      # ← Firmendaten (Impressum-Grundlage)
├── lib/              # Hilfsfunktionen (SEO, Cookie-Consent)
└── styles/
    ├── tokens.css    # ← Design-Tokens (identisch mit Admin-Panel)
    └── globals.css   # ← Globale Stile, Fonts, Buttons
```

---

## Design-System

Alle Farben und Abstände stehen in `src/styles/tokens.css`.
Die Tokens sind identisch mit der Admin-Panel-Vorlage — visuelle Kohärenz
zwischen WebCore-Site und Kunden-Admin ist Bestandteil des Produktversprechens.

Theme-Umschalter: `data-theme="dark"` (Default) / `data-theme="light"` auf `<html>`.

---

## Schriften (lokal, DSGVO-konform)

- **Display:** Manrope via `@fontsource/manrope`
- **Body:** IBM Plex Sans via `@fontsource/ibm-plex-sans`

Keine externen Anfragen, kein Google Fonts CDN (LG München 2022 konform).
