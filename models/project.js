const mongoose = require('mongoose');

// Setup the project schema
let projectSchema = new mongoose.Schema({
  projectName: { type: String, unique: true },
  projectNumber: { type: String, unique: true },
  projectDescription: String,
  projectCreated: { type: Date, default: Date.now },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model('Project', projectSchema);