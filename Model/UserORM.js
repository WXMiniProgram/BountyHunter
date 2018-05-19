let ose = require('mongoose');


let UserScema = new ose.Schema({
    /*username:{
        type: String,
        required:true,
        index:{unique: true}
    },
    password:{
        type:String,

    },*/
    _id:{
        type: ose.Schema.Types.ObjectId
        // index?
    },
    reputation:{
        type:Number
    },
    contact:{
        type: String
    },
    verifyed:{
        type:Boolean
    },
    img_path:{ // 认证图片
        type:String
    }
});

let User = ose.model('User', UserScema);
module.exports = User;