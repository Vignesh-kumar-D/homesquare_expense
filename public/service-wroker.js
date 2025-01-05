/// <reference lib="webworker" />
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'homesquare-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  OFFLINE_URL,
  '/logo192.png',
  '/static/css/main.chunk.css',
  '/static/js/main.chunk.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.mode === 'navigate' ||
    (event.request.method === 'GET' &&
      event.request.headers.get('accept')?.includes('text/html'))
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL).then((response) => {
          return (
            response ??
            new Response('Offline page not found', {
              status: 404,
              statusText: 'Not Found',
            })
          );
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
