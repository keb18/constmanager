let express = require('express'),
  passport = require('passport'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require('../middleware');

// Landing page
router.get('/', function (req, res) {
  res.render('landing');
});


// ===================================================================
// ======================== Authorisation routes =====================
// Show the register form
router.get('/register', function (req, res) {
  res.render('register');
});

// Handle register logic
router.post('/register', function (req, res) {
  // Check if company name exists
  const checkCompany = Company.find({ companyName: req.body.companyName });
  if (!(checkCompany.length > 0)) {
    req.flash('error', `Company with the name "${req.body.companyName}" already exists.`);
    return res.redirect('back');
  }
  // Start registering the User using passport
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash('error', err.message);
      mid.errorDb(err);
      return res.redirect('back');
    }
    // Populate the user fields
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.accountType = "owner";
    user.position = "manager";

    // Create a new company and add to the db
    Company.create({ companyName: req.body.companyName }, function (err, newlyCreatedCompany) {
      if (err) {
        req.flash('error', "Something went wrong when creating the company.");
        mid.errorDb(err);
        return res.redirect('back');
      }
      // Associate company with new user
      newlyCreatedCompany.users.push(user);
      newlyCreatedCompany.save();
      // Associate new user with the company
      user.company.push(newlyCreatedCompany);
      user.save();
      passport.authenticate('local')(req, res, function () {
        res.redirect('/' + newlyCreatedCompany._id);
      });
    });
  });
});

// Show the login form
router.get('/login', function (req, res) {
  // req.flash("error", "You need to be logged.")
  res.render('login');
});

// Handle login logic
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash("error", `${info.message}. Please check your credentials.`);
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        req.flash("error", err);
        mid.errorDb(err);
        return next(err);
      }
      // Flash success message
      req.flash("success", `Welcome back ${user.firstName} ${user.lastName}`);
      return res.redirect(`/${user.company}/dashboard`);
    });
  })(req, res, next);
});

// Handle logout logic
router.get('/logout', function (req, res) {
  req.logout();
  req.flash("success", "You have been logged out!")
  res.redirect('/');
});

module.exports = router;