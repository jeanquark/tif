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
		console.log('[Service Worker] data: ', data)
    }

    var options = {
        body: data.content,
        icon: '/images/icon.png',
        // icon: data.icon,
        badge: '/images/icon.png',
		// badge: data.badge,
		
		vibrate: [200, 100, 200, 100, 200, 100, 200],
		data: {
			link: 'http://www.google.com'
		}
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
    // event.waitUntil(self.registration.showNotification(data, options))
})

// self.addEventListener('pushsubscriptionchange', function() {
//     // do something, usually resubscribe to push and
//     // send the new subscription details back to the
//     // server via XHR or Fetch
//     console.log('[Service Worker] Pushsubscription change')
//     alert('abc')
// })

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	console.log('[Service Worker] notificationclick event: ', event)
	console.log('event: ', event)
	console.log('event.notification: ', event.notification)
	console.log('event.notification.data: ', event.notification.data)
	event.waitUntil(
	  	clients.openWindow(`${event.notification.data.link}`)
	);
  })