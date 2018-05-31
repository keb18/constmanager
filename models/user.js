const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

// Setup the user schema
let userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    position: String,
    salary: Number,
    accountType: String,
    userJoined: { type: Date, default: Date.now },
    company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    timesheets: {
        date: { type: Date },
        project: String,
        description: String,
        hours: Number
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);