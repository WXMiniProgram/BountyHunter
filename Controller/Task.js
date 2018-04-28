let ose = require("mongoose");
let Task = require("../Model/TaskORM");
let util = require("../util");

module.exports.queryAll  = (req, res)=>{ // query all infos from all datas
    console.log("queryAll: ", req.params);
    let params = req.params; // orderby: distance or award
    let field = params["orderby"], // 排序字段
        method = params["method"],
        option = {};
    if(field == "award"){
        option["award"] = method == "asc"? 1 : -1;
    }
    /*if(field == "distance"){

    }*/
    Task.find().sort(option).exec((err, result)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result": result})
    })
}

module.exports.queryOne = (req, res)=>{
    console.log("query one: ", req.params);
    let params = req.params,
        id = params["task_id"];
    Task.findById(id, (err, task)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result": task});
    })
}

module.exports.queryByUser = (req, res)=>{
    let params = req.params,
        role = params["as"], // publisher or hunter
        id = params["user_id"],
        filter = {};
    filter[role] = ose.Types.ObjectId(id);
    
    console.log("call `queryByUser`, filter: ", filter);
    Task.find(filter, (err, task)=>{
        console.log(err, task);
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result": task});
    })
}

module.exports.update = (req, res)=>{
    console.log("Update! ", req.params);

    let params = req.params,
    body = req.body,
    id = params["task_id"];
    if(body["status"] || body["hunter"]){
        this.updateStatus(req, res);
        return ;
    }else{
        Task.findByIdAndUpdate(id, body,(err, result)=>{
            if(err){
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
                return ;
            }
            res.status(200).json({"result":result});
        });
    }
}

module.exports.updateStatus = (req, res)=>{
    let params = req.params,
        body = req.body,
        task_id = params["task_id"];
    let verb = body["verb"];
    let info = {}
    if(verb == "cancel"){
        info["status"] = 0; // 更改状态
        info["hunter"] = null;
    }else if(verb == "get"){
        try{
            info["status"] = 1;
            info["hunter"] = ose.Types.ObjectId(body["hunter"]);
        }catch(err){
            res.status(400).json(util.errObj(ErrMsg["format"]));
            return ;
        }
    }else if(verb == "done"){
        info["status"] = 2;
    }else{
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
        return ;
    }

    Task.findByIdAndUpdate(task_id, info,(err, result)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result":result});
    });
}

module.exports.delete = (req, res)=>{
    console.log("Delete! ", req.params);
    let params = req.params;
    Task.findByIdAndRemove(params["task_id"],(err, result)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
           
        res.status(200).json({"result": result});
    })
}

module.exports.add = (req, res)=>{
    let body = req.body;
    console.log("Add Document: ", body);
    try{
        ose.Types.ObjectId(body["publisher"]); // 检查ID合法性
    }catch(err){
        res.status(400).json(util.errObj(err + util.ErrMsg["format"]));
    }

    if( util.isValid(body["publisher"])
        && util.isValid(body["caption"])
        && util.isValid(body["award"])
        && util.isValid(body["taskloc"]) //  && util.isValid(body["endloc"] => 任务结束地点也可以没有
       ) // && util.isValid(body["endtime"])  => 结束时间可以没有
        {
            let task = new Task({
                "publisher": ose.Types.ObjectId(body["publisher"]),
                "caption": body["caption"],
                "award": body["award"],
                "discription": body["discription"],
                "hunter": null,
                "taskloc": body["taskloc"],
                "endloc": body["endloc"],
                "endtime": body["endtime"],
            });
            console.log("Add document: ", task);
            task.save((err)=>{
                console.log("Save callback", task);
                if(err){
                    res.status(400).json(util.errObj(util.ErrMsg["unknown"]));
                    return ;
                }
                    
                res.status(200).json({"result": task});
            });
        }
    else{
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
    }
}
