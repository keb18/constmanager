const mongoose = require('mongoose');

// Setup the company schema
let companySchema = new mongoose.Schema({
    companyName: { type: String, unique: true },
    companyJoined: { type: Date, default: Date.now },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    userTypes: ['owner', 'admin', 'manager', 'employee'],
    admin: {
        timesheetCodes: {
            type: Object,
            "default":
            {
                hol: 'Holidays',
                phl: 'Public holidays',
                tra: 'Training',
                doc: 'Doctor appointment',
                sck: 'Sick time'
            }
        }
    }
});

module.exports = mongoose.model('Company', companySchema);


