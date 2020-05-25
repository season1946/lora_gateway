let mqtt = require("mqtt");
let coap = require("coap");
let udp = require("dgram");
let tcp = require("net");

let config = reqFile("./config/config.js");
let consts = reqFile("./config/constants.js");
let utilities = reqFile("./common/utilities.js");

let obj = {};

// The following array will only contain a simple 1-dimensional array of strings
// representing the gateway MACs received so far. The array is maintained in a
// sorted order so that searching it is fast.
let gwMACs = [];
// Once we quickly obtain the index of the gateway MAC in the above array, we can
// look up more information about this particular gateway such as its communication
// protocol (i.e.: MQTT, CoAP, or UDP);
let gwMACsInfo = [];

let mqttClient;
let coapServer;
let tcpClient;

obj.start = function() {
    logger.info("Starting LoRa Gateway Server Bridge...");
    logger.info("Environment:", config.environment);

    // Order is not important:
    // 1. Start up MQTT connection
    // 2. Start up CoAP connection
    // 3. Start up UDP connection
    // 4. Start up TCP connection with gw server

    // -------------- MQTT: (default port 1883) ---------------
    mqttClient = mqtt.connect("mqtt://" + config.mqttBrokerHost); // TODO: Set up our own MQTT broker
    mqttClient.on("connect", () => {
        logger.info("  - Connected to MQTT broker at", config.mqttBrokerHost);
        mqttClient.subscribe(config.mqttPublishTopic);
    });
    mqttClient.on("message", (topic, msg) => {
        processOutgoingLoRaPacket(msg, "MQTT", null);
    });

    // -------------- CoAP: (default port 5683) ---------------
    coapServer = coap.createServer();
    coapServer.listen(config.coapPort, () => {
        logger.info("  - CoAP server listening on port 5683")
    });
    coapServer.on("request", (coapReq, coapRes) => {
        processOutgoingLoRaPacket(coapReq.payload, "CoAP", coapRes);
    });

    // -------------- UDP: (port 7777) ----------------
    let udpServer = udp.createSocket("udp4");
    udpServer.bind(config.udpPort, config.udpHost);
    udpServer.on("listening", () => {
        logger.info("  - UDP server listening on port", config.udpPort)
    });
    udpServer.on("message", (message, remote) => {
        processOutgoingLoRaPacket(message, "UDP", remote);
    });

    // -------------- TCP: (port 6666) ----------------
    tcpClient = new tcp.Socket();
    tcpClient.connect(config.lgsPort, config.lgsHost, () => {
        logger.info("  - Connected to LoRa Gateway Server");
    });
    tcpClient.on("data", (msg) => {
        processLoRaReplyPacket(msg);
    });
};

// To the LoRa Gateway Server (uplink)
function processOutgoingLoRaPacket(msg, protocol, replyVar) {
    let msgStr = msg.toString("hex").toUpperCase();
    let bytePosInChars = consts.dataPacketFormatBytePosition * 2;
    let versionByteStr = msgStr.substring(bytePosInChars, bytePosInChars + 2);
    // Parse the gateway MAC from the incoming messages and record which
    // interface it's using so that we can get responses back to that gateway
    // from the LoRa gateway server (LGS).
    let gwMAC;
    switch (versionByteStr) {
        case consts.dataFormatBytes["v0.1"]:
            gwMAC = msgStr.substring(8, 24);
            break;
        default:
            break;
    }
    if (gwMAC !== undefined) {
        let newIndex;
        let gwMacIndex = utilities.partitionSearchSortedArray(gwMAC, gwMACs, 0, gwMACs.length);
        if (gwMacIndex === -1) {
            newIndex = utilities.insertIntoSortedArray(gwMAC, gwMACs);
            let gwObj = {
                protocol:   protocol
            };
            gwMACsInfo.splice(newIndex, 0, gwObj);
        }
        if (replyVar !== null) {
            let index = (gwMacIndex !== -1) ? gwMacIndex : newIndex;
            gwMACsInfo[index].replyVar = replyVar;
        }
        tcpClient.write(msg);
    } // Else unsupported data format
}

// From the LoRa Gateway Server (downlink)
function processLoRaReplyPacket(msg) {
    let msgStr = msg.toString("hex").toUpperCase();
    let bytePosInChars = consts.dataPacketFormatBytePosition * 2;
    let versionByteStr = msgStr.substring(bytePosInChars, bytePosInChars + 2);
    // Parse the gateway MAC from the incoming messages and record which
    // interface it's using so that we can get responses back to that gateway
    // from the LoRa gateway server (LGS).
    let gwMAC;
    switch (versionByteStr) {
        case consts.dataFormatBytes["v0.1"]:
            gwMAC = msgStr.substring(8, 24);
            break;
        default:
            break;
    }
    if (gwMAC !== undefined) {
        let gwMacIndex = utilities.partitionSearchSortedArray(gwMAC, gwMACs, 0, gwMACs.length);
        let msgProtocol = getProtocolFromMacAddress(gwMAC);
        if (msgProtocol !== null) {
            switch (msgProtocol) {
                case "MQTT":
                    mqttClient.publish(config.mqttSubscribeTopic, msg);
                    break;
                case "CoAP":
                    if (gwMacIndex !== -1) {
                        gwMACsInfo[gwMacIndex].replyVar.end(msg);
                    }
                    break;
                case "UDP":
                    if (gwMacIndex !== -1) {
                        if (gwMACsInfo[gwMacIndex].socket === undefined) {
                            gwMACsInfo[gwMacIndex].socket = udp.createSocket("udp4");
                        }
                        let host = gwMACsInfo[gwMacIndex].replyVar.address;
                        let port = config.udpPort;
                        gwMACsInfo[gwMacIndex].socket.send(msg, 0, msg.length, port, host, (err, bytes) => {
                            if (err) throw err;
                        });
                    }
                    break;
                default: // Unknown protocol
                    break;
            }
        } // Else we don't know anything about this MAC address, so ignore it
    } // Else unsupported data format
}

function getProtocolFromMacAddress(gwMAC) {
    let gwMacIndex = utilities.partitionSearchSortedArray(gwMAC, gwMACs, 0, gwMACs.length);
    if (gwMacIndex !== -1) {
        return gwMACsInfo[gwMacIndex].protocol;
    } else {
        return null;
    }
}

module.exports = obj;
