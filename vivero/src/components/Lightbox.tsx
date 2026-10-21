'use client';

import Image from 'next/image';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Photo } from '@/lib/photos';
import { Icon } from './Icon';

type LightboxApi = { open: (items: Photo[], index: number) => void };

const LightboxContext = createContext<LightboxApi>({ open: () => {} });
export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);
  const [fading, setFading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef(0);

  const open = useCallback((list: Photo[], i: number) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setItems(list);
    setIndex(i);
    setRendered(true);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => setRendered(false), 400);
    lastFocus.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback((delta: number) => {
    if (items.length < 2) return;
    setFading(true);
    setTimeout(() => {
      setIndex(i => (i + delta + items.length) % items.length);
      setFading(false);
    }, 120);
  }, [items.length]);

  // Entrada animada, foco y bloqueo del scroll de la página
  useEffect(() => {
    if (!rendered) return;
    const raf = requestAnimationFrame(() => setShown(true));
    closeBtn.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [rendered, close, go]);

  const api = useMemo(() => ({ open }), [open]);
  const item = items[index];

  return (
    <LightboxContext.Provider value={api}>
      {children}
      {rendered && item && (
        <div
          className={`lb${shown ? ' show' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
          onTouchStart={e => { touchX.current = e.changedTouches[0].clientX; }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <button ref={closeBtn} className="lb-close" aria-label="Cerrar" onClick={close}>
            <Icon name="x" />
          </button>
          <button className="lb-nav prev" aria-label="Anterior" onClick={() => go(-1)}>
            <Icon name="chev-l" />
          </button>
          <figure className="lb-fig">
            <Image
              src={item.src}
              width={item.width}
              height={item.height}
              alt={item.alt}
              sizes="92vw"
              style={{ opacity: fading ? 0 : 1 }}
            />
            <figcaption>{item.alt}</figcaption>
          </figure>
          <button className="lb-nav next" aria-label="Siguiente" onClick={() => go(1)}>
            <Icon name="chev-r" />
          </button>
        </div>
      )}
    </LightboxContext.Provider>
  );
}
