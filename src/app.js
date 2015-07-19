//Add desc to new UI

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Settings = require('settings');
var Vibe = require('ui/vibe');

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
    Vibe.vibrate('double');
  }

);

var main = new UI.Window({fullscreen: true});

var backgroundRect = new UI.Rect({
  position: new Vector2(0,0),
  size: new Vector2(144,168),
  color: 'white'
});

main.add(backgroundRect);

var mainCirc = new UI.Circle({
  position: new Vector2(72,40),
  radius: 25,
  backgroundColor: 'black',
});

main.add(mainCirc);

var mainNum = new UI.Text({
  position: new Vector2(60,12),
  size: new Vector2(30,30),
  font: 'bitham-42-light',
  text: '3',
  textAlign: 'left',
  color: 'white',
});

main.add(mainNum);

var mainTitle = new UI.Text({
  position: new Vector2(0,70),
  size: new Vector2(144,20),
  font: 'bitham-30-black',
  text: 'Weather',
  textAlign: 'center',
  color: 'black'
});

main.add(mainTitle);

var mainRect = new UI.Rect({
  position: new Vector2(0,110),
  size: new Vector2(144,2),
  backgroundColor: 'black'
});

main.add(mainRect);

var mainSub = new UI.Text({
  position: new Vector2(0,109),
  size: new Vector2(144,20),
  font: 'gothic-24-bold',
  text: 'Press any key',
  textAlign: 'center',
  textOverflow: 'wrap',
  color: 'black'
});

main.add(mainSub);

var mainRect2 = new UI.Rect({
  position: new Vector2(0,142),
  size: new Vector2(144,2),
  backgroundColor: 'black'
});

main.add(mainRect2);

var mainTime = new UI.TimeText({
  position: new Vector2(0,143),
  size: new Vector2(144,24),
  font: 'gothic-18-bold',
  textAlign: 'center',
  text: '%H:%M',
  color: 'black'
});

main.add(mainTime);

main.show();

main.on('longClick', 'select', function(e) {
  var unitWind = localStorage.getItem(4);
  var unitTemp = localStorage.getItem(5);
  var unitPres = localStorage.getItem(6);
  console.log('longSelect detected!');
  var locationOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    };
  function locationSuccess(pos) {
    var lat = pos.coords.latitude;
    var lat1 = lat.toString();
    var lon = pos.coords.longitude;
    var lon1 = lon.toString();
    var URL2 = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat1 + '&lon=' + lon1;
    
     
    ajax(
        {
          url: URL2,
          type: 'json'
        },
        function(data, status, request) {
          var kts = Math.round(data.wind.speed*2.23693629*0.868);
            var mph = Math.round(data.wind.speed*2.23693629);
            var kph = Math.round((data.wind.speed*2.23693629)*1.60934);
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
            var inHg = (data.main.pressure/33.86).toFixed(2);
            
            var presUnit;
            if (unitPres == "hPa") {
              presUnit = hPa;
            } else if (unitPres == "inHg") {
              presUnit = inHg;
            }
            var c = Math.round(data.main.temp-273.15);
            var f = Math.round(((data.main.temp-273.15)*1.8)+32);
            
            var tempUnit;
            if (unitTemp == "c") {
              tempUnit = c;
            } else if (unitTemp == "f") {
              tempUnit = f;
            }
            var desc1 = data.weather[0].description;
            desc1 = desc1.charAt(0).toUpperCase() + desc1.substring(1);
          
            
          
            var detailedDesc;
            if (desc1.indexOf("snow") >= 0) {
              detailedDesc = "Snow";
            } else if (desc1.indexOf("thunderstorm") >=0) {
              detailedDesc ="Thunderstorms";
            } else if (desc1.indexOf("rain") >= 0) {
              detailedDesc = "Rain";        
            } else if (desc1.indexOf("drizzle") >= 0) {
              detailedDesc = "Drizzle";
            } else if (desc1.indexOf("sleet") >= 0) {
              detailedDesc = "Sleet";
            } else if (desc1.indexOf("clear sky") >= 0) {
              detailedDesc = "Clear skies";
            } else if (desc1.indexOf("few clouds") >= 0) {
              detailedDesc = "Few";
            } else if (desc1.indexOf("scattered clouds") >= 0) {
              detailedDesc = "Scattered";
            } else if (desc1.indexOf("broken clouds") >=0) {
              detailedDesc = "Broken";
            } else if (desc1.indexOf("overcast clouds") >= 0) {
              detailedDesc = "Overcast";
            } else {
              detailedDesc = desc1;
            }
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
              var detailWind = new UI.Window({fullscreen: true});
              var rect = new UI.Rect({position: new Vector2(0,0), size: new Vector2(144,168), backgroundColor: 'white'});
              detailWind.add(rect);
              
              var titleText = new UI.Text({
                position: new Vector2(0,0),
                size: new Vector2(144,44),
                font: 'gothic-28-bold',
                textAlign: 'left',
                color: 'black',
                text: e.item.title
              });
              
             if (e.item.title === 'Wind') {
                 
               details = new UI.Text({
                   position: new Vector2(0,40),
                   size: new Vector2(144,100),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: deg + "°\n" + windUnit + "\n" + unitWind,
                   color: 'black'
                 });
               
               
             } else if (e.item.title === 'Cloud') {
                 details = new UI.Text({
                   position: new Vector2(0,59),
                   size: new Vector2(144,50),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: cover + "%",
                   color: 'black'
                 });
                 var details2 = new UI.Text({
                   position: new Vector2(0,102),
                   size: new Vector2(144,66),
                   font: 'gothic-28',
                   textAlign: 'left',
                   color: 'black',
                   text: detailedDesc
                 });
                 detailWind.add(details2);
               
               
             } else if (e.item.title === 'Pressure') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(144,100),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: presUnit + "\n" + unitPres
               });
               
             } else if (e.item.title === 'Temperature') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(144,50),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: tempUnit + "°" + unitTemp
               });
             } else if (e.item.title === 'Summary') {
               var windWx;
                 if (kts <= 5) {
                   windWx = ('Light breeze');
                 } else if (kts <= 20) {
                   windWx = ('Moderate wind');
                 } else if (kts < 35) {
                   windWx = ('Strong winds');
                 } else if (kts >= 35) {
                   windWx = ('Gale force winds');
                 }
               details = new UI.Text({
                 position: new Vector2(0,26),
                 size: new Vector2(144,138),
                 font: 'gothic-28-bold',
                 textAlign: 'left',
                 text: tempUnit + "°" + unitTemp + "\n" + windWx + "\n" + cover + "%\n" + desc1,
                 color: 'black'
               });
             }
              detailWind.add(titleText);
              detailWind.add(details);
              detailWind.show();
            });
          }
        );
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
  var URL;
  
  if (e.button === 'up') {
    console.log('up click, ' + location1);
    URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location1);
  } else if (e.button === 'select') {
    console.log('select click, ' + location2);
    URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location2);
  } else if (e.button === 'down') {
    console.log('down click, ' + location3);
    URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location3);
  }
    ajax(
          {
            url: URL,
            type: 'json'
          },
          function(data, status, request) {
            var kts = Math.round((data.wind.speed*2.23693629)*0.868);
            var mph = Math.round(data.wind.speed*2.23693629);
            var kph = Math.round((data.wind.speed*2.23693629)*1.60934);
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
            var inHg = (data.main.pressure/33.86).toFixed(2);
            
            var presUnit;
            if (unitPres == "hPa") {
              presUnit = hPa;
            } else if (unitPres == "inHg") {
              presUnit = inHg;
            }
            var c = Math.round(data.main.temp-273.15);
            var f = Math.round(((data.main.temp-273.15)*1.8)+32);
            
            var tempUnit;
            if (unitTemp == "c") {
              tempUnit = c;
            } else if (unitTemp == "f") {
              tempUnit = f;
            }
            var desc1 = data.weather[0].description;
            desc1 = desc1.charAt(0).toUpperCase() + desc1.substring(1);
          
            
          
            var detailedDesc;
            if (desc1.indexOf("snow") >= 0) {
              detailedDesc = "Snow";
            } else if (desc1.indexOf("thunderstorm") >=0) {
              detailedDesc ="Thunderstorms";
            } else if (desc1.indexOf("rain") >= 0) {
              detailedDesc = "Rain";        
            } else if (desc1.indexOf("drizzle") >= 0) {
              detailedDesc = "Drizzle";
            } else if (desc1.indexOf("sleet") >= 0) {
              detailedDesc = "Sleet";
            } else if (desc1.indexOf("clear sky") >= 0) {
              detailedDesc = "Clear skies";
            } else if (desc1.indexOf("few clouds") >= 0) {
              detailedDesc = "Few";
            } else if (desc1.indexOf("scattered clouds") >= 0) {
              detailedDesc = "Scattered";
            } else if (desc1.indexOf("broken clouds") >=0) {
              detailedDesc = "Broken";
            } else if (desc1.indexOf("overcast clouds") >= 0) {
              detailedDesc = "Overcast";
            } else {
              detailedDesc = desc1;
            }
            
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
              var detailWind = new UI.Window({fullscreen: true});
              var rect = new UI.Rect({position: new Vector2(0,0), size: new Vector2(144,168), backgroundColor: 'white'});
              detailWind.add(rect);
              
              var titleText = new UI.Text({
                position: new Vector2(0,0),
                size: new Vector2(144,44),
                font: 'gothic-28-bold',
                textAlign: 'left',
                color: 'black',
                text: e.item.title
              });
              
             if (e.item.title === 'Wind') {
                 
               details = new UI.Text({
                   position: new Vector2(0,40),
                   size: new Vector2(144,100),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: deg + "°\n" + windUnit + "\n" + unitWind,
                   color: 'black'
                 });
               
               
             } else if (e.item.title === 'Cloud') {
                 details = new UI.Text({
                   position: new Vector2(0,59),
                   size: new Vector2(144,50),
                   font: 'bitham-42-light',
                   textAlign: 'left',
                   text: cover + "%",
                   color: 'black'
                 });
                 var details2 = new UI.Text({
                   position: new Vector2(0,102),
                   size: new Vector2(144,66),
                   font: 'gothic-28',
                   textAlign: 'left',
                   color: 'black',
                   text: detailedDesc
                 });
                 detailWind.add(details2);
               
               
             } else if (e.item.title === 'Pressure') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(144,100),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: presUnit + "\n" + unitPres
               });
               
             } else if (e.item.title === 'Temperature') {
               details = new UI.Text({
                 position: new Vector2(0,59),
                 size: new Vector2(144,50),
                 font: 'bitham-42-light',
                 textAlign: 'left',
                 color: 'black',
                 text: tempUnit + "°" + unitTemp
               });
             } else if (e.item.title === 'Summary') {
               var windWx;
                 if (kts <= 5) {
                   windWx = ('Light breeze');
                 } else if (kts <= 20) {
                   windWx = ('Moderate wind');
                 } else if (kts < 35) {
                   windWx = ('Strong winds');
                 } else if (kts >= 35) {
                   windWx = ('Gale force winds');
                 }
               details = new UI.Text({
                 position: new Vector2(0,26),
                 size: new Vector2(144,138),
                 font: 'gothic-28-bold',
                 textAlign: 'left',
                 text: tempUnit + "°" + unitTemp + "\n" + windWx + "\n" + cover + "%\n" + desc1,
                 color: 'black'
               });
             }
              detailWind.add(titleText);
              detailWind.add(details);
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