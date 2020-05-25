let express = require("express");
let router = express.Router();
let exec = require("child_process").exec;

let db = require("../models");
let auth = require("../common/authentication.js");
let errorResp = require("../common/errorResponse.js");
let consts = require("../config/constants.js");

// This is our main entrypoint to the HTTP server:
router.get("/", (req, res, next) => {
    let ejsLoginFailed = (req.query.failed !== undefined) ? true : false;
    res.render("./login", { loginFailed: ejsLoginFailed });
});

// GET for logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

// Dashboard pages:
router.get("/overview", requiresLogin, (req, res, next) => {
    db.gatewayStatus.findAll({}).then((data) => {
        let dbData = data[0].dataValues;

        let overviewPageData = {
            url: req.url,
            gatewayData: {
                GatewaySN:        dbData.gatewaySN,
                GatewayMAC:       dbData.gatewayMAC,
                GatewayType:      dbData.gatewayType,

                Version:          dbData.version,

                GatewayLat:       dbData.gatewayLat,
                GatewayLng:       dbData.gatewayLng,
                GatewayAlt:       dbData.gatewayAlt,

                NetworkInterface: dbData.networkInterface,
                WifiMode:         dbData.wifiMode,
                uptimeInMins:     dbData.uptimeInMins,
                ConnectionMode:   dbData.connectionMode,
                DebugMode:        dbData.debugMode
            }
        };

        exec("cat /proc/uptime", (err, stdout, stderr) => {
            if (err !== null) {
                logger.error(err);
                errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);        
            } else {
                overviewPageData.gatewayData.uptimeInMins = Math.floor((stdout.split(".")[0]) / 60);
                res.render("./dashboard/overview.ejs", overviewPageData);
            }
        });
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/admin/password", requiresLogin, function(req, res) {
    let adminPageData = {
        url: ""
    };
    adminPageData.url = req.url;
    res.render("./dashboard/admin.ejs", adminPageData);
});

router.get("/admin/networkmode", requiresLogin, function(req, res) {
    db.gatewayStatus.find({}).then((data) => {
        if (data !== null) {
            let adminPageData = {};
            adminPageData.url = req.url;
            adminPageData.networkMode = {
                name:       data.dataValues.networkInterface,
                isApMode:   data.wifiMode === "AP"
            };
            res.render("./dashboard/admin.ejs", adminPageData);
        } else {
            let msg = "No gatewayStatus record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/admin/wifimode", requiresLogin, function(req, res) {
    let adminPageData = {
        url: ""
    };
    adminPageData.url = req.url;
    db.wifiAccount.findAll({}).then((wifiData) => {
        let dbWiFiData = [];
        wifiData.forEach((wifiRecord) => {
            dbWiFiData.push(wifiRecord.dataValues);
        });
        db.gatewayStatus.find({}).then((data) => {
            let dbData = data.dataValues;

            adminPageData.networkInterface = dbData.networkInterface;
            let wifiDetails = dbWiFiData.filter((each) => {
                return each.mode === dbData.wifiMode.toLowerCase();
            })[0];
            let apModeDetails = dbWiFiData.filter((each) => {
                return each.mode === "ap";
            })[0];
            let stnModeDetails = dbWiFiData.filter((each) => {
                return each.mode === "station";
            })[0];
            adminPageData.wifiMode = {
                name:           dbData.wifiMode,
                content: {
                    apMode: {
                        ssid:       apModeDetails.ssid,
                        password:   apModeDetails.password
                    },
                    stnMode: {
                        ssid:       stnModeDetails.ssid,
                        password:   stnModeDetails.password
                    }
                }
            };
            
            res.render("./dashboard/admin.ejs", adminPageData);
        }).catch((err) => {
            logger.error(err);
            errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
        });
    }).catch((err) => {
        logger.error(err);
        let msg = JSON.stringify({ success: false })
        errorResp.send(res, consts.error.badRequestLabel, msg, 500);
    })
});

router.get("/admin/debug", requiresLogin, function(req, res) {
    db.gatewayStatus.find({}).then((data) => {
        let dbData = data.dataValues;

        let adminPageData = {
            url: req.url,
            gatewayData: {
                DebugMode: dbData.debugMode
            }
        };

        res.render("./dashboard/admin.ejs", adminPageData);
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/lora/overview", requiresLogin, function(req, res) {
    let loraOverviewPageData = {
        url: req.url
    };
    db.loraOverviewInfo.find().then((data) => {
        loraOverviewPageData.overviewData = {
            freqBand:           data.dataValues.freqBand,
            uplinkChannel:      data.dataValues.uplinkChannel,
            gwServerIpPort:     data.dataValues.gwServerIpPort,
            ctrlServerIpPort:   data.dataValues.ctrlServerIpPort,
            antennaGain:        data.dataValues.antennaGain,
            fskEnable:          (data.dataValues.fskEnable.toString("hex") === "01") ? true : false,
            beaconEnable:       (data.dataValues.beaconEnable.toString("hex") === "01") ? true : false,
            pktRecdNum:         data.dataValues.pktRecdNum,
            pktSentNum:         data.dataValues.pktSentNum,
            beaconSentNum:      data.dataValues.beaconSentNum,
            clkDriftBias:       data.dataValues.clkDriftBias
        };
        res.render("./dashboard/lora.ejs", loraOverviewPageData);
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/lora/registry", requiresLogin, function(req, res) {
    let loraRegistryPageData = {
        url:        req.url,
        devices:    []
    };
    db.loraDeviceRegistry.findAll({
        limit:  100,
        order: [
            [ "utcTime", "DESC" ]
        ],
        include: [{
            // Because these tables have a "hasMany" relationship, we use
            // this clause to limit the number of returned records to 1.
            where: {
                utcTime: { $col: "loraDeviceRegistry.utcTime" }
            },
            model:      db.loraDeviceRegistryHistory,
            required:   false
        }]
    }).then((data) => {
        data.forEach((device) => {
            // A device might not have any registry history records (i.e.: nothing to join
            // with), so we will omit these from the displayed output.
            if (device.dataValues.loraDeviceRegistryHistories.length !== 0) {
                let foreignData = device.dataValues.loraDeviceRegistryHistories[0].dataValues;
                let deviceObj = {
                    devEUI:         device.dataValues.devEUI,
                    utcTime:        foreignData.utcTime.toISOString(),
                    gatewayTime:    foreignData.gatewayTime,
                    rssi:           foreignData.rssi,
                    snr:            foreignData.snr,
                    sf:             foreignData.sf,
                    bandwidth:      foreignData.bandwidth,
                    codeRate:       foreignData.codeRate,
                    crc:            (foreignData.crc.toString("hex") === "01") ? true : false
                };
                // Remove the "Z" at the end of the ISO string as it's both redundant and incorrect
                // in the 'utcTime' and 'gatewayTime' parameters' cases, respectively.
                deviceObj.utcTime = deviceObj.utcTime.substring(0, deviceObj.utcTime.length - 1);
                loraRegistryPageData.devices.push(deviceObj);
            }
        });
        res.render("./dashboard/lora.ejs", loraRegistryPageData);
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/lora/running", requiresLogin, function(req, res) {
    let loraRunningInfoPageData = {
        url:        req.url,
        devices:    []
    };
    db.loraDeviceStatus.findAll({
        limit:  100,
        order: [
            [ db.loraDeviceStatusHistory, "utcTime", "DESC" ]
        ],
        include: [{
            // Because these tables have a "hasMany" relationship, we use
            // this clause to limit the number of returned records to 1.
            where: {
                utcTime: { $col: "loraDeviceStatus.utcTime" }
            },
            model:      db.loraDeviceStatusHistory,
            required:   false
        }],
    }).then((data) => {
        data.forEach((device) => {
            // A device might not have any status history records (i.e.: nothing to join
            // with), so we will omit these from the displayed output.
            if (device.dataValues.loraDeviceStatusHistories.length !== 0) {
                let foreignData = device.dataValues.loraDeviceStatusHistories[0].dataValues;
                let fullDevInfo = {
                    devAddr:        device.devAddr,
                    fCnt:           foreignData.fCnt,
                    utcTime:        (foreignData.utcTime) ? foreignData.utcTime.toISOString() : null,
                    gatewayTime:    foreignData.gatewayTime,
                    frequency:      foreignData.frequency,
                    sf:             foreignData.sf,
                    bandwidth:      foreignData.bandwidth,
                    codeRate:       foreignData.codeRate,
                    payloadSize:    foreignData.payloadSize,
                    payload:        foreignData.payload,
                    rssi:           foreignData.rssi,
                    snr:            foreignData.snr,
                    crc:            (foreignData.crc) ? ((foreignData.crc.toString("hex") === "01") ? true : false) : null
                };
                // Remove the "Z" at the end of the ISO string as it's both redundant and incorrect
                // in the 'utcTime' and 'gatewayTime' parameters' cases, respectively.
                if (fullDevInfo.utcTime)
                    fullDevInfo.utcTime = fullDevInfo.utcTime.substring(0, fullDevInfo.utcTime.length - 1);
                loraRunningInfoPageData.devices.push(fullDevInfo);
            }
        });
        res.render("./dashboard/lora.ejs", loraRunningInfoPageData);
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/lora/running/devaddr/:devAddr", requiresLogin, function(req, res) {
    let loraRunningInfoPageData = {
        url:        req.url,
        devices:    []
    };
    db.loraDeviceStatus.findAll({
        where: {
            devAddr: req.params.devAddr
        },
        limit:  1,
        order: [
            [ db.loraDeviceStatusHistory, "utcTime", "DESC" ]
        ],
        include: [{
            model:      db.loraDeviceStatusHistory,
            required:   false,
        }],
        group: ["loraDeviceStatus.devAddr"]
    }).then((data) => {
        let device = data[0].dataValues;
        let devStatHist = device.loraDeviceStatusHistories;
        for (let i = 0; i < devStatHist.length; i++) {
            let fullDevInfo = {
                fCnt:           devStatHist[i].fCnt,
                utcTime:        (devStatHist[i].utcTime) ? devStatHist[i].utcTime.toISOString() : null,
                gatewayTime:    devStatHist[i].gatewayTime,
                frequency:      devStatHist[i].frequency,
                sf:             devStatHist[i].sf,
                bandwidth:      devStatHist[i].bandwidth,
                codeRate:       devStatHist[i].codeRate,
                payloadSize:    devStatHist[i].payloadSize,
                payload:        devStatHist[i].payload,
                rssi:           devStatHist[i].rssi,
                snr:            devStatHist[i].snr,
                crc:            (devStatHist[i].crc) ? ((devStatHist[i].crc.toString("hex") === "01") ? true : false) : null
            };
            // Remove the "Z" at the end of the ISO string as it's both redundant and incorrect
            // in the 'utcTime' and 'gatewayTime' parameters' cases, respectively.
            if (fullDevInfo.utcTime)
                fullDevInfo.utcTime = fullDevInfo.utcTime.substring(0, fullDevInfo.utcTime.length - 1);
            if (loraRunningInfoPageData.devices.length < 100) {
                loraRunningInfoPageData.devices.push(fullDevInfo);
            } else { // We have all we need, so exit the loop
                break;
            }
        }
        loraRunningInfoPageData.devAddr = device.devAddr;
        res.render("./dashboard/lora.ejs", loraRunningInfoPageData);
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.get("/systemlog", requiresLogin, function(req, res, next) {
    db.systemLog.findAll({
        order: [
            [ "date", "DESC" ]
        ]
    }).then((data) => {
        if (data !== null) {
            let systemLogPageData = {
                url:        req.url,
                logData:    []
            };
            data.forEach((logEntry) => {
                systemLogPageData.logData.push(logEntry.dataValues);
            });
            res.render("./dashboard/systemLog.ejs", systemLogPageData);
        } else {
            let msg = "No gatewayStatus record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect("/");
    }
}

module.exports = router;
