let ose = require("mongoose");
let Task = require("../Model/TaskORM");
let util = require("../util");

module.exports.queryAll  = (req, res)=>{ // query all infos from all datas
    console.log("queryAll: ", req.params);
    let params = req.params; // orderby: distance or award
    let field = params["orderby"], // 排序字段
        method = params["method"]; // 排序方式
    if(!field && !method){
        Task.find((err, result)=>{
            console.log(result);
            res.status(200).json({"result": result});
        });
    }else{
        if(field == "distance" || field == "award"){ // 其实不用做这个吧？ 前端用linq排序就好 ——为了前后台分离 先按标准写
            Task.find().sort({params: method == "asc" ? 1 : -1}).exec((err, results)=>{
                if(err){
                    console.log(err);
                    res.status(400).json(util.errObj(util.ErrMsg["unknown"]));
                }
                res.status(200).json({"result": results})
            }); // asc 正序 desc倒序
        }else{
            // API调用参数错误
            res.status(400).json(util.errObj(util.ErrMsg["format"])); // 再加上请求URL
        }
    }
    
}

module.exports.queryOne = (req, res)=>{
    console.log("query one: ", req.params);
    let params = req.params,
        id = params["task_id"];
    Task.findById(id, (err, task)=>{
        if(err)
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
        res.status(200).json({"result": task});
    })
}

module.exports.update = (req, res)=>{
    console.log("Update! ", req.params);
    try{
        let params = req.params,
        id = params["task_id"],
        verb = params["verb"]
        by = params["by"],
        info = {};

        if(verb == "cancel"){
            info = {"status": 0, "hunter": null};
        }else if(verb == "get"){
            info = {"status": 1, "hunter": ose.Types.ObjectId(by)};
        }else if(verb == "done"){
            info = {"status": 2};
        }

        Task.findByIdAndUpdate(id, info,(err, result)=>{
            if(err)
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
            res.status(200).json({"result":result});
        });
    }catch(err){
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
    }
    
}

module.exports.delete = (req, res)=>{
    console.log("Delete! ", req.params);
    let params = req.params;
    Task.findByIdAndRemove(params["task_id"],(err, result)=>{
        if(err)
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
        res.status(200).json({"result": result});
    })
}

module.exports.add = (req, res)=>{
    let body = req.body,
        info = {};
    console.log("Add Document: ", body);
    try{
        ose.Types.ObjectId(body["user_id"]); // 检查ID合法性
    }catch(err){
        res.status(400).json(util.errObj(err + util.ErrMsg["format"]));
    }
    if( util.isValid(body["user_id"])
        && util.isValid(body["caption"])
        && util.isValid(body["award"])
        && util.isValid(body["taskloc"]) //  && util.isValid(body["endloc"] => 任务结束地点也可以没有
       ) // && util.isValid(body["endtime"])  => 结束时间可以没有
        {
            let task = new Task({
                "publisher": ose.Types.ObjectId(body["user_id"]),
                "caption": body["caption"],
                "award": body["award"],
                "discription": body["discription"],
                "hunter": null,
                "taskloc": body["taskloc"],
                "endloc": body["endloc"],
                "endtime": body["endtime"],
            });
            task.save((err)=>{
                if(err)
                    res.status(400).json(util.errObj(err + util.ErrMsg["unknown"]));
                res.status(200).json({"result": task});
            });
        }
    else{
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
    }
}
