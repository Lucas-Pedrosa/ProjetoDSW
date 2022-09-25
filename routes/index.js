const express = require("express");
const { checkAuthenticated } = require("../controllers/users");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  if (req.session.userId) {
    res.render("index", {
      pageTitle: "Página principal",
      session: req.session
    });
  } else {
    res.redirect("/users/login")
  }
});

module.exports = router;
