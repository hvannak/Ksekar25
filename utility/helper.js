var jwt = require('jsonwebtoken');

function getuserId(request) {
    const token = request.header('auth-token');
    return jwt.verify(token,process.env.TOKEN_SECRET);
}

async function schemaPage(req,res,schema) {
    try{
        var reqData = req.body;
        var filter = (reqData.searchObj != '') ? {[reqData.searchObjby]: { "$regex": reqData.searchObj, "$options": "i" } } : {};
        var docObj = await schema.find(filter).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            [reqData.sortBy]: reqData.sortType
        });
        var totalItems = await schema.count(filter);
        res.json({objList:docObj,totalDoc:Math.ceil(totalItems/reqData.pageSize)});
    }catch(err){
        console.log(err);
    }
}

async function schemaPagewithPopulate1(req,res,schema,populate1) {
    try{
        var reqData = req.body;
        var filter = (reqData.searchObj != '') ? {[reqData.searchObjby]: { "$regex": reqData.searchObj, "$options": "i" } } : {};
        var docObj = await schema.find(filter).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            [reqData.sortBy]: reqData.sortType
        }).populate(populate1);
        var totalItems = await schema.count(filter);
        res.json({objList:docObj,totalDoc:Math.ceil(totalItems/reqData.pageSize)});
    }catch(err){
        console.log(err);
    }
}

async function schemaPagewithPopulate2(req,res,schema,populate1,populate2) {
    try{
        var reqData = req.body;
        var filter = (reqData.searchObj != '') ? {[reqData.searchObjby]: { "$regex": reqData.searchObj, "$options": "i" } } : {};
        var docObj = await schema.find(filter).limit(reqData.pageSize).skip(reqData.pageSize*(reqData.page-1)).sort({
            [reqData.sortBy]: reqData.sortType
        }).populate(populate1).populate(populate2);
        var totalItems = await schema.count(filter);
        res.json({objList:docObj,totalDoc:Math.ceil(totalItems/reqData.pageSize)});
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getuserId,
    schemaPage,
    schemaPagewithPopulate1,
    schemaPagewithPopulate2
}