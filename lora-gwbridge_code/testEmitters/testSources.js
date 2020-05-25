let mqtt = require("mqtt");
let coap = require("coap");
let udp = require("dgram");

let config = reqFile("./config/config.js");
let consts = reqFile("./config/constants.js");

let obj = {};

obj.start = function() {
    let mqttClient = mqtt.connect("mqtt://" + config.mqttBrokerHost);

    // -------------- MQTT: (default port 1883) ---------------
    mqttClient.on("connect", () => {
        logger.info("Connected to MQTT broker. Sending messages.")
        mqttClient.subscribe(config.mqttSubscribeTopic);
        mqttMsgLoop(mqttClient);
    });
    mqttClient.on("message", (topic, mqttMsg) => {
        // logger.info("MQTT reply received:", mqttMsg.toString("hex"));
    });

    // -------------- CoAP: (default port 5683) ---------------
    coapMsgLoop();

    // ------------------ UDP: (port 7777) --------------------
    let udpClient = udp.createSocket("udp4");
    udpLoop(udpClient);
    let udpServer = udp.createSocket("udp4");
    udpServer.bind(config.udpPort, config.udpHost);
    udpServer.on("listening", () => {
        // logger.info("UDP server listening on port", config.udpPort)
    });
    udpServer.on("message", (message, remote) => {
        // logger.warn(message);
    });
};

function mqttMsgLoop(mqttClient) {
    setTimeout(mqttMsgLoop.bind(this, mqttClient), 1000);
    mqttClient.publish(config.mqttPublishTopic, consts.mqttMsg1);
    setTimeout(() => {
        mqttClient.publish(config.mqttPublishTopic, consts.mqttMsg2);
    }, 500);
}

function coapMsgLoop() {
    setTimeout(coapMsgLoop, 1000);
    let coapReq = coap.request("coap://" + config.coapHost + ":" + config.coapPort);
    coapReq.on("response", (coapRes) => {
        // logger.info(coapRes.payload.toString("hex").toUpperCase());
    });
    coapReq.end(consts.coapMsg); // (Send message)
}

function udpLoop(udpClient) {
    setTimeout(udpLoop.bind(this, udpClient), 1000);
    udpClient.send(consts.udpMsg, 0, consts.udpMsg.length, config.udpPort, config.udpDestHost, (err, bytes) => {
        if (err) throw err;
        // udpClient.close();
    });
}

module.exports = obj;
