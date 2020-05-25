let config = {};

// Accepted protocols config:
config.mqttBrokerHost = "broker.hivemq.com";
config.mqttPublishTopic = "publishtopic1234";
config.mqttSubscribeTopic = "replytopic1234";

config.coapHost = "10.10.10.91"; // Evan's laptop
config.coapPort = 5683;

config.udpHost = "0.0.0.0";
config.udpDestHost = "10.10.10.91"; // Evan's laptop
config.udpPort = 7777;

// Fake LoRa Gateway Server config:
config.tcpHost = "0.0.0.0";
config.tcpPort = 6666;

module.exports = config;
