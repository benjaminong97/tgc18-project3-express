const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')

hbs.registerHelper('divide', function(leftValue, rightValue) {
  return (leftValue / rightValue)
 })

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET_KEY,
  resave: false.valueOf,
  saveUninitialized: true
}))

app.use(flash())

//register flash middleware
app.use(function(req,res,next) {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(csrf())

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
      req.flash('error_messages', 'The form has expired. Please try again');
      res.redirect('back');
  } else {
      next()
  }
});

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})



//import routes here
const homeRoutes = require('./routes/home')
const mousesRoutes = require('./routes/mouses')
const usersRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')
const cartRoutes = require('./routes/shoppingCart')

async function main() {
    app.use('/', homeRoutes)
    app.use('/mouses', mousesRoutes)
    app.use('/users', usersRoutes)
    app.use('/cloudinary', cloudinaryRoutes)
    app.use('/cart', cartRoutes)
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});