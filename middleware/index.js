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
        req.flash("error", "You need to be logged in to do that.");
        res.redirect('/login');
    }
}

// HANDLE DATABASE ERROR LOGS
middlewareObject.errorDb = function (err) {
    console.log(err);
}

// DISABLE CACHE
// caching disabled for every route to ensure that when hitting back after logging out it won't show an area which should be accessed only by users
middlewareObject.disableCache = function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
}


// Find the company from database
middlewareObject.getCompany = function (req, res, next) {
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

// Check if the company exists in the database
middlewareObject.checkExistingCompany = function (req, res, next) {
    let checkCompany = req.body.companyName;
    Company.findOne({ companyName: checkCompany })
        .then(foundCompany => {
            if (foundCompany !== null) {
                let error = `Company with the name "${req.body.companyName}" already exists.`;
                req.flash("error", error);
                res.redirect("back");
            } else {
                next();
            }
        });
}

// Check if email exists in the database
middlewareObject.checkExistingEmail = function (req, res, next) {
    let user = req.body.user;
    User.findOne({ email: user.email })
        .then((foundEmail) => {
            if (foundEmail !== null) {
                let error = `A user with the email "${user.email}" already exists. Please check your email.`;
                req.flash("error", error);
                res.redirect("back");
            } else {
                next();
            }
        });
}

// Check user register input
middlewareObject.checkRegisterInput = function (req, res, next) {
    let errors = []
    let user = req.body.user;

    let companyRegex = /^[^\s]+(\s+[^\s]+)*$/;
    let nameRegex = /^(?=.{3,}$)[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])+$/; // min 3 chars
    let usernameRegex = /^(?=.{4,10}$)[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])+$/; // min 4 max 8 chars
    let passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}/; // minimum 8 characters, one uppercase, one number, one special 
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Check Company Name
    let testCompany = companyRegex.test(req.body.companyName);
    if (!testCompany) {
        errors.push("Company name can't start or end with space.");
    }

    // Check First Name
    let testFirstName = nameRegex.test(user.firstName)
    if (!testFirstName) {
        errors.push(`First name: "${user.firstName}" is not valid. Must contain minimum 3 characters.`);
    }

    // Check Last Name
    let testLastName = nameRegex.test(user.lastName)
    if (!testLastName) {
        errors.push(`Last name: "${user.lastName}" is not valid. Must contain minimum 3 characters.`);
    }

    // Check email
    let testEmail = emailRegex.test(user.email)
    if (!testEmail) {
        errors.push(`Email: "${user.email}" is not valid.`);
    }

    // Check username
    let testUsername = usernameRegex.test(user.username)
    if (!testUsername) {
        errors.push(`Username: "${user.username}" is not valid. Must contain between 4 and 10 alphanumeric characters.`);
    }

    // Check password
    let testPassword = passwordRegex.test(user.password)
    if (!testPassword) {
        errors.push("Password not valid. Must contain minimum 8 characters, one uppercase letter, one number and one special character.");
    }

    // Check passwords match
    if (user.password !== user.confirmPassword) {
        errors.push(`Passwords don't match`);
    }

    // Check password not email
    if (user.password === user.email) {
        errors.push("Password can't be the same as the email");
    }

    // Check password not username
    if (user.password === user.username) {
        errors.push("Password can't be the same as the username");
    }

    if (errors.length > 0) {
        req.flash("error", errors);
        res.redirect("back");
    } else {
        next();
    }
}


// EXPORT TO app.js
module.exports = middlewareObject