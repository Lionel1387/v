# BioLab Nativo — Panel del invernadero

Panel de monitoreo y control con diseño estilo Apple (barra lateral de macOS en escritorio, tab bar de iOS en el celular, modo claro y oscuro automático). Mismo stack que `vivero/`: Next.js 16 (App Router) + React 19 + TypeScript y CSS propio, sin librerías de UI.

## Comandos

```bash
npm install
npm run dev      # desarrollo en http://localhost:3001
npm run build    # compilación de producción
npm start        # sirve la compilación en el puerto 3001
```

Usa el puerto 3001 para no chocar con `vivero/` ni con el backend, que usan el 3000.

## Secciones

| Vista | Contenido |
| --- | --- |
| Estación meteorológica (`#estacion`) | Temperatura, velocidad y dirección del viento (brújula), humedad y precipitación |
| Datos internos (`#internos`) | Ambiente (temperatura y humedad), 4 ventiladores, 6 electroválvulas con su último encendido, humedad de las 6 mesas |
| Datos externos (`#externos`) | 4 electroválvulas (una por cantero) y la humedad de cada cantero |

| Configuración (`#config`) | Reglas del modo automático: riego interno, riego externo y ventilación |

Ventiladores y electroválvulas se pueden encender de a uno (interruptor de cada tarjeta) o todos juntos (botón del grupo). El botón **Automático** de cada grupo deja los equipos en manos de las reglas de Configuración: mientras está activo, los controles manuales quedan bloqueados.

### Configuración

- **Riego interno:** humedad mínima para arrancar; corte por humedad objetivo o por tiempo fijo; tiempo máximo de cada electroválvula; espera entre ciclos; máximo diario; horarios permitidos y horarios bloqueados (franjas que se pueden agregar, activar o borrar); días de la semana.
- **Riego externo:** las mismas reglas para todos los canteros o individuales por cantero. Cada regla (humedad mínima, humedad objetivo, duración por ciclo, espera, horario y días) se habilita o deshabilita con su propio interruptor.
- **Ventilación:** temperatura de encendido y de apagado, tiempo mínimo entre cambios de estado y horarios permitidos.

Los umbrales de humedad configurados también definen cuándo una mesa o un cantero muestra "Necesita riego". La configuración se guarda sola en el backend (`PUT /configuracion`) un instante después de cada cambio, y el backend la aplica a los grupos que están en modo automático. El botón "Restablecer valores" vuelve a los valores de `src/lib/config.ts`.

## Estructura

```
src/
├── app/               layout, página, estilos globales e ícono
├── components/
│   ├── Panel.tsx      barra lateral, tab bar y cambio de vista
│   ├── ui.tsx         grupos, interruptor, botón Automático, tarjetas de equipo y de humedad
│   ├── ajustes.tsx    controles de Configuración (listas, stepper, segmentado, días, franjas)
│   └── vistas/        Estacion, Internos, Externos y Configuracion
└── lib/
    ├── data.ts        tipos (los que devuelve el backend) y umbrales
    ├── config.ts      tipos y valores iniciales de las reglas automáticas
    ├── useConfiguracion.ts  configuración guardada en el backend
    ├── useInvernadero.ts  estado en vivo (SSE) y acciones sobre los equipos
    └── format.ts      "hace X min", puntos cardinales, estado de humedad
```

## Conexión con el backend

El panel lee y escribe todo en el backend (`backend/`, por defecto `http://localhost:4000`; se cambia con `NEXT_PUBLIC_API_URL`):

- `useInvernadero` recibe el estado por Server-Sent Events (`/invernadero/eventos`), así que los cambios hechos desde otro panel o por el modo automático aparecen al instante. Los interruptores mandan `PATCH` al backend.
- `useConfiguracion` lee y guarda las reglas con `GET` y `PUT /configuracion`.

Los umbrales de humedad (`UMBRAL_RIEGO` = 35 %, `UMBRAL_SATURADO` = 80 %) están en `src/lib/data.ts`.
