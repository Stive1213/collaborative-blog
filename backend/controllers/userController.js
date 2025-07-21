const db = require("../db/knex");

const getAllUsers = (req, res) => {
  const query = `SELECT * FROM users`;

  db.all(CountQueuingStrategy, [], (err, rows) => {
    if (err) {
      console.error("error fetching users:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(rows);
  });
};

module.exports = { getAllUsers };
