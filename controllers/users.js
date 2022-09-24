const dbConnection = require("../config/dbConnection");
const crypto = require("crypto");
const { authUser } = require("../models/users");

module.exports.authUserController = (req, res) => {
  let user = req.body;
  const shaPassword = crypto.createHash("sha256").update(user.password).digest("hex");
  user.password = shaPassword;

  dbConn = dbConnection();

  authUser(user, dbConn, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      if (result.length > 0) {
        res.send("Logged in");
      } else {
        res.send("Not logged in");
      }
    }
  });
}
