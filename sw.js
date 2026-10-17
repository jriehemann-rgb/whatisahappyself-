/* Offline-Cache für Happy Breath, Happy Habits und die Install-/Startseiten. Netz zuerst, damit Updates ankommen; ohne Netz kommt der Cache. */
var V='hb-v2';
var PRE=['./','fonts/bricolage.woff2','habits/','install/','coaching/','coaching/en/','coaching/start/','coaching/en/start/','en/','impressum/','datenschutz/','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return Promise.all(PRE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(function(res){
    if(res&&res.ok){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)})}
    return res;
  }).catch(function(){return caches.match(r).then(function(m){return m||caches.match(r,{ignoreSearch:true})})}));
});
