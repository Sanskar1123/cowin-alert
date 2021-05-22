var dist_code = "141";                  //district code of the district (Central Delhi in this case)
var startDate = new Date(2021,05,23);   //start date in yyyy,mm,dd format
var endDate = new Date(2021,05,23);     //end date in yyyy,mm,dd format
var age = 18;                           //enter your age to search for slots for your age 
var dose = 1;                           //enter 1 to set alert for dose 1 slots, 2 for dose 2 slots and 0 for any of dose 1 or dose 2 slots
var check_free_of_cost_slots = 1;       //enter 1 to set alert for free of cost slots only, enter 0 to set alert for both paid and free slots
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
    return Math.floor(Math.random() * (max - min) + min); 
  }
function isAbove18SessionAvailable(sessions) {
    for (var i=0; i < sessions.length; i++) {
        var session = sessions[i];
        if(dose == 0)
            if (session.min_age_limit == 18 && session.available_capacity > 0) 
                return true;
        if(dose == 1)
            if (session.min_age_limit == 18 && session.available_capacity_dose1 > 0) 
                return true;
        if(dose == 2)
            if (session.min_age_limit == 18 && session.available_capacity_dose2 > 0)
                return true;
    }
  }
function isAbove45SessionAvailable(sessions) {
    for (var i=0; i < sessions.length; i++) {
        var session = sessions[i];
        if(dose == 0)
            if (session.min_age_limit == 45 && session.available_capacity > 0) 
                return true;
        if(dose == 1)
            if (session.min_age_limit == 45 && session.available_capacity_dose1 > 0) 
                return true;
        if(dose == 2)
            if (session.min_age_limit == 45 && session.available_capacity_dose2 > 0)
                return true;
    }
  }

function parser(a) {
    var capacity_45_dose1 = 0;
    var capacity_45_dose2 = 0;
    var capacity_18_dose1 = 0;
    var capacity_18_dose2 = 0;
    for (c in a.centers) {
        var free_slot = true;
        if(check_free_of_cost_slots == 1 && a.centers[c].fee_type== "Paid")
            free_slot= false;
        if(free_slot){
            if (age<45 && age>=18)
                if (isAbove18SessionAvailable(a.centers[c].sessions)) {
                    playSound();
                }
            if (age>=45)
                if (isAbove45SessionAvailable(a.centers[c].sessions)) {
                    playSound();
                }
        }
        
        for (s in a.centers[c].sessions) {
            if (a.centers[c].sessions[s].min_age_limit == 18 && a.centers[c].sessions[s].available_capacity_dose1 > 0)
                capacity_18_dose1 = capacity_18_dose1 + a.centers[c].sessions[s].available_capacity_dose1;
            if (a.centers[c].sessions[s].min_age_limit == 18 && a.centers[c].sessions[s].available_capacity_dose2 > 0)
                capacity_18_dose2 = capacity_18_dose2 + a.centers[c].sessions[s].available_capacity_dose2;
            if (a.centers[c].sessions[s].min_age_limit == 45 && a.centers[c].sessions[s].available_capacity_dose1 > 0)
                capacity_45_dose1 = capacity_45_dose1 + a.centers[c].sessions[s].available_capacity_dose1;
            if (a.centers[c].sessions[s].min_age_limit == 45 && a.centers[c].sessions[s].available_capacity_dose2 > 0)
                capacity_45_dose2 = capacity_45_dose2 + a.centers[c].sessions[s].available_capacity_dose2;
            }
            
        }        
        console.log("Total dose 1 slots availiable:- For 18+ :"+capacity_18_dose1+",For 45+ :"+capacity_45_dose1);
        console.log("Total dose 2 slots availiable:- For 18+ :"+capacity_18_dose2+",For 45+ :"+capacity_45_dose2);
        console.log("Total centers available: "+a.centers.length);
        console.log("");
}

function seek(){
    console.log("Seek:"+x);
    x= x+1;
    for(i = 0; i<dateArr.length;i++){
        var URL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+dist_code+"&date="+dateArr[i]+"&ran"+getRandomInt(0,1000000);
        fetch(URL)
        .then(data=>{return data.json()})
        .then(res=>{parser(res)})
    }
}
var x = 1;
var dateArr = getDateArray(startDate,endDate);
var go = setInterval(seek, waitTime*1000);