const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { 
  authUserController, 
  addUserController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
  deleteUserController,
  checkNotAuthenticated,
  checkAuthenticated,
  profileController,
  followController,
  unfollowController
} = require("../controllers/users");

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("users/login", { 
    pageTitle: "Entrar",
    active: "login"
  });
});

router.post("/login", checkNotAuthenticated,
  [
    check("email").isEmail().normalizeEmail().withMessage("Insira um email válido")
  ], (req, res) => {
  const validation = validationResult(req);
  const user = req.body;

  if (!validation.isEmpty()) {
    const errors = validation.mapped();

    res.render("users/login", {
      pageTitle: "Entrar",
      active: "login",
      errors: errors
    });
  } else {
    authUserController(req, res);
  }  
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("users/signup", { 
    pageTitle: "Cadastro",
    active: "signup"
    });
});

router.post("/signup", checkNotAuthenticated,
  [
    check("name").isLength({ min: 2, max: 20 }).withMessage("O nome deve conter entre 2 e 20 caracteres"),
    check("email").isEmail().normalizeEmail().withMessage("Insira um email válido"),
    check("password").isLength({ min: 5, max: 50 }).withMessage("A senha deve conter entre 5 e 50 caracteres"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("As senhas não batem!");
      }
      return true;
    })
  ], (req, res) => {
  const validation = validationResult(req);
  const user = req.body;

  if (!validation.isEmpty()) {
    const errors = validation.mapped();

    res.render("users/signup", {
      pageTitle: "Cadastro",
      active: "signup",
      errors: errors,
      user: user
    });
  } else {
    addUserController(req, res);
  }
});

router.get("/forgot-password", checkNotAuthenticated, (req, res) => {
  res.render("users/forgot-password", {
    pageTitle: "Redefinir senha"
  });
});

router.post("/forgot-password", checkNotAuthenticated,
  [
    check("email").isEmail().normalizeEmail().withMessage("Insira um email válido")
  ], (req, res) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      const errors = validation.mapped();
  
      res.render("users/forgot-password", {
        pageTitle: "Redefinir senha",
        errors: errors
      });
    } else {
      forgotPasswordController(req, res);
    }
});

router.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  
  resetPasswordController(req, res, id, token);
});

router.post("/reset-password/:id/:token",
  [
    check("password").isLength({ min: 5, max: 50 }).withMessage("A senha deve conter entre 5 e 50 caracteres"),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("As senhas não batem!");
      }
      return true;
    })
  ], (req, res) => {
    const validation = validationResult(req);
    const { id, token } = req.params;
    const user = req.body;
  
    if (!validation.isEmpty()) {
      const errors = validation.mapped();
  
      res.render("users/reset-password", {
        pageTitle: "Redefinir senha",
        errors: errors,
        email: user.email
      });
    } else {
      changePasswordController(req, res, id, token);
    }
});

router.get("/delete", checkAuthenticated, (req, res) => {
  res.render("users/delete", {
    pageTitle: "Excluir conta",
    session: req.session
  });
});

router.post("/delete", checkAuthenticated, 
[
  check("email").isEmail().normalizeEmail().withMessage("Insira um email válido")
], (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.mapped();

    res.render("users/delete", {
      pageTitle: "Excluir conta",
      errors: errors
    });
  } else {
    const { userId } = req.session;
    const sessionEmail = req.session.email;
    const { email } = req.body;

    deleteUserController(req, res, userId, sessionEmail, email);
  }
});

router.get("/profile/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;

  profileController(req, res, id);
});

router.get("/follow/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;

  followController(req, res, id);
});

router.get("/unfollow/:id", checkAuthenticated, (req, res) => {
  const { id } = req.params;

  unfollowController(req, res, id);
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
