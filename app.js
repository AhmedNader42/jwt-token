require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const User = require("./model/user");

app.use(express.json());
app.post("/register", async (req, res) => {
  // Register Logic

  try {
    const { first_name, last_name, email, password } = req.body;
    if (!email && password && first_name && last_name) {
      res.status(400).send("All input is required.");
    }

    // Check if var already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User already exists. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    user.token = token;
    res.status(201).json(user);
  } catch (e) {
    console.log(e);
  }
});

app.post("/login", (req, res) => {
  // Login Logic here
});

module.exports = app;
