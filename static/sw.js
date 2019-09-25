// When modified, clear site data on navigator console to see the changes

self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetch event called')
    // event.respondWith(
    //     caches
    //         .match(event.request)
    //         .then(response => {
    //             return response || fetch(event.request)
    //         })
    //         .catch(() => {
    //             return caches.match('offline')
    //         })
    // )
})


self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ....', event)
    return self.clients.claim()
})

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Notification received', event)

    if (event.data) {
        data = JSON.parse(event.data.text())
		console.log('[Service Worker] data: ', data)
    }

    var options = {
        body: data.content,
        // icon: '/images/icon.png',
        icon: data.icon,
        // badge: '/images/icon.png',
		badge: data.badge,
		
		// vibrate: [200, 100, 200, 100, 200, 100, 200],
        vibrate: data.vibrate,
		data: {
            link: `http://localhost:3000/${data.link}`
		}
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
})


self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	// console.log('[Service Worker] notificationclick event: ', event)
	// console.log('event: ', event)
	// console.log('event.notification: ', event.notification)
	// console.log('event.notification.data: ', event.notification.data)
	event.waitUntil(
        clients.openWindow(`${event.notification.data.link}`)
	);
  })