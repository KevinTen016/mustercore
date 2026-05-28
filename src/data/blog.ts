export interface BlogPost {
  slug: string;
  title: string;
  teaser: string;
  date: string;        // ISO 8601
  readingMinutes: number;
  category: string;
  body: string;        // plain paragraphs separated by \n\n
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'warum-online-buchung-friseur',
    title: 'Warum jeder Friseursalon eine Online-Buchung braucht',
    teaser:
      'Kunden rufen nicht mehr an — sie suchen, klicken, buchen. Was lokale Salons verlieren, wenn die Buchung nur per Telefon läuft.',
    date: '2025-11-10',
    readingMinutes: 5,
    category: 'Online-Buchung',
    body: `Der Friseursalon-Alltag ist turbulent: Sie schneiden, beraten, kassieren — und dazwischen klingelt das Telefon. Jedes Gespräch kostet Zeit, und oft werden Termine trotzdem verwechselt, vergessen oder doppelt vergeben.

Das eigentliche Problem ist jedoch ein anderes: Viele potenzielle Neukunden rufen gar nicht erst an. Sie suchen auf Google, sehen Ihren Salon, finden aber keinen „Jetzt buchen"-Button — und landen beim Wettbewerber, der eine Online-Buchung anbietet.

**Was geht verloren, wenn es keine Online-Buchung gibt?**

Wer heute keine Online-Buchung anbietet, verliert Termine in drei Situationen: abends und am Wochenende, wenn das Telefon nicht besetzt ist; an den Tagen, an denen Sie mitten im Schneiden nicht rangehen können; und bei Kunden, die einfach lieber klicken als anrufen — das ist mittlerweile die Mehrheit unter 40.

**Was bringt eine Online-Buchung konkret?**

Erstens: mehr Termine. Kunden können rund um die Uhr buchen — auch samstags um 22 Uhr. Termine, die sonst verloren gehen, kommen ins System.

Zweitens: weniger No-Shows. Eine automatische E-Mail-Erinnerung 24 Stunden vor dem Termin reduziert Ausfälle spürbar. Studien zeigen Rückgänge von 30–50 %.

Drittens: weniger Telefonarbeit. Jede Online-Buchung ist ein Anruf weniger. Das klingt banal, aber für einen Salon mit 8 Buchungen täglich spart das täglich 15–20 Minuten.

**Was muss eine gute Online-Buchung leisten?**

Sie muss einfach sein — keine App, kein Account, nur Dienstleistung wählen, Termin wählen, fertig. Sie muss auf dem Smartphone problemlos funktionieren. Und sie muss DSGVO-konform sein, also keine Daten in die USA übertragen.

**Fazit**

Online-Buchung ist kein Luxus mehr. Sie ist heute Standard — wie eine eigene Website. Friseursalons, die noch nicht online buchbar sind, werden in den nächsten zwei Jahren an Buchungen verlieren. Der Einstieg ist einfacher und günstiger als viele denken.`,
  },
  {
    slug: 'dsgvo-checkliste-kleine-betriebe',
    title: 'DSGVO-Checkliste für kleine Betriebe: Was wirklich zählt',
    teaser:
      'DSGVO klingt nach Bürokratie — ist aber eigentlich einfach. Diese 7 Punkte reichen für die meisten kleinen Betriebe als Grundlage.',
    date: '2025-12-03',
    readingMinutes: 6,
    category: 'DSGVO',
    body: `Seit 2018 gilt die DSGVO. Seitdem kursieren zwei Reaktionen: Panik und Gleichgültigkeit. Beides ist falsch. Die DSGVO verlangt von kleinen Betrieben keine großen Systeme — aber ein paar Grundlagen müssen stimmen.

**1. Impressum und Datenschutzerklärung**

Jede Website braucht ein Impressum (§ 5 TMG) und eine Datenschutzerklärung. Das Impressum muss Name, Adresse und Kontaktdaten des Verantwortlichen enthalten. Die Datenschutzerklärung erklärt, welche Daten Sie erheben, warum und wie lange.

**2. Cookie-Banner nach TTDSG**

Seit dem TTDSG (2021) müssen Cookies, die nicht technisch notwendig sind (z. B. Google Analytics, Marketing-Pixel), vor dem Setzen aktiv eingewilligt werden. Ein Banner, der nur „OK" bietet, reicht nicht. Es muss eine echte Auswahl geben: Akzeptieren oder Ablehnen.

**3. Auftragsverarbeitungsvertrag (AV-Vertrag)**

Wenn Sie Dienstleister einsetzen, die personenbezogene Daten Ihrer Kunden verarbeiten (z. B. ein Buchungssystem, ein E-Mail-Dienst, ein Hosting-Anbieter), brauchen Sie mit diesen einen AV-Vertrag nach Art. 28 DSGVO.

**4. EU-Hosting**

Personenbezogene Daten Ihrer Kunden — Namen, E-Mail-Adressen, Terminhistorie — dürfen nicht einfach auf Servern außerhalb der EU gespeichert werden. Viele günstige US-Dienste (z. B. US-basierte Buchungstools) erfüllen das nicht.

**5. Keine Daten in offenen Logs**

Achten Sie darauf, dass Namen, E-Mail-Adressen oder Buchungsdetails nicht unverschlüsselt in Log-Dateien landen. Das betrifft insbesondere Entwickler-Logs und E-Mail-Postfächer.

**6. Löschkonzept**

Kunden haben das Recht auf Löschung ihrer Daten (Art. 17 DSGVO). Sie müssen in der Lage sein, auf Anfrage alle Daten einer Person zu löschen. Das muss nicht automatisiert sein — aber manuell möglich.

**7. Datenpanne melden**

Wenn Kundendaten kompromittiert werden (z. B. durch einen Hack), müssen Sie das innerhalb von 72 Stunden der zuständigen Datenschutzbehörde melden. In Niedersachsen ist das die LfD Niedersachsen.

**Was MusterCore mitbringt**

MusterCore-Kunden bekommen DSGVO-konforme Grundlagen mit: EU-Hosting, AV-Vertrag, Cookie-Banner mit echtem Auswahlrecht, Impressum und Datenschutzerklärung — alles inklusive im Paket.`,
  },
  {
    slug: 'google-business-profil-optimieren',
    title: 'Google Business Profil für lokale Betriebe: 6 Schritte zur besseren Sichtbarkeit',
    teaser:
      'Das Google Business Profil ist kostenlos und einer der stärksten Hebel für lokale Sichtbarkeit. Trotzdem bleibt es bei den meisten Betrieben halb leer.',
    date: '2026-01-14',
    readingMinutes: 5,
    category: 'Online-Sichtbarkeit',
    body: `Wenn jemand in Ihrer Stadt nach einem Friseur, einer Werkstatt oder einem Physiotherapeuten sucht, erscheinen oben auf der Google-Ergebnisseite drei Einträge aus Google Maps — vor allen anderen Suchergebnissen. Das sind die drei wertvollsten Plätze im lokalen Online-Marketing. Und sie sind kostenlos.

**Was ist das Google Business Profil?**

Das Google Business Profil (früher Google My Business) ist der Eintrag, der rechts in der Suche erscheint — mit Öffnungszeiten, Adresse, Bewertungen, Fotos und dem Link zur Website. Wer hier gut aufgestellt ist, wird gefunden.

**Schritt 1: Profil beanspruchen**

Viele Betriebe haben bereits einen automatisch erstellten Google-Eintrag — aber keiner hat ihn beansprucht und verwaltet ihn. Gehen Sie auf business.google.com und machen Sie das Profil zu Ihrem.

**Schritt 2: Alle Felder ausfüllen**

Name, Adresse, Öffnungszeiten, Telefonnummer, Website — das ist die Basis. Viele lassen das Feld „Beschreibung" leer. Schreiben Sie 2–3 Sätze, was Sie anbieten und was Sie auszeichnet.

**Schritt 3: Die richtige Kategorie wählen**

Wählen Sie die Hauptkategorie so präzise wie möglich: „Friseursalon" statt „Salon". Fügen Sie Nebenkategorien hinzu, wenn sie passen.

**Schritt 4: Fotos hochladen**

Profile mit Fotos erhalten laut Google 42 % mehr Anfragen nach einer Wegbeschreibung und 35 % mehr Klicks auf die Website. Laden Sie mindestens 5–10 Fotos hoch: Außenansicht, Innenraum, Ihr Team, Ihre Arbeit.

**Schritt 5: Auf Bewertungen antworten**

Reagieren Sie auf jede Bewertung — positive und negative. Das signalisiert Google Aktivität und zeigt potenziellen Kunden, dass Sie professionell aufgestellt sind.

**Schritt 6: Regelmäßig aktiv sein**

Posten Sie Neuigkeiten, Aktionen oder saisonale Angebote direkt im Profil. Google belohnt aktive Profile mit besseren Rankings.

**Tipp**

Im MusterCore STANDARD-Paket ist die Einrichtung des Google Business Profils inklusive. Wir richten das Profil bei Ihrem Onboarding vollständig ein — Sie müssen sich um nichts kümmern.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
