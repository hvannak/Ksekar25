var jwt = require('jsonwebtoken');
const {logger} = require('../logger');

module.exports = async function auth (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        logger.error('verify token:' + err);
        res.status(400).send(err);
    }
}