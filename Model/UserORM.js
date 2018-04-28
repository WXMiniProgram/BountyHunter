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
    /*published:[{
        id:{
            type: ose.Schema.Types.ObjectId,
            //ref: 'Task'
        }
    }],
    hunted:[{
        id:{
            type: ose.Schema.Types.ObjectId,
           // ref: 'Task'
        }
    }]*/
});

let User = ose.model('User', UserScema);
module.exports = User;