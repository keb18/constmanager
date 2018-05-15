const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

// Set-up module imports for the mongoose schemas
const Project = require('./models/project'),
    Company = require('./models/company'),
    User = require('./models/user');

// Connect to the mongodb company server
mongoose.connect('mongodb://localhost/main_database');

// Make public folder accessible by default
app.use(express.static(__dirname + '/public'));

// Setup Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// use routes without the *.ejs extension
app.set('view engine', 'ejs');

// Landing page
app.get('/', function (req, res) {
    res.render('landing');
});


// =================================================================
// ========================== ADMIN ===============================
// ADMIN DASHBOARD
app.get('/adminDashboard', function (req, res) {
    // Get all projects from db
    Company.find({}, function (err, allCompanies) {
        if (err) {
            console.log(err);
        } else {
            res.render('admin/adminDashboard', { companies: allCompanies });
        }
    });
});


// CREATE
// ADMIN CREATE NEW COMPANY
app.post('/adminDashboard', function (req, res) {
    // get data from form and add to projects array
    let name = req.body.companyName;

    let newCompany = {
        companyName: name
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
app.get('/adminDashboard/new', function (req, res) {
    res.render('admin/newCompany');
});


// ADMIN SHOW MORE INFO ABOUT ONE COMPANY
app.get('/adminDashboard/company/:id', function (req, res) {
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


// =================================================================
// ========================== COMPANY ==============================
// INDEX
// COMPANY DASHBOARD
app.get('/dashboard/:companyId', function (req, res) {
    Company.findById(req.params.companyId).populate('projects').exec(function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCompany);
            // render the project template with the specified id
            // res.send("This is the company dashboard page");
            res.render('company/dashboard', {
                projects: foundCompany.projects,
                company: foundCompany
            });
        }
    });
});


// NEW
// COMPANY NEW PROJECT CREATION PAGE
app.get('/dashboard/:companyId/project/new', function (req, res) {
    Company.findById(req.params.companyId, function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            res.render('project/newProject', { company: foundCompany });
        }
    });
});


// CREATE
// COMPANY CREATE NEW PROJECT
app.post('/dashboard/:companyId/project', function (req, res) {
    // lookup company using ID
    Company.findById(req.params.companyId, function (err, company) {
        if (err) {
            console.log(err);
            res.redirect("/dashboard/" + company._id);
        } else {
            // Create a new project and add to the db
            Project.create(req.body.project, function (err, newlyCreatedProject) {
                if (err) {
                    console.log(err);
                } else {
                    company.projects.push(newlyCreatedProject);
                    company.save();
                    // redirect back to the dashboard
                    res.redirect("/dashboard/" + company._id);
                }
            });
        }
    });
});


// SHOW
// COMPANY SHOW MORE INFO ABOUT ONE PROJECT
app.get('/dashboard/:companyId/project/:projectId', function (req, res) {
    // find project with provided id
    Project.findById(req.params.projectId).populate('projects').exec(function (err, foundProject) {
        if (err) {
            console.log(err);
        } else {
            // render the project template with the specified id
            res.render('project/showProject', {
                project: foundProject
            });
        };
    });
});


// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});