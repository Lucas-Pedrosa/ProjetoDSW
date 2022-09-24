const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { authUserController } = require("../controllers/users");

router.get("/login", (req, res) => {
  res.render("users/index", { 
    pageTitle: "Login"
   });
});

router.post("/login",
  [
    check("email").isEmail().normalizeEmail().withMessage("Email deve ser válido.")
  ], (req, res) => {
  const validation = validationResult(req);
  const user = req.body;

  if (!validation.isEmpty()) {
    const errors = validation.array();
    res.send(errors);
  } else {
    authUserController(req, res);
  }  
});

module.exports = router;
