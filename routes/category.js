const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPage,schemaPagewithPopulate1} = require('../utility/helper');

router.get('/byLang/:langId', async (req,res) => {
    try{
        const result = await Category.find({ lang: req.params.langId });
        res.json(result);
    }catch(err){
        logger.error('category ByLang:' + err);
        res.json(err);
    }
});

router.get('/all', async (req,res) => {
    try{
        const result = await Category.find();
        res.json(result);
    }catch(err){
        logger.error('category all:' + err);
        res.json(err)
    }
});

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate1(req,res,Category,'lang');        
    }catch(err){
        logger.error('category page:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Category.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('language props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Category({
        title: req.body.title,
        icon: req.body.icon,
        lang: req.body.lang
    });
    try{
        await docObj.save();
        let resObj = await Category.find({ _id: docObj._id }).populate('lang');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('category post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:catId',verify, async (req,res) => {
    try{
        const result = await Category.remove({_id: req.params.catId});
        res.json(result);
    }catch(err){
        logger.error('category delete:' + err);
        res.json(err)
    }
});

router.put('/put/:catId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.catId };
        const update = new Category({
            _id: req.body._id,
            title: req.body.title,
            icon: req.body.icon,
            lang: req.body.lang     
        });
        await Category.update(filter,update);
        let resObj = await Category.find(filter).populate('lang');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('category put:' + err);
        res.json(err)
    }
});

module.exports = router;