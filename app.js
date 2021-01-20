/* eslint-disable global-require */
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const imageRoute = require('./routes/index');
const usersRoute = require('./routes/users');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Passport Config
require('./config/passport')(passport);

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('public/images'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/auth', usersRoute);
app.use('/', imageRoute);
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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
