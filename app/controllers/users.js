const dbConnection = require("../../config/dbConnection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const logger = require("../../config/logger");
const mailer = require("../../config/mailer");
const { 
  authUser,
  addUser,
  authUserById,
  authUserByEmailAndId,
  changePassword
} = require("../models/users");

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
    console.log(error.message);
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
    console.log(error.message);
  }
}

module.exports.forgotPasswordController = (req, res) => {
  try {
    const user = req.body;

    dbConn = dbConnection();

    authUser(user, dbConn, (error, result) => {
      if (error) {
        logger.log({ level: "error", message: error });
        //TODO: Add error screen?
        res.send(error);
      } else {
        if (result.length > 0) {
          const secret = process.env.JWT_SECRET + result[0].password;
          const payload = {
            email: result[0].email,
            id: result[0].userid
          }
          const token = jwt.sign(payload, secret, { expiresIn: "10m" });
          const link = `http://localhost:3000/users/reset-password/${result[0].userid}/${token}`;
          const html = `Olá ${result[0].name},<br><br>Clique no link para <a href="${link}" target="_blank">Redefinir senha</a>. Este link expira em 10 minutos.`;

          mailer.sendMail(result[0].email, html);

          res.render("users/forgot-password", {
            pageTitle: "Redefinir senha",
            emailMsg: "Link de recuperação enviado para o seu email",
            user: user
          });
        } else {
          res.render("users/forgot-password", {
            pageTitle: "Redefinir senha",
            loginMsg: "Email não registrado",
            user: user
          });
        }
      }
    });
  } catch (error) {
    logger.log({ level: "error", message: error });
    console.log(error.message);
  }
}

module.exports.resetPasswordController = (req, res, id, token) => {
  dbConn = dbConnection();

  authUserById(id, dbConn, (error, result) => {
    if (error) {
      logger.log({ level: "error", message: error });
      //TODO: Add error screen?
      res.send(error);
    } else {
      if (result.length > 0) {
        const secret = process.env.JWT_SECRET + result[0].password;

        try {
          jwt.verify(token, secret);
          res.render("users/reset-password", {
            pageTitle: "Redefinir Senha",
            email: result[0].email
          });
        } catch (error) {
          res.send("TODO Error screen");
        }
        
      } else {
        /* res.render("users/forgot-password", {
          pageTitle: "Redefinir senha",
          loginMsg: "Email não registrado",
          user: user
        }); */
        res.send("TODO Error screen");
      }
    }
  });
}

module.exports.changePasswordController = async (req, res, id, token) => {
  const user = req.body;
  user.id = id;
  const pass = user.password;
  const hashedPass = await bcrypt.hash(pass, 10);
  user.password = hashedPass;

  dbConn = dbConnection();

  authUserByEmailAndId(user.email, id, dbConn, (error, result) => {
    if (error) {
      logger.log({ level: "error", message: error });
      //TODO: Add error screen?
      res.send(error);
    } else {
      if (result.length > 0) {
        const secret = process.env.JWT_SECRET + result[0].password;

        try {
          jwt.verify(token, secret);

          changePassword(user, dbConn, (error, result) => {
            if (error) {
              logger.log({ level: "error", message: error });
              //TODO: Add error screen?
              res.send(error);
            } else {
              this.authUserController(req, res, pass);
            }
          });
        } catch (error) {
          res.send("TODO Error screen");
        }

      } else {
        res.send("TODO Error screen");
      }
    }
  });
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
