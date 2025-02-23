const jwt = require("jsonwebtoken");
const User = require("../database/userModel.js");
async function protect(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized,token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized,tokenfailed" });
  }
}
module.exports = { protect };
