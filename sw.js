(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cacheName = 'fo-sprints-v1';
var dataCacheName = 'fo-sprints-data-v1';
var filesToCache = ['', 'index.html', 'app-2678ec3b87.js', 'app-7544a1cd00.css', 'fonts/303098_0_0.eot', 'fonts/303098_0_0.ttf', 'fonts/303098_0_0.woff', 'fonts/303098_0_0.woff2', 'fonts/303098_1_0.eot', 'fonts/303098_1_0.ttf', 'fonts/303098_1_0.woff', 'fonts/303098_1_0.woff2', 'fonts/303098_2_0.eot', 'fonts/303098_2_0.ttf', 'fonts/303098_2_0.woff', 'fonts/303098_2_0.woff2', 'fonts/303098_3_0.eot', 'fonts/303098_3_0.ttf', 'fonts/303098_3_0.woff', 'fonts/303098_3_0.woff2', 'fonts/303098_4_0.eot', 'fonts/303098_4_0.ttf', 'fonts/303098_4_0.woff', 'fonts/303098_4_0.woff2', 'fonts/303098_5_0.eot', 'fonts/303098_5_0.ttf', 'fonts/303098_5_0.woff', 'fonts/303098_5_0.woff2', 'fonts/303098_6_0.eot', 'fonts/303098_6_0.ttf', 'fonts/303098_6_0.woff', 'fonts/303098_6_0.woff2', 'fonts/303098_7_0.eot', 'fonts/303098_7_0.ttf', 'fonts/303098_7_0.woff', 'fonts/303098_7_0.woff2', 'fonts/303098_8_0.eot', 'fonts/303098_8_0.ttf', 'fonts/303098_8_0.woff', 'fonts/303098_8_0.woff2', 'fonts/303098_9_0.eot', 'fonts/303098_9_0.ttf', 'fonts/303098_9_0.woff', 'fonts/303098_9_0.woff2', 'fonts/303098_A_0.eot', 'fonts/303098_A_0.ttf', 'fonts/303098_A_0.woff', 'fonts/303098_A_0.woff2', 'fonts/303098_B_0.eot', 'fonts/303098_B_0.ttf', 'fonts/303098_B_0.woff', 'fonts/303098_B_0.woff2', 'images/icon-144x144.png', 'images/icon-152x152.png', 'images/icon-192x192.png', 'images/icon-384x384.png', 'images/favicon.ico', 'images/ic_add_white_24px.svg', 'images/ic_info_outline_24px.svg', 'images/ic_menu_24px.svg', 'images/ic_refresh_white_24px.svg', 'images/side-nav-bg@2x.jpg'];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(caches.open(cacheName).then(function (cache) {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
    }));
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
            if (key !== cacheName && key !== dataCacheName) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    }));
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = 'https://api.trello.com/1/';

    if (e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(caches.open(dataCacheName).then(function (cache) {
            return fetch(e.request).then(function (response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        }));
    } else {
        e.respondWith(caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        }));
    }
});

},{}]},{},[1])


//# sourceMappingURL=sw.js.map
