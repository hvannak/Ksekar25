const mongoose = require('mongoose');

const localizationSchema = mongoose.Schema({
    props:{
        type:String,
        require:true,
        unique: true
    },
    lang:{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Language' 
    },
    text:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Localization',localizationSchema);