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
  function (req, res) {
    // console.log(req.user);
    // Find the company and populate it with the current projects
    Company.findById(req.params.companyId).populate('projects').exec(function (err, foundCompany) {
      if (err) {
        console.log(err);
      } else {
        // console.log(req.user);
        res.render('project/projects', {
          projects: foundCompany.projects,
          currentCompany: foundCompany
        });
      }
    });
  });


// CREATE NEW PROJECT
router.post('/:companyId/project',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  function (req, res) {
    // Create a new project and add to the db
    Project.create(req.body.project, function (err, newlyCreatedProject) {
      if (err) {
        console.log(err);
      } else {
        // Get the current company from middleware
        foundCompany = req.currentCompany;
        // Reference the project to the current company
        foundCompany.projects.push(newlyCreatedProject);
        foundCompany.save();

        // Reference the project to the current user
        currentUser = req.user;
        currentUser.projects.push(newlyCreatedProject);
        currentUser.save();

        // redirect back to the dashboard
        res.redirect("/dashboard/" + foundCompany._id + "/projects");
      }
    });
  });
// router.post('/:companyId/project',
//   mid.isLoggedIn,
//   mid.disableCache,
//   function (req, res) {
//     // find company using ID to reference the project
//     Company.findById(req.params.companyId, function (err, foundCompany) {
//       if (err) {
//         console.log(err);
//         res.redirect("/dashboard/" + company._id + "/projects");
//       } else {
//         // Create a new project and add to the db
//         Project.create(req.body.project, function (err, newlyCreatedProject) {
//           if (err) {
//             console.log(err);
//           } else {
//             // Reference the project to the current company
//             foundCompany.projects.push(newlyCreatedProject);
//             foundCompany.save();

//             // Reference the project to the current user
//             currentUser = req.user;
//             currentUser.projects.push(newlyCreatedProject);
//             currentUser.save();

//             // redirect back to the dashboard
//             res.redirect("/dashboard/" + foundCompany._id + "/projects");
//           }
//         });
//       }
//     });
//   });


// SHOW MORE INFO ABOUT ONE PROJECT
router.get('/:companyId/project/:projectId',
  mid.isLoggedIn,
  mid.disableCache,
  mid.getCompany,
  function (req, res) {
    // find project with provided id and serve it to the template
    Project.findById(req.params.projectId, function (err, foundProject) {
      if (err) {
        console.log(err);
      } else {
        // render the project template for the specified projectid
        res.render('project/showProject', {
          project: foundProject,
          // currentCompany from middleware
          currentCompany: req.currentCompany
        });
      }
    });
  });

module.exports = router;