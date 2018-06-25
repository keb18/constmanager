let express = require('express'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");


// INDEX - SHOW PROJECTS PAGE
router.get('/:companyId/projects',
  mid.isLoggedIn,
  mid.disableCache,
  // mid.checkCompanyAuth,
  (req, res) => {
    // Find the company and populate it with the current projects
    Company.findById(req.params.companyId).populate('projects')
      .exec((err, foundCompany) => {
        if (err) {
          mid.errorDb(err);
          req.flash("error", "There was a problem fetching the projects from the database.");
          res.redirect('back');
        }
        res.render('project/projects', {
          projects: foundCompany.projects,
          currentCompany: foundCompany
        });
      });
  });


// CREATE NEW PROJECT
router.post('/:companyId/project',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  (req, res) => {
    // Create a new project and add to the db
    Project.create(req.body.project, (err, newlyCreatedProject) => {
      if (err) {
        mid.errorDb(err);
        req.flash("error", "There was a problem creating a new project.");
        res.redirect('back');
      }
      // Get the current company from middleware
      let foundCompany = req.currentCompany;
      // Reference the project to the current company
      foundCompany.projects.push(newlyCreatedProject);
      foundCompany.save();

      // Reference the project to the current user
      let currentUser = req.user;
      currentUser.projects.push(newlyCreatedProject);
      currentUser.save();

      req.flash("success", "New project has been created.");
      // redirect back to the dashboard
      res.redirect(`/${foundCompany._id}/projects`);
    });
  });

  
// SHOW MORE INFO ABOUT ONE PROJECT
router.get('/:companyId/project/:projectId',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  function (req, res) {
    // find project with provided id and serve it to the template
    Project.findById(req.params.projectId, (err, foundProject) => {
      if (err) {
        mid.errorDb();
        req.flash("error", "The project was not found in the database.");
        res.redirect('back');
      }
      // render the project template for the specified projectid
      res.render('project/showProject', {
        project: foundProject,
        currentCompany: req.currentCompany // currentCompany comes from middleware
      });
    });
  });


// Show contract information
router.get('/:companyId/project/:projectId/contract',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  (req, res) => {
    // find project with provided id and serve it to the template
    Project.findById(req.params.projectId, (err, foundProject) => {
      if (err) {
        mid.errorDb();
        req.flash("error", "The project was not found in the database.");
        res.redirect('back');
      }
      return res.json(foundProject)
    });
  });

module.exports = router;