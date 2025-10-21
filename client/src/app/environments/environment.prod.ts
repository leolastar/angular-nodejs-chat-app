export const environment = {
  production: true,
  apiBase: '/api',
  wsUrl: window.location.origin.replace(/^http/, 'ws'),
  wsPath: '/socket.io',
  port: 4000,
};
