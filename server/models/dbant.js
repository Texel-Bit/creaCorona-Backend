const mysql = require("mysql");
const dbConfig = require("../config/databaseant");

var connectionant = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

module.exports = connectionant;