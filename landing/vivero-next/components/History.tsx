'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chapters } from '@/lib/data';
import Rail from './Rail';

export default function History() {
  const [active, setActive] = useState(0);
  const seg = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const chapterEls = useRef<(HTMLElement | null)[]>([]);

  // Mueve la "píldora" del control segmentado hasta la pestaña activa
  useLayoutEffect(() => {
    const place = () => {
      const tab = tabs.current[active];
      if (!tab || !thumb.current || !seg.current) return;
      thumb.current.style.width = tab.offsetWidth + 'px';
      thumb.current.style.transform = `translateX(${tab.offsetLeft}px)`;
      const s = seg.current;
      if (s.scrollWidth > s.clientWidth) {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        s.scrollTo({ left: tab.offsetLeft - (s.clientWidth - tab.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    place();
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [active]);

  // La pestaña activa sigue al capítulo que se está leyendo
  useEffect(() => {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const i = chapterEls.current.indexOf(en.target as HTMLElement);
        if (i >= 0) setActive(i);
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    chapterEls.current.forEach(el => el && spy.observe(el));
    return () => spy.disconnect();
  }, []);

  const goTo = (i: number) => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    chapterEls.current[i]?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="section dark" id="historia">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow eyebrow-green">Nuestra historia</p>
          <h2>Cuatro etapas.<br />Una misma idea.</h2>
          <p className="lead">Así pasó el vivero de un terreno vacío a un lugar vivo. Recorré cada etapa.</p>
        </header>
      </div>

      <div className="seg-wrap">
        <div className="seg" ref={seg} role="tablist" aria-label="Etapas">
          <span className="seg-thumb" ref={thumb} />
          {chapters.map((c, i) => (
            <button
              key={c.id}
              ref={el => { tabs.current[i] = el; }}
              role="tab"
              aria-selected={active === i}
              onClick={() => goTo(i)}
            >
              {c.tab}
            </button>
          ))}
        </div>
      </div>

      {chapters.map((c, i) => (
        <article className="chapter" id={c.id} key={c.id} ref={el => { chapterEls.current[i] = el; }}>
          <div className="container chapter-head reveal">
            <span className="num">{c.num}</span>
            <div>
              <h3>{c.tab}</h3>
              <p className="chapter-title">{c.title}</p>
              <p>{c.text}</p>
            </div>
          </div>
          <Rail ids={c.photos} />
        </article>
      ))}
    </section>
  );
}
