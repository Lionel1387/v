# BioLab Nativo — Backend

API en NestJS que lee y escribe la base MySQL de `database/`. La usan el panel (`panel/`, puerto 3001) y la sección "En vivo" de la web pública (`vivero/`, puerto 3000).

## Puesta en marcha

1. Levantar MySQL (desde `database/`, con su `.env` copiado de `.env.example`):

   ```bash
   docker compose up -d
   ```

   Los archivos de `database/init/` se ejecutan solos **solo la primera vez**, cuando el volumen está vacío. Si la base ya existía, correr una vez a mano los que falten, en orden:

   ```bash
   docker exec -i invernadero_mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < init/002_ajustes_panel.sql
   docker exec -i invernadero_mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < init/003_datos_iniciales.sql
   docker exec -i invernadero_mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < init/004_configuracion.sql
   ```

2. Copiar `.env.example` a `.env` (mismos datos que `database/.env`) y arrancar:

   ```bash
   npm install
   npm run start:dev   # http://localhost:4000
   ```

## Endpoints

| Método | Ruta | Cuerpo | Qué hace |
| --- | --- | --- | --- |
| GET | `/invernadero` | — | Estado actual: equipos, última humedad de cada sensor, último registro de estación y ambiente |
| GET | `/invernadero/eventos` | — | Server-Sent Events: el mismo estado, al conectarse, ante cada cambio y cada 10 s |
| PATCH | `/invernadero/ventiladores/:id` | `{ "encendido": true }` | Prende o apaga un ventilador (`:id` = `todos` para todos) |
| PATCH | `/invernadero/valvulasInternas/:id` | `{ "encendida": true }` | Electroválvula de una mesa (`:id` = `todas` para todas) |
| PATCH | `/invernadero/valvulasExternas/:id` | `{ "encendida": true }` | Electroválvula de un cantero (`:id` = `todas` para todas) |
| PATCH | `/invernadero/automatico/:grupo` | `{ "activo": true }` | Modo automático de `ventilacion`, `riegoInterno` o `riegoExterno` |
| GET | `/configuracion` | — | `{ "configuracion": … }` con las reglas del modo automático (`null` si nunca se guardaron) |
| PUT | `/configuracion` | Configuración completa | Guarda las reglas (forma de `src/configuracion/configuracion.types.ts`) |

La respuesta de `GET /invernadero` tiene la forma de `src/invernadero/invernadero.types.ts`, la misma que usa el panel.

## Modo automático

`src/automatico/` revisa las reglas cada 15 segundos para los grupos que están en automático y abre o cierra electroválvulas y ventiladores. Cada apertura queda en la tabla `Ciclo_Riego`, que se usa para la espera entre ciclos, el tiempo máximo por ciclo y el máximo diario. Las decisiones están en `reglas.ts`, con sus pruebas en `reglas.spec.ts` (`npm test`).

Los horarios y días se evalúan en la hora de Córdoba (`TZ`, por defecto `America/Argentina/Cordoba`). MySQL guarda las fechas en UTC.

## Pendiente

- Endpoint para que el firmware cargue mediciones.
- Que el firmware lea el estado de los equipos para prenderlos y apagarlos de verdad.
- Autenticación para los endpoints PATCH: ahora cualquiera que llegue a la API puede prender equipos.
