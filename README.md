# ACRES Platform

Plataforma demo para una propuesta de automatizacion de juntas de accionistas, gobernanza corporativa y generacion documental asistida por IA para ACRES Sociedad Titulizadora.

## Que Incluye

- Landing interactiva para presentar la propuesta.
- Dashboard de gobernanza y estructura accionarial.
- Modulos para asistencia, quorum, votacion, actas y seguimiento de acuerdos.
- Generador de documentos legales conectado a Gemini API.
- Chat corporativo IA para consultas sobre gobernanza, fideicomisos y juntas.
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

Esta plataforma es una demo/propuesta. La IA acelera tareas operativas como transcripcion, resumen, conteo preliminar y redaccion de borradores, pero todo documento, quorum, voto y acuerdo debe ser validado por abogados antes de su uso formal.
