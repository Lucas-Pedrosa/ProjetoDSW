module.exports = {
  followersCount: (id, connection, callback) => {
    const sql = "SELECT COUNT(*) AS followers FROM followers WHERE userid = ?;";
    connection.query(sql, [id], callback);
  },
  followingCount: (id, connection, callback) => {
    const sql = "SELECT COUNT(*) AS following FROM followers WHERE followerid = ?;";
    connection.query(sql, [id], callback);
  },
  follows: (followerid, userId, connection, callback) => {
    const sql = "SELECT COUNT(*) AS follows FROM followers WHERE followerid = ? AND userid = ?;";
    connection.query(sql, [followerid, userId], callback);
  },
  follow: (followerid, userId, connection, callback) => {
    const sql = "INSERT INTO followers (followerid, userid) VALUES (?, ?);";
    connection.query(sql, [followerid, userId], callback);
  },
  unfollow: (followerid, userId, connection, callback) => {
    const sql = "DELETE FROM followers WHERE followerid = ? AND userid = ?;";
    connection.query(sql, [followerid, userId], callback);
  }
}
