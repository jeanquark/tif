const express = require('express'),
      moment = require('moment'),
      axios = require('axios'),
      admin = require('firebase-admin')

const app = express();

// Fetch all events that are about to start
const today = moment().format('YYYY-MM-DD');
const yesterday = moment().subtract(1, 'days').unix().toString();
const twoWeeksFromNow = moment().add(15, 'days').unix().toString();
console.log('today: ', today);
console.log('yesterday: ', yesterday);

// To be run every day
module.exports = app.use(async function (req, res, next) {
    try {
        let eventsToRemove = [];
        // 1) Fetch all events that are older than 2 days
        const oldEvents = await admin.database().ref('events_new3').orderByChild('timestamp').startAt('1').endAt(yesterday.toString()).once('value');
        oldEvents.forEach(oldEvent => {
            eventsToRemove.push(oldEvent.val());
        });

        // 2) Fetch all events that will happen in more than 2 weeks
        const futureEvents = await admin.database().ref('events_new3').orderByChild('timestamp').startAt(twoWeeksFromNow.toString()).once('value');
        futureEvents.forEach(futureEvent => {
            eventsToRemove.push(futureEvent.val());
        });

        // 2) Add those events to the events_old node
        let updates = {};
        for (let event of eventsToRemove) {
            updates['/events_old/' + event.id] = event;
            updates['/events_new3/' + event.id] = null;
        }
        
        await admin.database().ref().update(updates);

        res.send(`GET request to remove old events succeeded!`);
    } catch (error) {
        console.log(error);
        res.end(`GET request to remove old events failed: ${error}`);
    }
})