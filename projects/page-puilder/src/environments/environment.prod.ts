export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'https://api.yourdomain.com/api',
  apiBaseUrl: process.env['API_BASE_URL'] || 'https://api.yourdomain.com',
  previewUrl: process.env['PREVIEW_URL'] || 'https://preview.yourdomain.com',
  frontendUrl: process.env['FRONTEND_URL'] || 'https://yourdomain.com'
};
