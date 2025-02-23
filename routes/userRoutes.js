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
} = require("../controllers/userControllers");

router.get("/:id", protect, getUser);
router.post("/signup", regUser);
router.put("/login", loginUser);
router.post("/submit", protect, addAnswer);
router.get("/answers/:id", protect, getAnswers);
router.put("/update", protect, updateProfile);

module.exports = router;
