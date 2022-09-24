module.exports = {
  authUser: (user, connection, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?;";
    connection.query(sql, [user.email, user.password], callback);
  }
}
