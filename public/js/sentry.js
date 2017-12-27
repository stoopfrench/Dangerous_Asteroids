$(document).ready(function() {

	var sentryData = []

	$.get('/sentry_data', function(body, status){

		body = JSON.parse(body)


		body.data.sort(function(a,b){

			return b.ip - a.ip
		})

		sentryData = body.data.slice(0, 25)

		console.log('sentry data ', sentryData)

		for(var i = 0; i < sentryData.length; i++){

			var diameter = (sentryData[i].diameter * 3280.84).toFixed(2)

			var velocity = Math.floor(sentryData[i].v_inf * 3280.84).toLocaleString()

			$('#resultsList').append(`
					<li class="asteroidResults">
						<h4 class="asteroidResultsTitle" onclick="getAsteroidDetails(this)" data-toggle="modal" data-target="#moreInfoModal"><span>${i + 1}. </span>${sentryData[i].des}</h4>
						<ul class="asteroidResultsDescription">
							<li>Date Range: ${sentryData[i].range}</li>
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

		$('#moreInfoList').empty()

		console.log(name.textContent)

		var asteroidSearch = name.textContent

		$.get(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroidSearch}`, function(data, status){

			console.log('data ', data)

			var splitDate = data.summary.last_obs.split('.')

			var sliceDate = splitDate.slice(0,1)

			var lastObs = sliceDate.join()


			console.log(lastObs)

			$('.modal-title').text(asteroidSearch)
			$('#moreInfoList').append(`
					<li>Last Observation: ${lastObs}</li>
					<li>Mass: ${data.summary.mass} kg</li>
					<li>Energy: ${data.summary.energy} megatons of TNT</li>
				`)

		})
	}