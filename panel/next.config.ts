import type { NextConfig } from 'next';
import { networkInterfaces } from 'node:os';

const nextConfig: NextConfig = {
  // Permite abrir el servidor de desarrollo desde el celular u otra PC por la IP de la red local.
  // Toma las IPs de esta máquina al arrancar `npm run dev`: si cambia la IP, alcanza con reiniciarlo.
  allowedDevOrigins: Object.values(networkInterfaces()).flat()
    .filter(i => i?.family === 'IPv4' && !i.internal)
    .map(i => i!.address),
  // Hay otro package-lock.json en la raíz del repo; esto evita que Next tome esa carpeta como raíz.
  turbopack: { root: __dirname },
};

export default nextConfig;
