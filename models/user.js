const mongoose = require('mongoose');

// Setup the user schema
let userSchema = new mongoose.Schema({
    userName: { type: String, unique: true },
    userJoined: { type: Date, default: Date.now },
    company: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        }
    ]
});

module.exports = mongoose.model('User', userSchema);