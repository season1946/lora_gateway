let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let loraDeviceRegistry = sqlize.define("loraDeviceRegistry", {
        devEUI: {
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
        tableName:  "loraDeviceRegistry",
        classMethods: {
            associate: function(models) {
                loraDeviceRegistry.hasMany(models.loraDeviceRegistryHistory, {
                    foreignKey: "devEUI"
                });
            }
        }
    });

    return loraDeviceRegistry;
};
