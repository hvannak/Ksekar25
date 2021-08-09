const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
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
    price:{
        type:String,
        require:true,
        default: 'xxx'
    },
    currency: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Currency'
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

module.exports = mongoose.model('Product',postSchema);