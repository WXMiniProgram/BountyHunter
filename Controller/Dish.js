let Dish = require('../Model/DishORM');
let Util = require('../util')

function isValid(obj){
    return obj != undefined && obj != null;
}

exports.queryAll = function(req, res) {
    let params = req.params;
    let filter = {};
    if(isValid(params["school"]) && params["school"] != "all"){
        filter["school"] = params["school"];
    }
    if(isValid(params["canteen"]) && params["canteen"] != "all"){
        filter["canteen"] = params["canteen"];
    }
    Dish.find(filter, (err, dish)=>{
        if(err){
            return res.status(400).json(err);
        }
        return res.status(200).json({"dishes":dish});
    });
}

exports.queryOne = function(req, res) { // queryOne 仅支持用id搜索
    let id = req.params["dish_id"];
    if(! id){
        return res.status(401).send("未找到ID, 建议使用 queryAll()");
    }
    Dish.findById(id, (err, dish)=>{
        if(err){
            return res.status(400).json(err);
        }
        return res.status(200).json({"dish": dish});
    })
}

exports.delete = function(req, res) {
    let id = (req.params)['dish_id'];
    if(id){
        Dish.remove({"_id":id}, (err)=>{
            if(err){
                return res.status(400).send(err);
            }
            return res.status(200).send({"id":id});
        });
    }
    else {
        return res.status(401).send(Util.ErrMsg["2"]);
    }    
}

exports.add = function(req, res) {
    let params = req.params; // 获得学校、食堂
    let body = req.body; // 表单数据
    if(isValid(body["name"]) && isValid(body["price"])){
        let dish = new Dish({
            "school":params['school'],
            "canteen":params['canteen'],
            "name":body['name'],
            "price":body['price'],
        });
        dish.save(); // 使用异步把
        // console.log("插入数据", body);
        return res.status(200).json({"obj": dish, "id":dish.id});
    }else{
        return res.status(400).send(Util.ErrMsg["0"]);
    }
    
}
