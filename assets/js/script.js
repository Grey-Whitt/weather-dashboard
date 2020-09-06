var date = moment().format('L')
var key = '570d8de33c9f13f6bcd17075f75bc5f7'




$('#add-city').on('click', function() {
    event.preventDefault()
    

    city = $('#city-search').val()
    


    getWeather(city)
})

var getWeather = function(city) {
    
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    `&appid=${key}`)
    .then(function(response) {
    
        if (response.ok) {
            response.json().then(function (data) {
                var currentTemp = data.main.temp
                var humid = data.main.humidity
                var wind = data.wind.speed
                
                var lat =  data.coord.lat
                var lon =  data.coord.lon

                buildData(city, currentTemp, humid, wind, uv)
                getUv(lat, lon)
            });
            
        } else {
            
            document.location.replace("./index.html");
        }
    })
}

var getUv =  function(lat, lon) {
    fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${lat}&lon=${lon}`)
    .then(function(response){
        if response.ok
    })
}

var buildData = function(city, currentTemp, humid, wind, uv) {

    $('#curCity').text(`${city} ${date}`)

    $('#temp').append( ` ${currentTemp}`)

    $('#humid').append( ` ${humid}`)

    $('#wind').append( ` ${wind}`)

    $('#uv').append( ` ${uv}`)


}