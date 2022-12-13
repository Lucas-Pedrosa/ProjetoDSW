const express = require("express");
const { checkAuthenticated } = require("../controllers/users");
const {
  libraryController,
  addBookController,
  removeBookController
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

router.get("/remove/:id", checkAuthenticated, (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;

  removeBookController(bookId, userId, req, res);
});

module.exports = router;
