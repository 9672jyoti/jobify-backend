const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    requirements: {
        type: String
    },

    location: {
        type: String,
        required: true
    },

    salary: {
        min: {
            type: Number
        },

        max: {
            type: Number
        },

        currency: {
            type: String,
            default: "INR"
        }
    },

    jobType: {
       type: String,
        enum: ['full-time', 'part-time', 'contract','internship','freelance'],
        default:'full-time'
    },

 experiencelevel: {
    type: String,
    enum: [ 'fresher', 'entry-level', 'mid-level','senior-level',  'lead', 'manager'],
    default: 'entry-level'
     },

       skills: [
        {
            type: String
        }
    ],

       company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
     applicationDeadline: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },

        applicationCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('job', jobSchema, 'jobs');