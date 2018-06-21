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


// GET LAST TIMESHEET
router.get('/:companyId/user/:userId/timesheet/project',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  (req, res) => {
    console.log('Get request received')
    console.log(req.params.userId)
    // find project with provided id and serve it to the template
    User.findById(req.params.userId, (err, foundUser) => {
      if (err) {
        mid.errorDb();
        req.flash("error", "The user was not found in the database.");
        res.redirect('back');
      }
      return res.json(foundUser)
    });
    // console.log(req);
    // plm = {'response': 'Here is your data.'};
    // return res.json(plm)
  });

module.exports = router;