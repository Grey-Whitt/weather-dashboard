var date = moment().format('L')
var key = '570d8de33c9f13f6bcd17075f75bc5f7'



//on click get set current text values to null and get weather for desired city
$('#add-city').on('click', function() {
    event.preventDefault()

    $('#curCity').text('')

    $('#temp').text('Temperature:')

    $('#humid').text('Humidity:')

    $('#wind').text('Wind Speed:')

    $('#uvData').text('')
    

    city = $('#city-search').val()

    getWeather(city)

    $('#city-search').val('')
})

//gets weather data for searched city and passes it to the BuildData function
var getWeather = function(city) {
    //makes fetch to server requesting weather data on the searched city
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    `&appid=${key}`)
    .then(function(response) {
    
        if (response.ok) {
            response.json().then(function (data) {
                //gets the data we need from the response
                var currentTemp = data.main.temp
                var humid = data.main.humidity
                var wind = data.wind.speed
                
                var lat =  data.coord.lat
                var lon =  data.coord.lon

                
                //gets uv index from location then passes all data to the buildData function
                return fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${lat}&lon=${lon}`)
                .then(function(response) {
                    response.json().then(function(data){
                        uv = data.value
                        buildData(city, currentTemp, humid, wind, uv)
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
var buildData = function(city, currentTemp, humid, wind, uv) {

    $('#curCity').text(`${city} ${date}`)

    $('#temp').append( ` ${currentTemp}`)

    $('#humid').append( ` ${humid}`)

    $('#wind').append( ` ${wind}`)

    $('#uvData').append( ` ${uv}`)

    //checks the uv index to see if it is favorable, moderate, or high
    if (uv <= 2) {
        $('#uvData').addClass('bg-success')
    } else if (uv > 2 && uv <= 5) {
        $('#uvData').addClass('bg-warning')
    } else if (uv > 5) {
        $('#uvData').addClass('bg-danger')
    }


}