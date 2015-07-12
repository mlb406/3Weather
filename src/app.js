//Add desc to new UI

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Settings = require('settings');

Settings.config(
  { url: 'http://mlb406.github.io/3Weather/' },
  function(e) {
    //Open config
    console.log("Configurable opened!");
  },
  function(e) {
    console.log("Settings recieved!");
    console.log(JSON.stringify(e.options));
    var options = e.options;
    var location1 = options.location1;
    var location2 = options.location2;
    var location3 = options.location3;
    var windUnit = options.units.wind;
    var tempUnit = options.units.temp;
    var presUnit = options.units.pressure;
    localStorage.setItem(1, location1);
    localStorage.setItem(2, location2);
    localStorage.setItem(3, location3);
    localStorage.setItem(4, windUnit);
    localStorage.setItem(5, tempUnit);
    localStorage.setItem(6, presUnit);
  }

);

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
  var location1 = localStorage.getItem(1);
  var location2 = localStorage.getItem(2);
  var location3 = localStorage.getItem(3);
  var unitWind = localStorage.getItem(4);
  var unitTemp = localStorage.getItem(5);
  var unitPres = localStorage.getItem(6);
  if (e.button === 'up') {
    console.log('up click, ' + location1);
    var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location1);
  } else if (e.button === 'select') {
    console.log('select click, ' + location2);
    var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location2);
  } else if (e.button === 'down') {
    console.log('down click, ' + location3);
    var URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location3);
  }
    ajax(
          {
            url: URL,
            type: 'json'
          },
          function(data, status, request) {
            var kts = Math.round(data.wind.speed*2.23693629*0.868);
            var mph = Math.round(data.wind.speed*2.23693629);
            var kph = Math.round(data.wind.speed*2.23693629*1.60934);
            var windUnit;
            if (unitWind == "kph") {
              windUnit = kph;
            } else if (unitWind == "mph") {
              windUnit = mph;
            } else if (unitWind == "kts") {
              windUnit = kts;
            }
            var deg = Math.round(data.wind.deg);
            var cover = data.clouds.all;
            var hPa = Math.round(data.main.pressure);
            var inHg = data.main.pressure/33.86.toFixed(2);
            
            var presUnit;
            if (unitPres == "hPa") {
              presUnit = hPa;
            } else if (unitPres == "inHg") {
              presUnit = inHg;
            }
            var c = Math.round(data.main.temp-273.15);
            var f = Math.round(data.main.temp-273.15*1.8+32);
            
            var tempUnit;
            if (unitTemp == "c") {
              tempUnit = c;
            } else if (unitTemp == "f") {
              tempUnit = f;
            }
            var humid = data.main.humidity + '% humidity.';
            var desc1 = data.weather[0].description;
            var cityName = data.name;
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
              
              var details;
              var image = new UI.Image({position: new Vector2(94,60), size: new Vector2(50,50)});
              var detailWind = new UI.Window({fullscreen: true});
              var rect = new UI.Rect({position: new Vector2(0,0), size: new Vector2(144,168), backgroundColor: 'white'});
              detailWind.add(rect);
              
             if (e.item.title === 'Wind') {
                 details = new UI.Text({
                   position: new Vector2(0,31),
                   size: new Vector2(93,60),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: deg + "°\n" + windUnit,
                   color: 'black'
                 });
                 image.image('images/icon_thermo.png');
               
             } else if (e.item.title === 'Cloud') {
                 details = new UI.Text({
                   position: new Vector2(0,59),
                   size: new Vector2(93,50),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: cover + "%",
                   color: 'black'
                 });
               image.image('images/icon_speed.png');
               image.size(new Vector2(51,50));
               
             } else if (e.item.title === 'Pressure') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(93,50),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: hPa
               });
               image.image('images/icon_cloud.png');
               
             } else if (e.item.title === 'Temperature') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(93,50),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: c
               });
               image.image('images/icon_cloud.png');
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
               details = new UI.Text({
                 position: new Vector2(0,0),
                 size: new Vector2(144,168),
                 font: 'gothic-28-bold',
                 textAlign: 'center',
                 text: tempUnit + "°" + unitTemp + "\n" + windWx + "\n" + cover + "%\n" + desc1,
                 color: 'black'
               });
             }
              detailWind.add(details);
              detailWind.add(image);
              detailWind.show();
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