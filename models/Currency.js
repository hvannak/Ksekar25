const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    symbol:{
        type:String,
        require:true,
        unique: true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Currency',languageSchema);