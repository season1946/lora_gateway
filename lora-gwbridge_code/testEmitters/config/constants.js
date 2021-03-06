let mqttMsg1 = new Buffer([ "0x01","0x00","0x00","0x00","0x01","0x23","0x45","0x67","0x89","0xAB","0xCD","0xEF","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00" ]);
let mqttMsg2 = new Buffer([ "0x01","0x00","0x00","0x00","0xEE","0xEE","0xEE","0xEE","0xEE","0xEE","0xEE","0xEF","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00" ]);
let coapMsg = new Buffer([ "0x01","0x00","0x00","0x00","0x0A","0x0A","0x0A","0x0A","0x0A","0x0A","0x0A","0x0A","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00" ]);
let udpMsg = new Buffer([ "0x01","0x00","0x00","0x00","0x11","0x11","0x11","0x11","0x11","0x11","0x11","0x11","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00","0x00" ]);

module.exports = {
    mqttMsg1:   mqttMsg1,   // 010000000123456789ABCDEF00000000000000000000
    mqttMsg2:   mqttMsg2,   // 01000000EEEEEEEEEEEEEEEF00000000000000000000
    coapMsg:    coapMsg,    // 010000000A0A0A0A0A0A0A0A00000000000000000000
    udpMsg:     udpMsg      // 01000000111111111111111100000000000000000000
};
