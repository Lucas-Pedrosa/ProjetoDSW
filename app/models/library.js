module.exports = {
  libraryCount: (id, connection, callback) => {
    const sql = "SELECT COUNT(*) AS library FROM library WHERE userid = ?;";
    connection.query(sql, [id], callback);
  },
  library: (id, connection, callback) => {
    const sql = "SELECT * FROM books as b INNER JOIN library as l on l.bookid = b.bookid WHERE l.userid = ?;";
    connection.query(sql, [id], callback);
  },
  addBook: (bookid, userid, connection, callback) => {
    const sql = "INSERT INTO library (bookid, userid) VALUES (?, ?);";
    connection.query(sql, [bookid, userid], callback);
  }
}
