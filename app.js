const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

// Set-up module imports for the mongoose schemas
let Project = require('./models/project'),
    Company = require('./models/company'),
    User = require('./models/user');

// Require the external routes
let companyRoutes = require('./routes/company'),
    adminRoutes = require('./routes/admin'),
    employeesRoutes = require('./routes/employees'),
    indexRoutes = require('./routes/index'),
    projectsRoutes = require('./routes/projects');

// Passport configuration
app.use(require('express-session')({
    secret: "put the keyboard on your head",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Connect to the mongodb company server
mongoose.connect('mongodb://localhost/main_database');

// Make public folder accessible by default
app.use(express.static(__dirname + '/public'));

// Setup Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// use routes without the *.ejs extension
app.set('view engine', 'ejs');

// pass currentUser to all routes to be able to
// use it in the header for example. This is actually
// a middleware that will run for every route
app.use(function (req, res, next) {
    // Pass current logged user to all routes
    res.locals.currentUser = req.user;
    
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next(); // move to the actual code
});

// Use the route files
app.use('/dashboard', companyRoutes);
app.use('/adminDashboard', adminRoutes);
app.use('/dashboard', employeesRoutes);
app.use(indexRoutes);
app.use('/dashboard', projectsRoutes);




// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});