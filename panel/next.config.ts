import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Permite abrir el servidor de desarrollo desde otra PC o el celular por la IP de la red local.
  // Si la IP de esta máquina cambia, actualizarla acá y reiniciar `npm run dev`.
  allowedDevOrigins: ['192.166.0.9'],
  // Hay otro package-lock.json en la raíz del repo; esto evita que Next tome esa carpeta como raíz.
  turbopack: { root: __dirname },
};

export default nextConfig;
