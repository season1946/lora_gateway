# LoRa Gateway Bridge

## Description

The LoRa Gateway Bridge is a standalone program that accepts LoRa Gateway Server (LGS) uplinks over exactly three different protocols:

1. MQTT
2. CoAP
3. UDP

...and forwards these messages to the LGS and forwards the LGS's replies / downlinks to the LoRa gateways in question.

## Deployment Instructions:

To deploy this product, SSH into the destination machine in question and run:

* `pm2 start startLoRaGwBridge.js`
* `pm2 unmonitor startLoRaGwBridge`

## Known Issues:

* At the time of writing, the downlink messages from the LGS do not contain the gateway MAC address, so there is no way to get these messages back to their correct recipients (as there's no way to know which message is intended for which recipient). As such, currently the Bridge only supports one-way communication.
* Additionally, communication over the Bridge can be susceptible for data loss and dropped packets, and if corrupted data is received at the LGS, these packets are simply dropped.
