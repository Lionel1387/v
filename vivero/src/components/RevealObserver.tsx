'use client';

import { useEffect } from 'react';

// Marca con la clase "in" cada elemento .reveal cuando entra en pantalla.
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
