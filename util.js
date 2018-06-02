let request = require("request");
let config = require("config");
let appID = "wx750215304d97dc16";
let appSecret = "864a0f96d62e80fdae679f421587e49d";


let ErrMsg = {
    "format": "API调用参数错误。",
    "404": "指定数据不存在",
    "unknown": "未知错误",
    "500": "未知错误"
};
module.exports.ErrMsg = ErrMsg;
module.exports.MyServer = "https://abc.yhmeng.top/";

module.exports.isValid = (obj)=>{
    return obj != null && obj != undefined && obj != "";
}

module.exports.errObj = (msg)=>{
    return {"reason": msg};
}

module.exports.WXRequest = (url, params, succ, err)=>{
    params["appid"] = appID;
    params["secret"] = appSecret;
    let GET_param = "?";
    for (let key in params)
        GET_param = GET_param +key+"="+params[key]+"&";
    GET_param +=("appid="+params["appid"]+"&")
    GET_param +=("secret="+params["secret"])
    url += GET_param;
    let options = {
        "uri": url,
        "method": "GET",
    }
    request(options, (err, response, body)=>{
        succ(body);
    })
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
        func(path.join("users", new_name));
    });
}
