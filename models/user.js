const mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

// Setup the user schema
let userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    position: String,
    salary: Number,
    accountType: String,
    userJoined: { type: Date, default: Date.now },
    company: [{type: mongoose.Schema.Types.ObjectId, ref: "Company"}],
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: "Project"}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);