const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPage} = require('../utility/helper');

router.get('/all', async (req,res) => {
    try{
        const result = await Currency.find();
        res.json(result);
    }catch(err){
        logger.error('currency page:' + err);
        res.json(err)
    }
});

router.post('/page',verify,async (req,res) => {
    try{
        await schemaPage(req,res,Currency);        
    }catch(err){
        logger.error('currency page:' + err);
        res.json(err);
    }
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Currency.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('currency props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Currency({
        title: req.body.title,
        symbol: req.body.symbol
    });
    try{
        await docObj.save();
        res.json({obj:docObj,message:'INSERT'});
    } catch(err) {
        logger.error('currency post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:curId',verify, async (req,res) => {
    try{
        const result = await Currency.remove({_id: req.params.curId});
        res.json(result);
    }catch(err){
        logger.error('currency delete:' + err);
        res.json(err)
    }
});

router.put('/put/:curId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.curId };
        const update = new Currency({
            _id: req.body._id,
            title: req.body.title,
            symbol: req.body.symbol    
        });
        await Currency.update(filter,update);
        res.json({obj:update,message:'UPDATE'});
    }catch(err){
        logger.error('currency put:' + err);
        res.json(err)
    }
});

module.exports = router;