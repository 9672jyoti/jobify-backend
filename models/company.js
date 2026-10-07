const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description:{
        type: String,
       
    },

    website:{
         type: String,
       
    },

    logo:{
        type: String,
        default: ''
    },

    industry:{
         
type: String,
    },

    location:{
      type: String,  
    },

    size:{
        type: String, 
        enum:['1-10','11-50', '51-200','201-500','501-1000','1001-5000','5001-10000', '10000+'],
        default: '1-10'

    },

    foundedyear:{
        type: Number,

    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }


},
{
    timestamps: true
}

);

module.exports = mongoose.model('company',companySchema,'companies');