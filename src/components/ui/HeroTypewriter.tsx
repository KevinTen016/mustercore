'use client';

import { useEffect, useRef, useState } from 'react';
import { BRANCHEN } from '@/data/branchen';

const WORDS = BRANCHEN.map((b) => b.namePlural);
const PREFIX = 'Die Website für ';
const TYPE_SPEED = 55;
const DELETE_SPEED = 30;
const PAUSE_MS = 1800;

interface Props {
  className?: string;
  accentClass?: string;
}

export function HeroTypewriter({ className, accentClass }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const word = WORDS[wordIdx % WORDS.length];

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timer.current = setTimeout(
          () => setDisplayed(word.slice(0, displayed.length + 1)),
          TYPE_SPEED,
        );
      } else {
        timer.current = setTimeout(() => setPhase('pausing'), PAUSE_MS);
      }
    } else if (phase === 'pausing') {
      setPhase('deleting');
    } else {
      if (displayed.length > 0) {
        timer.current = setTimeout(
          () => setDisplayed(word.slice(0, displayed.length - 1)),
          DELETE_SPEED,
        );
      } else {
        setWordIdx((i) => i + 1);
        setPhase('typing');
      }
    }

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [displayed, phase, wordIdx]);

  return (
    <h1 className={className}>
      {PREFIX}
      <span className={accentClass}>
        {displayed}
        <span aria-hidden="true" className="tw-cursor tw-cursor--blink">_</span>
      </span>
    </h1>
  );
}
