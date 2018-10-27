let express = require('express'),
  passport = require('passport'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");

// EMPLOYEES DASHBOARD
router.get('/:companyId/employees',
  mid.isLoggedIn,
  mid.disableCache,
  // mid.checkCompanyAuth,
  function (req, res) {
    Company.findById(req.params.companyId).populate('users').exec(function (err, foundCompany) {
      if (err) {
        mid.errorDb(err);
        res.redirect('back');
      } else {
        res.render('employee/employees', {
          employees: foundCompany.users,
          currentCompany: foundCompany
        });
      }
    });
  });


// CREATE NEW EMPLOYEE
router.post('/:companyId/employee',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        mid.errorDb(err);
        req.flash("error", err.message);
        res.redirect('back');
      }

      // Create a new project and add to the db
      Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
          mid.errorDb(err);
          res.redirect('back');
        } else {
          // Add user to company
          foundCompany.users.push(user);
          foundCompany.save();
          // Add company to user
          user.company.push(foundCompany);
          user.set(req.body.employee) // employee comes from the template
          user.save(function (err, updatedUser) {
            if (err) {
              mid.errorDb(err);
              res.redirect('back');
            } else {
              Company.findById(req.params.companyId).populate('users').exec(function (err, foundCompany) {
                if (err) {
                  mid.errorDb(err);
                  res.redirect('back');
                } else {
                  res.render('employee/employees', {
                    employees: foundCompany.users,
                    currentCompany: foundCompany
                  });
                }
              });
            }
          });
        }
      });
    });
  });


// SHOW MORE INFO ABOUT ONE employee
router.get('/:companyId/employee/:employeeId',
mid.isLoggedIn,
mid.disableCache,
function (req, res) {
  // find user and populate the projects
  User.findById(req.params.employeeId).populate('projects').exec(function (err, foundUser) {
    if (err) {
      mid.errorDb(err);
      res.redirect('back');
    } else {
      // find company and serve it to the template
      Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
          mid.errorDb(err);
          res.redirect('back');
        } else {
          // render the project template with the specified id
          res.render('employee/showEmployee', {
            currentCompany: foundCompany,
            employee: foundUser
          });
        }
      });
    };
  });
});

module.exports = router;