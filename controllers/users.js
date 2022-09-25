const dbConnection = require("../config/dbConnection");
const crypto = require("crypto");
const logger = require("../config/logger");
const { authUser, addUser } = require("../models/users");

module.exports.authUserController = (req, res, pass=null) => {
  let user = req.body;

  if (pass == null) {
    const cryptoPassword = crypto.createHash("sha256").update(user.password).digest("hex");
    user.password = cryptoPassword;
  } else {
    const cryptoPassword = crypto.createHash("sha256").update(pass).digest("hex");
    user.password = cryptoPassword;
  }

  dbConn = dbConnection();

  authUser(user, dbConn, (error, result) => {
    if (error) {
      logger.log({
        level: "error",
        message: error
      });
      //TODO: Add error screen?
      res.send(error);
    } else {
      if (result.length > 0) {
        req.session.userId = result[0].userid;
        req.session.email = result[0].email;
        req.session.name = result[0].name;

        res.redirect("/");
      } else {
        res.render("users/login", {
          pageTitle: "Entrar",
          loginMsg: "Usuário ou senha incorretos"
        });
      }
    }
  });
}

module.exports.addUserController = (req, res) => {
  let user = req.body;
  const cryptoPassword = crypto.createHash("sha256").update(user.password).digest("hex");
  const pass = user.password;
  user.password = cryptoPassword;

  dbConn = dbConnection();

  addUser(user, dbConn, (error, result) => {
    if (error) {
      logger.log({
        level: "error",
        message: error
      });
      //TODO: Add error screen?
      let errMessage = "";

      switch(error.errno) {
        case 1062:
          errMessage = "Email já cadastrado";
          break;
        default:
          errMessage = "Erro desconhecido";
      }

      res.render("users/signup", {
        pageTitle: "Cadastro",
        signupMsg: errMessage
      });
    } else {
      this.authUserController(req, res, pass);
    }
  });
}
