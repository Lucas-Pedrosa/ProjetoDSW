const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
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
