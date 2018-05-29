let express = require('express'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");


// GET LAST TIMESHEET
// SHOW MORE INFO ABOUT ONE PROJECT
router.get('/:companyId/timesheets',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  function (req, res) {
    // render the project template for the specified projectid
    res.render('timesheet/timesheets', {
      currentCompany: req.currentCompany
    });
  });


module.exports = router;