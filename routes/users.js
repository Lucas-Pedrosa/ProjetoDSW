const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { authUserController } = require("../controllers/users");

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

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
