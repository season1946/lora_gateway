let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let loraDeviceStatusHistory = sqlize.define("loraDeviceStatusHistory", {
        id: {
            primaryKey:     true,
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        devAddr: {
            type:           DataTypes.STRING,
            allowNull:      true
        },
        fCnt: {
            type:           DataTypes.DOUBLE,
            allowNull:      true
        },
        frequency: {
            type:           DataTypes.DOUBLE,
            allowNull:      true
        },
        sf: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        },
        bandwidth: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        },
        codeRate: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        },
        payloadSize: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        },
        payload: {
            type:           DataTypes.STRING,
            allowNull:      true
        },
        utcTime: {
            type:           DataTypes.DATE,
            allowNull:      true
        },
        gatewayTime: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        },
        rssi: {
            type:           DataTypes.DOUBLE,
            allowNull:      true
        },
        snr: {
            type:           DataTypes.DOUBLE,
            allowNull:      true
        },
        crc: {
            type:           DataTypes.INTEGER,
            allowNull:      true
        }
    }, {
        timestamps: false,
        tableName:  "loraDeviceStatusHistory"
    });

    return loraDeviceStatusHistory;
};

