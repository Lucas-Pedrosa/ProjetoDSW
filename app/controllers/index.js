const dbConnection = require("../../config/dbConnection");
const logger = require("../../config/logger");
const {
  allUsers
} = require("../models/users");
const { 
  allBooks
 } = require("../models/books");

module.exports.indexController = (req, res) => {
  let pageResult = {};
  dbConn = dbConnection();

  allUsers(dbConn, (error, usersResult) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      pageResult = Object.assign({ "usersResult": usersResult });

      allBooks(dbConn, (error, booksResult) => {
        if (error) {
          logger.log({ level: "error", message: error });
          res.render("errors/error", {
            errorMsg: "Erro desconhecido."
          });
        } else {
          pageResult = Object.assign(pageResult, { "booksResult": booksResult });

          res.render("index", {
            pageTitle: "Página inicial",
            session: req.session,
            users: pageResult
          });
        }
      });
    }
  });
}
