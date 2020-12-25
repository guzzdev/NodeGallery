const express = require("express");
const router = express.Router();
const passport = require("passport")
const bcrypt = require("bcrypt");
const users = require("./../users")

/*

TODO:
  - DATABASE
  - MVC

*/

const initializePassport = require('./../config/passport')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

router.get('/home', checkAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.user.username })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
  console.log(users)
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/error',
  failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect('/auth/login')
  } catch (error){
    res.redirect('/auth/register')
    console.error(error)
  }
})

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/auth/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/auth/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = router;