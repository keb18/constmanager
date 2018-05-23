let express = require('express'),
  router = express.Router();

// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
  Company = require('../models/company'),
  User = require('../models/user');

// Require the middleware
let mid = require("../middleware");


// INDEX - COMPANY DASHBOARD
router.get('/:companyId',
  mid.isLoggedIn,
  mid.disableCache,
  // mid.checkCompanyAuth,
  function (req, res) {
    // console.log(req.user);
    Company.findById(req.params.companyId).populate('projects').exec(function (err, foundCompany) {
      if (err) {
        console.log(err);
      } else {
        res.render('company/dashboard', {
          projects: foundCompany.projects,
          currentCompany: foundCompany
        });
      }
    });
  });


// // NEW PROJECT CREATION PAGE
// router.get('/:companyId/project/new',
//   mid.isLoggedIn,
//   mid.disableCache,
//   function (req, res) {
//     Company.findById(req.params.companyId, function (err, foundCompany) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.render('company/newProject', { company: foundCompany });
//       }
//     });
//   });


// // CREATE NEW PROJECT
// router.post('/:companyId/project',
//   mid.isLoggedIn,
//   mid.disableCache,
//   function (req, res) {
//     // lookup company using ID
//     Company.findById(req.params.companyId, function (err, company) {
//       if (err) {
//         console.log(err);
//         res.redirect("/dashboard/" + company._id);
//       } else {
//         // Create a new project and add to the db
//         Project.create(req.body.project, function (err, newlyCreatedProject) {
//           if (err) {
//             console.log(err);
//           } else {
//             // console.log(req.user);
//             company.projects.push(newlyCreatedProject);
//             company.save();
//             // redirect back to the dashboard
//             res.redirect("/dashboard/" + company._id);
//           }
//         });
//       }
//     });
//   });


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
//             res.render('company/showProject', {
//               project: foundProject,
//               company: foundCompany
//             });
//           }
//         });
//       };
//     });
//   });

module.exports = router;