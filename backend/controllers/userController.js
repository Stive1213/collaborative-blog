const db = require("../db/knex");

const getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select("*");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers };
