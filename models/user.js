const mongoose = require('mongoose');

// Setup the user schema
let userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, unique: true },
    userJoined: { type: Date, default: Date.now },
    company: [{type: mongoose.Schema.Types.ObjectId, ref: "Company"}],
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: "Project"}]
});

module.exports = mongoose.model('User', userSchema);