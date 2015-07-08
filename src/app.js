// Finalise location

// a bit broken! (location)

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var main = new UI.Window();

var mainCirc = new UI.Circle({
  position: new Vector2(72,40),
  radius: 25,
  backgroundColor: 'white',
});

main.add(mainCirc);

var mainNum = new UI.Text({
  position: new Vector2(60,12),
  size: new Vector2(30,30),
  font: 'bitham-42-light',
  text: '3',
  textAlign: 'left',
  color: 'black',
});

main.add(mainNum);

var mainTitle = new UI.Text({
  position: new Vector2(0,70),
  size: new Vector2(144,20),
  font: 'bitham-30-black',
  text: 'Weather',
  textAlign: 'center',
});

main.add(mainTitle);

var mainRect = new UI.Rect({
  position: new Vector2(0,110),
  size: new Vector2(144,2),
});

main.add(mainRect);

var mainSub = new UI.Text({
  position: new Vector2(0,115),
  size: new Vector2(144,20),
  font: 'gothic-24-bold',
  text: 'Press any key',
  textAlign: 'center',
  textOverflow: 'wrap',
});

main.add(mainSub);

main.show();

main.on('longClick', 'select', function(e) {
  console.log('longSelect detected!');
  var locationOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    };
  function locationSuccess(pos) {
    console.log('lat= ' + pos.coords.latitude + 'lon= ' + pos.coords.longitude);
    var lat = pos.coords.latitude;
    var lat1 = lat.toString();
    var lon = pos.coords.longitude;
    var lon1 = lon.toString();
    var URL2 = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat1 + '&lon=' + lon1;
    console.log(URL2);
     
    ajax(
        {
          url: URL2,
          type: 'json'
        },
        function(data, status, request) {
          var cityName = data.name;
          var country = data.sys.country;
          var kts = Math.round(data.wind.speed*2.23693629*0.868);
          var mph = Math.round(data.wind.speed*2.23693629);
          var deg = Math.round(data.wind.deg);
          var cover = data.clouds.all;
          var hPa = Math.round(data.main.pressure);
          var c = Math.round(data.main.temp-273);
          var desc1 = data.weather[0].description;
            var humid = data.main.humidity + '% humidity.';
            var Menu = new UI.Menu({
            sections: [{
              title: cityName + ', ' + country,
            items: [{
              title: 'Summary',
            }, {
              title: 'Cloud',
            }, {
              title:'Pressure',
            }, {
              title: 'Temperature',
            }, {
              title: 'Wind',
            }]
 
           }]
           
      });
          Menu.show();
            Menu.on('select', function(e) {
             if (e.item.title === 'Wind') {
                 var details = (kts + 'kts, ' + mph + 'mph, from ' + deg + ' degrees.');
             } else if (e.item.title === 'Cloud') {
                 var details = (cover + '%, ' + desc1 + '.');
             } else if (e.item.title === 'Pressure') {
               var details = (hPa + 'hPa');
             } else if (e.item.title === 'Temperature') {
               var details = (c + '°c, ' + humid);
             } else if (e.item.title === 'Summary') {
                 if (kts <= 5) {
                   var windWx = ('light breeze');
                 } else if (kts <= 20) {
                   var windWx = ('moderate wind');
                 } else if (kts < 35) {
                   var windWx = ('strong winds');
                 } else if (kts >= 35) {
                   var windWx = ('gale force winds');
                 }
               var details = (c + '°c, ' + windWx + ', ' + desc1 + '.');
             }
             var card = new UI.Card({
               title: e.item.title,
               body: details,
               scrollable: true
             });
            card.show();
            });
          });
        }
   
    function locationError(err) {
      console.log('location error (' + err.code + '): ' + err.message);
      var errCard = new UI.Card({
          title: "ERROR",
          body: "An error occured. Please try again later."
        });
        errCard.show();
    }
 
    // Make an asynchronous request
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
   
 
  return;
  
});

main.on('click', function(e) {
  if (e.button === 'up') {
    console.log('up click, New York');
    var cityName = 'New York';
    var URL = 'http://api.openweathermap.org/data/2.5/weather?q=New_York';
  } else if (e.button === 'select') {
    console.log('select click, London');
    var cityName = 'London';
    var URL = 'http://api.openweathermap.org/data/2.5/weather?q=London';
  } else if (e.button === 'down') {
    console.log('down click, Sydney');
    var cityName = 'Sydney';
    var URL = 'http://api.openweathermap.org/data/2.5/weather?lat=-33.85&lon=151.21';
  }
    ajax(
          {
            url: URL,
            type: 'json'
          },
          function(data, status, request) {
            var kts = Math.round(data.wind.speed*2.23693629*0.868);
            var mph = Math.round(data.wind.speed*2.23693629);
            var deg = Math.round(data.wind.deg);
            var cover = data.clouds.all;
            var hPa = Math.round(data.main.pressure);
            var c = Math.round(data.main.temp-273);
            var humid = data.main.humidity + '% humidity.';
            var desc1 = data.weather[0].description;
            var Menu = new UI.Menu({
            sections: [{
              title: cityName,
            items: [{
              title: 'Summary',
            }, {
              title: 'Cloud',
            }, {
              title:'Pressure',
            }, {
              title: 'Temperature',
            }, {
              title: 'Wind',
            }]

           }]
            
      });
          Menu.show();
            Menu.on('select', function(e) {
              
             if (e.item.title === 'Wind') {
                 var details = (kts + 'kts, ' + mph + 'mph, from ' + deg + ' degrees.');
             } else if (e.item.title === 'Cloud') {
                 var details = (cover + '%, ' + desc1 + '.');
             } else if (e.item.title === 'Pressure') {
               var details = (hPa + 'hPa');
             } else if (e.item.title === 'Temperature') {
               var details = (c + '°c. ' + humid);
             } else if (e.item.title === 'Summary') {
                 if (kts <= 5) {
                   var windWx = ('light breeze');
                 } else if (kts <= 20) {
                   var windWx = ('moderate wind');
                 } else if (kts < 35) {
                   var windWx = ('strong winds');
                 } else if (kts >= 35) {
                   var windWx = ('gale force winds');
                 }
               var details = (c + '°c, ' + windWx + ', ' + desc1 + '.');
             }
             var card = new UI.Card({
               title: e.item.title,
               body: details,
               scrollable: true
             });
            card.show();
            });
          },
      function(error, status, request) {
        console.log('Error: ' + error);
        var errCard = new UI.Card({
          title: "ERROR",
          body: "An error occured. Please try again later."
        });
        errCard.show();
      }
        
        );
});