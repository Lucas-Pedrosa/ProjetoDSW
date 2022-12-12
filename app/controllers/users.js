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
  changePassword,
  deleteUser,
  allUsers,
  userById
} = require("../models/users");
const {
  followersCount,
  followingCount
} = require("../models/followers");

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
        res.render("errors/error", {
          errorMsg: "Erro desconhecido."
        });
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
              active: "login",
              loginMsg: "Email ou senha inválidos",
              user: user
            });
          }
        } else {
          res.render("users/login", {
            pageTitle: "Entrar",
            active: "login",
            loginMsg: "Email ou senha inválidos",
            user: user
          });
        }
      }
    });
  } catch (error) {
    logger.log({ level: "error", message: error });
    console.log(error.message);
    res.render("errors/error", {
      errorMsg: "Erro desconhecido."
    });
  }
}

module.exports.addUserController = async (req, res) => {
  try {
    let user = req.body;
    const pass = user.password;
    const hashedPass = await bcrypt.hash(pass, 10);
    user.password = hashedPass;
    user.userid = crypto.randomUUID();
  
    dbConn = dbConnection();
  
    addUser(user, dbConn, (error, result) => {
      if (error) {
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
          active: "signup",
          signupMsg: errMessage
        });
      } else {
        this.authUserController(req, res, pass);
      }
    });
  } catch (error) {
    logger.log({ level: "error", message: error });
    console.log(error.message);
    res.render("errors/error", {
      errorMsg: "Erro desconhecido."
    });
  }
}

module.exports.forgotPasswordController = (req, res) => {
  try {
    const user = req.body;

    dbConn = dbConnection();

    authUser(user, dbConn, (error, result) => {
      if (error) {
        logger.log({ level: "error", message: error });
        res.render("errors/error", {
          errorMsg: "Erro desconhecido."
        });
      } else {
        if (result.length > 0) {
          const secret = process.env.JWT_SECRET + result[0].password;
          const payload = {
            email: result[0].email,
            id: result[0].userid
          }
          const token = jwt.sign(payload, secret, { expiresIn: "10m" });
          const link = `http://localhost:3000/users/reset-password/${result[0].userid}/${token}`;
          const html = `Olá ${result[0].name},<br><br><a href="${link}" target="_blank">Clique aqui para Redefinir sua senha</a>. Este link expira em 10 minutos.`;

          console.log(link);
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
    res.render("errors/error", {
      errorMsg: "Erro desconhecido."
    });
  }
}

module.exports.resetPasswordController = (req, res, id, token) => {
  dbConn = dbConnection();

  authUserById(id, dbConn, (error, result) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
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
          res.render("errors/unknownUrl");
        }
        
      } else {
        res.render("errors/unknownUrl");
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
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      if (result.length > 0) {
        const secret = process.env.JWT_SECRET + result[0].password;

        try {
          jwt.verify(token, secret);

          changePassword(user, dbConn, (error, result) => {
            if (error) {
              logger.log({ level: "error", message: error });
              res.render("errors/error", {
                errorMsg: "Erro desconhecido."
              });
            } else {
              this.authUserController(req, res, pass);
            }
          });
        } catch (error) {
          res.render(res.render("errors/unknownUrl"));
        }

      } else {
        res.render("errors/unknownUrl");
      }
    }
  });
}

module.exports.deleteUserController = (req, res, userId, sessionEmail, email) => {
  if (email !== sessionEmail) {
    res.render("users/delete", {
      pageTitle: "Excluir conta",
      emailMsg: "Email não confere."
    });
  } else {
    dbConn = dbConnection();

    deleteUser(userId, dbConn, (error, result) => {
      if (error) {
        logger.log({ level: "error", message: error });
        res.render("errors/error", {
          errorMsg: "Erro desconhecido."
        });
      } else {
        req.session.destroy();
        res.redirect("/");
      }
    });
  }
}

module.exports.allUsersController = (req, res) => {
  dbConn = dbConnection();

  allUsers(dbConn, (error, result) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      return result;
    }
  });
}

module.exports.profileController = (req, res, userId) => {
  dbConn = dbConnection();

  userById(userId, dbConn, (error, result) => {
    if (error) {
      logger.log({ level: "error", message: error });
      res.render("errors/error", {
        errorMsg: "Erro desconhecido."
      });
    } else {
      followersCount(userId, dbConn, (error, followers) => {
        if (error) {
          logger.log({ level: "error", message: error });
          res.render("errors/error", {
            errorMsg: "Erro desconhecido."
          });
        } else {
          result[0].followers = followers[0].followers;
          
          followingCount(userId, dbConn, (error, following) => {
            if (error) {
              logger.log({ level: "error", message: error });
              res.render("errors/error", {
                errorMsg: "Erro desconhecido."
              });
            } else {
              result[0].following = following[0].following;

              res.render("users/profile", {
                pageTitle: "Perfil",
                user: result[0],
                session: req.session
              });
            }
          });
        }
      });      
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
