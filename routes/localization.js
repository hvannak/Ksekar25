const express = require('express');
const router = express.Router();
const Localization = require('../models/Localization');
const Language = require('../models/Language');
const verify = require('../routes/verifyToken');
const {schemaPagewithPopulate1} = require('../utility/helper');
const {logger} = require('../logger');
const localconst = require('../utility/constant.json');

router.post('/page',verify,async (req,res) => {
    try{
        await schemaPagewithPopulate1(req,res,Localization,'lang');        
    }catch(err){
        logger.error('localization page:' + err);
        res.json(err);
    }
});


router.get('/switch/:lang', async (req,res) => {
    try{
        // const langresult = await Language.find({default: true});
        // let lang = (req.params.lang == 'null') ? langresult[0]._id : req.params.lang;
        let lang = null;
        if(req.params.lang == 'null'){
            const langresult = await Language.find({default: true});
            lang = langresult[0]._id;
        } else {
            lang = req.params.lang;
        }     
        const result = await Localization.find({lang: lang});
        res.json(result);
    }catch(err){
        logger.error('localization switch:' + err);
        res.json(err)
    }
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Localization.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('localization props:' + err);
        res.json(err);
    }
});

router.get('/localprops', async (req,res) => {
    try{
        res.json(localconst);
    }catch(err){
        logger.error('localization localprops:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Localization({
        props: req.body.props,
        lang: req.body.lang,
        text: req.body.text
    });
    try{
        await docObj.save();
        let resObj = await Localization.find({ _id: docObj._id }).populate('lang');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        console.log(err);
        logger.error('localization post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:localId',verify, async (req,res) => {
    try{
        const result = await Localization.remove({_id: req.params.localId});
        res.json(result);
    }catch(err){
        logger.error('localization delete:' + err);
        res.json(err)
    }
});

router.put('/put/:Id',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.Id };
        const update = new Localization({
            _id: req.body._id,
            props: req.body.props,
            lang: req.body.lang,
            text: req.body.text    
        });
        await Localization.update(filter,update);
        let resObj = await Localization.find(filter).populate('lang');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('localization put:' + err);
        res.json(err)
    }
});

module.exports = router;