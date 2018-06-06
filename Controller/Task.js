let ose = require("mongoose");
let Task = require("../Model/TaskORM");
let User = require("../Model/UserORM");
let util = require("../util");

function wrapTaskDTO(task){
//    console.log("length", task.length);
    if(task.length){
        let dtos = [];
        for(let i=0;i<task.length;i++){
//            console.log(task[i]);
            dtos.push(wrapTaskDTO(task[i]));
//            dtos.push(wrapTaskDTO(t));
        }
        return dtos;
    }
    else if(typeof task == typeof {}){
        let dto = {
            "id": task._id,
            "caption": task.caption,
            "bounty": task.award,
            "endtime": task.endtime,
            "taskloc": task.taskloc,
            "description": task.description,
            "publisher": task.publisher,
            "hunter": task.hunter,
            "status": task.status,
            "hiddenMsg": task.hiddenMsg
        };       
        return dto;
    }
    else return task
}

module.exports.queryAll  = (req, res)=>{ // query all infos from all datas
    console.log("Query ALL");
    let params = req.params; // orderby: distance or award
    let field = params["orderby"], // 排序字段
        method = params["method"],
        option = {};
    if(field == "award"){
        option["award"] = method == "asc"? 1 : -1;
 }
    /*if(field == "distance"){

    }*/ 
    Task.find({"status": {$gte: 0, $lte:3}}).sort(option).exec((err, result)=>{
        console.log("result： ", result);
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        let r = wrapTaskDTO(result);
        res.status(200).json({"result": r});
    })
}

module.exports.queryOne = (req, res)=>{
    console.log("query one: ", req.params);
    let params = req.params,
        id = params["task_id"];
    Task.findById(id, (err, task)=>{
        if(err || !util.isValid(task)){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result": wrapTaskDTO(task)}); // 未找到时返回null
    })
}

module.exports.queryByUser = (req, res)=>{
    let params = req.params,
        role = params["as"], // publisher or hunter
        user_id = params["user_id"];
    //filter[role] = {};
    //filter[role][role+"_openid"] = user_id;
//    console.log(role, user_id, typeof user_id);
    let key = role=="publisher"? "publisher.publisher_openid" :  "hunter.hunter_openid";    
   // console.log("call `queryByUser`, filter: ", key, user_id);
    let filter={};
    filter[key] = user_id;
    console.log("filter:", filter);
    Task.find(filter, (err, task)=>{
        console.log(task);
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"result": wrapTaskDTO(task)});
    })
}

module.exports.queryUndoneByUser = (req, res)=>{
    let params = req.params;
    let role = params["as"],
        id = params["user_id"];
    let filter = {"status": 3};
    role = role == "publisher"?"publisher.publisher_openid":"hunter.hunter_openid";
    filter[role] = id;
    Task.count(filter, (err, c)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        res.status(200).json({"amount": c});
    })
}

module.exports.update = (req, res)=>{
//    console.log("Update! ", req.params);

    let params = req.params,
    body = req.body,
    id = params["task_id"];
    if(body["verb"]){
        this.updateStatus(req, res);
        return ;
    }else{
        Task.findByIdAndUpdate(id, body,(err, result)=>{
            if(err){
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
                return ;
            }
            res.status(200).json({"result": wrapTaskDTO(result)});
        });
    }
}

module.exports.updateStatus = (req, res)=>{
    let params = req.params,
        body = req.body,
        task_id = params["task_id"];
    let verb = body["verb"];
    let info = {}
    if(verb == "cancel"){ // 发布人撤销
        info["status"] = -1; // 更改状态
//        info["hunter"] = {};
    }else if(verb == "get"&& body["status"] && body["hunter"]){ // 领取任务 (之前任务状态必须是0 且必须存在hunter)
        try{
            info["status"] = 3;
            info["hunter"] = body["hunter"];
        }catch(err){
            res.status(400).json(util.errObj(ErrMsg["format"]));
            return ;
        }
    }else if(verb == "done"){ // 确认完成
        info["status"] = 4;
    }else{
//  console.log("wrong verb");
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
        return ;
    }
  //  console.log("info", info);
    Task.findByIdAndUpdate(task_id, info,(err, result)=>{
        if(err){
                    console.log("DB error:", err);
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
        else 
            res.status(200).json({"result": wrapTaskDTO(result)});
    });
    /*User.find({"openid": body["hunter"]["hunter_openid"]}, (err, users)=>{
        let user = users[0];
        user.hunted.amount +=1;
        user.save();
    });*/
}

module.exports.delete = (req, res)=>{
    console.log("Delete! ", req.params);
    let params = req.params;
    Task.findByIdAndRemove(params["task_id"],(err, result)=>{
        if(err){
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
            return ;
        }
           
        res.status(200).json({"result": wrapTaskDTO(result)});
    })
}

module.exports.add = (req, res)=>{
    let body = req.body;
/*    try{
        ose.Types.ObjectId(body["publisher"]); // 检查ID合法性
    }catch(err){
        res.status(400).json(util.errObj(err + util.ErrMsg["format"]));
    }*/

    if( util.isValid(body["publisher"])
        && util.isValid(body["caption"])
        // && util.isValid(body["award"]) 不一定非有赏金 默认为0
        && util.isValid(body["taskloc"]) //  && util.isValid(body["endloc"] => 任务结束地点也可以没有
       ) // && util.isValid(body["endtime"])  => 结束时间可以没有
        {
            let task = new Task({
                "publisher": body["publisher"],
                "caption": body["caption"],
                "award": body["bounty"] ? body["bounty"] : 0,
                "description": body["description"],
                "hunter": null,
                "hiddenMsg": body["hiddenMsg"],
                "taskloc": body["taskloc"],
                "endloc": body["endloc"],
                "endtime": body["date"],
            });
            console.log("Add document: ", task);
            task.save((err)=>{
                if(err){
                    res.status(400).json(util.errObj(util.ErrMsg["unknown"]+err));
                    return ;
                }
                    
                res.status(200).json({"result": wrapTaskDTO(task)});
            });
            let publisher_openid = body["publisher"]["publisher_openid"]
            User.find({"openid": publisher_openid}, (err, users)=>{
                let u = users[0];
                u.published.amount +=1;
                u.save();
            })
        }
    else{
        console.log("Missing value", body);
        res.status(400).json(util.errObj(util.ErrMsg["format"]));
    }
}

