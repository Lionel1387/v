'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { photo, type PhotoId } from '@/lib/photos';
import { Icon } from './Icon';
import { useLightbox } from './Lightbox';

// Carrusel horizontal: scroll-snap, botones y arrastre con el mouse
export default function Rail({ ids }: { ids: PhotoId[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const { open } = useLightbox();
  const list = ids.map(photo);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft < 8);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };

    let down = false, startX = 0, startLeft = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved.current = false; startX = e.clientX; startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved.current = true; el.style.scrollSnapType = 'none'; }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.style.scrollSnapType = '';
    };
    // Si se arrastró, no abrir el visor
    const onClickCapture = (e: MouseEvent) => {
      if (moved.current) { e.stopPropagation(); e.preventDefault(); moved.current = false; }
    };

    el.addEventListener('scroll', update, { passive: true });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', e => e.preventDefault());
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    addEventListener('resize', update);
    update();
    return () => {
      el.removeEventListener('scroll', update);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('click', onClickCapture, true);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="rail-wrap reveal">
      <div className="rail" ref={rail}>
        {list.map((p, i) => (
          <figure className="rail-item" key={p.src}>
            <button type="button" onClick={() => open(list, i)}>
              <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 700px) 80vw, 640px" />
            </button>
          </figure>
        ))}
      </div>
      <div className="rail-ctrl">
        <button className="rail-btn" aria-label="Anterior" disabled={atStart} onClick={() => scroll(-1)}>
          <Icon name="chev-l" />
        </button>
        <button className="rail-btn" aria-label="Siguiente" disabled={atEnd} onClick={() => scroll(1)}>
          <Icon name="chev-r" />
        </button>
      </div>
    </div>
  );
}
