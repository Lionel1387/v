# BiolabNativo — landing en Next.js

Next.js 16 (App Router) + React 19 + TypeScript. Sin librerías de UI ni de animación: los estilos son CSS propio (`app/globals.css`) y las animaciones usan CSS, `IntersectionObserver` y eventos de scroll.

## Comandos

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # compilación de producción
npm start        # sirve la compilación
```

## Estructura

- `app/layout.tsx` — metadatos, sprite de íconos y proveedor del visor de imágenes.
- `app/page.tsx` — arma la página con las secciones.
- `components/` — una pieza por sección. Los que necesitan interacción son Client Components: `Navbar`, `Hero`, `Statement`, `History`, `Rail`, `Compare`, `Gallery`, `Lightbox`, `RevealObserver`.
- `lib/data.ts` — textos, etapas de la historia y qué foto va en cada lugar.
- `lib/photos.ts` — medidas y texto alternativo de cada foto de `public/img`.

## Para completar antes de publicar

- Contacto: `lib/data.ts` (`contact`: WhatsApp, email, Instagram) y `components/Contact.tsx` (dirección y horarios).
- Dominio: definí `NEXT_PUBLIC_SITE_URL` para que las imágenes de redes sociales (Open Graph) tengan URL absoluta.
