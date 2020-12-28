if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const users = require("./users")


const imageRoute = require("./routes/image");
const authRoute = require("./routes/auth");

connectDB();

const app = express();

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static("public/images"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


app.use("/auth", authRoute);
app.use("/", imageRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
