'use client';

import { useEffect, useRef, useState } from 'react';
import { statementHighlight, statementText } from '@/lib/data';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const words = statementText.split(/\s+/);

// Frase grande cuyas palabras se encienden a medida que se baja
export default function Statement() {
  const wrap = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(words.length);
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!wrap.current) return;
      const vh = innerHeight;
      const r = wrap.current.getBoundingClientRect();
      const p = clamp((-r.top + vh * 0.15) / (r.height - vh * 1.05));
      setLit(Math.round(p * words.length * 1.04));
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', update);
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="statement-wrap" id="manifiesto" ref={wrap}>
      <div className="statement-stick">
        <p className="statement">
          {words.map((w, i) => (
            <span
              key={i}
              className={`w${statementHighlight.includes(w.toLowerCase()) ? ' hl' : ''}${i < lit ? ' on' : ''}`}
            >
              {w}{i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
