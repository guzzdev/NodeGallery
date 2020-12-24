const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
require("dotenv").config();

const imageRoute = require("./routes/image");

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public/images"));

app.use("/", imageRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
