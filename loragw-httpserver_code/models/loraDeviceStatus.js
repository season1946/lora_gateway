let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let loraDeviceStatus = sqlize.define("loraDeviceStatus", {
        devAddr: {
            primaryKey:     true,
            type:           DataTypes.STRING,
            allowNull:      false
        },
        utcTime: {
            type:           DataTypes.DATE,
            allowNull:      false,
            defaultValue:   Sequelize.literal("CURRENT_TIMESTAMP")
        }
    }, {
        timestamps: false,
        tableName:  "loraDeviceStatus",
        classMethods: {
            associate: function(models) {
                loraDeviceStatus.hasMany(models.loraDeviceStatusHistory, {
                    foreignKey: "devAddr"
                });
            }
        }
    });

    return loraDeviceStatus;
};

