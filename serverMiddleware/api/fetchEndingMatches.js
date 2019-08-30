const express = require("express"),
      moment = require("moment"),
      admin = require("firebase-admin"),
      bodyParser = require('body-parser'),
      slugifyFunction = require("../../helpers/slugify"),
      unirest = require("unirest");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function getFixtureById (fixture) {
    const url = `https://api-football-v1.p.rapidapi.com/fixtures/id/${fixture}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

function getLeagueStanding (league) {
    const url = `https://api-football-v1.p.rapidapi.com/leagueTable/${league}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

function getMatchStatistics (fixture) {
    const url = `https://api-football-v1.p.rapidapi.com/statistics/fixture/${fixture}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

// To be called when new competition is added as a POST request with league_id as body data
module.exports = app.use(async function(req, res, next) {
    try {
        // 1) First, retrieve all events that have an elapsed time of above 85 min
        const matchesArray = [];
        const endingMatches = await admin.database().ref('/events_new3').orderByChild('statusShort').equalTo('2H').once('value');
        endingMatches.forEach(match => {
            console.log('match.elapsed: ', match.val().elapsed);
            if (parseInt(match.val().elapsed) > 85) {
                matchesArray.push({
                    id: match.val().id, 
                    league_id: match.val().league_id,
                    league_slug: match.val().league_slug,
                    elapsed: match.val().elapsed
                });
            }
        });

        console.log('matchesArray: ', matchesArray);

        // 2) Second, make request to API-football for every ending match
        let updates = {};
        let updatesLeagueStanding = {};
        const updateLeagueStanding = {};
        const getStatisticsArray = [];

        for (let match of matchesArray) {
            const response = await getFixtureById(match.id);
            Object.values(response.body.api.fixtures).forEach(fixture => {
                console.log('match: ', match);
                const id = fixture.fixture_id;
                updates[`/events_new3/${id}/status`] = fixture.status;
                updates[`/events_new3/${id}/statusShort`] = fixture.statusShort;
                updates[`/events_new3/${id}/goalsHomeTeam`] = fixture.goalsHomeTeam;
                updates[`/events_new3/${id}/goalsVisitorTeam`] = fixture.goalsAwayTeam;
                updates[`/events_new3/${id}/final_score`] = fixture.final_score;
                updates[`/events_new3/${id}/penalty`] = fixture.penalty;

                // If match has ended, add league id to updateLeagueStanding array
                // if (fixture.statusShort === 'FT') {
                //     updateLeagueStanding[fixture.league_id] = {
                //         'id': fixture.league_id,
                //         'slug' : match.league_slug
                //     };
                // }

                // If match has ended, add fixture id to getStatisticsArray
                if (fixture.statusShort === 'FT') {
                    getStatisticsArray.push(id);
                }
            });
        }

        console.log('updateLeagueStanding: ', updateLeagueStanding);
        console.log('getStatisticsArray: ', getStatisticsArray);

        // for (let league in updateLeagueStanding) {
        //     const league_id = updateLeagueStanding[league].id;
        //     const league_slug = updateLeagueStanding[league].slug;

        //     const response = await getLeagueStanding(league_id);
        //     Object.values(response.body.api.standings).forEach(teams => {
        //         teams.forEach(team => {
        //             updates[`/standings_new3/${league_slug}/standing/${team.rank}`] = team;
        //         });
        //     });
        //     updates[`/standings_new3/${league_slug}/last_updated`] = moment().format('YYYY-MM-DD HH:mm');
        // }

        for (let match of getStatisticsArray) {
            const response = await getMatchStatistics(match);
            updates[`/events_new3/${id}/statistics`] = response.body.api.statistics;
        }

        const snapshot = await admin.database().ref().update(updates);

        console.log('Done!');
        res.send(`GET request to APIFootball to fetch ending matches succeeded!`);
    } catch (error) {
        console.log("APIFootball error: ", error);
        res.end(`GET request to APIFootball to fetch ending matches failed: ${error}`);
    }
});
