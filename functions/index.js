const functions = require('firebase-functions'),
    moment = require('moment'),
    unirest = require('unirest'),
    webpush = require('web-push')

// Log messages are accessible online on the Firebase console

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')
admin.initializeApp()

// Cloud functions that reacts to update in events node and triggers a push notification to subscribed users
// exports.listenToEventUpdate = functions.database.ref('/events/{eventId}').onUpdate(async (change, context) => {
//     const VapidPrivateKey = functions.config().vapid.private_key
//     console.log('change.before.val(): ', change.before.val())
//     console.log('change.after.val(): ', change.after.val())
//     console.log('context: ', context)
//     const event = change.after.val()
//     const oldStatusShort = change.before.val().statusShort
//     const newStatusShort = change.after.val().statusShort
//     const oldHomeTeamScore = change.before.val().homeTeam_score
//     const newHomeTeamScore = change.after.val().homeTeam_score
//     const oldAwayTeamScore = change.before.val().awayTeam_score
//     const newAwayTeamScore = change.after.val().awayTeam_score
//     // console.log('oldStatusShort', oldStatusShort)
//     // console.log('newStatusShort', newStatusShort)
//     // console.log('oldHomeTeamGoals', oldHomeTeamGoals)
//     // console.log('newHomeTeamGoals', newHomeTeamGoals)
//     // console.log('oldVisitorTeamGoals', oldVisitorTeamGoals)
// 	// console.log('newVisitorTeamGoals', newVisitorTeamGoals)
// 	let change2 = ''
// 	if (oldStatusShort !== newStatusShort) {
// 		console.log('Status changed!')
// 		change2 = 'status'
// 	}
// 	if (oldHomeTeamScore !== newHomeTeamScore) {
// 		console.log('HomeTeam scored!')
// 		change2 = 'score'
// 	}
// 	if (oldAwayTeamScore !== newAwayTeamScore) {
// 		console.log('AwayTeam scored!')
// 		change2 = 'score'
// 	}


//     // 1) Initialize Webpush module with our Vapid keys
// 	// const vapidPublicKey = 'BImRhHlpuwUWML_D09_SN1WfBU8XwCpDW8DH20Blrc_xeIl0LLC5rqxhT-P-l-h8RKSnBTiKAJ-4YdDgLh96QxU'
// 	const vapidPublicKey = functions.config().vapid.public_key
//     const vapidPrivateKey = functions.config().vapid.private_key
//     webpush.setVapidDetails('mailto:thisisfan2018@gmail.com', vapidPublicKey, vapidPrivateKey)


// 	// 2) Fetch all users subscribed to both teams
// 	// const homeTeamSubscriptions = await admin
//  //        .database()
//  //        .ref('/subscriptions')
//  //        .orderByChild('team_goals')
//  //        .equalTo(`${event.homeTeam_slug}`)
// 	// 	.once('value')

// 	// const awayTeamSubscriptions = await admin
//  //        .database()
//  //        .ref('/subscriptions')
//  //        .orderByChild('team_goals')
//  //        .equalTo(`${event.awayTeam_slug}`)
// 	// 	.once('value')



// 	// 3) Send notifications to all subscribers of both teams
// 	// homeTeamSubscriptions.forEach(subscription => {
// 	// 	const pushConfig = {
// 	// 		endpoint: subscription.val().endpoint,
// 	// 		keys: {
// 	// 			auth: subscription.val().keys.auth,
// 	// 			p256dh: subscription.val().keys.p256dh
// 	// 		}
// 	// 	}
// 	// 	// console.log("pushConfig: ", pushConfig)
// 	// 	webpush
// 	// 		.sendNotification(
// 	// 			pushConfig,
// 	// 			JSON.stringify({
// 	// 				title: `${event.homeTeam_short} vs ${event.awayTeam_short}: ${event.homeTeam_score}-${event.awayTeam_score}`,
// 	// 				content: "Congratulations, you've earned 20$fans!",
// 	// 				icon: '/static/images/icons/icon_256x256.png',
// 	// 				badge: '/static/images/icons/icon_96x96.png',
// 	// 				vibrate: [100, 50, 100]
// 	// 			})
// 	// 		)
// 	// 		.catch(function(error) {
// 	// 			console.log('Send notification error: ', error)
// 	// 		})
// 	// })

// 	// awayTeamSubscriptions.forEach(subscription => {
// 	// 	const pushConfig = {
// 	// 		endpoint: subscription.val().endpoint,
// 	// 		keys: {
// 	// 			auth: subscription.val().keys.auth,
// 	// 			p256dh: subscription.val().keys.p256dh
// 	// 		}
// 	// 	}
// 	// 	// console.log("pushConfig: ", pushConfig)
// 	// 	webpush
// 	// 		.sendNotification(
// 	// 			pushConfig,
// 	// 			JSON.stringify({
// 	// 				title: `${event.homeTeam_short} vs ${event.awayTeam_short}: ${event.homeTeam_score}-${event.awayTeam_score}`,
// 	// 				content: "Congratulations, you've earned 20$fans!",
// 	// 				icon: '/static/images/icons/icon_256x256.png',
// 	// 				badge: '/static/images/icons/icon_96x96.png',
// 	// 				vibrate: [100, 50, 100]
// 	// 			})
// 	// 		)
// 	// 		.catch(function(error) {
// 	// 			console.log('Send notification error: ', error)
// 	// 		})
// 	// })
// })

exports.listenToEventHomeTeamScoreUpdate = functions.database.ref('/events/{eventId}/notificationStatus').onUpdate(async (change, context) => {
    console.log('change.before.val(): ', change.before.val())
    console.log('change.after.val(): ', change.after.val())
    console.log('context: ', context)
    const event = change.after.val()
    let eventType

    // 1) Determine event's type (game starts or game ends)
    if (change.before.val().statusShort === 'NS' && event.statusShort === '1H') {
    	// Event has started
    	eventType = 'game_starts'
    }
    if (event.statusShort === 'FT') {
    	// Event has ended
    	eventType = 'game_ends'
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
			title = `Full time ${event.homeTeam_short} vs ${event.awayTeam_short}: ${event.homeTeam_score}-${event.awayTeam_score}`
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
						icon: '/static/images/icons/icon_256x256.png',
						badge: '/static/images/icons/icon_96x96.png',
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
						icon: '/static/images/icons/icon_256x256.png',
						badge: '/static/images/icons/icon_96x96.png',
						vibrate: [100, 50, 100]
					})
				)
				.catch(function(error) {
					console.log('Send notification error: ', error)
				})
		})
    }

    
})

exports.listenToEventsAwayTeamGoalsUpdate = functions.database.ref('/events/{eventId}/notificationScore').onUpdate(async (change, context) => {
    console.log('change.before.val(): ', change.before.val())
    console.log('change.after.val(): ', change.after.val())
    console.log('context: ', context)
    const event = change.after.val();

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
					title: `${event.homeTeam_short} vs ${event.awayTeam_short}: ${event.homeTeam_score}-${event.awayTeam_score}`,
					content: "Congratulations, you've earned 20$fans!",
					icon: '/static/images/icons/icon_256x256.png',
					badge: '/static/images/icons/icon_96x96.png',
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
					icon: '/static/images/icons/icon_256x256.png',
					badge: '/static/images/icons/icon_96x96.png',
					vibrate: [100, 50, 100]
				})
			)
			.catch(function(error) {
				console.log('Send notification error: ', error)
			})
	})
})
