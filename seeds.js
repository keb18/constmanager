const mongoose = require('mongoose');

const Company = require('./models/company'),
    Project = require('./models/project');

var comp = [
    { companyName: "Company 1", companyJoined: Date.now() },
    { companyName: "Company 2", companyJoined: Date.now() },
    { companyName: "Company 3", companyJoined: Date.now() },
    { companyName: "Company 4", companyJoined: Date.now() },
];

function seedDB() {
    // remove companies from db
    Company.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed companies")
            // add companies
            comp.forEach(function (compSeed) {
                Company.create(compSeed, function (err, company) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a company");
                        // add projects
                        Project.create(
                            {
                                projectName: "Project 1",
                                projectNumber: "2/7588",
                                projectDescription: "2S+P+3E+M",
                                projectCreated: Date.now()
                            }, function (err, project) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    company.projects.push(project);
                                    company.save();
                                    console.log("Created project")
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;