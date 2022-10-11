const mysql = require("mysql2");

const host = process.env.MYSQL_HOST;
const database = process.env.MYSQL_DATABASE;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;

module.exports = () => {
  return dbConn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  });
}
