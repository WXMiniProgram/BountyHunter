let ose = require('mongoose');

// 先创建文档，再生成ORM对象
let TaskSchema = new ose.Schema({ // ID 自动设置了 类型为mongo的ObjectId
    caption:{ //  任务标题
        type:String,
        //required: true
    },
    price:{ // 赏金
        type:Number,
        //required: true
    },
    discription:{ // 描述
        type:String,
    },
    publisher:{
        type: ObjectId,
        //required:true
    },
    hunter:{
        type: ObjectId,
    },
    startloc:{
        type: String,
        
    },
    endloc:{
        type: String
    },
    // 联系方式(默认为用户信息里的？)
    endtime:{
        type: Date
    },
    close:{ // 未完成 已完成 (已关闭要不要？)
        type:Boolean
    }
});
// 字段类型都有： 
// String, Number, Date, Buffer, Booleanm Mixed, ObjectId, Array

let TaskORM = ose.model('Task', TaskSchema);
module.exports = DishORM;