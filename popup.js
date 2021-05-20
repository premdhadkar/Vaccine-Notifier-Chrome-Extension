$(function(){
    chrome.storage.sync.get(['Pincode','Vaccine','Age','ServiceActive'],function (result) {
        if(result.ServiceActive==='Y') {
            $('#pincode').val(result.Pincode);
            result.Age !== "18" ? $('#a45').prop("checked", true) : $('#a18').prop("checked", true);
            $("#vaccine").val(result.Vaccine);
            $('#pastService1').text("Service already Active for:-");
            $('#pastService2').text("PIN: " + result.Pincode);
            $('#pastService3').text("Age Group: " + result.Age + "+");
            switch (result.Vaccine) {
                case "COVISHIELD":
                    vaccine = "Covishield";
                    break;
                case "COVAXIN":
                    vaccine = "Covaxin";
                    break;
                case "SPUTNIKV":
                    vaccine = "Sputnik-V";
                    break;
                case "ANY":
                    vaccine = "Any Vaccine";
                    break;
            }
            $('#pastService4').text("Vaccine: " + vaccine);
        }
    });
    $('#addService').click(function(){
        let pin =  $('#pincode').val();
        let age =  $("input[name='age']:checked").val();
        let vaccine = $("#vaccine").val();
        if(pin.length !=6 || isNaN(pin) || pin.includes('.')){
            console.log('invalid pincode entered');
            $('#pincode').css('border-color','red');
            return;
        }else{
            $('#pincode').css('border-color','');
        }
        chrome.storage.sync.set({'Pincode' : pin}, function () {
            console.log("pincode saved in sync as 'Pincode' with value: "+pin);
        });
        chrome.storage.sync.set({'Age' : age}, function () {
            console.log("age saved in sync as 'Age' with value: "+age);
        });
        chrome.storage.sync.set({'Vaccine' : vaccine}, function () {
            console.log("vaccine saved in sync as 'Vaccine' with value: "+vaccine);
        });
        chrome.storage.sync.set({'ServiceActive' : 'Y'}, function () {
            console.log("Service activated");
        });
        $('#pastService1').text("Service already Active for:-");
        $('#pastService2').text("PIN: " + pin);
        $('#pastService3').text("Age Group: " + age + "+");
        switch (vaccine) {
            case "COVISHIELD":
                vaccine = "Covishield";
                break;
            case "COVAXIN":
                vaccine = "Covaxin";
                break;
            case "SPUTNIKV":
                vaccine = "Sputnik-V";
                break;
            case "ANY":
                vaccine = "Any Vaccine";
                break;
        }
        $('#pastService4').text("Vaccine: " + vaccine);
        /*after submitting pin,age,vacc page*/
        chrome.runtime.sendMessage({message :"startService"}, (response)=>{});
    });
/*
    $('#temp').click(function () {
       chrome.storage.sync.get(['Pincode','Vaccine','Age','ServiceActive'],function (result) {
           console.log(result);
       })
    });
*/
    $('#resetServices').click(function () {
        chrome.storage.sync.set({'ServiceActive': 'N'},function () {
            console.log("service Deactivated");
        });
        chrome.storage.sync.set({'Vaccine': ''},function () {});
        chrome.storage.sync.set({'Pincode': ''},function () {});
        chrome.storage.sync.set({'Age': ''},function () {});
        chrome.runtime.sendMessage({message :"stopService"}, (response)=>{
            console.log(response.message);
        });
        $('#pastService4').text("");
        $('#pastService3').text("");
        $('#pastService2').text("");
        $('#pastService1').text("");
    });
});
