const express = require("express");
const { checkAuthenticated } = require("../controllers/users");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("index", {
    pageTitle: "Página principal",
    session: req.session
  });
});

module.exports = router;
