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
		const competitions = req.body.competitions
		console.log('competitions: ', competitions)
		
		// await writeJsonFile('./helpers/activeCompetitions7.json', JSON.stringify(competitions, null, 4), {chown: false, mode: false})

		const writeFile = util.promisify(fs.writeFile)
		await writeFile(`${publicPath}/competitions.json`, JSON.stringify(competitions, null, 4))
		
		res.send(competitions)
		
    } catch (error) {
        console.log('error: ', error)
        res.end(`POST request to writeCompetitionsOnFile failed: ${error}`)
    }
})
