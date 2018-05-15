const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Set-up module imports for the mongoose schemas
const Project = require('./models/project'),
    Company = require('./models/company'),
    User = require('./models/user');

// Set-up the seeds to populate the database with data
let seedDB = require('./seeds');
// seedDB();


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
            res.render('adminDashboard', { companies: allCompanies });
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
    res.render('newCompany');
});


// ADMIN SHOW MORE INFO ABOUT ONE COMPANY
app.get('/adminDashboard/:id', function (req, res) {
    // find project with provided id
    Company.findById(req.params.id, function (err, foundCompany) {
        if (err) {
            console.log(err);
        } else {
            // render the project template with the specified id
            res.render('showCompany', { company: foundCompany });
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
            console.log(foundCompany);
            // render the project template with the specified id
            // res.send("This is the company dashboard page");
            res.render('dashboard', { projects: foundCompany.projects });
        }
    });
});


// CREATE
// COMPANY CREATE NEW PROJECT
app.post('/dashboard/:companyId', function (req, res) {
    // get data from form and add to projects array
    let name = req.body.projectName,
        number = req.body.projectNumber,
        description = req.body.projectDescription;

    let newProject = {
        projectName: name,
        projectNumber: number,
        projectDescription: description
    }
    // Create a new project and add to the db
    Project.create(newProject, function (err, newlyCreatedProject) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to the dashboard
            res.redirect('/dashboard')
        }
    });
});


// NEW
// COMPANY NEW PROJECT CREATION PAGE
app.get('/dashboard/:companyId/new', function (req, res) {
    res.render('newProject');
});


// SHOW
// COMPANY SHOW MORE INFO ABOUT ONE PROJECT
app.get('/dashboard/:companyId/:projectId', function (req, res) {
    // find project with provided id
    Project.findById(req.params.id).populate('projects').exec(function (err, foundProject) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundProject);
            // render the project template with the specified id
            res.render('showProject', { project: foundProject });
        }
    });
});



// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});