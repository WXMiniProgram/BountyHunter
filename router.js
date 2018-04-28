let query = require('./index');
let express = require('express');
let Task = require('./Controller/Task');
let User = require('./Controller/User');
let bodyParser = require('body-parser');
let router = express.Router();

let urlEncodeParser = bodyParser.urlencoded({extended:false, limit:2*1024*1024})
let jsonParser = bodyParser.json

router.post('/tasks', Task.add);

router.get('/tasks', Task.queryAll);
router.get('/tasks/:orderby.:method', Task.queryAll); // 所有任务(按距离或赏金排序)
router.get('/tasks/:as/:user_id', Task.queryByUser); // as hunter or publisher

router.get('/tasks/:task_id', Task.queryOne); // 任务详情页


router.put('/tasks/:task_id', Task.update); // 全部都可更新
// TODO: PUT 连不上？！
// router.put('/tasks/:verb/：task_id', Task.updateStatus); // 更新任务：主要被领取、完成 时
router.delete('/tasks/:task_id', Task.delete); // task 被sheriff主动删除时

module.exports = router;

/* 范围查询可用：的形式传递参数（利用 '-'和'.'）,如
Route Path: /flights/:from-:to
Request URL: http://localhost:8000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:8000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
*/