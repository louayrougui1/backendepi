const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
    },
    email: {
      type: String,
      required: [true, "please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please add a password"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
      required: [true, "please add a difficulty"],
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        answer: { type: String, required: true },
        isValid: { type: Boolean, required: true, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
