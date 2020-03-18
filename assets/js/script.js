console.log( "ready!" );

//moment
var momentTime = moment().format('L');
console.log(momentTime);

//variables
var APIKey = 'c713cdaa927c21aadd4497732b1e2f54';
var submitCity = $('#submit-city');
var cityHistory = $('#city-history');
var currentWeather = $('#current-weather');
var fiveDay = $('#five-day');


var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
console.log(searchHistory);

function loadHistory() {
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.text(searchHistory[i]);
        historyDivs.addClass('list-group-item');
        historyDivs.addClass('saved-city');
        historyDivs.attr('data-city', searchHistory[i]);
        historyDivs.prependTo(cityHistory);
    }
}

function getCurrentWeather(city) {
    var cityInput = city || $('#cityInput').val().trim();

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
        console.log(weatherData.weather[0].icon);
        currentWeather.empty();
        $('#icon').empty();

        var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);
        var imgIcon = $('<img>');
        imgIcon.attr('class', 'image');
        imgIcon.attr('src', 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
        console.log(imgIcon);

        $('#icon').append(imgIcon);
        $('<h3>').text(weatherData.name + ", " + momentTime).appendTo(currentWeather);
        $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather);
        $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather);
        $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather);
        $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather);

        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        //getting the UV index
        var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
          })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(moreData) {
                console.log(moreData);
                console.log(cityInput);

                $('<h3 id = ' + city + '>').text("UV Index: " + moreData.value).appendTo(currentWeather);

                if (moreData.value <= 2) {
                    $('#' + city).addClass('green');
                }
                else if (moreData.value <= 5) {
                    $('#' + city).addClass('yellow');
                }
                else if (moreData.value <= 7) {
                    $('#' + city).addClass('orange');
                } 
                else if (moreData.value <= 10) {
                    $('#' + city).addClass('red');
                } 
                else if (moreData.value > 10) {
                    $('#' + city).addClass('purple');
                } 
                
            });

        getMoreWeather(cityInput);

    });



}

function getMoreWeather (city) {

var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=" + APIKey + "&units=imperial"
console.log(city);
console.log(queryURL3);

$.ajax({
    url: queryURL3,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(forecastData) {
        console.log(forecastData);
        fiveDay.empty();

        for (var j = 0; j < 5; j++) {
            var fiveDayDate = moment().add(j + 1, "day").format("MMMM Do YYYY");
            fiveDayFaren = Math.floor(forecastData.list[j].main.temp);
            console.log(fiveDayFaren);

            var card = $('<div>');
            card.addClass('card');
            var cardBody = $('<div>');
            cardBody.addClass('card-body');
            var cardText = $('<p>');
            cardText.addClass('card-text');
            cardText.text("Temperature (F): " + fiveDayFaren);
            cardBody.append(cardText);
            card.append(cardBody);

            fiveDay.append(card);
            console.log(card);

            // // card.attr('id', 'card-' + [j]);
            // $('<div class="card-body" id="card-'+ [j] + '">').appendTo(card);
            // $('<h5>').text("Temperature (F): " + fiveDayFaren).appendTo('#card-' + [j]);

            // $('<div class="card dayFives">').appendTo(fiveDay);
            // $('<div class="card-body fives">').appendTo('.dayFives');
            // $('<div>').appendTo('.fives').append('<img class="images" src=""/>');
            // $('.images').attr('src', 'http://openweathermap.org/img/wn/' + forecastData.list[j].weather[0].icon + '@2x.png');
            
            // $('<div>').text(fiveDayDate);

        }

    });
}


submitCity.on('click', function(event) {
    event.preventDefault();
    var cityHistDiv = $('<div>');
    var cityInput = $('#cityInput').val().trim();
    $('#cityInput').text("");

    cityHistDiv.attr('data-city', cityInput);
    cityHistDiv.addClass('saved-city');
    cityHistDiv.text(cityInput);

    searchHistory.push(cityInput);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    
    cityHistDiv.prependTo(cityHistory);
    getCurrentWeather();
});

$(document).on("click", ".saved-city", function(){
    var city = $(this).attr("data-city");
    getCurrentWeather(city);
})

$( document ).ready(function() {
loadHistory();
});