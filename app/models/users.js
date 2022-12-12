module.exports = {
  authUser: (user, connection, callback) => {
    const sql = "SELECT userid, email, name, password FROM users WHERE email = ?;";
    connection.query(sql, [user.email], callback);
  },
  addUser: (user, connection, callback) => {
    const sql = "INSERT INTO users (userid, name, email, password) VALUES (?, ?, ?, ?);"
    connection.query(sql, [user.userid, user.name, user.email, user.password], callback);
  },
  authUserById: (id, connection, callback) => {
    const sql = "SELECT userid, email, name, password FROM users WHERE userid = ?;";
    connection.query(sql, [id], callback);
  },
  authUserByEmailAndId: (email, id, connection, callback) => {
    const sql = "SELECT userid, email, name, password FROM users WHERE userid = ? AND email = ?;";
    connection.query(sql, [id, email], callback);
  },
  changePassword: (user, connection, callback) => {
    const sql = "UPDATE users SET password = ? WHERE userid = ? AND email = ?;";
    connection.query(sql, [user.password, user.id, user.email], callback);
  },
  deleteUser: (id, connection, callback) => {
    const sql = "DELETE FROM users WHERE userid = ?;";
    connection.query(sql, [id], callback);
  },
  allUsers: (connection, callback) => {
    const sql = "SELECT userid, name, email FROM users;";
    connection.query(sql, callback);
  },
  userById: (id, connection, callback) => {
    const sql = "SELECT userid, name, email FROM users WHERE userid = ?;";
    connection.query(sql, [id], callback);
  }
}
