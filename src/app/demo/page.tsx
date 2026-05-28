import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import DemoQuiz from '@/components/quiz/DemoQuiz';
import { TypewriterH1 } from '@/components/ui/TypewriterH1';

export const metadata: Metadata = buildMetadata({
  title: 'Kostenlose Demo anfragen',
  description: 'Erhalten Sie in 24 Stunden eine persönliche Demo-Website für Ihr Unternehmen — kostenlos und unverbindlich.',
  path: '/demo',
});

export default function Page() {
  return (
    <div style={{ paddingBlock: 'clamp(4rem, 10vw, 7rem)' }}>
      <div className="container" style={{ maxWidth: '760px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <TypewriterH1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Ihre persönliche Demo — in 24 Stunden
          </TypewriterH1>
          <p style={{ fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1.65, maxWidth: '52ch', margin: '0 auto' }}>
            3 Minuten, 5 Fragen. Wir erstellen daraus eine Demo-Website, die genau zu Ihrem Betrieb passt.
          </p>
        </div>
        <DemoQuiz />
      </div>
    </div>
  );
}
