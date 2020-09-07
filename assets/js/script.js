var date = moment().format('L')
var key = '570d8de33c9f13f6bcd17075f75bc5f7'
var searchHistory = [];
if (localStorage.getItem('history') === null) {
    localStorage.setItem('history', '[]')
}


//on click get set current text values to null and get weather for desired city
$('#add-city').on('click', function() {
    
    event.preventDefault()

    setNone()
    
    var citySearch = $('#city-search').val().trim()

    var city = citySearch.charAt(0).toUpperCase() + citySearch.slice(1)

    getWeather(city)

    $('#city-search').val('')
})

//set all values to null
var setNone = function() {

    $('#curCity').text('')

    $('#temp').text('Temperature:')

    $('#humid').text('Humidity:')

    $('#wind').text('Wind Speed:')

    $('#uvData').text('').removeClass()

    $('#icon').attr('src', '')
    
}

//gets weather data for searched city and passes it to the BuildData function
var getWeather = function(city) {
    //makes fetch to server requesting latitude and longitude on the searched city. reasoning for this is that the one call api needs cords and not city name
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    `&appid=${key}`)
    .then(function(response) {
    
        if (response.ok) {
            response.json().then(function (data) {

                if (searchHistory.includes(city)) {
                    //if the city is already in the array do nothing
                } else {
                    //if city isnt in array save it
                    saveSearch(city)
                }

                var lat =  data.coord.lat
                var lon =  data.coord.lon

                

                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${key}`)
                .then(function(response) {
                    response.json().then(function(data1){
                        
                        //gets the data we need from the response
                        var currentTemp = data1.current.temp
                        var humid = data1.current.humidity
                        var wind = data1.current.wind_speed
                        var uv = data1.current.uvi
                        var icon = data1.current.weather[0].icon

                        buildData(city, currentTemp, humid, wind, uv, icon)

                        //set the 5 day weather forecast
                        for (var i = 1; i < 6; i++) {
                            
                            var futureTemp = data1.daily[i].temp.max
                            var futureHumid = data1.daily[i].humidity
                            var futureIcon = data1.daily[i].weather[0].icon
                            var date = moment.unix(data1.daily[i].dt).format("MM/DD/YYYY"); 
                            
                            $('#date-'+[i]).text(date)
                            $('#day-'+[i]).removeClass('d-none')
                            $('#icon-'+[i]).attr('src', `http://openweathermap.org/img/wn/${futureIcon}@2x.png`)
                            $('#temp-'+[i]).text(`High of ${futureTemp}\u00B0F`)
                            $('#humid-'+[i]).text(`Humidity: ${futureHumid}%`)

                        }

                    })
                    
                })
                 
                
            });
            
        } else {
            window.alert("Sorry! We couldn't find your city")
            location.reload();
        }
    })
}

//Puts data in correct places so the user can see it
var buildData = function(city, currentTemp, humid, wind, uv, icon) {
    setNone()
    $('#curCity').append(`${city} (${date})`)
    
    $('#icon').attr('src', `http://openweathermap.org/img/wn/${icon}@2x.png`)

    $('#temp').append( ` ${currentTemp}\u00B0F`)

    $('#humid').append( ` ${humid}%`)

    $('#wind').append( ` ${wind} MPH`)

    $('#uvData').append( ` ${uv}`)

    

    //checks the uv index to see if it is favorable, moderate, or high
    if (uv <= 3) {
        $('#uvData').addClass('bg-success')
    } else if (uv > 3 && uv <= 7) {
        $('#uvData').addClass('bg-warning')
    } else if (uv > 7) {
        $('#uvData').addClass('bg-danger')
    }

}




//saves search history
var saveSearch =  function(city) {
    
    searchHistory.unshift(city)

    //makes sure that the search history doesnt get too long
    if (searchHistory.length >= 11) {
        searchHistory.pop()
        $('#history li:last-child').remove()
    }
    

    localStorage.setItem('history', JSON.stringify(searchHistory));

    
    lastSearch();
    
}

//loads search history
var loadSearch = function() {
    var storedCities = JSON.parse(localStorage.getItem('history'))
    searchHistory = storedCities
    
    $.each(storedCities, function(index, value){
        $('#history').append("<li class='list-group-item list-group-item-action'>" + value + "</li>")
    })
    
}

//adds last searched city to top of search history
var lastSearch = function() {
    newCity = searchHistory[0]
    $('#history').prepend("<li class='list-group-item list-group-item-action'>" + newCity + "</li>")
}

$( "#history" ).on( "click", "li", function( event ) {
    event.preventDefault();

    getWeather($(this).text())
});

loadSearch();