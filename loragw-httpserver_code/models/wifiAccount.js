let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let wifiAccount = sqlize.define("wifiAccount", {
        ssid: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        mode: {
            primaryKey: true,
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName:  "wifiAccount"
    });

    return wifiAccount;
};

