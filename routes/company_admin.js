let express = require('express'),
  passport = require('passport'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");

// ADMIN DASHBOARD
router.get('/:companyId/company_admin',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // find user with provided id in db and serve the timesheet to the template
    Company.findById(req.params.companyId)
      .populate('users')
      .exec()
      .then(foundCompany => {
        // res.json(findOpenTimesheets(foundCompany));
        res.render('company_admin/company_admin', {
          employees: findOpenTimesheets(foundCompany),
          currentCompany: foundCompany
        })
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "Company was not found in the database.");
        res.redirect('back');
      });
  });

function findOpenTimesheets(foundCompany) {
  let employees = [];
  foundCompany.users.forEach(function (user, i) {
    employees.push({
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      position: user.position,
      totalOpenTimesheets: 0,
      openTimesheetsDates: [],
      totalNotApprovedTimesheets: 0,
      notApprovedTimesheetsDates: []
    });

    user.timesheets.forEach(function (timesheet) {
      if (timesheet.status === "open") {
        employees[i].totalOpenTimesheets++;
        employees[i].openTimesheetsDates.push(String(timesheet.timesheetDate));
      }
      if (timesheet.approved === "no") {
        employees[i].totalNotApprovedTimesheets++;
        employees[i].notApprovedTimesheetsDates.push(String(timesheet.timesheetDate));
      }
    });

    if (employees[i].totalOpenTimesheets === 0) {
      employees[i].openTimesheetsDates.push("All timesheets submitted.");
    }
    if (employees[i].totalNotApprovedTimesheets === 0) {
      employees[i].totalNotApprovedTimesheets.push("All timesheets approved.");
    }

  });
  return employees
}



// ADD NEW TIMESHEET CODES
router.post('/:companyId/company_admin/editTimesheetCodes',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    let newCodes = req.body
    console.log(req.body).
      // find user with provided id in db and serve the timesheet to the template
      Company.findById(req.params.companyId)
      .then(foundCompany => {

        console.log(foundCompany.admin);

        return res.json(foundCompany.admin)
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "Company was not found in the database.");
        res.redirect('back');
      });
  });


// // SAVE TIMESHEET CODES
// router.post('/:companyId/employee',
//   mid.isLoggedIn,
//   mid.disableCache,
//   function (req, res) {
//     let newUser = new User({ username: req.body.username });
//     User.register(newUser, req.body.password, function (err, user) {
//       if (err) {
//         mid.errorDb(err);
//         req.flash("error", err.message);
//         res.redirect('back');
//       }

//       // Create a new project and add to the db
//       Company.findById(req.params.companyId, function (err, foundCompany) {
//         if (err) {
//           mid.errorDb(err);
//           res.redirect('back');
//         } else {
//           // Add user to company
//           foundCompany.users.push(user);
//           foundCompany.save();
//           // Add company to user
//           user.company.push(foundCompany);
//           user.set(req.body.employee) // employee comes from the template
//           user.save(function (err, updatedUser) {
//             if (err) {
//               mid.errorDb(err);
//               res.redirect('back');
//             } else {
//               Company.findById(req.params.companyId).populate('users').exec(function (err, foundCompany) {
//                 if (err) {
//                   mid.errorDb(err);
//                   res.redirect('back');
//                 } else {
//                   res.render('employee/employees', {
//                     employees: foundCompany.users,
//                     currentCompany: foundCompany
//                   });
//                 }
//               });
//             }
//           });
//         }
//       });
//     });
//   });

module.exports = router;