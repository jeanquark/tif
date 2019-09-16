self.addEventListener('fetch', event => {
    // console.log('[Service Worker] Fetch event called')
    event.respondWith(
        caches
            .match(event.request)
            .then(response => {
                return response || fetch(event.request)
            })
            .catch(() => {
                return caches.match('offline')
            })
    )
})

// self.addEventListener("install", function(event) {
//   console.log("[Service Worker] Installing Service Worker ...", event);
// });

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ....', event)
    return self.clients.claim()
})

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Notification received', event)

    var data = { title: 'New!', content: 'Something new happened!' }
    if (event.data) {
        data = JSON.parse(event.data.text())
        // data = JSON.parse(event.data.json());
    }

    var options = {
        body: data.content,
        icon: '/images/icon.png',
        badge: '/images/icon.png'
        // vibrate: [200, 100, 200, 100, 200, 100, 200],
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('pushsubscriptionchange', function() {
    // do something, usually resubscribe to push and
    // send the new subscription details back to the
    // server via XHR or Fetch
    console.log('[Service Worker] Pushsubscription change')
    alert('abc')
})
