let User = require("../Model/UserORM");
let util = require("../util");

function CheckAndReg(id){ // 查找指定id 的用户 如果不存在则注册
    User.findById(id, (err, res)=>{
        if(err){
            return null;
        }
        if(util.isValid(res)){ // 该用户存在
            return res;
        }else{ //  用户不存在
            let user = new User({
                "id": id,
                "repution":"1000",
                "verified":"false",
                "img_path": ""
            });
            user.save((err)=>{
                if(err){
                    return null;
                }else{
                    return user;
                }
            });
        }
    });
}

module.exports.login = (req, res)=>{
    let params = req.params,
        body = req.body;
    let url = "https://api.weixin.qq.com/sns/jscode2session",
        req_params = {
            "grant_type": "authorization_code",
            "js_code": body["code"],
        };
    util.WXRequest(url, req_params, (result)=>{ // 最基础的数据包(不管有没有 unionID)
        /*let open_id = result.open_id,
            session_key = result.session_key; // 暂时不校验 session_key 是否过期*/
        let user = this.CheckAndReg(result.open_id);
        if(user){
            res.status(200).json({"result": user});
        }else{
            // 创建失败
        }
    })
 // 登录的接口地址：
 // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
       
}

module.exports.query = (req, res)=>{
   

}
module.exports.update = (req, res)=>{ // 荣誉值、联系方式、审核状态
    let params = req.params,
        body = req.body; // reputation, contact, verified
    User.findByIdAndUpdate(params["user_id"], body, (err, result)=>{
        if(err){

        }
        res.status(200).json({"result": res});
    })

}
// 增查改
// 增： 首次登录需完善信息
// 正常登录 返回session 需要包括用户id 姓名等信息
// 查： 返回指定ID的个人信息（可选择字段）
// 改： reputation、 详细信息、 联系方式、验证（暂时包括 用户的图片上传 和 服务器的审核）


// 返回值： 使用json格式，结果放在 {"result": result}
