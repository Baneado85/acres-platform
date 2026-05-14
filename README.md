# GOBIA - ACRES Platform

Plataforma demo para presentar GOBIA, una propuesta de software interno para ACRES Sociedad Titulizadora. El objetivo es automatizar juntas virtuales de accionistas: asistencia, poderes, quorum, votaciones, acuerdos, actas y evidencia auditable.

## Que Incluye

- Landing interactiva para presentar GOBIA como herramienta para ACRES.
- Dashboard de gobernanza y estructura accionarial.
- Modulos para Google Meet, asistencia, poderes, quorum, votacion, actas y seguimiento de acuerdos.
- Registro conceptual de hashes en blockchain para integridad de evidencias.
- Generador de documentos legales conectado a Gemini API.
- Chat corporativo IA para consultas sobre sesiones, votos, poderes y documentos.
- Marketplace conceptual de agentes de automatizacion.
- Modelo comercial por fases: servicio por junta, plan recurrente y plataforma enterprise.

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Gemini API

## Instalacion

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

Luego abre:

```bash
http://localhost:3000
```

## Build

```bash
npm run build
```

El proyecto esta configurado con `output: 'export'`, por lo que genera una version estatica en la carpeta `out`.

## Lint

```bash
npm run lint
```

## Gemini API

El chat y el generador de documentos permiten ingresar una API key de Gemini desde la interfaz. La key se guarda en `localStorage` del navegador bajo:

```txt
acres_gemini_key
```

Puedes obtener una key en:

[Google AI Studio](https://aistudio.google.com)

## Despliegue en GitHub Pages

El proyecto incluye el script:

```bash
npm run deploy
```

Antes de usarlo, confirma si el repositorio necesita `basePath` en `next.config.js`. Para un repo como:

```txt
https://github.com/Baneado85/acres-platform
```

normalmente se debe activar:

```js
basePath: '/acres-platform'
```

si se publica en `https://baneado85.github.io/acres-platform/`.

## Scripts

```bash
npm run dev      # servidor local
npm run build    # build de produccion/export estatico
npm run start    # servidor Next de produccion
npm run lint     # revision ESLint
npm run deploy   # build y publicacion con gh-pages
```

## Nota Legal

Esta plataforma es una demo/propuesta. La IA acelera tareas operativas como transcripcion, resumen, conteo preliminar y redaccion de borradores, pero todo documento, quorum, voto, poder y acuerdo debe ser validado por abogados antes de su uso formal. El componente blockchain debe registrar evidencias o hashes, no datos sensibles en texto plano.
