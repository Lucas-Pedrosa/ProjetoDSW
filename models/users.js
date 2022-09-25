module.exports = {
  authUser: (user, connection, callback) => {
    const sql = "SELECT userid, email, name FROM users WHERE email = ? AND password = ?;";
    connection.query(sql, [user.email, user.password], callback);
  },
  addUser: (user, connection, callback) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);"
    connection.query(sql, [user.name, user.email, user.password], callback);
  }
}
