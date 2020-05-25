let tcp = require("net");

let config = require("./config/config.js");

tcp.createServer((sock) => {
    sock.on("data", (msg) => {
        let msgStr = msg.toString("hex");
        console.log((new Date()).toISOString() + ": Fake LoRa Gw Server:", msgStr);
        sock.write(msg);
    });
    sock.on("error", (err) => {
        console.log("Fake LoRa Gw Server:", err);
    });
}).listen(config.tcpPort, config.tcpHost);
