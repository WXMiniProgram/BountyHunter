let User = require("../Model/UserORM");
let util = require("../util");
let fs = require("fs");
let path = require("path");

function wrapDTO(userORM){ // 我就是闲的
    let user = {
        "openid": userORM._id,
        "username": userORM.username,
        "name":userORM.name,
        "verify": userORM.verify,
        "school": userORM.school,
        "school_id": userORM.school_id,
        "avatar": util.MyServer + userORM.avatar, // 已配置了静态资源，可直接访问该地址拿到文件
        "img": util.MyServer + userORM.img
    }
    return user;
}

function CheckAndReg(id, func){ // 查找指定id 的用户
    User.findById(id, (err, res)=>{
        if(err){
            func(null);
        }else{
            if(!util.isValid(res)){ // 用户不存在， 创建个基础版的
                let user = new User({
                    _id: id
                });
                user.save(); // 基础版User  without any infos except a plain ID
                res = user;
            }
            func(res);
        }
    });
}

module.exports.login = (req, res)=>{
    // let code = req.params["code"];
    /*CheckAndReg("41224d776a326fb40f000001", (user)=>{
        if(user){
            res.status(200).json({"result": wrapDTO(user)});
        }else{
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
        }
    })*/
    let body = req.body;
    let url = "https://api.weixin.qq.com/sns/jscode2session",
        req_params = {
            "grant_type": "authorization_code",
            "js_code": body["code"],
        };
    util.WXRequest(url, req_params, (result)=>{ // 最基础的数据包(不管有没有 unionID)
        this.CheckAndReg(result.open_id, (user)=>{
            if(user){
                res.status(200).json({"result": wrapDTO(user)});
            }else{
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
            }
        });
    });
 // 登录的接口地址：
 // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code     
}

module.exports.verify = (req, res)=>{ // 含有头像 认证图片在用户选择完以后就上传了哈哈哈哈哈哈
    let body = req.body,
        avatar = req.files.avatar;
    let id = req.params["openid"];
    if(!util.isValid(id)){
        res.status(401).json(util.errObj(util.ErrMsg["format"]));
    }
    util.StoreFile(id, "_avatar", avatar, (path)=>{
        let updates = {
            "username": body["username"],
            "name":body["name"],
            // "verify": body["verify"],
            "school": body["school"],
            "school_id": body["school_id"],
            "avatar": path // 既然路径是固定的 那么只存名字就可以了
        }
        User.findByIdAndUpdate(id, updates, (err, user)=>{
            if(err || !util.isValid(user)){
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
            }
            res.status(200).json({"result": wrapDTO(user)});
        },)
    },
        (err)=>{
            console.log("error?:", err);
        }
    )
}

module.exports.uploadImg = (req, res)=>{ // 上传学生证照片
    let img = req.files.img,
        id = req.params["openid"];
    util.StoreFile(id, "_img", img, (path)=>{
        User.findByIdAndUpdate(id, {"img": path}, (err, user)=>{
            if(err || !util.isValid(user)){
                res.status(404).json(util.errObj(util.ErrMsg["404"]));
            }
            res.status(200).json({"result": wrapDTO(user)});
        })
    })
}

// 得到审核列表可以用： 未通过审核且img不为 "" 的用户
module.exports.query = (req, res)=>{
    let params = {};
    User.find(params, (err, result)=>{
        if(err || !util.isValid(result)){
            res.status(404).json({"result": result});
        }
        res.status(200).json({"result": result});
    })
}

module.exports.queryOne = (req, res)=>{
    let params = req.params;
    let id = params["openid"];
    User.findById(id, (err, user)=>{
        if(err || !util.isValid(user)){
            res.status(404).json(util.ErrMsg["404"]);
        }
        res.status(200).json({"result": wrapDTO(user)});
    })
}

module.exports.pass = (req, res)=>{ // 专门用来通过审核的
    let id = req.params["openid"];
    User.findByIdAndUpdate(id, {"verifyed": true}, (err, user)=>{
        if(err || !user){
            res.status(404).json(util.errObj(util.ErrMsg["404"]))
        }
        res.status(200).json({"result": user});
    })
}

module.exports.reject = (req, res)=>{
    let id = req.params["openid"],
        updates = {
            "verify": false,
            "img": "",
            "name": "",
            "school": "",
            "school_id": ""
        };
    User.findByIdAndUpdate(id, updates, (err, user)=>{
        if(err || !user){
            res.status(404).json(util.errObj(util.ErrMsg["404"]))
        }
        res.status(200).json({"result": user});
    })
}

module.exports.update = (req, res)=>{ // 荣誉值、联系方式、审核状态
    let params = req.params,
        body = req.body; // 这么写有可能会存一堆垃圾信息
    let id = params["openid"];
    User.findByIdAndUpdate(id, body, (err, user)=>{
        if(err || !util.isValid(user))
            res.status(404).json(util.errObj(util.ErrMsg["404"]));
        res.status(200).json({"result": user});
    })

}