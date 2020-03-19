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

var city = "" || searchHistory[0];

getMoreWeather(getCurrentWeather(city));

function loadHistory() {
    for (var i = 0; i < searchHistory.length; i++) {
        var historyDivs = $('<div>');
        historyDivs.text(searchHistory[i]);
        historyDivs.addClass('list-group-item');
        historyDivs.addClass('saved-city');
        historyDivs.attr('data-city', searchHistory[i]);
        historyDivs.appendTo(cityHistory);
    }
}

function getMoreWeather (city) {

    var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=imperial"

    $.ajax({
        url: queryURL3,
        method: "GET"
      })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(forecastData) {
            console.log(forecastData);
            fiveDay.empty();
            $('#title').empty();


            var title = $('#title');
            $('<h2>').text("5-Day Forecast:").appendTo(title);
    
            for (var j = 0; j < forecastData.list.length; j++) {
                if (forecastData.list[j].dt_txt.indexOf("00:00:00") !== -1) {
                    fiveDayFaren = Math.floor(forecastData.list[j].main.temp);

                    var fiveDayDate = moment(new Date(forecastData.list[j].dt_txt).toLocaleDateString()).format("LL");
    
                    var card = $('<div class ="card bg-info border-light">');
                    var cardBody = $('<div class="card-body">');
    
                    var cardIcon = $('<img class="images" src ="https://openweathermap.org/img/wn/' + forecastData.list[j].weather[0].icon + '@2x.png"/>')
                    cardIcon.appendTo(cardBody);
                    $('<p class="card-text">').text(fiveDayDate).appendTo(cardBody);
                    $('<p class="card-text">').text("Temp. (F): " + fiveDayFaren).appendTo(cardBody);
                    $('<p class="card-text">').text("Humidity: " + forecastData.list[j].main.humidity + " %").appendTo(cardBody);
    
                    card.append(cardBody);
                    fiveDay.append(card);
                }
            }
    
        });
    }

function getCurrentWeather(city) {
    var cityInput = city || $('#cityInput').val().trim();

    if (cityInput !== "") {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityInput + "&appid=" + APIKey;

    
  // Here we run our first ajax call for current weather
    $.ajax({
        url: queryURL,
        method: "GET"
     })
    // We store all of the retrieved data inside of an object called "weatherData"
    .then(function(weatherData) {
        
        currentWeather.empty();
        $('#icon').empty();

        var farenTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
        var feelsLike = Math.floor((weatherData.main.feels_like - 273.15) * 1.8 + 32);

        var imgIcon = $('<img>');
        imgIcon.attr('class', 'image');
        imgIcon.attr('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');

        $('#icon').append(imgIcon);
        $('<h2 class="text-white">').text("Current Weather: ").appendTo(currentWeather);
        $('<h3>').text(weatherData.name + ", " + momentTime).appendTo(currentWeather);
        $('<h3>').text("Current Temperature (F): " + farenTemp).appendTo(currentWeather);
        $('<h3>').text("Feels Like: " + feelsLike).appendTo(currentWeather);
        $('<h3>').text("Humidity: " + weatherData.main.humidity + "%").appendTo(currentWeather);
        $('<h3>').text("Wind Speed: " + weatherData.wind.speed + " mph").appendTo(currentWeather);

        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        //getting the UV index
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: queryURL2,
            method: "GET"
          })
            // We store all of the retrieved data inside of an object called "response"
            .then(function(moreData) {

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
    //end of the if
    }

}




submitCity.on('click', function(event) {
    event.preventDefault();
    var cityHistDiv = $('<div>');
    var cityInput = $('#cityInput').val().trim();

    if (cityInput !== "") {

        cityHistDiv.attr('data-city', cityInput);
        cityHistDiv.addClass('saved-city');
        cityHistDiv.addClass('list-group-item');
        cityHistDiv.text(cityInput);

        searchHistory.unshift(cityInput);

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    
        cityHistDiv.prependTo(cityHistory);
    }
    
    getCurrentWeather();
    $('#cityInput').val("");
});

$(document).on("click", ".saved-city", function(){
    var city = $(this).attr("data-city");

    getCurrentWeather(city);
})

$( document ).ready(function() {
loadHistory();
});