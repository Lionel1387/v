import type { Metadata, Viewport } from 'next';
import { IconSprite } from '@/components/Icon';
import { LightboxProvider } from '@/components/Lightbox';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'BioLab Nativo — Corredor educativo',
  description:
    'Corredor Educativo BioLab Nativo: espacio de educación ambiental del ISEP en Córdoba con invernadero, huerta agroecológica, bosque urbano y compostaje.',
  openGraph: {
    title: 'BioLab Nativo — Corredor educativo',
    description: 'Un aula abierta para aprender biodiversidad, producción vegetal y sustentabilidad.',
    images: ['/img/hoy-06.jpg'],
    locale: 'es_AR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Sin JavaScript, las secciones animadas se muestran igual */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.statement .w{opacity:1!important}`}</style>
        </noscript>
        <IconSprite />
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}
