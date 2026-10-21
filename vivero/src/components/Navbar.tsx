'use client';

import { useEffect, useState } from 'react';
import { navLinks } from '@/lib/data';
import { Icon } from './Icon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  // Enlace activo según la sección visible
  useEffect(() => {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive('#' + en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(l => {
      const el = document.querySelector(l.href);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={`nav${open ? ' open' : ''}`} id="nav">
      <div className="nav-bar">
        <a className="brand" href="#top" aria-label="BioLab Nativo, inicio">
          <Icon name="leaf" />
          <span>BioLab Nativo</span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={active === l.href ? 'active' : undefined}>{l.label}</a>
          ))}
        </nav>
        <a className="nav-cta" href="#contacto">Contacto</a>
        <button
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="navSheet"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span />
        </button>
      </div>
      <div className="nav-sheet" id="navSheet">
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
      </div>
    </header>
  );
}
