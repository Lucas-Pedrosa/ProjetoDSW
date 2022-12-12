module.exports = {
  followersCount: (id, connection, callback) => {
    const sql = "SELECT COUNT(*) AS followers FROM followers WHERE userid = ?;";
    connection.query(sql, [id], callback);
  },
  followingCount: (id, connection, callback) => {
    const sql = "SELECT COUNT(*) AS following FROM followers WHERE followerid = ?;";
    connection.query(sql, [id], callback);
  }
}
