const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { authUserController, addUserController } = require("../controllers/users");

router.get("/login", (req, res) => {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.render("users/login", { 
      pageTitle: "Entrar"
     });
  }
});

router.post("/login",
  [
    check("email").isEmail().normalizeEmail().withMessage("Insira um email válido")
  ], (req, res) => {
  const validation = validationResult(req);
  const user = req.body;

  if (!validation.isEmpty()) {
    const errors = validation.mapped();

    res.render("users/login", {
      pageTitle: "Entrar",
      errors: errors
    });
  } else {
    authUserController(req, res);
  }  
});

router.get("/signup", (req, res) => {
  res.render("users/signup", { 
    pageTitle: "Cadastro"
    });
});

router.post("/signup",
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
] ,(req, res) => {
  const validation = validationResult(req);
  const user = req.body;

  if (!validation.isEmpty()) {
    const errors = validation.mapped();

    res.render("users/signup", {
      pageTitle: "Cadastro",
      errors: errors,
      user: user
    });
  } else {
    addUserController(req, res);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
