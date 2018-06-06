let ose = require("mongoose");
// 先创建文档，再生成ORM对象
let TaskSchema = new ose.Schema({ // ID 自动设置了 类型为mongo的ObjectId
    caption:{ //  任务标题
        type:String,
        //required: true
    },
    award:{ // 赏金
        type:Number,
        //required: true
    },
    discription:{ // 描述
        type:String,
    },
    publisher:{
        type: ose.Schema.Types.ObjectId
        //required:true
    },
    hunter:{
        type: ose.Schema.Types.ObjectId,
        //ref: 'User'  // 查询时使用 .populate(field) 即可将次字段填充为全部信息
    },
    taskloc:{ // 任务地点
        longitude:{
            type: Number
        },
        latitude:{
            type: Number
        },
        name:{ // 地址名称
            type: String
        },
        address:{ // 详细地址
            type: String
        }
        //ref: 'User'
    },
    starttime:{
        type:Date,
        default:Date.now
    },
    endtime:{
        type: Date
    },
    status:{ // 0:未领取 1:正在执行 2:已完成
        type: Number,
        default: 0
    }
    /*endloc:{
        longitude:{
            type: Number
        },
        latitude:{
            type: Number
        },
        name:{ // 地址名称
            type: String
        },
        address:{ // 详细地址
            type: String
        }
    },*/
    // 联系方式(默认为用户信息里的？)
});
// 字段类型都有： 
// String, Number, Date, Buffer, Booleanm Mixed, ObjectId, Array

let TaskORM = ose.model('Task', TaskSchema);
module.exports = TaskORM;