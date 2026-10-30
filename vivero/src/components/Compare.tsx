'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { photo } from '@/lib/photos';
import { Icon } from './Icon';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Deslizador "antes / hoy"
export default function Compare() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const before = photo('partida-09');
  const now = photo('hoy-06');

  // Pequeña demostración al entrar en pantalla
  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, timer = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now() + 500, dur = 2600;
      const step = (now: number) => {
        const t = clamp((now - t0) / dur);
        if (range.current?.matches(':active')) return;
        if (now >= t0) setPos(50 + Math.sin(t * Math.PI * 2) * 28 * (1 - t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      timer = window.setTimeout(() => { raf = requestAnimationFrame(step); }, 500);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section" id="antes-despues">
      <div className="container">
        <header className="section-head center reveal">
          <p className="eyebrow eyebrow-green">Antes y hoy</p>
          <h2>De invernadero en desuso<br />a invernadero en producción.</h2>
          <p className="lead">Deslizá para ver el mismo lugar en dos momentos distintos.</p>
        </header>

        <div className="compare reveal" ref={box} style={{ '--pos': `${pos}%` } as React.CSSProperties}>
          <Image className="compare-img" src={now.src} alt="Hoy: invernadero con plantines sobre las mesadas" fill sizes="1000px" />
          <Image className="compare-img compare-before" src={before.src} alt="Antes: interior del invernadero vacío, con piso de tierra" fill sizes="1000px" />
          <span className="compare-tag left">Antes</span>
          <span className="compare-tag right">Hoy</span>
          <div className="compare-handle" aria-hidden="true">
            <span><Icon name="chev-l" /><Icon name="chev-r" /></span>
          </div>
          <input
            ref={range}
            className="compare-range"
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={pos}
            onChange={e => setPos(Number(e.target.value))}
            aria-label="Comparar antes y hoy"
          />
        </div>
      </div>
    </section>
  );
}
