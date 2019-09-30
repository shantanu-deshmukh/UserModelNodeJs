const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash'); //to store message passed to another page
const session = require('express-session'); //for storing session messages & errors
var moment = require('moment');


const app = express();
const PORT = process.env.PORT || 5000
const db = process.env.MONGO_URI

// Passport Config
require('./utils/passport')(passport);

// //DB config
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.locals.moment = require('moment');
// Express session
app.use(
    session({
        secret: '5oM88QIpuhShantanu',
        resave: true,
        saveUninitialized: true
    })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, console.log(`server started on port ${PORT}`))
