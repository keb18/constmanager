const express = require('express'),
  passport = require('passport'),
  moment = require('moment'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
const Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
const mid = require('../middleware');

// Landing page
router.get('/', (req, res) => {
  res.render('landing');
  let a = moment();
  let day = a.get('day');
  let month = a.get('month');
  let year = a.get('year');
  console.log(moment().year(year).month(month).date(day));
});


// ===================================================================
// ======================== Authorisation routes =====================
// Show the register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register logic
router.post('/register',
  mid.checkRegisterInput,
  mid.checkExistingCompany,
  mid.checkExistingEmail,
  (req, res) => {
    // Create a new user
    const newUser = new User({
      username: req.body.user.username,
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      email: req.body.user.email,
      accountType: "owner",
      position: "manager",
      timesheets: {
        timesheetDate: moment().startOf('isoWeek').format("DD.MM.YYYY"),
        status: "open",
        timesheet:
          [{
            projectId: "",
            projectNumber: "",
            projectName: "",
            description: "",
            time: 0
          }]
      }
    });

    // Register user
    User.register(newUser, req.body.user.password)
      .then(user => {
        return Promise.all(
          [
            // Create new company
            Company.create({ companyName: req.body.companyName }),
            user // Serve user to next promises
          ]
        );
      })
      .then(results => Promise.all(
        [
          results, // Serve the new company and user to use in the response 
          pushUser(results[0], results[1]), // Push user to the company db
          pushCompany(results[0], results[1]) // Push company to the user db
        ]
      ))
      .then(resArr => {
        req.flash("success", `${resArr[0][1].firstName} ${resArr[0][1].lastName} has been successfully registered. Please check your email to `);
        return res.redirect(`login`); // Redirect to a confirmation page
      })
      .catch(err => {
        req.flash('error', err.message);
        mid.errorDb(err);
        return res.redirect('back');
      });
  });

// Associate company with new user
function pushUser(company, user) {
  company.users.push(user)
  company.save()
}

// Associate new user with the company
function pushCompany(company, user) {
  user.company.push(company)
  user.save()
}


// Show the login form
router.get('/login', (req, res) => {
  res.render('login');
});


// Handle login logic
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash("error", `${info.message}. Please check your credentials.`);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
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
router.get('/logout', (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out!")
  res.redirect('/');
});

module.exports = router;