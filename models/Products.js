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
    price:{
        type:String,
        require:true,
        default: 'xxx'
    },
    actualprice: {
        type: mongoose.Types.Decimal128,
        require:true,
        default: 0,
        get: getPrice
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
},{toJSON: {getters: true}});

module.exports = mongoose.model('Product',postSchema);