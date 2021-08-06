const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');
const {schemaPage} = require('../utility/helper');

router.post('/login', async (req,res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('WRONGEP');
        const validPass = await bcrypt.compare(req.body.password,user.password);
        if(!validPass) return res.status(400).send('INVPASS');
        const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
        res.header('auth-token',token).send(token);
    } catch (err) {
        logger.error('auth login:' + err);
        res.status(400).send(err);
    }
});

router.post('/page',verify,async (req,res) => {
    try{
       await schemaPage(req,res,User);        
    }catch(err){
        logger.error('user page:' + err);
        res.json(err);
    }   
});

router.get('/props', async (req,res) => {
    try{
        const props =  Object.keys(User.schema.paths);
        res.json(props);
    }catch(err){
        logger.error('user props:' + err);
        res.json(err);
    }
});

router.post('/post',verify,async (req,res)=> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    const docObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        await docObj.save();
        res.json({obj:docObj,message:'INSERT'});
    } catch(err) {
        logger.error('user post:' + err);
        res.json(err);
    }
});

router.delete('/delete/:userId',verify, async (req,res) => {
    try{
        const result = await User.remove({_id: req.params.userId});
        res.json(result);
    }catch(err){
        logger.error('user delete:' + err);
        res.json(err)
    }
});

router.put('/put/:userId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.userId };
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        const update = new User({
            _id: req.body._id,
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        });
        await User.update(filter,update);
        res.json({obj:update,message:'UPDATE'});
    }catch(err){
        logger.error('user put:' + err);
        res.json(err)
    }
});

module.exports = router;