module.exports = {
  authUser: (user, connection, callback) => {
    const sql = "SELECT userid, email, name FROM users WHERE email = ? AND password = ?;";
    connection.query(sql, [user.email, user.password], callback);
  }
}
