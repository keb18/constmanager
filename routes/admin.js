let express = require('express'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");


// ADMIN DASHBOARD
router.get('/',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    // Get all projects from db
    Company.find({}, function (err, allCompanies) {
      if (err) {
        console.log(err);
      } else {
        res.render('admin/adminDashboard', { companies: allCompanies });
      }
    });
  });


// CREATE NEW COMPANY
router.post('/',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    // get data from form and add to projects array
    let newCompany = {
      companyName: req.body.companyName
    }
    // Create a new project and add to the db
    Company.create(newCompany, function (err, newlyCreatedCompany) {
      if (err) {
        console.log(err);
      } else {
        // redirect back to the dashboard
        res.redirect('/adminDashboard')
      }
    });
  });


// ADMIN NEW COMPANY CREATION PAGE
router.get('/new',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    res.render('admin/newCompany');
  });


// ADMIN SHOW MORE INFO ABOUT ONE COMPANY
router.get('/company/:id',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    // find project with provided id
    Company.findById(req.params.id, function (err, foundCompany) {
      if (err) {
        console.log(err);
      } else {
        // render the project template with the specified id
        res.render('admin/showCompany', { company: foundCompany });
      }
    });
  });

module.exports = router;