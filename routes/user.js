let express = require('express'),
  router = express.Router(),
  moment = require('moment');

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

// ===============================================================
// ===================== TIMESHEETS LOGIC ========================
// ===============================================================

// ==================================================
// GET PROJECT NAME when inputting the project number
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

// =======================================================
// GET LAST timesheet when first opening the timesheet page
router.get('/:companyId/user/:userId/timesheet/last',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // find user with provided id in db and serve the timesheet to the template
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;

        // Get the total timesheet entries
        let numberOfEntries = foundTimesheets.length;

        // Find the last timesheet
        let lastTimesheet = foundTimesheets[numberOfEntries - 1];

        return res.json(lastTimesheet)
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      });
  });

// ===================================================
// GET FIRST & LAST timesheet for the calendar choices
router.get('/:companyId/user/:userId/timesheet/first',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // find user with provided id in db and serve the timesheet to the template
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;

        // Find the first timesheet
        let firstTimesheetDate = foundTimesheets[0].timesheetDate;

        // Find last timesheet
        let noTimesshets = foundTimesheets.length;
        let lastTimesheetDate = foundTimesheets[noTimesshets - 1].timesheetDate;

        let firstLastDate = {
          firstTimesheetDate: firstTimesheetDate,
          lastTimesheetDate: lastTimesheetDate
        }

        return res.json(firstLastDate)
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      });
  });

// // ===========================================
// // GET SELECTED timesheet for the calendar choice
router.post('/:companyId/user/:userId/timesheet/date',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    let selectedDate = req.body.selectedDate;

    let selectedWeek = moment(selectedDate, "DD.MM.YYYY").startOf('isoWeek').format("DD.MM.YYYY");

    // find user with provided id in db and search for the selected timesheet
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;

        // Find index of current date in all timesheets
        let timesheetIndex = foundTimesheets.findIndex(obj => obj.timesheetDate == selectedWeek);

        return res.json(foundTimesheets[timesheetIndex]);
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      });
  });

// ======================
// GET PREVIOUS timesheet
router.post('/:companyId/user/:userId/timesheet/previous',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // Save to variable the current timesheet
    let timesheet = req.body;
    // find user with provided id in db and serve the timesheet to the template
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;
        // Find the current date
        let currDate = timesheet.timesheetDate;

        // Find index of current date in all timesheets
        let timesheetIndex = foundTimesheets.findIndex(obj => obj.timesheetDate == currDate);

        // Check if the first timesheet has been reached
        if (timesheetIndex === 0) {
          message = { "state": "error", "message": "First timesheet has been reached." };
          return res.json(message);
        } else {
          // If not the first timesheet, find the next timesheet
          let previousTimesheet = foundTimesheets[timesheetIndex - 1];
          return res.json(previousTimesheet);
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      });
  });

// ==================
// GET NEXT timesheet
router.post('/:companyId/user/:userId/timesheet/next',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    // Save to variable the current timesheet
    let timesheet = req.body;
    // find user with provided id in db and serve the timesheet to the template
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;

        // Find the current date
        let currDate = timesheet.timesheetDate;

        // Find index of current date in all timesheets
        let timesheetIndex = foundTimesheets.findIndex(obj => obj.timesheetDate == currDate);

        // Check if the first timesheet has been reached
        if (timesheetIndex === foundTimesheets.length - 1) {
          message = { "state": "error", "message": "Last timesheet has been reached. Create a new timesheet for the next week." };
          return res.json(message);
        } else {
          // If not the last timesheet, find the next timesheet
          let nextTimesheet = foundTimesheets[timesheetIndex + 1];
          return res.json(nextTimesheet);
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      });
  });

// ========================
// POST new empty timesheet
router.post('/:companyId/user/:userId/timesheet/new',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {
    User.findById(req.params.userId)
      .then(foundUser => {
        // Get only the user's timesheet
        let foundTimesheets = foundUser.timesheets;

        // Get the total timesheet entries
        let numberOfEntries = foundTimesheets.length;

        // Find the date of the last timesheet
        let lastDate = foundTimesheets[numberOfEntries - 1].timesheetDate;

        // Number of the timesheet
        let lastNumber = foundTimesheets[numberOfEntries - 1].timesheetNumber;

        // Add 7 days to the last timesheet
        let newDate = moment(lastDate, "DD.MM.YYYY").add(7, 'days').format("DD.MM.YYYY");
        let tue = moment(newDate, "DD.MM.YYYY").add(1, 'days').format("DD.MM.YYYY");
        let wed = moment(newDate, "DD.MM.YYYY").add(2, 'days').format("DD.MM.YYYY");
        let thu = moment(newDate, "DD.MM.YYYY").add(3, 'days').format("DD.MM.YYYY");
        let fri = moment(newDate, "DD.MM.YYYY").add(4, 'days').format("DD.MM.YYYY");
        let sat = moment(newDate, "DD.MM.YYYY").add(5, 'days').format("DD.MM.YYYY");
        let sun = moment(newDate, "DD.MM.YYYY").add(6, 'days').format("DD.MM.YYYY");

        let newTimesheet = {
          timesheetNumber: lastNumber + 1,
          timesheetDate: newDate,
          status: "open",
          timesheet:
            [{
              "projectId": "",
              "projectNumber": "",
              "projectName": "",
              "description": "",
              "time": 0,
              "dayHours": {
                [newDate]: 0,
                [tue]: 0,
                [wed]: 0,
                [thu]: 0,
                [fri]: 0,
                [sat]: 0,
                [sun]: 0
              }
            }]
        }

        // Push the new timesheet
        foundTimesheets.push(newTimesheet);

        // Save to the database
        foundUser.save();

        return res.json({
          timesheet: newTimesheet,
          msg: { "state": "ok", "message": "New timesheet created." }
        });
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        return res.redirect('back');
      })
  });



// POST timesheet (submit current timesheet - cannot be edited by user)
router.post('/:companyId/user/:userId/timesheet/submit',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {

    let timesheetBody = req.body;
    let instruction = "submit";

    User.findById(req.params.userId)
      .then(foundUser => {
        let check = updateTimesheet(foundUser, timesheetBody, instruction);
        if (check === "saved") {
          res.json({
            "state": "ok",
            "message": "Timesheet has been submitted."
          });
        } else if (check === "closed") {
          res.json({
            "state": "error",
            "message": "Timesheet has already been submitted. Cannot be edited."
          });
        } else {
          res.json({
            "state": "error",
            "message": "There was an error in saving the timesheet. Please try again or contact us."
          });
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        return res.redirect('back');
      })
  });


  // PUT TIMESHEETS (save current timesheet)
router.put('/:companyId/user/:userId/timesheet/save',
  mid.isLoggedIn,
  mid.disableCache,
  (req, res) => {

    let timesheetBody = req.body;
    let instruction = "save";

    User.findById(req.params.userId)
      .then(foundUser => {
        let check = updateTimesheet(foundUser, timesheetBody, instruction);
        if (check === "saved") {
          res.json({
            "state": "ok",
            "message": "Timesheet has been saved."
          });
        } else if (check === "closed") {
          res.json({
            "state": "error",
            "message": "Timesheet has already been submitted. Cannot be edited."
          });
        } else {
          res.json({
            "state": "error",
            "message": "There was an error in saving the timesheet. Please try again or contact us."
          });
        }
      })
      .catch(err => {
        mid.errorDb(err);
        req.flash("error", "User was not found in the database.");
        return res.redirect('back');
      })
  });


function updateTimesheet(foundUser, timesheetBody, instruction) {

  let timesheetLookup = timesheetBody.timesheetDate.trim();

  // Get only the user's timesheet
  let foundTimesheets = foundUser.timesheets;

  // Find the index of the current date to be updated
  let indexOfTimesheet = foundTimesheets.findIndex(dateToFind => dateToFind.timesheetDate === timesheetLookup)

  // Find the length of the array containing all the time spent
  let lengthOfSpentTime = foundTimesheets[indexOfTimesheet].timesheet.length;

  // Determine the status of the array currently in the database
  let timeSpent = foundTimesheets.find(dateToFind => dateToFind.timesheetDate === timesheetLookup);

  if (timeSpent.status === 'open') {
    // Delete the exisiting times
    foundUser.timesheets[indexOfTimesheet].timesheet.splice(0, lengthOfSpentTime);
    
    // Delete the current status

    // Push the new times
    times = timesheetBody.timesheet
    times.forEach(element => {
      foundUser.timesheets[indexOfTimesheet].timesheet.push(element);
    });
    
    if(instruction === "submit"){
      foundUser.timesheets[indexOfTimesheet].status = "closed";
    }


    // Mark the array for changes
    foundUser.markModified('timesheets');

    // Save to the database
    foundUser.save();
    return "saved"
  } else if (timeSpent.status === 'closed') {
    return "closed"
  } else {
    return "error"
  }
}


module.exports = router;