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
    reputation:{
        type:Number
    },
    contact:{
        type: String
    },
    verifyed:{
        type:Boolean
    },
    publish:[{
        id:{
            type: ObjectId
        },
        caption:{
            type:String
        },
        close:{
            type:Boolean
        }
    }],
    hunted:[{
        id:{
            type: ObjectId
        },
        caption:{
            type:String
        },
        close:{
            type:Boolean
        }
    }]
});

let User = ose.model('User', UserScema);
module.exports = User;