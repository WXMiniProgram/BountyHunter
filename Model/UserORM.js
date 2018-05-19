let ose = require('mongoose');


let UserScema = new ose.Schema({
    _id:{
        type: ose.Schema.Types.ObjectId
    },
    username:{
        type:String,
        default: ""
    },
    name:{
        type: String,
        default: ""
    },
    verifyed:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default: ""
    },
    school: {
        type:String,
        default: ""
    },
    school_id: {
        type: Number,
        default: null
    },
    img:{ // 认证图片
        type:String,
        default: ""
    }
});

let User = ose.model('User', UserScema);
module.exports = User;