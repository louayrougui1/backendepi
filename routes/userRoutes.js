const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUser,
  regUser,
  loginUser,
  addAnswer,
  getAnswers,
  updateProfile,
  getAllUsers,
} = require("../controllers/userControllers");
router.get("/dashboard", getAllUsers);
router.post("/signup", regUser);
router.put("/login", loginUser);
router.get("/", protect, getUser);
router.post("/submit", protect, addAnswer);
router.get("/answers/:id", protect, getAnswers);
router.put("/update", protect, updateProfile);

module.exports = router;
