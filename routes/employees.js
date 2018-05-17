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
    // console.log(req.user);
    Company.findById(req.params.companyId).populate('users').exec(function (err, foundCompany) {
      if (err) {
        console.log(err);
      } else {
        res.render('employee/employees', {
          employees: foundCompany.users,
          company: foundCompany,
          currentUser: req.user
        });
      }
    });
  });


// NEW EMPLOYEE CREATION PAGE
router.get('/:companyId/employee/new',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    Company.findById(req.params.companyId, function (err, foundCompany) {
      if (err) {
        console.log(err);
      } else {
        res.render('employee/newEmployee', { company: foundCompany });
      }
    });
  });


// CREATE NEW PROJECT
// router.post('/:companyId/employee', function(req, res){
//   console.log(req.body.employee);
//   console.log(req.body.employee.employeeUserName);
//   console.log(req.body.employee.employeePassword);
// });

router.post('/:companyId/employee',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render('employee/employees');
      }


      // user.firstName = req.body.employeeFirstName;
      // user.lastName = req.body.employeeLastNumber;
      // user.email = req.body.email;
      // user.position = req.body.position;
      // user.salary = req.body.salary;
      // user.accountType = req.body.accountType;
      // user.userJoined = Date.now();

      // Create a new project and add to the db
      Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
          console.log(err);
        } else {
          // Associate user with the company
          foundCompany.users.push(user);
          foundCompany.save();
          // Associate user with the company
          user.company.push(foundCompany);
          user.set(req.body.employee) // employee comes from the template
          user.save(function (err, updatedUser) {
            if (err) {
              console.log(err);
            } else {
              Company.findById(req.params.companyId).populate('users').exec(function (err, foundCompany) {
                if (err) {
                  console.log(err);
                } else {
                  res.render('employee/employees', {
                    employees: foundCompany.users,
                    company: foundCompany,
                    currentUser: req.user
                  });
                }
              });
            }
          });
        }
      });
    });
  });



module.exports = router;