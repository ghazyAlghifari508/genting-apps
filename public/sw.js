// This file is disabled to prevent stale caching issues during development.
// active workers are being unregistered via layout.tsx
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
