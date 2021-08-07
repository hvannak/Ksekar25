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
        default: xxx
    },
    currency:{
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

module.exports = mongoose.model('Product',postSchema);