const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)

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
  secret:'keyboard cat',
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

//import routes here
const homeRoutes = require('./routes/home')
const mousesRoutes = require('./routes/mouses')
const usersRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')

async function main() {
    app.use('/', homeRoutes)
    app.use('/mouses', mousesRoutes)
    app.use('/users', usersRoutes)
    app.use('/cloudinary', cloudinaryRoutes)
  
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});