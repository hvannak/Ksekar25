const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPage} = require('../utility/helper');

router.get('/all', async (req,res) => {
    try{
        const result = await Language.find();
        res.json(result);
    }catch(err){
        logger.error('language page:' + err);
        res.json(err)
    }
});

router.post('/page',verify,async (req,res) => {
    try{
        await schemaPage(req,res,Language);        
    }catch(err){
        logger.error('language page:' + err);
        res.json(err);
    }
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Language.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('language props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Language({
        title: req.body.title,
        shortcode: req.body.shortcode,
        default: req.body.default
    });
    try{
        await docObj.save();
        res.json({obj:docObj,message:'INSERT'});
    } catch(err) {
        logger.error('language post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:langId',verify, async (req,res) => {
    try{
        const result = await Language.remove({_id: req.params.langId});
        res.json(result);
    }catch(err){
        logger.error('language delete:' + err);
        res.json(err)
    }
});

router.put('/put/:langId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.langId };
        const update = new Language({
            _id: req.body._id,
            title: req.body.title,
            shortcode: req.body.shortcode,
            default: req.body.default     
        });
        await Language.update(filter,update);
        res.json({obj:update,message:'UPDATE'});
    }catch(err){
        logger.error('category put:' + err);
        res.json(err)
    }
});

module.exports = router;