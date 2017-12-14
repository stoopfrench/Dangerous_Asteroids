
$(document).ready(function() {

			$('#rangeSearch').hide()

			$('#dayRadio').on('click', function() {

			resetHTML()

			$('#search').show()
			$('#rangeSearch').hide()

			$('#dateInput')[0].value = ''

			$('#dateInput').focus()
		})

		$('#weekRadio').on('click', function() {
			
			resetHTML()

			$('#search').hide()
			$('#rangeSearch').show()

			$('#startDate')[0].value = ''
			$('#endDate')[0].value = ''

			$('#startDate').focus()
		})

// GET TODAY ====================================================================================================================================================================================

			
		$('#showToday').on('click', function(){

			resetHTML()

			var today = new Date()

			var formatToday = new Date(+today - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]

			var splitDate = formatToday.split('-')
			splitDate.push(splitDate.shift())
			var formattedDate = splitDate.join('/')

			$('#dateInput')[0].value = formatToday




// Today GET request

				$.get(`/search?start_date=${formatToday}`, function(body, status) {

					body = JSON.parse(body)

					var hazardousAsteroids = []

					if (body.near_earth_objects[formatToday]) {
					
					for(var asteroid of body.near_earth_objects[formatToday]) {
						
// Declare variables and push into the hazardousAsteroids array


						var name = asteroid.name

						var diameter = Math.floor(Number(asteroid.estimated_diameter.feet.estimated_diameter_max)).toLocaleString()
					
						var velocity = Math.floor(Number(asteroid.close_approach_data[0].relative_velocity.miles_per_hour)).toLocaleString()

						var distanceFromEarth = Math.floor(Number(asteroid.close_approach_data[0].miss_distance.miles)).toLocaleString()

						var link = asteroid.nasa_jpl_url

						
						if(asteroid.is_potentially_hazardous_asteroid) {

							hazardousAsteroids.push(asteroid)

						
// Print results to html page

							$('#entry').append (
								`
								<div id='listDiv'>
								<h4 id='listName'><a href="${link}" target="_blank">${name}<a></h4>
								 <p id='listDiameter'>${'Estimated Diameter: ' + diameter + ' ft'}</p>
								 <p id='listVelocity'>${'Velocity: ' + velocity + ' mph'}</p>
								 <p id='listDistance'>${'Distance from Earth: ' + distanceFromEarth + ' miles'}</p>
								 </div>
								 `
								)

						}		

					}
							
// Print to html
								$('#entryInfo').append (
									
									`<h3 class="dateInfo">${'Date: ' + formattedDate}</h3>`
			
									)
					
								
								if (hazardousAsteroids.length === 0) {

									$('#entryInfo').append (	

										`<h3>No Dangerous Asteroids.</h3>`
										)
									}

									else {

										$('#entryInfo').append (
											
											`<h3>${'Number of Dangerous Asteroids: ' + hazardousAsteroids.length}</h3>`
											
											)
									}
// Print Summary

								$('#summary').append (
									`<div id="summaryAccordion" data-children=".item">
									  <div class="item">
									    <a data-toggle="collapse" data-parent="#summaryAccordion" href="#summaryAccordion1" aria-expanded="true" aria-controls="summaryAccordion1">
									      Summary
									    </a>
									    <div id="summaryAccordion1" class="collapse show" role="tabpanel">
									      <ul id="summaryList" class="mb-3">
									      <li>${'Date: ' + formattedDate}</li>
									      <li>${'Total Asteroids: ' + body.near_earth_objects[formatToday].length}</li>
									      <li>${'Dangerous Asteroids: ' + hazardousAsteroids.length}</li>
									      </ul>
									    </div>
									  </div>
									</div>
									`
									)
							}

							else {

								$('#message').append(`<h2>Invalid date format</h3>`)
							}
					
					})
							
		})
									

// SINGLE-DATE ================================================================================================================================================================================

		
		$('#search').on('submit', function(event) {
			
			resetHTML()
			
			event.preventDefault()
			
			var userDate = $('#dateInput').val()


// Reformat the Date to US time format
			
			var splitDate = userDate.split('-')
			splitDate.push(splitDate.shift())
			var formattedDate = splitDate.join('/')


// Error Handling for single day form

			if (userDate === '') {

				$('#message').append(`<h2>Please enter a valid date.</h2>`)
			}

			else {


// Single-day GET request

				$.get(`/search?start_date=${userDate}`, function(body, status) {

					body = JSON.parse(body)

					var hazardousAsteroids = []

					if (body.near_earth_objects[userDate]) {
					
					for(var asteroid of body.near_earth_objects[userDate]) {
					

// Declare variables and push into the hazardousAsteroids array


					var name = asteroid.name

					var diameter = Math.floor(Number(asteroid.estimated_diameter.feet.estimated_diameter_max)).toLocaleString()
				
					var velocity = Math.floor(Number(asteroid.close_approach_data[0].relative_velocity.miles_per_hour)).toLocaleString()

					var distanceFromEarth = Math.floor(Number(asteroid.close_approach_data[0].miss_distance.miles)).toLocaleString()

					var link = asteroid.nasa_jpl_url

					
					if(asteroid.is_potentially_hazardous_asteroid) {

						hazardousAsteroids.push(asteroid)

					
// Print results to html page

						$('#entry').append (
							`
							<div id='listDiv'>
							<h4 id='listName'><a href="${link}" target="_blank">${name}<a></h4>
							 <p id='listDiameter'>${'Estimated Diameter: ' + diameter + ' ft'}</p>
							 <p id='listVelocity'>${'Velocity: ' + velocity + ' mph'}</p>
							 <p id='listDistance'>${'Distance from Earth: ' + distanceFromEarth + ' miles'}</p>
							 </div>
							 `
							)

					}		

				}
						
// Print to html
							$('#entryInfo').append (
								
								`<h3 class="dateInfo">${'Date: ' + formattedDate}</h3>`
		
								)
				
							
							if (hazardousAsteroids.length === 0) {

								$('#entryInfo').append (	

									`<h3>No Dangerous Asteroids.</h3>`
									)
								}

								else {

									$('#entryInfo').append (
										
										`<h3>${'Number of Dangerous Asteroids: ' + hazardousAsteroids.length}</h3>`
										
										)
								}

// Print Summary

							$('#summary').append (
								`<div id="summaryAccordion" data-children=".item">
								  <div class="item">
								    <a data-toggle="collapse" data-parent="#summaryAccordion" href="#summaryAccordion1" aria-expanded="true" aria-controls="summaryAccordion1">
								      Summary
								    </a>
								    <div id="summaryAccordion1" class="collapse show" role="tabpanel">
								      <ul id="summaryList" class="mb-3">
								      <li>${'Date: ' + formattedDate}</li>
								      <li>${'Total Asteroids: ' + body.near_earth_objects[userDate].length}</li>
								      <li>${'Dangerous Asteroids: ' + hazardousAsteroids.length}</li>
								      </ul>
								    </div>
								  </div>
								</div>
								`
								)
						}

						else {

							$('#message').append(`<h2>Invalid date format</h3>`)
						}
				
				})

			}			
	})

// PAST WEEK ================================================================================================================================================================================

		
		$('#showWeek').on('click', function(){

			resetHTML()


			var today = new Date()

			var formatToday = new Date(+today - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
			
			var lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

			var formatWeek = new Date(+lastWeek - lastWeek.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]

// Reformat the Date to US time format
			
			var splitDate = formatWeek.split('-')
			splitDate.push(splitDate.shift())
			var formatStartDate = splitDate.join('/')

			
			var splitDate = formatToday.split('-')
			splitDate.push(splitDate.shift())
			var formatEndDate = splitDate.join('/')

			$('#startDate')[0].value = formatWeek
			$('#endDate')[0].value = formatToday

// Range-date GET request

			$.get(`/range_search?start_date=${formatWeek}&end_date=${formatToday}`, function(body, status) {

				body = JSON.parse(body)

				var totalAsteroids = []

				var hazardousAsteroids = []

				
				for(var day in body.near_earth_objects) {


					for(var asteroid = 0; asteroid < body.near_earth_objects[day].length; asteroid++) {

						totalAsteroids.push(body.near_earth_objects[day][asteroid])

						

						if(body.near_earth_objects[day][asteroid].is_potentially_hazardous_asteroid === true) {


// Reformat the Date to US time format

							var date = body.near_earth_objects[day][asteroid].close_approach_data[0].close_approach_date

							var splitDate = date.split('-')
							splitDate.push(splitDate.shift())
							var formattedDate = splitDate.join('/')


// Declare Variables and push into the hazardousAsteroids array

							var days = body.near_earth_objects

							var dayAsteroid = body.near_earth_objects[day][asteroid]

							var name = dayAsteroid.name
					
							var diameter = Math.floor(Number(dayAsteroid.estimated_diameter.feet.estimated_diameter_max)).toLocaleString()
				
							var velocity = Math.floor(Number(dayAsteroid.close_approach_data[0].relative_velocity.miles_per_hour)).toLocaleString()

							var distanceFromEarth = Math.floor(Number(dayAsteroid.close_approach_data[0].miss_distance.miles)).toLocaleString()

							var link = dayAsteroid.nasa_jpl_url

							hazardousAsteroids.push(dayAsteroid)


// Print results to the html page 

							$('#entry').append(
							`
							<div id='listDiv'>
							<h4 id='listName'><a href="${link}" target="_blank">${name}<a></h4>
							<p id="listDate">${'Date: ' + formattedDate}</p>
							 <p id='listDiameter'>${'Estimated Diameter: ' + diameter + ' ft'}</p>
							 <p id='listVelocity'>${'Velocity: ' + velocity + ' mph'}</p>
							 <p id='listDistance'>${'Distance from Earth: ' + distanceFromEarth + ' miles'}</p>
							 </div>
							 `
							)	
						}
					}
				}							
							

// Error handling for invalid api request
// Print results info to html

							if (body.code === 400) {

							$('#message').append(`<h2>Search is limited to 7 continuous days.</h2>`)
							
							}
							
							else {
							
							$('#entryInfo').append (
								`
								<h3 class="dateInfo">${'Date Range: ' + formatStartDate + ' - ' + formatEndDate}</h3>`
								)

								if (hazardousAsteroids.length === 0) {

									$('#entryInfo').append (

									`<h3>No Dangerous Asteroids.</h3>`

									)
								}

								else {

									$('#entryInfo').append (
										
										`<h3>${'Number of Dangerous Asteroids: ' + hazardousAsteroids.length}</h3>`
										
										)
								}
							}

							$('#summary').append (
								`<div id="summaryAccordion" data-children=".item">
								  <div class="item">
								    <a data-toggle="collapse" data-parent="#summaryAccordion" href="#summaryAccordion1" aria-expanded="true" aria-controls="summaryAccordion1">
								      Summary
								    </a>
								    <div id="summaryAccordion1" class="collapse show" role="tabpanel">
								      <ul id="summaryList" class="mb-3">
								      <li>${'Date Range: ' + formatStartDate + ' - ' + formatEndDate}</li>
								      <li>${'Total Asteroids: ' + totalAsteroids.length}</li>
								      <li>${'Dangerous Asteroids: ' + hazardousAsteroids.length}</li>
								      </ul>
								    </div>
								  </div>
								</div>`
								)

				})


		})


// RANGE-DATE =================================================================================================================================================================================

		
		$('#rangeSearch').on('submit', function(event) {
			
			resetHTML()

			event.preventDefault()

			var startDate = $('#startDate').val()
			
			var endDate = $('#endDate').val()

			var splitDate = startDate.split('-')
			splitDate.push(splitDate.shift())
			var formatStartDate = splitDate.join('/')


// Reformat the Date to US time format

			var splitDate = endDate.split('-')
			splitDate.push(splitDate.shift())
			var formatEndDate = splitDate.join('/')


// Error Handling for range form
			
			if ( startDate === '' && endDate === '') {

				$('#message').append(`<h2>Please enter a valid START and END date.</h2>`)
			}

			else if ( startDate === '') {

				$('#message').append(`<h2>Please enter a valid START date.</h2>`)
			}

			else if (endDate === '') {

				$('#message').append(`<h2>Please enter a valid END date.</h2>`)
			}

			else {


// Range-date GET request

			$.get(`/range_search?start_date=${startDate}&end_date=${endDate}`, function(body, status) {

				body = JSON.parse(body)

				var totalAsteroids = []

				var hazardousAsteroids = []

				
				for(var day in body.near_earth_objects) {


					for(var asteroid = 0; asteroid < body.near_earth_objects[day].length; asteroid++) {

						totalAsteroids.push(body.near_earth_objects[day][asteroid])

						

						if(body.near_earth_objects[day][asteroid].is_potentially_hazardous_asteroid === true) {

							var date = body.near_earth_objects[day][asteroid].close_approach_data[0].close_approach_date


// Reformat the Date to US time format

							var splitDate = date.split('-')
							splitDate.push(splitDate.shift())
							var formattedDate = splitDate.join('/')


// Declare Variables and push into the hazardousAsteroids array
							
							var days = body.near_earth_objects

							var dayAsteroid = body.near_earth_objects[day][asteroid]

							var name = dayAsteroid.name
					
							var diameter = Math.floor(Number(dayAsteroid.estimated_diameter.feet.estimated_diameter_max)).toLocaleString()
				
							var velocity = Math.floor(Number(dayAsteroid.close_approach_data[0].relative_velocity.miles_per_hour)).toLocaleString()

							var distanceFromEarth = Math.floor(Number(dayAsteroid.close_approach_data[0].miss_distance.miles)).toLocaleString()

							var link = dayAsteroid.nasa_jpl_url

							hazardousAsteroids.push(dayAsteroid)


// Print results to the html page 

							$('#entry').append(
							
							`<div id='listDiv'>
							<h4 id='listName'><a href="${link}" target="_blank">${name}<a></h4>
							<p id="listDate">${'Date: ' + formattedDate}</p>
							 <p id='listDiameter'>${'Estimated Diameter: ' + diameter + ' ft'}</p>
							 <p id='listVelocity'>${'Velocity: ' + velocity + ' mph'}</p>
							 <p id='listDistance'>${'Distance from Earth: ' + distanceFromEarth + ' miles'}</p>
							 </div>`
							)	
						}
					}
				}


// Error handling for invalid api request
// Print results info to html

							if (body.code === 400) {

							$('#message').append(`<h2>Search is limited to 7 continuous days.</h2>`)
							
							}
							
							else {
							
							$('#entryInfo').append (
								`
								<h3 class="dateInfo">${'Date Range: ' + formatStartDate + ' - ' + formatEndDate}</h3>`
								)

								if (hazardousAsteroids.length === 0) {

									$('#entryInfo').append (

									`<h3>No Dangerous Asteroids.</h3>`

									)
								}

								else {

									$('#entryInfo').append (
										
										`<h3>${'Number of Dangerous Asteroids: ' + hazardousAsteroids.length}</h3>`
										
										)
								}
							}

							$('#summary').append (
								`<div id="summaryAccordion" data-children=".item">
								  <div class="item">
								    <a data-toggle="collapse" data-parent="#summaryAccordion" href="#summaryAccordion1" aria-expanded="true" aria-controls="summaryAccordion1">
								      Summary
								    </a>
								    <div id="summaryAccordion1" class="collapse show" role="tabpanel">
								      <ul id="summaryList" class="mb-3">
								      <li>${'Date Range: ' + formatStartDate + ' - ' + formatEndDate}</li>
								      <li>${'Total Asteroids: ' + totalAsteroids.length}</li>
								      <li>${'Dangerous Asteroids: ' + hazardousAsteroids.length}</li>
								      </ul>
								    </div>
								  </div>
								</div>`
								)


			})

		}


	})

//FUNCTIONS ==============================================================================================================================================================================

	// RESET HTML FUNCTION

	var resetHTML = function(){

			$('#entryInfo').empty()
			$('#entry').empty()
			$('#message').empty()
			$('#summary').empty()
		}

})


