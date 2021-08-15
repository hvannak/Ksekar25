const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Language = require('../models/Language');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPagewithPopulate2,getuserId} = require('../utility/helper');

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate2(req,res,Post,'lang','user');        
    }catch(err){
        logger.error('post page:' + err);
        res.json(err);
    }   
});

router.post('/fetch',async (req,res) => {
    try{
        var reqData = req.body;
        let lang = null;
        if(reqData.lang == null){
            const langresult = await Language.find({default: true});
            lang = langresult[0]._id;
        } else {
            lang = reqData.lang;
        } 
        var docObj = await Post.find({lang:lang}).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            date: 'desc'
        });
        var totalItems = await Post.count({lang:lang});
        res.json({objList:docObj,totalDoc:Math.ceil(totalItems/reqData.pageSize)});
    }catch(err){
        console.log(err);
        logger.error('post fetch:' + err);
        console.log(err);
    } 
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Post.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('post props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Post({
        lang: req.body.lang,
        user: getuserId(req)._id,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
    try{
        await docObj.save();
        let resObj = await Post.find({ _id: docObj._id }).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('post post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:postId',verify, async (req,res) => {
    try{
        const result = await Post.remove({_id: req.params.postId});
        res.json(result);
    }catch(err){
        logger.error('post delete:' + err);
        res.json(err)
    }
});

router.put('/put/:postId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.postId };
        const update = new Post({
            _id: req.body._id,
            category: req.body.lang,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        });
        await Post.update(filter,update);
        let resObj = await Post.find(filter).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('post put:' + err);
        res.json(err)
    }
});

module.exports = router;