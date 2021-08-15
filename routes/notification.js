const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPage,schemaPagewithPopulate1} = require('../utility/helper');

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate1(req,res,Notification,'lang');        
    }catch(err){
        logger.error('notification page:' + err);
        res.json(err);
    }   
});

router.post('/search',async (req,res) => {
    try{
    //    await schemaPage(req,res,Notification);
        var reqData = req.body;
        let lang = null;
        if(reqData.lang == null){
            const langresult = await Notification.find({default: true});
            lang = langresult[0]._id;
        } else {
            lang = reqData.lang;
        } 
        var docObj = await Notification.find({lang:lang}).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            date: 'desc'
        });
        var totalItems = await Notification.count({lang:lang});
        res.json({objList:docObj,totalDoc:Math.ceil(totalItems/reqData.pageSize)});        
    }catch(err){
        console.log(err);
        logger.error('notification search:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Notification.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('notification props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Notification({
        title: req.body.title,
        description: req.body.description,
        lang: req.body.lang
    });
    try{
        await docObj.save();
        let resObj = await Notification.find({ _id: docObj._id }).populate('lang');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('notification post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:notId',verify, async (req,res) => {
    try{
        const result = await Notification.remove({_id: req.params.notId});
        res.json(result);
    }catch(err){
        logger.error('notification delete:' + err);
        res.json(err)
    }
});

router.put('/put/:notId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.notId };
        const update = new Notification({
            _id: req.body._id,
            title: req.body.title,
            description: req.body.description,
            lang: req.body.lang     
        });
        await Notification.update(filter,update);
        let resObj = await Notification.find(filter).populate('lang');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('notification put:' + err);
        res.json(err)
    }
});

module.exports = router;