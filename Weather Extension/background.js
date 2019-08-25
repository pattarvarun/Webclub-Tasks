getlocation();

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    console.log(position);
    var mid = "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
    console.log(encodeURI("api.openweathermap.org/data/2.5/forecast?" + mid + "&APPID=c102ccac8d97ddd95a49de37f7cd1f90"));

    var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?" + mid + "&APPID=c102ccac8d97ddd95a49de37f7cd1f90";
    // var url = "https://api.openweathermap.org/data/2.5/weather?" + mid + "&APPID=c102ccac8d97ddd95a49de37f7cd1f90";
    fetch(forecastUrl)
        .then(res => {

            res.json().then(data => {
                console.log(data);
                // localStorage.setItem('weather',data);
                chrome.storage.local.set({ "weather": data }, function() {
                    console.log("weather stored");
                });
                // var weather = localStorage.getItem('weather');
                chrome.storage.local.get(['weather'], function(result) {
                    console.log("value is " + result.weather.list[0].weather[0].main);
                });
                // console.log(weather.main.temp);
            });


        });

}