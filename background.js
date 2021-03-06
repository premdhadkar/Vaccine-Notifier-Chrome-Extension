let initialseconds = 49;
let seconds = initialseconds;
let secondinterval = 20;
let interval = (secondinterval)/60;

chrome.notifications.onClicked.addListener((id)=>{
    if(id=="sendNotif")
        window.open("https://selfregistration.cowin.gov.in/",'_blank');
});

chrome.runtime.onInstalled.addListener(reason=>{
    chrome.storage.sync.set({'ServiceActive':"N"},()=>{});
    console.log("installed notifier extension");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if(request.message=="startService"){
        seconds = initialseconds;
        chrome.alarms.create('fetchdata',{periodInMinutes:interval});
        sendResponse({message:"Alarm created"});
    }
    else if(request.message==="stopService"){
        seconds = initialseconds;
        chrome.alarms.clear('fetchdata');
        sendResponse({message:"Alarm Stopped if any"});
    }
});

chrome.alarms.onAlarm.addListener((alarm)=>{
    chrome.storage.sync.get(["ServiceActive"],function (result) {
        if(result.ServiceActive === 'Y'){
            chrome.storage.sync.get(['Pincode','Vaccine','Dose','Age'],function (result) {
                let pincode = result.Pincode;
                let age = result.Age;
                let dose = result.Dose;
                let vaccine = result.Vaccine;
                let date = new Date()
                let month = date.toISOString().split("-")[1];
                let day = date.toDateString().split(" ")[2];
                seconds += secondinterval;
                fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincode+"&date="+day+"-"+month+"-2021")
                    .then(result => result.json())
                    .then(doc =>{
                        console.log('fetched data using api');
                        if(doc.centers){
                            let centers = doc.centers;
                            for(i in centers){
                                let center = centers[i];
                                if(center.sessions){
                                    let sessions = center.sessions;
                                    for( j in sessions){
                                        let session = sessions[j];
                                        if(session["available_capacity_dose"+dose] > 0 && session.min_age_limit == age){
                                            if(vaccine == session.vaccine || vaccine == "ANY"){
                                                if (seconds < initialseconds) {
                                                    return;
                                                }
                                                else{
                                                    seconds = 0;
                                                    chrome.notifications.create("sendNotif",{
                                                        title: 'Get Vaccinated Now',
                                                        message: 'Your Preferred slots are available, Click HERE!',
                                                        iconUrl: 'icon128.png',
                                                        type: 'image',
                                                        isClickable: true,
                                                        imageUrl: 'icon128.png'
                                                    },(id) =>{
                                                        ntt = new Audio('ntt.mp3').play();
                                                        console.log(id);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .catch(err => {
                        chrome.notifications.create("noInternet", {
                            title: 'No Internet',
                            message: 'You won\'t get notification as you are not connected to internet',
                            iconUrl: 'icon128.png',
                            type: 'image',
                            isClickable: false,
                            imageUrl: 'noi.png'
                        }, (id) => {
                            ntt = new Audio('ntt.mp3').play();
                            console.log(id);
                        });
                    });
            });
        }
    })
});
