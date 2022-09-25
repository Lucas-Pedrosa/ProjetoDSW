module.exports = {
  authUser: (user, connection, callback) => {
    const sql = "SELECT userid, email, name, password FROM users WHERE email = ?;";
    connection.query(sql, [user.email], callback);
  },
  addUser: (user, connection, callback) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?);"
    connection.query(sql, [user.name, user.email, user.password], callback);
  }
}
