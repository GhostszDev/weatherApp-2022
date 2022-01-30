const API_KEY = '&appid=3c890e2eb127beb3199800aea092bd52';
const OPEN_WEATHER_URI = 'https://api.openweathermap.org/data/2.5/weather';
const OPEN_WEATHER_ICON_URI = 'http://openweathermap.org/img/wn/';
const weatherApp = $('.weatherApp');
const  body = $('body');
var imgLength;

var coords = {};
var data_ = {};

var backgroundDataDay = [
    {img_src: '/media/img/bg_2.jpg', color: '#5D576F', textColor: '#342e1f'},
];

var backgroundDataNight = [
    {img_src: '/media/img/bg_1.jpg', color: '#f7ac8bad', textColor: '#51597d'},
    {img_src: '/media/img/bg_3.jpg', color: '#aeb9cead', textColor: '#342e1f'},
];

var getBackgroundImg = (imgData = [])=>{
    imgLength = imgData.length;
    var selected = Math.floor(Math.random() * imgLength);

    body.css({"background-image": "url("+imgData[selected].img_src+")", "color": imgData[selected].textColor});
    weatherApp.css({"background": imgData[selected].color});
};

var getWeatherData = async (city = '', coord = {lat: '', lon: ''})=>{

    if(!city) {
        var fetchData = await fetch(OPEN_WEATHER_URI + '?lat=' + coord.lat + '&lon=' + coord.lon + '&units=imperial' + API_KEY);
    } else {
        var fetchData = await fetch(OPEN_WEATHER_URI + '?q=' + city + '&units=imperial' + API_KEY);
    }

    var data = await fetchData.json();
    return data;
};

var updateWeatherApp = (data)=>{
    if(data.weather[0].icon.includes('d')){

        getBackgroundImg(backgroundDataDay);

    }else {

        getBackgroundImg(backgroundDataNight);

    }

    weatherApp.html(
        '<div class="weather">' +
        '<img src="'+OPEN_WEATHER_ICON_URI+data.weather[0].icon+'@2x.png" class="weatherIcon"/>' +
        '<p class="weatherTemp">' + Math.round(data.main.temp) + '&#8457;</p>' +
        '<p class="weatherDesc">' + data.name + '</p>' +
        '</div>'
    );
};

if (window.navigator.geolocation) {
    // Geolocation available
    window.navigator.geolocation
        .getCurrentPosition((data) => {
            // coords = data.coords;
            coords = {lat: data.coords.latitude, lon: data.coords.longitude}

            var weatherData = getWeatherData('', coords);
            weatherData.then((data)=>{
                updateWeatherApp(data);
            });

        }, console.log);
}
