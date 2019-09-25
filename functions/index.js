const functions = require('firebase-functions'),
    moment = require('moment'),
    unirest = require('unirest'),
    webpush = require('web-push')

// Log messages are accessible online on the Firebase console

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')
admin.initializeApp()

exports.listenToEventHomeTeamScoreUpdate = functions.database.ref('/events/{eventId}/notificationStatus').onUpdate(async (change, context) => {
    console.log('change.before.val(): ', change.before.val())
    console.log('change.after.val(): ', change.after.val())
    console.log('context: ', context)
    console.log('context.params: ', context.params)
    console.log('context.params.eventId: ', context.params.eventId)


    const event = change.after.val()
	const eventId = context.params.eventId
    let eventType

    // 1) Determine event's type (game starts or game ends)
    if (change.before.val().statusShort === 'NS' && event.statusShort === '1H') {
    	// Event has started
    	eventType = 'game_starts'
    	console.log('eventType: game_starts')
    }
    if (change.before.val().statusShort === '2H' && event.statusShort === 'FT') {
    	// Event has ended
    	eventType = 'game_ends'
    	console.log('eventType: game_ends')
    }

    if (eventType) {
    	// 2) Initialize Webpush module with our Vapid keys
		const vapidPublicKey = functions.config().vapid.public_key
	    const vapidPrivateKey = functions.config().vapid.private_key
	    webpush.setVapidDetails('mailto:thisisfan2018@gmail.com', vapidPublicKey, vapidPrivateKey)


		// 3) Fetch all users subscribed to both teams
		const homeTeamSubscriptions = await admin
	        .database()
	        .ref('/subscriptions')
	        .orderByChild(`team_${eventType}`)
	        .equalTo(`${event.homeTeam_id}_${eventType}`)
			.once('value')

		const awayTeamSubscriptions = await admin
	        .database()
	        .ref('/subscriptions')
	        .orderByChild(`team_${eventType}`)
	        .equalTo(`${event.awayTeam_id}_${eventType}`)
			.once('value')

		// 4) Define message title & content
		let title
		let content
		if (eventType === 'game_starts') {
			title = `Game starts ${event.homeTeam_name} vs ${event.awayTeam_name}`
			content = `Click here to play with other fans!`
		} else if (eventType === 'game_ends') {
			title = `Full time ${event.homeTeam_name} vs ${event.awayTeam_name}: ${event.homeTeam_score}-${event.awayTeam_score}`
			content = `Congratulations, you have earned $20 dollars fans!`
		}

		// 5) Send notifications to all subscribers of both teams
		homeTeamSubscriptions.forEach(subscription => {
			const pushConfig = {
				endpoint: subscription.val().endpoint,
				keys: {
					auth: subscription.val().keys.auth,
					p256dh: subscription.val().keys.p256dh
				}
			}
			webpush
				.sendNotification(
					pushConfig,
					JSON.stringify({
						title,
						content,
						icon: '/images/icons/icon_256x256.png',
						badge: '/images/icons/icon_96x96.png',
						link: `events/${eventId}`,
						vibrate: [100, 50, 100]
					})
				)
				.catch(function(error) {
					console.log('Send notification error: ', error)
				})
		})

		awayTeamSubscriptions.forEach(subscription => {
			const pushConfig = {
				endpoint: subscription.val().endpoint,
				keys: {
					auth: subscription.val().keys.auth,
					p256dh: subscription.val().keys.p256dh
				}
			}
			webpush
				.sendNotification(
					pushConfig,
					JSON.stringify({
						title,
						content,
						icon: '/images/icons/icon_256x256.png',
						badge: '/images/icons/icon_96x96.png',
						link: `events/${eventId}`,
						vibrate: [100, 50, 100]
					})
				)
				.catch(function(error) {
					console.log('Send notification error: ', error)
				})
		})
    }

    // 6) Update standings if game has ended
    if (eventType === 'game_ends') {
    	// Require to update to paid firebase because of the need to access external API (APIFootball)
    }

    
})

exports.listenToEventsAwayTeamGoalsUpdate = functions.database.ref('/events/{eventId}/notificationScore').onUpdate(async (change, context) => {
    console.log('change.before.val(): ', change.before.val())
    console.log('change.after.val(): ', change.after.val())
    console.log('context: ', context)
	const event = change.after.val()
	const eventId = context.params.eventId

    // 1) Initialize Webpush module with our Vapid keys
	const vapidPublicKey = functions.config().vapid.public_key
    const vapidPrivateKey = functions.config().vapid.private_key
    webpush.setVapidDetails('mailto:thisisfan2018@gmail.com', vapidPublicKey, vapidPrivateKey)


	// 2) Fetch all users subscribed to both teams
	const homeTeamSubscriptions = await admin
        .database()
        .ref('/subscriptions')
        .orderByChild('team_goals')
        // .equalTo(`${event.homeTeam_slug}`)
        .equalTo(`${event.homeTeam_id}_goals`)
		.once('value')

	const awayTeamSubscriptions = await admin
        .database()
        .ref('/subscriptions')
        .orderByChild('team_goals')
        // .equalTo(`${event.awayTeam_slug}`)
        .equalTo(`${event.awayTeam_id}_goals`)
		.once('value')

	// 3) Send notifications to all subscribers of both teams
	homeTeamSubscriptions.forEach(subscription => {
		const pushConfig = {
			endpoint: subscription.val().endpoint,
			keys: {
				auth: subscription.val().keys.auth,
				p256dh: subscription.val().keys.p256dh
			}
		}
		webpush
			.sendNotification(
				pushConfig,
				JSON.stringify({
					title: `${event.homeTeam_name} vs ${event.awayTeam_name}: ${event.homeTeam_score}-${event.awayTeam_score}`,
					content: "Congratulations, you've earned 20$fans!",
					icon: '/images/icons/icon_256x256.png',
					badge: '/images/icons/icon_96x96.png',
					link: `events/${eventId}`,
					vibrate: [100, 50, 100]
				})
			)
			.catch(function(error) {
				console.log('Send notification error: ', error)
			})
	})

	awayTeamSubscriptions.forEach(subscription => {
		const pushConfig = {
			endpoint: subscription.val().endpoint,
			keys: {
				auth: subscription.val().keys.auth,
				p256dh: subscription.val().keys.p256dh
			}
		}
		webpush
			.sendNotification(
				pushConfig,
				JSON.stringify({
					title: `${event.homeTeam_short} vs ${event.awayTeam_short}: ${event.homeTeam_score}-${event.awayTeam_score}`,
					content: "Congratulations, you've earned 20$fans!",
					icon: '/images/icons/icon_256x256.png',
					badge: '/images/icons/icon_96x96.png',
					link: `events/${eventId}`,
					vibrate: [100, 50, 100]
				})
			)
			.catch(function(error) {
				console.log('Send notification error: ', error)
			})
	})
})
