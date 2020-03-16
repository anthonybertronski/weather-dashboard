console.log( "ready!" );

//moment
var momentTime = moment().format('MMMM Do YYYY');
console.log(momentTime);

//variables
var APIKey = 'c713cdaa927c21aadd4497732b1e2f54';
var submitCity = $('#submit-city');
var cityHistory = $('#city-history');
var currentWeather = $('#current-weather');
var fiveDay = $('#five-day');
// var searchHistory = [];
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

console.log(searchHistory);

function loadHistory() {
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.text(searchHistory[i]);
        historyDivs.appendTo(cityHistory);
    }
}

function getCurrentWeather() {
    var cityInput = $('#cityInput').val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;

  // Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(weatherData) {
        
        console.log(weatherData);
        console.log(queryURL);
        var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

        $('<h3>').text("City: " + weatherData.name).appendTo(currentWeather)
        $('<h3>').text("Date: " + momentTime).appendTo(currentWeather)
        $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather)
        $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather)
        $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather)
        $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather)

        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        //This api call adds the UV Index to the current weather
        var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
          })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(moreData) {
                console.log(moreData);
                $('<h3>').text("UV Index: " + moreData.value).appendTo(currentWeather);

            });

        // getMoreWeather(cityInput, queryURL);

    });



}

// function getMoreWeather (city, url) {
//     console.log(city);
//     console.log(url);
//     var queryURL2 = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;

// $.ajax({
//     url: queryURL2,
//     method: "GET"
//   })
//     // We store all of the retrieved data inside of an object called "response"
//     .then(function(moreData) {
//         console.log(moreData);

//     });
// }


submitCity.on('click', function(event) {
    event.preventDefault();

    var cityHistDiv = $('<div>');
    var cityInput = $('#cityInput').val().trim();

    cityHistDiv.text(cityInput);

    searchHistory.push(cityInput);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    
    cityHistDiv.prependTo(cityHistory);
    getCurrentWeather();
});

$( document ).ready(function() {
loadHistory();
});