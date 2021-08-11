const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    lang:{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Language' 
    },
    description:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Notification',notificationSchema);