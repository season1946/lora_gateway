let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let systemLog = sqlize.define("systemLog", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        event: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        }
    }, {
        timestamps: false,
        tableName:  "systemLog"
    });

    return systemLog;
};

