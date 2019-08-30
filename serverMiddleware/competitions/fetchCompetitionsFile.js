const express = require('express'),
    // loadJsonFile = require('load-json-file'),
    fs = require('fs'),
    util = require('util'),
    path = require('path');

const app = express()
const publicPath = path.resolve('./', 'static')

module.exports = app.use(async function(req, res, next) {
    try {
        const readFile = util.promisify(fs.readFile)
        const competitions = await readFile(`${publicPath}/competitions.json`, 'utf8')

        // const competitions = await loadJsonFile('./helpers/activeCompetitions7.json')
        res.send(competitions)
    } catch (error) {
        console.log('error: ', error)
        res.end(`GET request to fetchCompetitionsFromFile failed: ${error}`)
    }
})
