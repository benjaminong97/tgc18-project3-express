const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const cors = require('cors')
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')

hbs.registerHelper('divide', function (leftValue, rightValue) {
  return (leftValue / rightValue)
})

// create an instance of express app
let app = express();

app.use(cors({
  origin: true
}))


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
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

const csurfInstance = csrf();
app.use(function (req, res, next) {
  console.log("checking for csrf exclusion")
  // exclude whatever url we want from CSRF protection
  if (req.url === "/checkout/process_payment" || req.url.slice(0,5) == '/api/') {
    return next();
  }
  csurfInstance(req, res, next);
})

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash('error_messages', 'The form has expired. Please try again');
    res.redirect('back');
  } else {
    next()
  }
});

app.use(function (req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next()
})




//import routes here
const homeRoutes = require('./routes/home')
const mousesRoutes = require('./routes/mouses')
const usersRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')
const cartRoutes = require('./routes/shoppingCart')
const checkoutRoutes = require('./routes/checkout')
const api = {
  mouses: require('./routes/api/mouses'),
  users : require('./routes/api/users')

}
const orderRoutes = require('./routes/orders')

async function main() {
  app.use('/', homeRoutes)
  app.use('/mouses', mousesRoutes)
  app.use('/users', usersRoutes)
  app.use('/cloudinary', cloudinaryRoutes)
  app.use('/cart', cartRoutes)
  app.use('/checkout', checkoutRoutes)
  app.use('/api/mouses', express.json(), api.mouses)
  app.use('/api/users', api.users)
  app.use('/orders', orderRoutes)
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});