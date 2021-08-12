const mongoose = require('mongoose');

const presentionSchema = mongoose.Schema({
    lang:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Language'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image: {
        type:Buffer,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Presentation',presentionSchema);