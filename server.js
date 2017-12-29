const express = require('express')
const HTTP = require('http')
const HTTPS = require('https')

const request = require('request')
const secrets = require('./secrets.js')

var app = express()


var key = secrets.nasaKey


app.use(express.static('./public'))


// HTML FILES =========================================================================== 


app.get('/', function(req, res) {

	res.sendFile('./public/html/index.html', {root:'./'})

	console.log('sent index.html')

})

app.get('/Top-25', function(req, res) {

	res.sendFile('./public/html/sentry.html', {root:'./'})

	console.log('sent sentry.html')
})


// NEO API ==============================================================================


app.get('/search', function(req, res) {
	

		var nasaAPI = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${req.query.start_date}&end_date=${req.query.start_date}&api_key=${key}`
		request (nasaAPI, function(err, response, dataFromServer) {
			
			res.send(dataFromServer)
			
			console.log('single-date sent')
		})
	})

app.get('/range_search', function(req, res) {

		var nasaAPI = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${req.query.start_date}&end_date=${req.query.end_date}&api_key=${key}`
		request (nasaAPI, function(err, response, dataFromServer) {
			
			res.send(dataFromServer)
			
			console.log('range-date sent')
	})
})


// SENTRY API ===========================================================================


app.get('/sentry_data', function(req, res) {

	var sentryAPI = `https://ssd-api.jpl.nasa.gov/sentry.api`
	request(sentryAPI, function(err, response, sentryDataFromServer) {

		res.send(sentryDataFromServer)

		console.log('sentry data sent')
	})
})

//HTTPS SERVER ---------------------------------------------------------------------------

try {
    var httpsConfig = {
        
        key: fs.readFileSync('/etc/letsencrypt/live/asteroids.iamaaronallen.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/asteroids.iamaaronallen.com/fullchain.pem'),
    }

    var httpsServer = HTTPS.createServer(httpsConfig, app)
    
    httpsServer.listen(443, function(){
    	
    	console.log('running on 443')
    })
    
    var httpApp = express()
    
    httpApp.use(function(req, res, next){
        
        res.redirect('https://asteroids.iamaaronallen.com' + req.url)
    })
    
    httpApp.listen(80)
}

catch(e){
    
    console.log(e)
    
    console.log('could not start HTTPS server')
    
    var httpServer = HTTP.createServer(app)
    
    httpServer.listen(80)
}

//EXPRESS SERVER ------------------------------------------------------------------------

// var port = 8081

// app.listen(port, function() {

// 	console.log("'Dangerous Asteroids' on port " + port)

// })


