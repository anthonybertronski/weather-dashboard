console.log( "ready!" );

//moment
var momentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
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

        console.log("Wind Speed: " + weatherData.wind.speed);
        console.log("Humidity: " + weatherData.main.humidity);
        console.log("Current Temperature (F): " + farenTemp);
        console.log("City: " + weatherData.name);

        getMoreWeather(cityInput, queryURL);

    });

}

function getMoreWeather (city, url) {
    console.log(city);
    console.log(url);

}


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