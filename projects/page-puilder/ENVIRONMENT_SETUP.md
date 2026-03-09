# Environment Variables Setup

All URLs have been moved to environment variables for easy configuration across different environments.

## Environment Files

### Development (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiBaseUrl: 'http://localhost:3000',
  previewUrl: 'http://localhost:4201',
  frontendUrl: 'http://localhost:4200'
};
```

### Production (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.yourdomain.com/api',
  apiBaseUrl: process.env['API_BASE_URL'] || 'https://api.yourdomain.com',
  previewUrl: process.env['PREVIEW_URL'] || 'https://preview.yourdomain.com',
  frontendUrl: process.env['FRONTEND_URL'] || 'https://yourdomain.com'
};
```

## Environment Variables

### Development
- `apiUrl`: Backend API endpoint (default: `http://localhost:3000/api`)
- `apiBaseUrl`: Backend base URL without `/api` (default: `http://localhost:3000`)
- `previewUrl`: Preview server URL (default: `http://localhost:4201`)
- `frontendUrl`: Frontend application URL (default: `http://localhost:4200`)

### Production
Set these environment variables before building:
- `API_URL`: Backend API endpoint
- `API_BASE_URL`: Backend base URL
- `PREVIEW_URL`: Preview server URL
- `FRONTEND_URL`: Frontend application URL

## Usage

All services now use environment variables:

```typescript
import { environment } from '../../environments/environment';

// Use environment variables
const apiUrl = environment.apiUrl;
const previewUrl = environment.previewUrl;
```

## Files Updated

1. ✅ `core/http/http-client.service.ts` - Uses `environment.apiUrl`
2. ✅ `core/services/auth.service.ts` - Uses `environment.apiBaseUrl`
3. ✅ `services/auth.service.ts` - Uses `environment.apiUrl` and `environment.apiBaseUrl`
4. ✅ `services/pages.service.ts` - Uses `environment.apiUrl`
5. ✅ `services/ai-generator.service.ts` - Uses `environment.apiUrl` and `environment.apiBaseUrl`
6. ✅ `components/preview-area/preview-area.component.ts` - Already uses `environment.previewUrl`

## Building for Production

```bash
# Set environment variables
export API_URL=https://api.yourdomain.com/api
export API_BASE_URL=https://api.yourdomain.com
export PREVIEW_URL=https://preview.yourdomain.com
export FRONTEND_URL=https://yourdomain.com

# Build
ng build --configuration production
```

Or create a `.env` file and use a tool like `dotenv` to load it during build.
