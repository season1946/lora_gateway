let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let gatewayStatus = sqlize.define("gatewayStatus", {
        // --------- HARDWARE SETTINGS -----------
        gatewaySN: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            allowNull: false
        },
        gatewayMAC: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        gatewayType: {
            type: DataTypes.STRING(45),
            allowNull: true
        },

        // --------- SOFTWARE SETTINGS -----------
        version: {
            type: DataTypes.STRING(45),
            allowNull: true
        },

        // ----------- COORDINATES ---------------
        gatewayLat: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        gatewayLng: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        gatewayAlt: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },

        // -------- NETWORK SETTINGS -------------
        networkInterface: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        wifiMode: {
            type: DataTypes.STRING(45),
            allowNull: true
        },

        // -------------- OTHER ------------------
        uptimeInMins: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        connectionMode: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        debugMode: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName:  "gatewayStatus"
    });

    return gatewayStatus;
};

