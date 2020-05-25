let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let loraOverviewInfo = sqlize.define("loraOverviewInfo", {
        id: {
            primaryKey: true,
            type:       DataTypes.INTEGER,
            allowNull:  false
        },
        freqBand: {
            type:       DataTypes.STRING,
            allowNull:  false
        },
        uplinkChannel: {
            type:       DataTypes.INTEGER,
            allowNull:  false
        },
        gwServerIpPort: {
            type:       DataTypes.STRING,
            allowNull:  false
        },
        ctrlServerIpPort: {
            type:       DataTypes.STRING,
            allowNull:  false
        },
        antennaGain: {
            type:       DataTypes.DOUBLE,
            allowNull:  false
        },
        fskEnable: {
            type:       DataTypes.INTEGER,
            allowNull:  false
        },
        beaconEnable: {
            type:       DataTypes.INTEGER,
            allowNull:  false
        },
        pktRecdNum: {
            type:       DataTypes.DOUBLE,
            allowNull:  false
        },
        pktSentNum: {
            type:       DataTypes.DOUBLE,
            allowNull:  false
        },
        beaconSentNum: {
            type:       DataTypes.DOUBLE,
            allowNull:  false
        },
        clkDriftBias: {
            type:       DataTypes.DOUBLE,
            allowNull:  false
        }
    }, {
        timestamps: false,
        tableName:  "loraOverviewInfo"
    });

    return loraOverviewInfo;
};

