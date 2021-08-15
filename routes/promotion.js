const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPagewithPopulate1,getuserId} = require('../utility/helper');


router.get('/all', async (req,res) => {
    try{
        const result = await Promotion.find();
        res.json(result);
    }catch(err){
        logger.error('Promotion all:' + err);
        res.json(err)
    }
});

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate1(req,res,Promotion,'user');        
    }catch(err){
        logger.error('Promotion page:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Promotion.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('Promotion props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Promotion({
        user: getuserId(req)._id,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
    try{
        await docObj.save();
        let resObj = await Promotion.find({ _id: docObj._id }).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('Promotion post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:postId',verify, async (req,res) => {
    try{
        const result = await Promotion.remove({_id: req.params.postId});
        res.json(result);
    }catch(err){
        logger.error('Promotion delete:' + err);
        res.json(err)
    }
});

router.put('/put/:postId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.postId };
        const update = new Promotion({
            _id: req.body._id,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        });
        await Promotion.update(filter,update);
        let resObj = await Promotion.find(filter).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('post put:' + err);
        res.json(err)
    }
});

module.exports = router;