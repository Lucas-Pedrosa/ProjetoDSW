const mysql = require("mysql");

const host = process.env.HOST;
const database = process.env.DATABASE;
const user = process.env.USER;
const password = process.env.PASSWORD;

module.exports = () => {
  return dbConn = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  });
}
