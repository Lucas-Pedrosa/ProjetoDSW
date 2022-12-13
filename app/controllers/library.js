const dbConnection = require("../../config/dbConnection");
const logger = require("../../config/logger");
const {
  library,
  addBook,
  removeBook,
  bookInLibrary
} = require("../models/library");

module.exports.libraryController = (userId, req, res) => {
  dbConn = dbConnection();

  library(userId, dbConn, (error, libraryResult) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      res.render("library/library", {
        pageTitle: "Biblioteca",
        session: req.session,
        library: libraryResult
      });
    }
  });
}

module.exports.addBookController = (bookId, userId, req, res) => {
  dbConn = dbConnection();

  addBook(bookId, userId, dbConn, (error, addBookResult) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      res.redirect("/library/" + userId);
    }
  });
}

module.exports.removeBookController = (bookId, userId, req, res) => {
  dbConn = dbConnection();

  removeBook(bookId, userId, dbConn, (error, removeBookResult) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      res.redirect("/library/" + userId);
    }
  });
}
