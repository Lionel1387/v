# BiolabNativo — landing en Next.js

Next.js 16 (App Router) + React 19 + TypeScript. Sin librerías de UI ni de animación: los estilos son CSS propio (`src/app/globals.css`) y las animaciones usan CSS, `IntersectionObserver` y eventos de scroll.

## Comandos

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # compilación de producción
npm start        # sirve la compilación
```

## Estructura

```
├── public/img/          fotos optimizadas para la web (las que usa el sitio)
├── src/
│   ├── app/             layout, página, estilos globales e ícono
│   ├── components/      una pieza por sección (Hero, Bento, History, Gallery…)
│   └── lib/
│       ├── data.ts      textos, etapas y qué foto va en cada lugar
│       └── photos.ts    medidas y texto alternativo de cada foto
├── fotos-originales/    fotos sin procesar, por etapa (no se publican)
└── _legacy-html/        primera versión en HTML/CSS/JS (se puede borrar)
```

Los componentes que necesitan interacción son Client Components: `Navbar`, `Hero`, `Statement`, `History`, `Rail`, `Compare`, `Gallery`, `Lightbox` y `RevealObserver`. El resto se renderiza en el servidor.

## Para completar antes de publicar

- Sección "En vivo" (`src/components/Live.tsx`): hoy muestra datos de ejemplo fijos de `enVivo` en `src/lib/data.ts`. Cuando el backend esté listo, reemplazarlos por los datos reales y poner `demo: false` para ocultar el aviso.
- Contacto: `src/lib/data.ts` (`contact`: WhatsApp, email, Instagram) y `src/components/Contact.tsx` (dirección y horarios).
- Dominio: definí `NEXT_PUBLIC_SITE_URL` para que las imágenes de redes sociales (Open Graph) tengan URL absoluta.
