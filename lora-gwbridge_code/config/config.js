let config = {};

// ---------------------------------------------------------------------
// ---------------------------- MODIFY ---------------------------------
// ---------------------------------------------------------------------
// Manually modify this to your desired environment, and all other settings
// will be set accordingly:

config.environment = "test";

// ---------------------------------------------------------------------
// ------------------------- DO NOT MODIFY -----------------------------
// ---------------------------------------------------------------------

config.acceptedEnvironments = [
    "local",
    "test",
    "testShanghai",
    "prodCalgary",
    "prodShanghai"
];

// --------- Accepted protocols config: --------------
// MQTT:
config.mqttBrokerHost = "broker.hivemq.com";
config.mqttPublishTopic = "publishtopic1234";
config.mqttSubscribeTopic = "replytopic1234";
// CoAP:
config.coapPort = 5683;
// UDP:
config.udpHost = "0.0.0.0";
config.udpPort = 7777;

// --------- LoRa Gateway Server config: -------------
if (config.environment === "local") {
    config.lgsHost = "localhost";
    config.lgsPort = 6666;
}
if (config.environment === "test") {
    config.lgsHost = "10.10.10.9";
    config.lgsPort = 9600;
}
if (config.environment === "testShanghai") {
    config.lgsHost = "192.168.100.100";
    config.lgsPort = 9600;
}
if (config.environment === "prodCalgary") {
    config.lgsHost = "10.10.10.8";
    config.lgsPort = 9700;
}

if (config.acceptedEnvironments.includes(config.environment) == false) {
    throw new Error("Error: Invalid environment name. Please check your config file.");
}

module.exports = config;
