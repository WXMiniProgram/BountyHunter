let User = require("../Model/UserORM");
let util = require("../util")

module.exports.queryTaskByUser = function(req, res) { // 不返回所有信息
    let params = req.params,
        user = params["user_id"],
        role = params["as"];// as sheriff or hunter
    if(role == "sheriff"){
        User.find({"_id": user}, ["published"], (err, tasks)=>{
            res.status(200).json({"result": tasks})
        });
    }else if(role == "hunter"){
        User.find({"_id": user}, ["hunted"], (err, tasks)=>{
            res.status(200).json({"result": tasks})
        });
    }else{
        // API 调用参数错误
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
    }
}