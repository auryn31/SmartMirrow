$(document).ready(function() {  
  reqListener();
  setInterval(reqListener, 360000);
  addWeatherToHTML();
  setInterval(addWeatherToHTML, 90000);
  addTimerHTMLToSite();
  setInterval(addTimerHTMLToSite, 1000);
  loadNews();
  setInterval(loadNews, 360000);
});

//constants
var today = new Date();
var weekday = new Array(7);
weekday[0] =  "So";
weekday[1] = "Mo";
weekday[2] = "Di";
weekday[3] = "Mi";
weekday[4] = "Do";
weekday[5] = "Fr";
weekday[6] = "Sa";

//news
function createNewsHTML(news){  
  var html = '<ul><i class="material-icons newsHead">public</i>';  
  for (var i = 0; i < news.length; i++) {
    html += '<li><h1>'+news[i].title +'</h1>'+news[i].description+'</li>'    ;
  };
  html += '</ul>';  
  $("#news").html(html);
}

function loadNews(){
  $.getJSON("https://newsapi.org/v1/articles?source=wired-de&language=de&apiKey=YOUR_API_KEY", function(data){
    createNewsHTML(data.articles);
  });
}

//time
function addTimerHTMLToSite(){  
  $("#currentTime").html(getTimeHTML());
}

function getTimeHTML(){
  var today = new Date();
  return '<h2>'+getDateFormat(today)+'</h2><br><h3>'+getTimeFormat(today)+'</h3>';
}

function getDateFormat(today){
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  } 
  if(mm<10){
      mm='0'+mm;
  } 
  return dd+'.'+mm+'.'+yyyy;
}

function getTimeFormat(today){
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();
  if(minutes<10){
      minutes='0'+minutes;
  } 
  if(hours<10){
      hours='0'+hours;
  } 
  if(seconds<10){
      seconds='0'+seconds;
  } 
  return hours + ':' + minutes + ':' + seconds +' Uhr';
}

//weather
function addWeatherToHTML(){
  $.simpleWeather({
    location: 'YOUR_LOCATION',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      html = createWeatherHTML(weather);
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}

function getDayString(offset){
  if(today.getDay()+offset>6){
    return weekday[(today.getDay()+offset-7)];
  }
  return weekday[(today.getDay()+offset)];
}

function createWeatherHTML(weather){
  var html = '<div><h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2></div>';
  html += '<div><li id="city">'+weather.city+'</li></div>';
  html += '<div><ul id="tempMinMax"><li>'+'<i class="material-icons">call_received</i> '+weather.low+'&deg;'+weather.units.temp;
  html += '<i class="material-icons">call_made</i> '+weather.high+'&deg;'+weather.units.temp+'</li></ul></div>';    
  html += '<div class="overviewTemp"><ul><li><i class="material-icons">wb_sunny</i> '+weather.sunrise+ '&nbsp;&nbsp; ';
  html += '<i class="material-icons">lightbulb_outline</i> '+weather.sunset+'</li>';
  html += '<li class="currently">'+weather.currently + '&nbsp; &nbsp; ';
  html += weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul></div>';
  html += createForeCastHTML(weather);
  return html;
}

function createForeCastHTML(weather){
  var html = '<div class="forecast"><table id="forecast">';
  for (var i = 1; i <= 4; i++) {
    html += '<tr>'
    html += '<th>' 
      + getDayString(i)
      +': </th>';
    html += '<th>'
      +' <i class="icon-'+weather.forecast[i].code+' forecastIcon"></i> '      
      +'</th>';  
    html += '<th>' 
      +weather.forecast[i].low
      +'&deg;'+weather.units.temp
      +' - '
      +weather.forecast[i].high
      +'&deg;'
      +weather.units.temp
      +'</th></tr>';
    
  };
  html += '</table></div>';
  return html;
}

//calender
function reqListener () {
  $.post( "ical.php", function(response){
    loadCalender(response);
  });
}

function loadCalender(filename){
  new ical_parser(filename, function(cal) {
    var events = cal.getEvents();
    createCalendatHTMLforEntrys(events);    
  });
}

function createCalendatHTMLforEntrys(events){
  html = '<table>';
  html += '<caption><i class="material-icons calendarHead">event</i></caption>'
  for (var i = 0; i < events.length; i++) {
    var startDateArr = events[i].start_date.split("/");
    var dd = startDateArr[0];
    var mm = startDateArr[1];
    var yy = startDateArr[2];
    var yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    //show only calendarentries from today
    if((new Date(mm+"/"+dd+"/"+yy)) >= (yesterday) && (new Date(mm+"/"+dd+"/"+yy)) <= (new Date())){
      html += '<tr>'
      //'<th>'+ events[i].day +'</th>';
      //html += '<th>'+ dd+'.'+mm+'.'+yy +'</th>';
      html += '<th>'+ events[i].start_time +'</th>';
      html += '<th>'+ events[i].end_time +'</th>';      
      html += '<th>'+ events[i].SUMMARY +'</th></tr>';
    }
  };
  html += '</table>';
  $("#calendar").html(html);
}