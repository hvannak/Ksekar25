
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const {logger} = require('../logger');

router.get('/all', async (req,res) => {
    try{
        const result = await Post.find();
        res.json(result);
    }catch(err){
        logger.error('post all:' + err);
        res.json(err);
    }
});

module.exports = router;