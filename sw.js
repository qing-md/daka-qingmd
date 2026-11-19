/* 离线缓存：让 App 装到桌面后，即使网络/托管地址抽风也能秒开 */
const CACHE = 'aiai-training-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;            // 云端写操作（GitHub）不走缓存
  var url = new URL(e.request.url);
  var isHtml = url.pathname.endsWith('/') || url.pathname.endsWith('index.html') || url.pathname.endsWith('.html');
  if (!isHtml) return;                                // 只缓存页面外壳，数据走网络
  e.respondWith(
    fetch(e.request).then(function (r) {
      var c = r.clone();
      caches.open(CACHE).then(function (cs) { cs.put(e.request, c); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
