let Sequelize = require("sequelize");

module.exports = function(sqlize, DataTypes) {
    let adminAccount = sqlize.define("adminAccount", {
        userID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName:  "adminAccount"
    });

    return adminAccount;
};

