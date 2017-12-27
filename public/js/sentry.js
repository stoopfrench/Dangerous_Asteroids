$(document).ready(function() {

	var sentryData = []

	$.get('/sentry_data', function(body, status){

		body = JSON.parse(body)


		body.data.sort(function(a,b){

			return b.ip - a.ip
		})

		sentryData = body.data.slice(0, 25)

		// console.log('sentry data ', sentryData)

		for(var i = 0; i < sentryData.length; i++){

			var diameter = (sentryData[i].diameter * 3280.84).toFixed(2)

			var velocity = Math.floor(sentryData[i].v_inf * 3280.84).toLocaleString()

			$('#resultsList').append(`
					<li class="asteroidResults">
						<h3 class="asteroidResultsTitle" onclick="getAsteroidDetails(this)" data-toggle="modal" data-target="#moreInfoModal">${sentryData[i].des}</h3>
						<ul class="asteroidResultsDescription">
							<li>Impact Probability: ${sentryData[i].ip}</li>
							<li>Diameter: ${diameter} ft</li>
							<li>Velocity: ${velocity} ft/s</li>
						</ul>
					</li>
				`)

		}
	})

})
	var getAsteroidDetails = function(name){

		console.log(name.textContent)

		var asteroidSearch = name.textContent

		$.get(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroidSearch}`, function(data, status){

			console.log('data ', data)

			$('.modal-title').text(asteroidSearch)
		})
	}