const CACHE_NAME='kitappwa-cache-v1';
const urlsToCache=[
    './index.html','./style.css','./app.js','./manifest.json',
    './icons/baykus.png','./sesler/jungle.mp3','./sesler/owl.mp3'
];

self.addEventListener('install',event=>{
    event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});

self.addEventListener('fetch',event=>{
    event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));
});
