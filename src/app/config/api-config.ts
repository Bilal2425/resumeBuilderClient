/**
 * Helper to dynamically determine the API base URL.
 * Under local development (localhost:4200), it routes directly to the .NET development SSL port.
 * In production (Jetson Orin Nano / Docker Nginx), it uses relative URLs (/api) proxied by Nginx.
 */
export const getApiUrl = (endpoint: string): string => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' && window.location.port === '4200') {
      return `https://localhost:7216/api/${endpoint}`;
    }
  }
  // Relative URL in production: resolves to http://<jetson-ip>/api/<endpoint>
  return `/api/${endpoint}`;
};
