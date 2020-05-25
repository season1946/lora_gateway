"use strict";
/* eslint-disable */
//Dashboard Page Shared Javascript

////////////////////////////////////////////
//
// Widget Function for Login Page
//
////////////////////////////////////////////

$(document).ready(function () {
    let formContentArray = $("#editWifiMode").serializeArray();
    let apMode = formContentArray.find((element) => { return element.name === "apMode"; });
    let stationMode = formContentArray.find((element) => { return element.name === "stationMode"; });
    let currentMode = apMode ? "apMode" : "statioinMode"; 
    hideEditPasswordAlert();
    hideEditWifiModeAlert();
    hideEditWifiModeSsidAndPassword(currentMode);
});

// Currently, the folling 3 functions are written inefficiently. First, they make HTTP
// requests to the /api/<route_name> URL, then upon getting the response code, they
// then re-request the same page again, this time passing an empty query parameter,
// either "?success" or "?failure", which will re-render the page with a URL that the
// frontend page will parse for clues as to whether the operation succeeded or failed.
// Obviously this is inefficient and creates unnecessary dependencies between frontend
// and the server, and may be changed sometime in the near future.

//Submit Edit Result Function
function editPassword() {
    $(".password-alert").hide();
    let formContentArray = $("#editPassword").serializeArray();
    let password = formContentArray.find((element) => { return element.name === "password"; });
    let confirmPassword = formContentArray.find((element) => { return element.name === "confirmPassword"; });
    if (password.value === "" || confirmPassword.value === "" || password.value !== confirmPassword.value) {
        $(".password-alert").show();
    } else {
        let passwReq = new XMLHttpRequest();
        passwReq.addEventListener("load", (resp) => {
            if (resp.currentTarget.status === 200) {
                window.location.assign("/admin/password?success");
            } else if (resp.currentTarget.status === 500) {
                window.location.assign("/admin/password?failure");
            }
        });
        passwReq.open("PUT", "/api/password");
        passwReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        passwReq.send(JSON.stringify({
            newPassword: password.value
        }));
    }
}

function editWifiMode() {
    $(".wifi-mode-alert").hide();
    let formContentArray = $("#editWifiMode").serializeArray();
    let apMode = formContentArray.find((element) => { return element.name === "apMode"; });
    let stationMode = formContentArray.find((element) => { return element.name === "stationMode"; });
    let apModeSsid = formContentArray.find((element) => { return element.name === "ap-mode-ssid"; });
    let apModePassword = formContentArray.find((element) => { return element.name === "ap-mode-password"; });
    let stnModeSsid = formContentArray.find((element) => { return element.name === "stn-mode-ssid"; });
    let stnModePassword = formContentArray.find((element) => { return element.name === "stn-mode-password"; });
    let ssid = apMode ? apModeSsid : stnModeSsid;
    let password = apMode? apModePassword : stnModePassword;
    if (ssid.value === "" || password.value === "") {
        $(".wifi-mode-alert").show();
    } else {
        let wifiReq = new XMLHttpRequest();
        wifiReq.addEventListener("load", (resp) => {
            if (resp.currentTarget.status === 200) {
                window.location.assign("/admin/wifimode?success");
            } else if (resp.currentTarget.status === 500) {
                window.location.assign("/admin/wifimode?failure");
            }
        });
        wifiReq.open("PUT", "/api/wifimode");
        wifiReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let wifiPutObj = {
            ssid: ssid.value,
            password: password.value
        };
        if (apMode)
            wifiPutObj.apMode = apMode.value;
        if (stationMode)
            wifiPutObj.stationMode = stationMode.value;
        wifiReq.send(JSON.stringify(wifiPutObj));
    }
}

function editNetworkMode() {
    let formContentArray = $("#editNetworkMode").serializeArray();
    let wifiMode = formContentArray.find((element) => { return element.name === "wifiMode"; });
    let lteMode = formContentArray.find((element) => { return element.name === "lteMode"; });
    let ethernetMode = formContentArray.find((element) => { return element.name === "ethernetMode"; });
    let apWiFiMode = formContentArray.find((element) => { return element.name === "isApMode"; });

    let agreed = true;
    if (apWiFiMode !== undefined && wifiMode !== undefined) {
        agreed = window.confirm("'AP Mode' is not available while using the WiFi network interface. Click 'OK' to automatically switch into 'Station' WiFi mode.");
    }
    let nwkReq = new XMLHttpRequest();
    nwkReq.addEventListener("load", (resp) => {
        if (resp.currentTarget.status === 200) {
            window.location.assign("/admin/networkmode?success");
        } else if (resp.currentTarget.status === 500) {
            window.location.assign("/admin/networkmode?failure");
        }
    });
    nwkReq.open("PUT", "/api/networkmode");
    nwkReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let nwkPutObj = {};
    if (wifiMode)
        nwkPutObj.wifiMode = wifiMode.value;
    if (lteMode)
        nwkPutObj.lteMode = lteMode.value;
    if (ethernetMode)
        nwkPutObj.ethernetMode = ethernetMode.value;
    if (agreed)
        nwkReq.send(JSON.stringify(nwkPutObj));
}

function editDebugMode() {
    let formContentArray = $("#editDebugMode").serializeArray();
    let debugMode0 = formContentArray.find((element) => { return element.name === "debugMode0"; });
    let debugMode1 = formContentArray.find((element) => { return element.name === "debugMode1"; });

    let agreed = true;
    if (debugMode1) {
        agreed = window.confirm("Turning on debug mode will impact system performance. Continue?");
    }
    let debugReq = new XMLHttpRequest();
    debugReq.addEventListener("load", (resp) => {
        if (resp.currentTarget.status === 200) {
            window.location.assign("/admin/debug?success");
        } else if (resp.currentTarget.status === 500) {
            window.location.assign("/admin/debug?failure");
        }
    });
    debugReq.open("PUT", "/api/debugmode");
    debugReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let debugReqObj = {};
    if (debugMode0)
        debugReqObj.debugMode0 = debugMode0.value;
    if (debugMode1)
        debugReqObj.debugMode1 = debugMode1.value;
    if (agreed)
        debugReq.send(JSON.stringify(debugReqObj));
}

function hideEditPasswordAlert() {
    $(".password-alert").hide();
}

function hideEditWifiModeAlert() {
    $(".wifi-mode-alert").hide();
}

function hidePasswordUpdateSuccessAlert() {
    $(".update-success").hide();
}

function hidePasswordUpdateFailureAlert() {
    $(".update-failure").hide();
}

function hideEditWifiModeSsidAndPassword(currentMode) {
    if (currentMode === "apMode") {
        showAPModeContent();
        hideStationModeContent();
    }
    else {
        showStationModeContent();
        hideAPModeContent();
    }
}

function hideAPModeContent() {
    $(".apModeContent").hide();
}

function showAPModeContent() {
    $(".apModeContent").show();
}

function hideStationModeContent() {
    $(".stationModeContent").hide();
}

function showStationModeContent() {
    $(".stationModeContent").show();
}

function hideDebugModeUpdateSuccessAlert() { $(".update-success").hide() }
function hideDebugModeUpdateFailureAlert() { $(".update-failure").hide() }

//Help Function
function switchToAPMode() {
    let currentMode = "apMode";
    hidePasswordUpdateSuccessAlert();
    hideEditWifiModeSsidAndPassword(currentMode);
    $("#stationMode").prop("checked", false);
}

function switchToStationMode() {
    let currentMode = "stationMode";
    hidePasswordUpdateSuccessAlert();
    hideEditWifiModeSsidAndPassword(currentMode);
    $("#apMode").prop("checked", false);
}

function switchToWifiMode() {
    hidePasswordUpdateSuccessAlert();
    $("#lteMode").prop("checked", false);
    $("#ethernetMode").prop("checked", false);
}

function switchToLTEMode() {
    hidePasswordUpdateSuccessAlert();
    $("#wifiMode").prop("checked", false);
    $("#ethernetMode").prop("checked", false);
}

function switchToEthernetMode() {
    hidePasswordUpdateSuccessAlert();
    $("#wifiMode").prop("checked", false);
    $("#lteMode").prop("checked", false);
}

function switchToDebugMode0() {
    hidePasswordUpdateSuccessAlert();
    $("#debugMode1").prop("checked", false);
}

function switchToDebugMode1() {
    hidePasswordUpdateSuccessAlert();
    $("#debugMode0").prop("checked", false);
}
