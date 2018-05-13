const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the mongodb company server
mongoose.connect('mongodb://localhost/company');

// Make public folder accessible by default
app.use(express.static(__dirname + "/public"));

// Setup Body Parser
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');

// Landing page
app.get('/', function (req, res) {
    res.render('landing');
});


var projects = [
    { projectName: "24 High Street", projectNumber: "22331", projectDateCreated: "12/03/2018" },
    { projectName: "21 High Street", projectNumber: "22111", projectDateCreated: "12/03/2018" },
    { projectName: "23 High Street", projectNumber: "21231", projectDateCreated: "12/03/2018" }
];

// Dashboard (Campgrounds)
// Show company dashboard
app.get('/dashboard', function (req, res) {
    res.render('dashboard', { projects: projects });
});

// Add a new project (campground)
app.post('/dashboard', function (req, res) {
    // get data from form and add to projects array
    let name = req.body.projectName;
    let number = req.body.projectNumber;
    let newProject = { projectName: name, projectNumber: number }
    projects.push(newProject);
    // redirect back to the dashboard
    res.redirect('/dashboard')
});

app.get('/dashboard/new', function (req, res) {
    res.render('new_project');
});





// Express to listen for requests (start server)
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});