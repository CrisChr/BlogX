var express = require('express');
var path = require('path');
var ejs = require('ejs');
var partials = require('express-partials');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('config-lite')(__dirname);
var MongoStore = require('connect-mongo')(session);

//记录日志
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

//获取当前时间
var date = new Date();
var expireDays = 30;
//将date设置为30分钟以后的时间
date.setTime(date.getTime() + expireDays * 60 * 1000);

app.set('views', path.join(__dirname, '/views')); // 设置存放模板文件的目录
app.use(express.static(path.join(__dirname, '/public'))); //设置静态文件的存放目录
//app.engine('.html', ejs.__express); //注册ejs模板为html页.
app.set('view engine', 'ejs'); // 设置模板引擎为 ejs

app.use(partials());
app.use(require('body-parser')());

app.use(session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge, // 过期时间，过期后 cookie 中的 session id 自动删除
        Expires: date.toGMTString()
    },
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: config.mongodb // mongodb 地址
    })
}));
app.use(flash());

// set flashb
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.nav_errors = req.flash('nav_error');
    res.locals.nav_success = req.flash('nav_success');
    res.locals.errors = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    return next();
});

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new(winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

app.use('/home', require('./routes/home'));
app.use('/user/login', require('./routes/login'));
app.use('/user', require('./routes/reg'));
app.use('/view', require('./routes/view'));
app.use('/viewdetails', require('./routes/viewdetails'));
app.use('/write', require('./routes/write'));
app.use('/edit', require('./routes/edit'));
app.use('/loginout', require('./routes/loginout'));

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

// error page
app.use(function(err, req, res, next) {
    res.render('error', {
        error: err
    });
});

app.listen(3000);

//开启页面布局功能
app.set('view options', {
    layout: true
});

//定制404页面
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// 定制500 页面
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

module.exports = app;