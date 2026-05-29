# GOBIA - Software interno para juntas de ACRES

GOBIA es una aplicacion operativa, no una landing. Esta pensada para que ACRES gestione internamente juntas virtuales de accionistas: asistencia, poderes, quorum, votaciones, acuerdos, actas, reportes y evidencia auditable.

## Que hace ahora

- Login demo para abogados y administradores.
- Dashboard con juntas programadas, finalizadas, empresas registradas y asistencia promedio.
- Registro de empresas con razon social, RUC, direccion, correo y tipo societario.
- Registro de accionistas con nombre, DNI/RUC, correo, porcentaje accionario y empresa.
- Control de asistentes importados desde Google Meet.
- Calculo de quorum por acciones representadas.
- Votacion por acuerdo dentro de la plataforma.
- Conteo ponderado por acciones, no solo por persona.
- Generacion de acta/reporte con IA desde backend.
- Exportacion de actas a PDF y Word.
- Historial de actas, buscador, filtros y logs de auditoria.
- Modo oscuro.
- Registro conceptual de evidencia con hash SHA-256 para trazabilidad blockchain.

## Arquitectura

- Frontend: Next.js + React + TypeScript + Tailwind CSS.
- Backend: Next.js API Routes.
- IA: Gemini API llamada desde el backend.
- Seguridad de API key: `GEMINI_API_KEY` vive solo en `.env.local`.

El navegador nunca recibe la API key.

## Variables de entorno

Crea un archivo `.env.local` en la raiz del proyecto:

```bash
GEMINI_API_KEY=tu_api_key_de_gemini
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Hay un archivo de ejemplo:

```bash
.env.example
```

Importante: no subas `.env.local` a GitHub. Ya esta cubierto por `.gitignore`.

La app funciona con datos demo aunque Supabase no este configurado. Supabase queda preparado para persistir empresas, accionistas, asambleas, votos, actas y auditoria.

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre:

```bash
http://localhost:3000
```

## Build

```bash
npm run build
```

## Produccion

```bash
npm run build
npm run start
```

## Despliegue

Como GOBIA ahora tiene backend, no debe desplegarse como GitHub Pages estatico. Usa una plataforma que soporte Next.js con API routes, por ejemplo:

- Vercel
- Render
- Railway
- VPS propio

En produccion configura `GEMINI_API_KEY` como variable secreta del servidor.

## Nota legal y de seguridad

La IA genera borradores y apoyo operativo. Todo quorum, poder, voto, acuerdo, acta y documento debe ser validado por abogados de ACRES antes de uso formal.

Para blockchain, la recomendacion es registrar hashes de evidencia o documentos, no datos sensibles en texto plano.
