// No-op service worker — suppresses browser 404 for sw.js requests
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
