'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Props {
  children: string;
  style?: CSSProperties;
  className?: string;
  speed?: number;
}

export function TypewriterH1({ children, style, className, speed = 28 }: Props) {
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCount(0);
    let n = 0;
    function tick() {
      if (n >= children.length) return;
      n++;
      setCount(n);
      timer.current = setTimeout(tick, speed);
    }
    timer.current = setTimeout(tick, speed);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [children, speed]);

  const done = count >= children.length;

  return (
    <h1 style={style} className={className}>
      {children.slice(0, count)}
      <span
        aria-hidden="true"
        className={done ? 'tw-cursor tw-cursor--blink' : 'tw-cursor'}
      >_</span>
    </h1>
  );
}
