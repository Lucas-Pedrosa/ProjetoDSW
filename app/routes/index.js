const express = require("express");
const { checkAuthenticated } = require("../controllers/users");
const {
  indexController
} = require("../controllers/index");
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  indexController(req, res);
});

module.exports = router;
