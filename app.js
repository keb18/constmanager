const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

// Set-up module imports for the mongoose schemas
const Project = require('./models/project'),
    Company = require('./models/company'),
    User = require('./models/user');

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

// Landing page
app.get('/', function (req, res) {
    res.render('landing');
});


// =================================================================
// ========================== ADMIN ===============================
// ADMIN DASHBOARD
app.get('/adminDashboard', isLoggedIn, disableCache, function (req, res) {
    // Get all projects from db
    Company.find({}, function (err, allCompanies) {
        if (err) {
            console.log(err);
        } else {
            res.render('admin/adminDashboard', { companies: allCompanies });
        }
    });
});


// CREATE
// ADMIN CREATE NEW COMPANY
app.post('/adminDashboard', isLoggedIn, disableCache, function (req, res) {
    // get data from form and add to projects array
    let newCompany = {
        companyName: req.body.companyName
    }
    // Create a new project and add to the db
    Company.create(newCompany, function (err, newlyCreatedCompany) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to the dashboard
            res.redirect('/adminDashboard')
        }
    });
});


// ADMIN NEW COMPANY CREATION PAGE
app.get('/adminDashboard/new', isLoggedIn, disableCache, function (req, res) {
    res.render('admin/newCompany');
});


// ADMIN SHOW MORE INFO ABOUT ONE COMPANY
app.get('/adminDashboard/company/:id', isLoggedIn, disableCache, function (req, res) {
    // find project with provided id
    Company.findById(req.params.id, function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            // render the project template with the specified id
            res.render('admin/showCompany', { company: foundCompany });
        }
    });
});


// =================================================================
// ========================== COMPANY ==============================
// INDEX
// COMPANY DASHBOARD
app.get('/dashboard/:companyId', isLoggedIn, disableCache, function (req, res) {
    Company.findById(req.params.companyId).populate('projects').exec(function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCompany);
            // render the project template with the specified id
            // res.send("This is the company dashboard page");
            res.render('company/dashboard', {
                projects: foundCompany.projects,
                company: foundCompany
            });
        }
    });
});


// NEW
// NEW PROJECT CREATION PAGE
app.get('/dashboard/:companyId/project/new', isLoggedIn, disableCache,function (req, res) {
    Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            res.render('project/newProject', { company: foundCompany });
        }
    });
});


// CREATE
// CREATE NEW PROJECT
app.post('/dashboard/:companyId/project', isLoggedIn, disableCache, function (req, res) {
    // lookup company using ID
    Company.findById(req.params.companyId, function (err, company) {
        if (err) {
            console.log(err);
            res.redirect("/dashboard/" + company._id);
        } else {
            // Create a new project and add to the db
            Project.create(req.body.project, function (err, newlyCreatedProject) {
                if (err) {
                    console.log(err);
                } else {
                    company.projects.push(newlyCreatedProject);
                    company.save();
                    // redirect back to the dashboard
                    res.redirect("/dashboard/" + company._id);
                }
            });
        }
    });
});


// SHOW
// SHOW MORE INFO ABOUT ONE PROJECT
app.get('/dashboard/:companyId/project/:projectId', isLoggedIn, disableCache, function (req, res) {
    // find project with provided id
    Project.findById(req.params.projectId).populate('projects').exec(function (err, foundProject) {
        if (err) {
            console.log(err);
        } else {
            Company.findById(req.params.companyId, function (err, foundCompany) {
                if (err) {
                    console.log(err);
                    res.redirect("/dashboard/" + company._id);
                } else {
                    // render the project template with the specified id
                    res.render('project/showProject', {
                        project: foundProject,
                        company: foundCompany
                    });
                }
            });
        };
    });
});

// ==================================================
// Authorisation routes
// Show the register form
app.get('/register', function (req, res) {
    res.render('register');
});

// Handle register logic
app.post('/register', function (req, res) {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }

        // Populate the user fields
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.accountType = "owner";
        // doc.visits.$inc();  == increment a value

        // Create a new project and add to the db
        Company.create({ companyName: req.body.companyName }, function (err, newlyCreatedCompany) {
            if (err) {
                console.log(err);
            } else {
                // Associate company with user
                newlyCreatedCompany.users.push(user);
                newlyCreatedCompany.save();
                // Associate user with the company
                user.company.push(newlyCreatedCompany);
                user.save();
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/dashboard/' + newlyCreatedCompany._id);
                });
            }
        });
    });
});

// Show the login form
app.get('/login', function (req, res) {
    res.render('login');
});

// Handle login logic
app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/dashboard/' + user.company);
        });
    })(req, res, next);
});

// Handle logout logic
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // req.flash("error", "You need to be logged in to do that."); // is handled in the /login
        res.redirect("/login");
    }
}

function disableCache(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}


// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// http://127.0.0.1:3000/dashboard/5afb81de9254e75ec4878acb