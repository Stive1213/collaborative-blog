const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/userController");

router.get("/", getAllUsers);

const { deleteUser } = require("../controllers/userController");
router.delete("/:id", deleteUser);

module.exports = router;
