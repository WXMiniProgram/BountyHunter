let express = require('express');
let hbs = require('hbs');
let app = express();
let router = require('./router');
let ose = require('mongoose');
let bodyParser = require('body-parser');

// app.set('views', './templates'); // 纯后台 不需要视图层了
// app.set('view engine', 'html');
// app.engine('html', hbs.__express);

app.use(bodyParser.json());
app.use('/', router); // 将router挂载到根目录访问
app.use(express.static('statics'));


let db_addr = 'mongodb://127.0.0.1:27017/dish' // 地址从命令行里打开 mongo就可看到  dish 为数据库名 格式：'mongodb://user:pass@localhost:port/database'
ose.connect(db_addr);
ose.connection.once('open', ()=>{
    // ?
});

let server = app.listen(3000, function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log('listening: %s:%s', host, port);
});