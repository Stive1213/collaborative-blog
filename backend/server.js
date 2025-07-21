require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
