import type { Metadata, Viewport } from 'next';
import { IconSprite } from '@/components/Icon';
import './globals.css';

export const metadata: Metadata = {
  title: 'BioLab Nativo — Panel del invernadero',
  description: 'Monitoreo y control del invernadero BioLab Nativo: estación meteorológica, ventilación, riego y humedad.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <IconSprite />
        {children}
      </body>
    </html>
  );
}
