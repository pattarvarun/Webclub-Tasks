var weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tues";
weekday[3] = "Wed";
weekday[4] = "Thur";
weekday[5] = "Fri";
weekday[6] = "Sat";


function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();

    var time = hour + ':' + min;
    return time;
}

function getday(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var day = weekday[a.getDay()];
    return day;
}

// var status = document.getElementById('status').innerHTML = weather.weather[0].main;
chrome.storage.local.get(['weather'], function(result) {

    var list = document.getElementById("list");
    console.log(list);
    var count = Object.keys(result.weather.list).length;
    for (var i = 0; i < count; i++) {
        var node = document.createElement('div');
        var a = document.createAttribute("class");
        a.value = "card";
        node.setAttributeNode(a);

        var day = document.createElement('p');
        var dayValue = document.createTextNode(getday(result.weather.list[i].dt));
        day.appendChild(dayValue);
        node.appendChild(day);


        var Time = document.createElement('p');
        var TimeValue = document.createTextNode(timeConverter(result.weather.list[i].dt));
        Time.appendChild(TimeValue);
        node.appendChild(Time);

        var weatherCondition = document.createElement('p');
        var weatherConditionValue = document.createTextNode(result.weather.list[i].weather[0].description);
        weatherCondition.appendChild(weatherConditionValue);
        node.appendChild(weatherCondition);

        var icon = document.createElement("img");
        icon.setAttribute('src', "http://openweathermap.org/img/wn/" + result.weather.list[i].weather[0].icon + "@2x.png");
        node.appendChild(icon);


        var tempValue = document.createTextNode(Math.round(result.weather.list[i].main.temp - 273.15) + ' °C');
        var temp = document.createElement('p');
        temp.appendChild(tempValue);
        node.appendChild(temp);


        var windSpeed = document.createElement('p');
        var windSpeedValue = document.createTextNode("Wind Speed : " + result.weather.list[i].wind.speed + "m/s");
        windSpeed.appendChild(windSpeedValue);
        node.appendChild(windSpeed);

        var humidity = document.createElement('p');
        var humidityValue = document.createTextNode("Humidity : " + result.weather.list[i].main.humidity + " %");
        humidity.appendChild(humidityValue);
        node.appendChild(humidity);

        list.appendChild(node);
    }
});