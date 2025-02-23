const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./database/db.js");
const userRoutes = require("./routes/userRoutes.js");
const port = 3000;
dotenv.config();
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRoutes);
