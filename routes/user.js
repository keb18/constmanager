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


// GET TIMESHEET
router.get('/:companyId/user/:userId/timesheet',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  (req, res) => {
    console.log('Get request received')
    // find project with provided id and serve it to the template
    User.findById(req.params.userId, (err, foundUser) => {
      if (err) {
        mid.errorDb();
        req.flash("error", "User was not found in the database.");
        res.redirect('back');
      }
      return res.json(foundUser.projects)
    });
  });

// GET PROJECT NAME
router.get('/:companyId/user/:userId/timesheet/findName/:projectNumber(*)',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
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
            console.log(foundProject)
            return res.json(foundProject);
          } else if (i === projects.length-1 && !k) {
            foundProject = {
              "projectName": "n/a",
              "_id": "n/a"
            }
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

  // POST TIMESHEETS
router.post('/:companyId/user/:userId/timesheet/save',
mid.isLoggedIn,
mid.disableCache,
mid.getCompany, (req, res) => {
  timesheet = req.body;
  // timesheet["28.05.2018"][1].projectId
  console.log(req.body);
  return res.json('Saved');
});
// 

module.exports = router;