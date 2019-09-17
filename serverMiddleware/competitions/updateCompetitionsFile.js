const express = require('express'),
	// writeJsonFile = require('write-json-file'),
	fs = require('fs'),
	util = require('util'),
	path = require('path'),
	bodyParser = require('body-parser');

const app = express()
const publicPath = path.resolve('./', 'static')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


module.exports = app.use(async function(req, res, next) {
    try {
		// console.log('req.body: ', req.body)
		const { competitions } = req.body
		
		const newCompetitionsArray = []
		competitions.forEach(competition => {
			if (competition.active) {
				newCompetitionsArray.push({
					name: competition.name,
					slug: competition.slug,
					apifootball_id: competition.apifootball_id
				})
			}
		})
		// console.log('newCompetitionsArray: ', newCompetitionsArray)

		const writeFile = util.promisify(fs.writeFile)
		await writeFile(`${publicPath}/activeCompetitions.json`, JSON.stringify(newCompetitionsArray, null, 4))
		
		res.send(newCompetitionsArray)
		
    } catch (error) {
        console.log('error: ', error)
        res.end(`POST request to writeCompetitionsOnFile failed: ${error}`)
    }
})
