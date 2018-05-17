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
          company: foundCompany,
          currentUser: req.user
        });
      }
    });
  });


// CREATE NEW PROJECT
router.post('/:companyId/project',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    // lookup company using ID to reference the project
    Company.findById(req.params.companyId, function (err, foundCompany) {
      if (err) {
        console.log(err);
        res.redirect("/dashboard/" + company._id + "/projects");
      } else {
        // Create a new project and add to the db
        Project.create(req.body.project, function (err, newlyCreatedProject) {
          if (err) {
            console.log(err);
          } else {
            // Reference the project to the current company
            foundCompany.projects.push(newlyCreatedProject);
            foundCompany.save();
            // Find the current user in db to reference the new project
            User.findById(req.user._id, function (err, foundUser) {
              if (err) {
                console.log(err);
                res.redirect("/dashboard/" + company._id + "/projects")
              } else {
                // Reference the project to the current user
                foundUser.projects.push(newlyCreatedProject);
                foundUser.save();

                // redirect back to the dashboard
                res.redirect("/dashboard/" + foundCompany._id + "/projects");
              }
            });
          }
        });
      }
    });
  });


// SHOW MORE INFO ABOUT ONE PROJECT
router.get('/:companyId/project/:projectId',
  mid.isLoggedIn,
  mid.disableCache,
  function (req, res) {
    // find project with provided id and serve it to the template
    Project.findById(req.params.projectId, function (err, foundProject) {
      if (err) {
        console.log(err);
      } else {
        // Find company and serve it to the template
        Company.findById(req.params.companyId, function (err, foundCompany) {
          if (err) {
            console.log(err);
            res.redirect("/dashboard/" + company._id);
          } else {
            // render the project template with the specified id
            res.render('project/showProject', {
              project: foundProject,
              company: foundCompany
            });
          }
        });
      };
    });
  });
// // SHOW MORE INFO ABOUT ONE PROJECT
// router.get('/:companyId/project/:projectId',
//   mid.isLoggedIn,
//   mid.disableCache,
//   function (req, res) {
//     // find project with provided id
//     Project.findById(req.params.projectId).populate('projects').exec(function (err, foundProject) {
//       if (err) {
//         console.log(err);
//       } else {
//         Company.findById(req.params.companyId, function (err, foundCompany) {
//           if (err) {
//             console.log(err);
//             res.redirect("/dashboard/" + company._id);
//           } else {
//             // render the project template with the specified id
//             res.render('project/showProject', {
//               project: foundProject,
//               company: foundCompany
//             });
//           }
//         });
//       };
//     });
//   });

module.exports = router;