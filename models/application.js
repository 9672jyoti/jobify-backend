const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },

    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    status: {
        type: String,
        enum: ['applied', 'reviewing', 'interview', 'rejected', 'accepted'],
        default: 'applied'
    },

    coverLetter: {
        type: String
    },

    resume: {
        type: String
    },

    appliedAt: {
        type: Date,
        default: Date.now
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    reviewedAt: {
        type: Date
    },

    notes: {
        type: String
    }

}, {
    timestamps: true
});


// One user can apply only once for one job
applicationSchema.index(
    { job: 1, applicant: 1 },
    { unique: true }
);


module.exports = mongoose.model(
    'application',
    applicationSchema,
    'applications'
);