const User = require("../database/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
function generateToken(user) {
  const jwt_secret = process.env.JWT_SECRET;
  return jwt.sign({ id: user._id }, jwt_secret, { expiresIn: 3600 });
}
const getUser = async (req, res) => {
  try {
    id = req.params.id;
    const user = await User.findById({ _id: id });
    res.json({
      error: "false",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        difficulty: user.difficulty,
        score: user.score,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const regUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const isUser = await User.findOne({ email: email });
    if (isUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({
      error: "false",
      message: "User registered successfully",
      user: {
        name,
        email,
        token: generateToken(newUser),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "true", message: err });
  }
};
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Please fill all the fields" });
    }
    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({
      message: "Login's successful",
      user: {
        id: isUser._id,
        email,
        name: isUser.name,
        difficulty: isUser.difficulty,
        score: isUser.score,
        token: generateToken(isUser),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "true", message: err });
  }
}
async function getAnswers(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById({
      _id: id,
    });
    if (user.answers.length === 0) {
      return res.status(404).json({
        message: "No answers found",
      });
    }
    return res.status(200).json({
      message: "Answers found",
      answers: user.answers,
    });
  } catch (err) {
    res.status(500).json({ error: "true", message: err.message });
  }
}
async function addAnswer(req, res) {
  try {
    const { isValid, answer, id } = req.body;
    const newAnswer = { answer, isValid };
    const newUser = await User.findByIdAndUpdate(
      { _id: id },
      { $push: { answers: newAnswer } }
    );
    if (!newUser) {
      return res.status(400).json({ message: "Answer not added" });
    }
    return res.status(200).json({ message: "Answer added" });
  } catch (err) {
    res.status(500).json({ error: "true", message: err.message });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { id, password, name } = req.body;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "Profile not updated" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser = {
      name: name || user.name,
      password: hashedPassword || user.password,
    };
    await User.findByIdAndUpdate({ _id: id }, { $set: newUser });
    return res.status(200).json({ message: "Profile updated", newUser });
  } catch (error) {
    res.status(500).json({ error: "true", message: error.message });
  }
};
module.exports = {
  getUser,
  regUser,
  loginUser,
  addAnswer,
  getAnswers,
  updateProfile,
};
