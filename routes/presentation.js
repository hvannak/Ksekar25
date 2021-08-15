const express = require('express');
const router = express.Router();
const Presentation = require('../models/Presentation');
const Language = require('../models/Language');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPagewithPopulate2,getuserId} = require('../utility/helper');


router.post('/all', async (req,res) => {
    try{
        var reqData = req.body;
        let lang = null;
        if(reqData.lang == null){
            const langresult = await Language.find({default: true});
            lang = langresult[0]._id;
        } else {
            lang = reqData.lang;
        }
        const result = await Presentation.find({lang:lang});
        res.json(result);
    }catch(err){
        console.log(err);
        logger.error('presentation all:' + err);
        res.json(err)
    }
});

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate2(req,res,Presentation,'lang','user');        
    }catch(err){
        logger.error('presentation page:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Presentation.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('presentation props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Presentation({
        lang: req.body.lang,
        user: getuserId(req)._id,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
    try{
        await docObj.save();
        let resObj = await Presentation.find({ _id: docObj._id }).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('presentation post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:postId',verify, async (req,res) => {
    try{
        const result = await Presentation.remove({_id: req.params.postId});
        res.json(result);
    }catch(err){
        logger.error('presentation delete:' + err);
        res.json(err)
    }
});

router.put('/put/:postId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.postId };
        const update = new Presentation({
            _id: req.body._id,
            lang: req.body.lang,
            title: req.body.title,
            description: req.body.description,
            image: req.body.image
        });
        await Presentation.update(filter,update);
        let resObj = await Presentation.find(filter).populate('lang').populate('user');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('post put:' + err);
        res.json(err)
    }
});

module.exports = router;