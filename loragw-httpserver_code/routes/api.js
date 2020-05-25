let express = require("express");
let router = express.Router();
let sys = require("sys");
let exec = require("child_process").exec;

let db = require("../models");
let errorResp = require("../common/errorResponse.js");
let consts = require("../config/constants.js");

router.post("/login", (req, res, next) => {
    db.adminAccount.findAll({
        where: {
            username: req.body.username
        }
    }).then((data) => {
        if (data !== undefined && data.length > 0) {
            let userAcct = data[0];
            if (req.body.password === userAcct.password) {
                req.session.userId = userAcct.userID;
                res.redirect("/overview");
            } else { res.redirect("/?failed"); }
        } else { res.redirect("/?failed"); }
    }).catch((err) => {
        logger.error(err);
        errorResp.send(res, consts.error.serverErrorLabel, "" + err, 500);
    });
});

router.put("/password", (req, res, next) => {
    db.adminAccount.find({
        where: {
            username: "admin"
        }
    }).then((data) => {
        if (data !== null) {
            db.adminAccount.update({
                password: req.body.newPassword
            }, {
                where: {
                    username: "admin"
                }
            }).then((resp) => {
                res.send({ success: true });
            }).catch((err) => {
                logger.error(err);
                let msg = JSON.stringify({ success: false })
                errorResp.send(res, consts.error.badRequestLabel, msg, 500);
            });
        } else {
            let msg = "No adminAccount record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    });
});

router.put("/networkmode", (req, res, next) => {
    let whichMode;
    if (req.body.wifiMode)
        whichMode = "WiFi";
    if (req.body.lteMode)
        whichMode = "LTE";
    if (req.body.ethernetMode)
        whichMode = "Ethernet";

    db.gatewayStatus.find({}).then((data) => {
        if (data !== null) {
            let updateObj = {
                networkInterface: whichMode
            };
            if (whichMode === "WiFi") { // Gateway WiFi cannot be in AP mode when network interface is "WiFi"
                updateObj.wifiMode = "Station";
            }
            db.gatewayStatus.update(updateObj, {
                where: {
                    gatewaySN: data.dataValues.gatewaySN
                }
            }).then((resp) => {
                res.send({ success: true });
                // WiFi mode has changed, therefore send signal to Linux PID
                if (updateObj.wifiMode !== undefined) {
                    let procName = "lora_gateway_agent";
                    exec("pidof " + procName, (err, stdout, stderr) => {
                        if (err !== null) {
                            logger.error(err);
                        } else {
                            let pid = parseInt(stdout);
                            exec("kill -10 " + pid, (err, stdout, stderr) => {
                                if (err !== null) {
                                    logger.error(err);
                                } // Else we're all good
                            });
                        }
                    });
                }
            }).catch((err) => {
                logger.error(err);
                let msg = JSON.stringify({ success: false })
                errorResp.send(res, consts.error.badRequestLabel, msg, 500);
            });
        } else {
            let msg = "No gatewayStatus record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    }).catch((err) => {
        logger.error(err);
        let msg = JSON.stringify({ success: false })
        errorResp.send(res, consts.error.badRequestLabel, msg, 500);
    });
});

router.put("/wifimode", (req, res, next) => {
    let whichMode;
    let whichModeGw;
    if (req.body.apMode) {
        whichMode = "ap";
        whichModeGw = "AP";
    }
    if (req.body.stationMode) {
        whichMode = "station";
        whichModeGw = "Station";
    }

    db.gatewayStatus.find({}).then((gwData) => {
        if (gwData !== null) {
            let oldWiFiMode = gwData.wifiMode.toLowerCase();
            db.gatewayStatus.update({
                wifiMode: whichModeGw
            }, {
                where: {}
            }).then((gwResp) => {
                db.wifiAccount.find({
                    where: {
                        mode: whichMode
                    }
                }).then((data) => {
                    if (data !== null) {
                        let oldSSID = data.dataValues.ssid;
                        let oldPassword = data.dataValues.password;
                        db.wifiAccount.update({
                            ssid:       req.body.ssid,
                            password:   req.body.password
                        }, {
                            where: {
                                mode: whichMode
                            }
                        }).then((resp) => {
                            // WiFi mode has changed, therefore send signal to Linux PID
                            if (oldWiFiMode !== whichMode || oldPassword !== req.body.password ||
                                oldSSID !== req.body.ssid) {
                                let procName = "lora_gateway_agent";
                                exec("pidof " + procName, (err, stdout, stderr) => {
                                    if (err !== null) {
                                        logger.error(err);
                                    } else {
                                        let pid = parseInt(stdout);
                                        exec("kill -10 " + pid, (err, stdout, stderr) => {
                                            if (err !== null) {
                                                logger.error(err);
                                            } // Else we're all good
                                        });
                                    }
                                });
                            }
                            res.send({ success: true });
                        }).catch((err) => {
                            logger.error(err);
                            let msg = JSON.stringify({ success: false })
                            errorResp.send(res, consts.error.badRequestLabel, msg, 500);
                        });
                    } else {
                        let msg = "No wifiAccount record found. Please check database.";
                        errorResp.send(res, consts.error.badRequestLabel, msg, 400);
                    }
                }).catch((err) => {
                    logger.error(err);
                    let msg = JSON.stringify({ success: false })
                    errorResp.send(res, consts.error.badRequestLabel, msg, 500);
                });
            }).catch((err) => {
                logger.error(err);
                let msg = JSON.stringify({ success: false })
                errorResp.send(res, consts.error.badRequestLabel, msg, 500);
            });
        } else {
            let msg = "No gatewayStatus record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    }).catch((err) => {
        logger.error(err);
        let msg = JSON.stringify({ success: false })
        errorResp.send(res, consts.error.badRequestLabel, msg, 500);
    });
});

router.put("/debugmode", (req, res, next) => {
    let whichMode;
    if (req.body.debugMode0)
        whichMode = 0;
    if (req.body.debugMode1)
        whichMode = 1;

    db.gatewayStatus.find({}).then((data) => {
        if (data !== null) {
            let oldDebugMode = data.dataValues.debugMode;
            let updateObj = {
                debugMode: whichMode
            };
            db.gatewayStatus.update(updateObj, {
                where: {
                    gatewaySN: data.dataValues.gatewaySN
                }
            }).then((resp) => {
                res.send({ success: true });
                // Debug mode has changed, therefore send signal to Linux PID
                if (oldDebugMode !== whichMode) {
                    let procName = "lora_gateway_agent";
                    exec("pidof " + procName, (err, stdout, stderr) => {
                        if (err !== null) {
                            logger.error(err);
                        } else {
                            let pid = parseInt(stdout);
                            exec("kill -12 " + pid, (err, stdout, stderr) => {
                                if (err !== null) {
                                    logger.error(err);
                                } // Else we're all good
                            });
                        }
                    });
                }
            }).catch((err) => {
                logger.error(err);
                let msg = JSON.stringify({ success: false })
                errorResp.send(res, consts.error.badRequestLabel, msg, 500);
            });
        } else {
            let msg = "No gatewayStatus record found. Please check database.";
            errorResp.send(res, consts.error.badRequestLabel, msg, 400);
        }
    }).catch((err) => {
        logger.error(err);
        let msg = JSON.stringify({ success: false })
        errorResp.send(res, consts.error.badRequestLabel, msg, 500);
    });
});

module.exports = router;
