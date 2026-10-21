'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { photo } from '@/lib/photos';
import { Icon } from './Icon';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const idx = (i: number) => ({ '--i': i }) as React.CSSProperties;

export default function Hero() {
  const card = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const img = photo('hoy-06');

  // La tarjeta se achica y el fondo hace parallax al bajar
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = scrollY;
      const vh = innerHeight;
      if (y > vh * 1.4 || !card.current || !media.current) return;
      const p = clamp(y / vh);
      card.current.style.setProperty('--s', (1 - p * 0.07).toFixed(4));
      card.current.style.setProperty('--o', (1 - p * 1.4).toFixed(3));
      media.current.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-card" ref={card}>
        <div className="hero-media" ref={media}>
          <Image src={img.src} alt={img.alt} fill priority sizes="100vw" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow hero-in" style={idx(0)}>Educación ambiental · ISEP, Córdoba</p>
          <h1 className="hero-title">
            <span className="line"><span style={idx(1)}>Corredor educativo</span></span>
            <span className="line"><span style={idx(2)}>BioLab Nativo.</span></span>
          </h1>
          <p className="hero-sub hero-in" style={idx(3)}>
            Un aula abierta donde estudiantes y docentes aprenden biodiversidad, producción vegetal y sustentabilidad con la experiencia directa.
          </p>
          <div className="hero-actions hero-in" style={idx(4)}>
            <a className="btn btn-primary" href="#historia">Conocé la historia</a>
            <a className="btn btn-ghost" href="#contacto">Visitas <Icon name="arrow" /></a>
          </div>
        </div>
        <ul className="hero-chips hero-in" style={idx(5)} aria-label="Espacios del vivero">
          <li><Icon name="greenhouse" />Invernadero</li>
          <li><Icon name="tree" />Bosque urbano</li>
          <li><Icon name="sprout" />Huerta agroecológica</li>
        </ul>
        <a className="scroll-hint" href="#manifiesto" aria-label="Ir a la siguiente sección">
          <Icon name="chev-d" />
        </a>
      </div>
    </section>
  );
}
