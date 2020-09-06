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
    //makes fetch to server requesting weather data on the searched city
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

                //gets the data we need from the response
                var currentTemp = data.main.temp
                var humid = data.main.humidity
                var wind = data.wind.speed
                var icon = data.weather[0].icon
                
                
                
                var lat =  data.coord.lat
                var lon =  data.coord.lon

                
                //gets uv index from location then passes all data to the buildData function
                fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${lat}&lon=${lon}`)
                .then(function(response) {
                    response.json().then(function(data){
                        uv = data.value
                        buildData(city, currentTemp, humid, wind, uv, icon)
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

    $('#curCity').append(`${city} (${date})`)
    console.log(icon)
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
    //if statement here to delete oldest item in array if array is larger then a certain number
    
    
    searchHistory.unshift(city)
    

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
    setNone()
    getWeather($(this).text())
});

loadSearch();

