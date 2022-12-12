module.exports = {
  allBooks: (connection, callback) => {
    const sql = "SELECT bookid, title, author, description, link FROM books;";
    connection.query(sql, callback);
  }
}
