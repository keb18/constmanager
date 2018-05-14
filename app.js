const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

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


// Dashboard
// INDEX - Show company dashboard
app.get('/dashboard', function (req, res) {
    // Get all projects from db
    Project.find({}, function (err, allProjects) {
        if (err) {
            console.log(err);
        } else {
            res.render('dashboard', { projects: allProjects });
        }
    });
});

// CREATE - Add a new project
app.post('/dashboard', function (req, res) {
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

// NEW - Show new project creation page
app.get('/dashboard/new', function (req, res) {
    res.render('new_project');
});

// SHOW - Show more info about one project
app.get('/dashboard/:id', function (req, res) {
    // find project with provided id
    Project.findById(req.params.id, function (err, foundProject) {
        if (err) {
            console.log(err);
        } else {
            // render the project template with the specified id
            res.render('show_project', {project: foundProject});
        }
    });
});






// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});