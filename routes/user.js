let express = require('express'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");


// RENDER THE USER PAGE
router.get('/:companyId/user/:userId',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  function (req, res) {
    // render the project template for the specified projectid
    res.render('user/user', {
      currentCompany: req.currentCompany
    });
  });


// ===================== TIMESHEETS LOGIC ========================
// ===============================================================
// GET last timesheet when first opening the timesheet page
router.get('/:companyId/user/:userId/timesheet',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // find project with provided id and serve it to the template
    User.findById(req.params.userId, (err, foundUser) => {
      if (err) {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      }
      return res.json(foundUser.timesheets)
    });
  });

// GET project name when inputting the project number
router.get('/:companyId/user/:userId/timesheet/findName/:projectNumber(*)',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    Company.findById(req.params.companyId)
      .populate('projects', 'projectNumber projectName')
      .exec()
      .then(company => {
        let projects = company.projects;
        for (let i = 0, k = false; i < projects.length; i++) {
          if (projects[i].projectNumber === req.params.projectNumber) {
            k = true;
            foundProject = {
              "projectName": projects[i].projectName,
              "_id": projects[i]._id
            }
            return res.json(foundProject);
          } else if (i === projects.length - 1 && !k) {
            foundProject = { "projectName": "n/a", "_id": "n/a" }
            return res.json(foundProject);
          }
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "There was a problem fetching the projects from the database.");
        res.redirect('back');
      });
  });

// POST timesheet (submit current timesheet - cannot be edited after code runs)
router.post('/:companyId/user/:userId/timesheet/submit',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    console.log("POST route.")
    timesheet = req.body;
    timesheet.status = "closed";
    User.findById(req.params.userId)
      .then(foundUser => {
        // change the status of the timesheet {status: closed}
        pushTimesheet(timesheet, foundUser)
      })
      .then(() => { return res.json('Timesheet has been submitted.'); })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        return res.redirect('back');
      })
  });

// Push timesheet to user
function pushTimesheet(timesheet, user) {
  user.timesheets.push(timesheet)
  user.save()
}

// PUT TIMESHEETS (save current timesheet)
router.put('/:companyId/user/:userId/timesheet/save',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    
    timesheetBody = req.body;
    timesheetLookup = timesheetBody.timesheetDate;

    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;
        // console.log(foundTimesheets)
        // Find the index of the current date to be updated
        const indexOfTimesheet = foundTimesheets.findIndex(dateToFind => dateToFind.timesheetDate === timesheetLookup)
        // Find the length of the array containing all the time spent
        const lengthOfSpentTime = foundUser.timesheets[indexOfTimesheet].timesheet.length;

        // Determine the status of the array currently in the database
        const timeSpent = foundTimesheets.find(dateToFind => dateToFind.timesheetDate === timesheetLookup);
        if (timeSpent.status === 'open') {
          // Delete the exisiting times
          foundUser.timesheets[indexOfTimesheet].timesheet.splice(0, lengthOfSpentTime);

          // Push the new times
          times = timesheetBody.timesheet
          times.forEach(element => {
            foundUser.timesheets[indexOfTimesheet].timesheet.push(element);
          })

          // Mark the array for changes
          foundUser.markModified('timesheets');

          // Save to the database
          foundUser.save()

          return res.json({
            "state": "ok",
            "message": "Timesheet has been saved"
          });
        } else if (timeSpent.status === 'closed') {
          return res.json({
            "state": "error",
            "message": "Timesheet has already been submitted. Cannot be edited."
          });
        } else {
          return res.json({
            "state": "error",
            "message": "There was an error in saving the timesheet. Please try again or contact us."
          })
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        return res.redirect('back');
      })
  });

module.exports = router;