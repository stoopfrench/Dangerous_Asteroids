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

			var ip = sentryData[i].ip

			var formatIp = Number(ip).toExponential()

			// console.log(formatIp)

			var diameter = (sentryData[i].diameter * 3280.84).toFixed(2)

			var velocity = Math.floor(sentryData[i].v_inf * 3280.84).toLocaleString()

			$('#resultsList').append(`
					<li class="asteroidResults">
						<h4 class="asteroidResultsTitle" onclick="getAsteroidDetails(this)" data-toggle="modal" data-target="#moreInfoModal">${sentryData[i].des}</h4>
						<ul class="asteroidResultsDescription">
							<li>Rank: ${i + 1}</li>
							<li>Date Range: ${sentryData[i].range}</li>
							<li>Impact Probability: ${formatIp}</li>
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

		// console.log(name.textContent)

		var asteroidSearch = name.textContent

		$.get(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroidSearch}`, function(data, status){

			// console.log('data ', data)

			var splitDate = data.summary.last_obs.split('.')

			var sliceDate = splitDate.slice(0,1)[0]

			var year = sliceDate.split('-').shift()

			var day = sliceDate.split('-').pop()

			var month = sliceDate.split('-').slice(1,2).toString()

			var lastObs = `${month}-${day}-${year}`

			var darc = data.summary.darc

			var fixedDarc = darc.split('.')[0]

			$('.modal-title').text(asteroidSearch)
			$('#moreInfoList').append(`
					<li>Last Observation: ${lastObs}</li>
					<li>Days Observed: ${fixedDarc} days</li>
					<li>Mass: ${data.summary.mass} kg</li>
					<li>Absolute Magnitude: ${data.summary.h}</li>
					<li># of Potential Impacts: ${data.summary.n_imp}</li>
					<li>Energy: ${data.summary.energy} megatons of TNT</li>
				`)

		})
	}