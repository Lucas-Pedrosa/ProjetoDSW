const express = require("express");
const { checkAuthenticated } = require("../controllers/users");
const {
  libraryController,
  addBookController
} = require("../controllers/library");
const router = express.Router();

router.get("/:id", checkAuthenticated, (req, res) => {
  const userId = req.params.id;

  libraryController(userId, req, res);
});

router.get("/add/:id", checkAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  addBookController(bookId, userId, req, res);
});

module.exports = router;
