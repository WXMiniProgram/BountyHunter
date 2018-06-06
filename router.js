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
router.get('/tasks/:task_id', Task.queryOne); // 任务详情页
router.get('/tasks/:as/:user_id', Task.queryByUser); // as hunter or publisher
<<<<<<< HEAD
router.get('/tasks/amount/:as/:user_id', Task.queryUndoneByUser);
router.put('/tasks/:task_id', Task.update); // 全部都可更新
=======
router.post('/tasks/:task_id', Task.update); // 全部都可更新
>>>>>>> 7a7171fbc20deaf7fa28557601af76954806bf27
// TODO: PUT 连不上？！
// router.put('/tasks/:verb/：task_id', Task.updateStatus); // 更新任务：主要被领取、完成 时
router.post('/tasks/delete/:task_id', Task.delete); // task 被sheriff主动删除时

router.get('/user/login/:code', User.login);
router.post('/user/pass/:openid', User.pass);
router.post('/user/reject/:openid', User.reject);
router.post('/user/uploadImg/:openid', User.uploadImg);
router.post('/user/verify/:openid', User.verify);
router.put('/user/:openid', User.update);
router.get('/user', User.query);
router.get('/user/:openid', User.queryOne);
module.exports = router;

/* 范围查询可用：的形式传递参数（利用 '-'和'.'）,如
Route Path: /flights/:from-:to
Request URL: http://localhost:8000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:8000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
*/
