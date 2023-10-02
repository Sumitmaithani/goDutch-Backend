const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String },
  image: { type: String, default: "" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
