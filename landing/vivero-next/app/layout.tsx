import type { Metadata, Viewport } from 'next';
import { IconSprite } from '@/components/Icon';
import { LightboxProvider } from '@/components/Lightbox';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'BiolabNativo — Vivero de especies nativas',
  description:
    'BiolabNativo: un vivero de especies nativas con invernadero, bosque urbano y jardín biodiverso, construido desde cero por estudiantes.',
  openGraph: {
    title: 'BiolabNativo — Vivero de especies nativas',
    description: 'Un invernadero, un bosque urbano y un jardín biodiverso construidos desde cero por estudiantes.',
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
