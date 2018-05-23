const mongoose = require('mongoose');

// Setup the project schema
let projectSchema = new mongoose.Schema({
  projectName: String,
  projectNumber: { type: String, unique: true },
  projectDescription: String,
  projectCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);