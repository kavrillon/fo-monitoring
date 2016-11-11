import config from './scripts/config/Config';

const cacheName = `${config.shellCacheName}-v1`;
const dataCacheName = `${config.dataCacheName}-v1`;
const filesToCache = [
    '',
    'index.html',
    'app.js',
    'app.css',
    'fonts/303098_0_0.eot',
    'fonts/303098_0_0.ttf',
    'fonts/303098_0_0.woff',
    'fonts/303098_0_0.woff2',
    'fonts/303098_1_0.eot',
    'fonts/303098_1_0.ttf',
    'fonts/303098_1_0.woff',
    'fonts/303098_1_0.woff2',
    'fonts/303098_2_0.eot',
    'fonts/303098_2_0.ttf',
    'fonts/303098_2_0.woff',
    'fonts/303098_2_0.woff2',
    'fonts/303098_3_0.eot',
    'fonts/303098_3_0.ttf',
    'fonts/303098_3_0.woff',
    'fonts/303098_3_0.woff2',
    'fonts/303098_4_0.eot',
    'fonts/303098_4_0.ttf',
    'fonts/303098_4_0.woff',
    'fonts/303098_4_0.woff2',
    'fonts/303098_5_0.eot',
    'fonts/303098_5_0.ttf',
    'fonts/303098_5_0.woff',
    'fonts/303098_5_0.woff2',
    'fonts/303098_6_0.eot',
    'fonts/303098_6_0.ttf',
    'fonts/303098_6_0.woff',
    'fonts/303098_6_0.woff2',
    'fonts/303098_7_0.eot',
    'fonts/303098_7_0.ttf',
    'fonts/303098_7_0.woff',
    'fonts/303098_7_0.woff2',
    'fonts/303098_8_0.eot',
    'fonts/303098_8_0.ttf',
    'fonts/303098_8_0.woff',
    'fonts/303098_8_0.woff2',
    'fonts/303098_9_0.eot',
    'fonts/303098_9_0.ttf',
    'fonts/303098_9_0.woff',
    'fonts/303098_9_0.woff2',
    'fonts/303098_A_0.eot',
    'fonts/303098_A_0.ttf',
    'fonts/303098_A_0.woff',
    'fonts/303098_A_0.woff2',
    'fonts/303098_B_0.eot',
    'fonts/303098_B_0.ttf',
    'fonts/303098_B_0.woff',
    'fonts/303098_B_0.woff2',
    'images/icon-144x144.png',
    'images/icon-152x152.png',
    'images/icon-192x192.png',
    'images/icon-384x384.png',
    'images/favicon.ico',
    'images/ic_add_white_24px.svg',
    'images/ic_info_outline_24px.svg',
    'images/ic_menu_24px.svg',
    'images/ic_refresh_white_24px.svg',
    'images/side-nav-bg@2x.jpg'
];

self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    console.log('[Service Worker] Fetch', e.request.url);


    // var data = '?cards=open&card_fields=name,labels&fields=name,desc&key=' + Trello.key() + '&token=' + Trello.token();
    // var url = 'https://api.trello.com/1/boards/577130dfed8fabf757eddc60/lists' + data;

    var dataUrl = `${config.trello.url}${config.trello.filters}`;

    if (e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(
            caches.open(dataCacheName).then((cache) => {
                return fetch(e.request).then((response) => {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then((response) => {
                return response || fetch(e.request);
            })
        );
    }
});
