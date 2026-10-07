const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'recruiter', 'admin'],
        default: 'user'
    },

    profilePicture: {
        type: String,
        default: ''
    },

    phone: {
        type: Number
    },

    resume: {
        type: String,
        default: ''
    },

    bio: {
        type: String
    },

    skill: [
        {
            type: String
        }
    ],

    experience: {
        type: Number,
        default: 0
    },

    location: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false
    },

       assignedCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            default: null
        }

}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema, 'users');