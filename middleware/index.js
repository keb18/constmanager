// Set-up module imports for the mongoose schemas
let Project = require('../models/project'),
    Company = require('../models/company'),
    User = require('../models/user');

// MIDDLEWARE
var middlewareObject = {};

// CHECK IF USER IS LOGGED
// before running next() which can be a route only for logged users
middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // req.flash("error", "You need to be logged in to do that."); // is handled in the /login
        res.redirect('/login');
    }
}

// DISABLE CACHE
// caching disabled for every route to ensure that when hitting back after logging out it won't show an area which should be accessed only by users
middlewareObject.disableCache = function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}


// Find the company from database
middlewareObject.getCompany = function(req, res, next) {
    Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
          console.log(err);
          res.redirect("/dashboard/" + company._id);
        } else {
            // Serve foundCompany
            req.currentCompany = foundCompany;
            next();
        }
      });
}


// Check if user is allowed to access the company
middlewareObject.checkCompanyAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        // req.params.companyId gets it from the route which calls this function
        Company.findById(req.params.companyId, function (err, foundCompany) {
            if (err) {
                req.flash("error", "Campground was not found."); // is handled in the "back"
                res.redirect("back");
            } else {
                console.log(foundCompany.users);
                console.log(req.user._id);
                // if (foundCompany.users.equals(req.user._id)) { // equals is a mongoose method
                //     // continue executing the code
                //     next();
                // } else {
                //     // req.flash("error", "You are not part of this organisation.");
                //     res.redirect("back");
                // }
            }
        });
    }
}

// Check if user is allowed to access the project
middlewareObject.checkProjectAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        // req.params.projectId gets it from the route which calls this function
        if (req.params.projectId.equals(req.user._id)) { // equals is a mongoose method
            // continue executing the code
            next();
        } else {
            // req.flash("error", "You are not allowed to access this project.");
            res.redirect("back");
        }
    }
}




// // CHECK CAMPGROUND OWNERSHIP
// middlewareObject.checkCampOwnership = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         // req.params.id gets it from the route which calls this function
//         Campground.findById(req.params.id, function (err, foundCampground) {
//             if (err) {
//                 req.flash("error", "Campground was not found."); // is handled in the "back"
//                 res.redirect("back");
//             } else {
//                 // does user own the campground?
//                 // req.user._id is available from app.js by passing current
//                 // user to all routes
//                 if (foundCampground.author.id.equals(req.user._id)) { // mongoose method
//                     // continue executing the code
//                     next();
//                 } else {
//                     req.flash("error", "You can't modify campgrounds created by others."); // is handled in the /login
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that."); // is handled in the "back"
//         res.redirect("back");
//     }
// }

// // CHECK COMMENT OWNERSHIP
// middlewareObject.checkCommentOwnership = function(req, res, next) {
//     if (req.isAuthenticated()) {
//         // req.params.id gets it from the route which calls this function
//         Comment.findById(req.params.comment_id, function (err, foundComment) {
//             if (err) {
//                 res.redirect("back");
//             } else {
//                 // does user own the comment?
//                 // req.user._id is available from app.js by passing current
//                 // user to all routes
//                 if (foundComment.author.id.equals(req.user._id)) { // mongoose method
//                     // continue executing the code
//                     next();
//                 } else {
//                     req.flash("error", "You need to be logged in to do that."); // is handled in the "back"
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// }

// EXPORT TO app.js
module.exports = middlewareObject