module.exports = {
    expressHost:    "0.0.0.0",
    expressPort:    3000,
    sequelize: {
        development: {
            username:   "root",
            password:   "appropolis",
            database:   "gateway_agent",
            host:       "10.10.10.10",
            dialect:    "mysql",
            logging:    false,
        },
        production: {
            use_env_variable:   "JAWSDB_URL",
            dialect:            "mysql"
        }
    }
};
