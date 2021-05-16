var dist_code = "141";                  //district code of the district
var startDate = new Date(2021,05,16);
var endDate = new Date(2021,05,16);
var waitTime = 7;                       //reload time in seconds

Date.prototype.addDay = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDateArray(strDate, stpDate) {
    var dArray = new Array();
    var cDate = strDate;
    while (cDate <= stpDate) {
        var d = new Date(cDate);
        var dd = d.getDate();
        var mm = d.getMonth();
        var yyyy = d.getFullYear();
        if(d.getDate()<10)
            dd = '0'+dd;
        if(d.getMonth()<10)
            mm = '0'+mm;
        var n = dd+"-"+mm+"-"+yyyy;
        dArray.push(n); 
        cDate = cDate.addDay(1); 
    }
    return dArray;
}
var dateArr = getDateArray(startDate,endDate);

function playSound() {
    var audio = new Audio('https://www.cleversoundpromotions.com/wp-content/uploads/2015/01/182-Doorbell-3-Rings.wav');
    audio.play();
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
function isBelow18SessionAvailable(sessions) {
    for (var i=0; i < sessions.length; i++) {
      var session = sessions[i];
      if (session.min_age_limit == 18 && session.available_capacity != 0) {
        return true;
      }
    }
  }

function parser(a) {
    var capacity_45 = 0;
    var capacity_18 = 0;
    for (c in a.centers) {
        if (isBelow18SessionAvailable(a.centers[c].sessions)) {
            playSound();
          }
        for (s in a.centers[c].sessions) {
            if (a.centers[c].sessions[s].min_age_limit == 18 && a.centers[c].sessions[s].available_capacity > 0)
                capacity_18 = capacity_18 + a.centers[c].sessions[s].available_capacity;
            if (a.centers[c].sessions[s].min_age_limit == 45 && a.centers[c].sessions[s].available_capacity > 0)
                capacity_45 = capacity_45 + a.centers[c].sessions[s].available_capacity;
            }
            
        }        
        console.log("Total slots availiable:- For 18+ :"+capacity_18+",For 45+ :"+capacity_45);
        console.log("Total centers available:-"+a.centers.length);
        console.log("");
}

function seek(){
    console.log("Seek:"+x);
    x= x+1;
    for(i = 0; i<dateArr.length;i++){
        var URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+dist_code+"&date="+dateArr[i]+"ran"+getRandomInt(0,1000000);
        fetch(URL)
        .then(data=>{return data.json()})
        .then(res=>{parser(res)})
    }
}
var x = 1;
var dateArr = getDateArray(startDate,endDate);
var go = setInterval(seek, waitTime*1000);