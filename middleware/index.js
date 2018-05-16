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
// caching disabled for every route to ensure that
// when hitting back after logging out it won't show
// an area which should be accessed only by users
middlewareObject.disableCache = function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
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