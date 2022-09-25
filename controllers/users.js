const dbConnection = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const logger = require("../config/logger");
const { authUser, addUser } = require("../models/users");

module.exports.authUserController = (req, res, pass=null) => {
  try {
    let user = req.body;

    if (pass != null) {
      user.password = pass;
    }

    dbConn = dbConnection();

    authUser(user, dbConn, async (error, result) => {
      if (error) {
        logger.log({ level: "error", message: error });
        //TODO: Add error screen?
        res.send(error);
      } else {
        if (result.length > 0) {
          if (await bcrypt.compare(user.password, result[0].password)) {
            req.session.userId = result[0].userid;
            req.session.email = result[0].email;
            req.session.name = result[0].name;
            req.session.loggedIn = true;

            res.redirect("/");
          } else {
            res.render("users/login", {
              pageTitle: "Entrar",
              loginMsg: "Email ou senha incorretos",
              user: user
            });
          }
        } else {
          res.render("users/login", {
            pageTitle: "Entrar",
            loginMsg: "Email ou senha incorretos",
            user: user
          });
        }
      }
    });
  } catch (error) {
    logger.log({ level: "error", message: error });
    console.log(e.message);
  }
}

module.exports.addUserController = async (req, res) => {
  try {
    let user = req.body;
    const pass = user.password;
    const hashedPass = await bcrypt.hash(pass, 10);
    user.password = hashedPass;
  
    dbConn = dbConnection();
  
    addUser(user, dbConn, (error, result) => {
      if (error) {
        //TODO: Add error screen?
        let errMessage = "";
  
        switch(error.errno) {
          case 1062:
            errMessage = "Email já cadastrado";
            break;
          default:
            logger.log({ level: "error", message: error });
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
  } catch (error) {
    logger.log({ level: "error", message: error });
    console.log(e.message);
  }
}

module.exports.checkAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect("/users/login");
}

module.exports.checkNotAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  next();
}
