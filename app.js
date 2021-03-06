const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    favicon = require('serve-favicon');

// Set-up module imports for the mongoose schemas
const User = require('./models/user');

// Require the external routes
const companyRoutes = require('./routes/company'),
    adminRoutes = require('./routes/admin'),
    employeesRoutes = require('./routes/employees'),
    indexRoutes = require('./routes/index'),
    projectsRoutes = require('./routes/projects'),
    userRoutes = require('./routes/user'),
    companyAdminRoutes = require('./routes/company_admin');

// use favicon
app.use(favicon(__dirname + '/public/images/favicons/favicon.ico'));

// Setup moment for use
app.locals.moment = require("moment");

// Express-session configuration
app.use(require('express-session')({
    secret: "put the keyboard on your head",
    resave: false,
    saveUninitialized: false
}));
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect to remote mongodb (deploy)
// mongoose.connect('mongodb://admin:Noiembrie11@ds161740.mlab.com:61740/constmanager')

// Connect to the mongodb company server
mongoose.connect('mongodb://localhost/main_database')
    .then(() => console.log('Successfully connected to the MongoDB database.'))
    .catch(err => console.log(err));

// Make public folder accessible by default
app.use(express.static(__dirname + '/public'));

// Setup Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup connect flash
app.use(flash());

// use routes without the *.ejs extension
app.set('view engine', 'ejs');

// Global variables
app.use((req, res, next) => {
    // Pass current logged user to all routes
    res.locals.currentUser = req.user;
    // Pass the message in any route
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // move to the actual code
});

// Use the route files
app.use(indexRoutes);
app.use(companyRoutes);
app.use('/adminDashboard', adminRoutes);
app.use(employeesRoutes);
app.use(projectsRoutes);
app.use(userRoutes);
app.use(companyAdminRoutes);





// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

const moment = require('moment') // just for testing here
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

    // for testing moment.js
    // let checkDate = "26.11.2018";
    // console.log(checkDate);
    // let changed = moment(checkDate, "DD.MM.YYYY").format("MM.DD.YYYY");
    // console.log(changed)
    // let utc = new Date(changed)
    // console.log(utc)

    // let newDate = moment(checkDate, "DD.MM.YYYY").add(7, 'days').format("DD.MM.YYYY");
    // console.log(newDate);
    // let plmDate = moment(checkDate).format("DD.MM.YYYY");
    // console.log(plmDate);
    // let date = moment().startOf('isoWeek').format("DD.MM.YYYY")
    // let date = moment(checkDate).format("DD.MM.YYYY")
    // console.log(date)
});

// for deploying to Heroku
// app.listen(process.env.PORT, '0.0.0.0');