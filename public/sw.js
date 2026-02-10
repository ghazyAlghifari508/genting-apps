// This file is disabled to prevent stale caching issues during development.
// active workers are being unregistered via layout.tsx
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());
