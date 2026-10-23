// Hora local para los horarios y días del modo automático
process.env.TZ ??= 'America/Argentina/Cordoba';

import { NestFactory } from '@nestjs/core';
import { networkInterfaces } from 'node:os';
import { AppModule } from './app.module';

// IPs de esta PC en la red local, para poder abrir la web y el panel desde el celular
const ipsLocales = () =>
  Object.values(networkInterfaces()).flat().filter(i => i?.family === 'IPv4').map(i => i!.address);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const permitidos = (process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001').split(',');
  // La web pública (3000) y el panel (3001) llaman a la API desde el navegador.
  // Además de CORS_ORIGINS se aceptan las mismas páginas abiertas por la IP de esta PC (http://192.166.0.3:3001).
  app.enableCors({
    origin: (origen: string | undefined, listo: (err: Error | null, permitir?: boolean) => void) => {
      if (!origen || permitidos.includes(origen)) return listo(null, true);
      try {
        const { hostname, port } = new URL(origen);
        listo(null, ['3000', '3001'].includes(port) && ipsLocales().includes(hostname));
      } catch {
        listo(null, false);
      }
    },
  });
  // 4000 para no chocar con vivero/ (3000) ni con panel/ (3001)
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
