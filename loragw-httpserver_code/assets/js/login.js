"use strict";
/* eslint-disable */
//Login Page Script

////////////////////////////////////////////
//
// Widget Function for Login Page
//
////////////////////////////////////////////


$(document).ready(function () {
    let isCellPhone = checkCellPhone();
    if (isCellPhone) {
        $(".lora-gateway-dashboard-header > div > p").text("app Gateway");
        $(".lora-gateway-dashboard-header > div > p").css({ "font-size": "18px", "margin-top": "9px" });
        $(".lora-gateway-dashboard-footer").css("font-size", "16px");
    }
});

//Detect the device type is cell phone or not, according to html5 navigator
function checkCellPhone() {
    let is_other_cell_phone = /iPhone|BlackBerry|IEMobile/i.test(navigator.userAgent);
    let is_android_cell_phone = /^.*?\bAndroid\b.*?\bMobile\b.*?$/m.test(navigator.userAgent);
    return is_other_cell_phone || is_android_cell_phone;
}