const express = require('express');
const router = express.Router();
const Product = require('../models/Products');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPagewithPopulate2,getuserId} = require('../utility/helper');

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPagewithPopulate2(req,res,Product,'category','currency');        
    }catch(err){
        logger.error('product page:' + err);
        res.json(err);
    }   
});

router.post('/search',async (req,res) => {
    try{
        var reqData = req.body;
        let dynamicQuery = {};

        if(req.body.categoryId != '0'){
            dynamicQuery["category"] = reqData.category
        }
        if(filterObj.title != ""){
            dynamicQuery["title"] = { "$regex": reqData.title, "$options": "i" }
        }
        if(filterObj.description != ""){
            dynamicQuery["description"] = { "$regex": reqData.description, "$options": "i" }
        }

        if(reqData.fromprice && reqData.toprice){
            dynamicQuery["price"] = { $lte: reqData.toprice, $gte: reqData.fromprice }
            if(filterObj.currency != "0"){
                dynamicQuery["currency"] = reqData.currency
            }
        }
        console.log(dynamicQuery);
        docObj = await Product.find({$and:[dynamicQuery]}).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            date: 'desc'
        });

        var totalItems = await Product.count({$and:[dynamicQuery]});
        res.json({objList:docObj,totalDoc:totalItems});       
    }catch(err){
        logger.error('product page:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(Product.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('product props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Product({
        category: req.body.category,
        user: getuserId(req)._id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency,
        image: req.body.image
    });
    try{
        await docObj.save();
        let resObj = await Product.find({ _id: docObj._id }).populate('category').populate('currency');
        res.json({obj:resObj[0],message:'INSERT'});
    } catch(err) {
        logger.error('product post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:proId',verify, async (req,res) => {
    try{
        const result = await Product.remove({_id: req.params.proId});
        res.json(result);
    }catch(err){
        logger.error('product delete:' + err);
        res.json(err)
    }
});

router.put('/put/:proId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.proId };
        const update = new Product({
            _id: req.body._id,
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            currency: req.body.currency,
            image: req.body.image
        });
        await Product.update(filter,update);
        let resObj = await Product.find(filter).populate('category').populate('currency');
        res.json({obj:resObj[0],message:'UPDATE'});
    }catch(err){
        logger.error('category put:' + err);
        res.json(err)
    }
});

module.exports = router;