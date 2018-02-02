$(document).ready(function() {

    var sentryData = []

    $.get('/sentry_data', function(body, status) {

        body = JSON.parse(body)

        body.data.sort(function(a, b) {

            return b.ip - a.ip
        })

        sentryData = body.data.slice(0, 25)

        // console.log('sentry data ', sentryData)

        for (var i = 0; i < sentryData.length; i++) {

            var ip = sentryData[i].ip

            var formatIp = Number(ip).toExponential()

            var diameter = (sentryData[i].diameter * 3280.84).toFixed(2)

            var velocity = Math.floor(sentryData[i].v_inf * 3280.84).toLocaleString()

            $('#resultsList').append(`
					<li class="asteroidResults">
						<h4 class="asteroidResultsTitle" onclick="getAsteroidDetails(this)" data-toggle="modal" data-target="#moreInfoModal">${sentryData[i].des}</h4>
						<ul class="asteroidResultsDescription">
							<li>Rank: ${i + 1}</li>
							<li>Date Range: ${sentryData[i].range}</li>
							<li>Impact Probability: ${formatIp}</li>
						</ul>
					</li>
				`)
        }
    })
})

var getAsteroidDetails = function(name) {

    $('#moreInfoList').empty()

    // console.log(name.textContent)

    var asteroidSearch = name.textContent

    $.get(`https://ssd-api.jpl.nasa.gov/sentry.api?des=${asteroidSearch}`, function(data, status) {

        // console.log('data ', data)

        var firstSplitDate = data.summary.first_obs.split('.')

        var firstSliceDate = firstSplitDate.slice(0, 1)[0]

        var firstYear = firstSliceDate.split('-').shift()

        var firstDay = firstSliceDate.split('-').pop()

        var firstMonth = firstSliceDate.split('-').slice(1, 2).toString()

        var firstObs = `${firstMonth}-${firstDay}-${firstYear}`

        var lastSplitDate = data.summary.last_obs.split('.')

        var lastSliceDate = lastSplitDate.slice(0, 1)[0]

        var lastYear = lastSliceDate.split('-').shift()

        var lastDay = lastSliceDate.split('-').pop()

        var lastMonth = lastSliceDate.split('-').slice(1, 2).toString()

        var lastObs = `${lastMonth}-${lastDay}-${lastYear}`

        var darc = data.summary.darc

        var fixedDarc = darc.split('.')[0]

        var ip = data.summary.ip

        var formatIp = Number(ip).toExponential()

        var diameter = (data.summary.diameter * 3280.84).toFixed(2)

        var velocity = Math.floor(data.summary.v_inf * 3280.84).toLocaleString()

        $('.modal-title').text(data.summary.fullname)
        $('#moreInfoList').append(`
					<li>First Observation: <span>${firstObs}</span></li>
					<li>Last Observation: <span>${lastObs}</span></li>
					<li>Days Observed: <span>${fixedDarc} days</span></li>
					<li>Impact Potential: <span>${formatIp}</span></li>
					<li># of Potential Impacts: <span>${data.summary.n_imp}</span></li>
					<li>Absolute Magnitude: <span>${data.summary.h}</span></li>
					<li>Mass: <span>${data.summary.mass} kg</span></li>
					<li>Diameter: <span>${diameter} ft</span></li>
					<li>Velocity: <span>${velocity} ft/s</span></li>
					<li>Energy: <span>${data.summary.energy} megatons of TNT</span></li>
				`)

    })
}