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
    user.position = "manager";
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
router.get('/login', function (req, res) {
  res.render('login');
});

// Handle login logic
router.post('/login', function (req, res, next) {
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
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;