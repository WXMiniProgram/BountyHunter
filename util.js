let config = require("config");


let ErrMsg = {
    "format": "API调用参数错误。",
    "404": "指定数据不存在",
    "unknown": "未知错误"
};
module.exports.ErrMsg = ErrMsg;

module.exports.isValid = (obj)=>{
    return obj != null && obj != undefined && obj != "";
}

module.exports.errObj = (msg)=>{
    return {"reason": msg};
}

module.exports.WXRequest = (url, params, success, err)=>{

}