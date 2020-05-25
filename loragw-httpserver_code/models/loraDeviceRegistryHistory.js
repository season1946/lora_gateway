let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let loraDeviceRegistryHistory = sqlize.define("loraDeviceRegistryHistory", {
        id: {
            primaryKey:     true,
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        devEUI: {
            type:           DataTypes.STRING,
            allowNull:      false
        },
        utcTime: {
            type:           DataTypes.DATE,
            allowNull:      false
        },
        gatewayTime: {
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        rssi: {
            type:           DataTypes.DOUBLE,
            allowNull:      false
        },
        snr: {
            type:           DataTypes.DOUBLE,
            allowNull:      false
        },
        sf: {
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        bandwidth: {
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        codeRate: {
            type:           DataTypes.INTEGER,
            allowNull:      false
        },
        crc: {
            type:           DataTypes.INTEGER,
            allowNull:      false
        }
    }, {
        timestamps: false,
        tableName:  "loraDeviceRegistryHistory"
    });

    return loraDeviceRegistryHistory;
};
