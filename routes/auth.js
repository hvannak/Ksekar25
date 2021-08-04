const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const {logger} = require('../logger');

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


module.exports = router;