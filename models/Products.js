const mongoose = require('mongoose');
function getPrice(value) {
    if (typeof value !== 'undefined') {
       return parseFloat(value.toString());
    }
    return value;
};

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
    phone:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    price:{
        type:mongoose.Decimal128,
        require:true,
        default: 0,
        get: getPrice
    },
    currency:{
        type:String,
        require:true
    },
    firstimage: {
        type:String,
        require:false
    },
    date:{
        type:Date,
        default:Date.now
    }
},{toJSON: {getters: true}});

module.exports = mongoose.model('Post',postSchema);