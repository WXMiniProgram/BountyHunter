let query = require('./index');
let express = require('express');
let Dish = require('./Controller/Dish');
let bodyParser = require('body-parser');
let router = express.Router();

let urlEncodeParser = bodyParser.urlencoded({extended:false, limit:2*1024*1024})
let jsonParser = bodyParser.json

router.get('/dishes/:school/:canteen', Dish.queryAll); // 所有菜品
router.get('/dishes/:school/:canteen/:dish_id', Dish.queryOne); // 随机抽签时的某一个菜品
router.delete('/dishes/:school/:canteen/:dish_id', Dish.delete);
router.post('/dishes/:school/:canteen', Dish.add);
// router.post('/dishes/:School/:Canteen', jsonParser, Dish.Add); // 增加菜品 菜品信息在表单中
module.exports = router;

/* 范围查询可用：的形式传递参数（利用 '-'和'.'）,如
Route Path: /flights/:from-:to
Request URL: http://localhost:8000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:8000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
*/