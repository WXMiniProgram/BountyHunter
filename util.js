let config = require("config");


let ErrMsg = {
    "format": "API调用参数错误。",
    "404": "指定数据不存在",
    "unknown": "未知错误",
    "500": "未知错误"
};
module.exports.ErrMsg = ErrMsg;
module.exports.MyServer = "127.0.0.1:3000/";

module.exports.isValid = (obj)=>{
    return obj != null && obj != undefined && obj != "";
}

module.exports.errObj = (msg)=>{
    return {"reason": msg};
}

module.exports.WXRequest = (url, params, success, err)=>{

}

module.exports.StoreFile = (id, suffix, file, func, err_cb)=>{ // type: avatar or img
    let temp = file.name.split(".");
    let type = "." + temp[temp.length - 1];
    let new_name = "" + id + suffix + type;
    // let new_path = "../statics/users/" + new_name;
    let new_path = path.join(__dirname, "..", "statics", "users", new_name);
    console.log("new_path", new_path);
    file.mv(new_path, function(err) {
        if (err && err_cb)
            err_cb(err);
        func(new_name);
    });
}