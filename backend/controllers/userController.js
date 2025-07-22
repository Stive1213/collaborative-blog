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

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const delteUser = await db("users").where({ id }).del();
    if (delteUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllUsers, deleteUser };
