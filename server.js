const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const dotenv = require("dotenv");

const SECRET_KEY = "super-secret-key";

// connect to express app
const app = express();

dotenv.config();

// connect to mongoDB
const dbURI = process.env.MONGO_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3001, () => {
      console.log("Server connected to port 3001 and MongoDb");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to Server and/or MongoDB", error);
  });

// middleware
app.use(bodyParser.json());
app.use(cors());

//Routes

// REGISTER
//POST REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, username, password, image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      image,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      name: username,
      email: email,
      image: image,
      id: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
});

//GET Registered Users
app.get("/register", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to get users" });
  }
});

//LOGIN

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1hr",
    });
    res.json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      image: user.image,
      id: user.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});
