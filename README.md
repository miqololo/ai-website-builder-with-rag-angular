# Brandomize – Angular Website Builder

Angular-based frontend for the Brandomize website builder platform. Create, customize, preview, and publish SEO-friendly websites using a visual page builder with AI-assisted content generation.

This is the **Angular** variant of the Brandomize frontend. It works with the [ai-website-builder-with-rag](../ai-website-builder-with-rag) backend (NestJS).

## Tech Stack

- **Angular 21**
- **TypeScript 5.9**
- **Tailwind CSS**
- **PrimeNG** – UI components
- **Flowbite** – Additional UI components
- **Lucide Angular** – Icons
- **ngx-translate** – i18n
- **Angular SSR** – Server-side rendering

## Project Structure

This is an Angular workspace with multiple projects:

```
ai-website-builder-with-frontend-angular/
├── projects/
│   ├── page-puilder/      # Main page builder app (port 4200)
│   │   ├── src/
│   │   │   ├── app/       # Pages, auth, builder, core
│   │   │   ├── core/      # API, services, guards, stores
│   │   │   └── environments/
│   │   └── ...
│   ├── preview/           # Preview app (port 4201)
│   │   └── src/
│   └── brandomize-ui-kit/ # Reusable UI component library
│       └── src/lib/       # Primitives, components, themes
├── ai-prompts/            # AI system documentation
├── angular.json
├── package.json
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- The [ai-website-builder-with-rag](../ai-website-builder-with-rag) backend running (PostgreSQL, Redis, NestJS API)

### Installation

```bash
npm install
```

### Configure API URL

Edit the environment files to point to your backend:

**page-puilder** – `projects/page-puilder/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api',      // Backend API
  apiBaseUrl: 'http://localhost:3001',
  previewUrl: 'http://localhost:4201',
  frontendUrl: 'http://localhost:4200'
};
```

**preview** – `projects/preview/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001/api'
};
```

> **Note:** The ai-website-builder-with-rag backend runs on port **3001** by default.

### Run Development Servers

**Page Builder** (main app):
```bash
npm run page-builder
```
Runs on http://localhost:4200

**Preview** (site preview):
```bash
npm run preview
```
Runs on http://localhost:4201

**Both** (in separate terminals):
```bash
# Terminal 1
npm run page-builder

# Terminal 2
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run page-builder` | Serve page builder on port 4200 |
| `npm run preview` | Serve preview app on port 4201 |
| `npm run build` | Build all projects |
| `npm run watch` | Build with watch mode |
| `npm run test` | Run unit tests |

## Key Features

- **Visual Page Builder** – Drag-and-drop style page creation
- **AI Content Generation** – AI-assisted content for sections
- **Component Library** – Reusable primitives and blocks (hero, pricing, FAQ, etc.)
- **Theming** – Theme-aware components with Tailwind
- **Preview** – Live preview of built pages
- **Authentication** – Sign in, sign up, password reset
- **Multi-language** – ngx-translate for i18n

## UI Kit (brandomize-ui-kit)

The `brandomize-ui-kit` library provides:

- **Primitives** – section, container, stack, row, grid, text, image, button
- **Components** – hero, pricing, FAQ, testimonials, CTA, blog, team, etc.
- **Animations** – Scroll-triggered animations, fade-in, slide-up
- **Theming** – CSS variables, dark/light modes

Build the library:
```bash
ng build brandomize-ui-kit
```

See `ai-prompts/SYSTEM_DOCUMENTATION.md` for component reference.

## Production Build

Set environment variables and build:

```bash
export API_URL=https://api.yourdomain.com/api
export API_BASE_URL=https://api.yourdomain.com
export PREVIEW_URL=https://preview.yourdomain.com
export FRONTEND_URL=https://yourdomain.com

ng build page-puilder --configuration production
ng build preview --configuration production
```

## Full Stack Setup

1. Start the **backend** (ai-website-builder-with-rag):
   ```bash
   cd ../ai-website-builder-with-rag
   docker compose up -d
   cd backend && npm install && cp .env.example .env
   npm run migration:push && npm run seed
   npm run start:dev
   ```

2. Start the **Angular frontend**:
   ```bash
   cd ai-website-builder-with-frontend-angular
   npm install
   npm run page-builder   # Port 4200
   npm run preview        # Port 4201 (separate terminal)
   ```

3. Access:
   - Page Builder: http://localhost:4200
   - Preview: http://localhost:4201
   - Backend API: http://localhost:3001

## Troubleshooting

### API connection errors
- Ensure the backend is running on port 3001
- Check `environment.ts` files have the correct `apiUrl` and `apiBaseUrl`

### Build errors
- Run `npm install` to ensure dependencies are installed
- Build the UI kit first: `ng build brandomize-ui-kit`

### CORS issues
- Backend must have `FRONTEND_URL` including `http://localhost:4200` for dev

## Related Projects

- [ai-website-builder-with-rag](../ai-website-builder-with-rag) – Backend (NestJS), Next.js frontend variant

## License

See repository license.
