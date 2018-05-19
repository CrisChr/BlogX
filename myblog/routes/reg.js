var express = require('express');
var sha1 = require('sha1');
var router = express.Router();

var userModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;

//注册页
router.get('/reg', function(req, res, next) {
    res.render('reg', {
        body: 'reg',
        layout: 'temp'
    });
});

router.post('/reg', function(req, res, next) {
    var name = req.body.username;
    var password = req.body.password;

    var user = {
        name: name,
        password: sha1(password)
    }

    //用户信息写入数据库
    userModel.create(user).then(function(result) {
        // 此 user 是插入 mongodb 后的值，包含 _id
        user = result.ops[0];
        // 将用户信息存入 session
        delete user.password;
        req.session.user = user;
        // 写入 flash
        req.flash('nav_success', '已登录');
        return res.redirect('/view/?blog=' + req.session.user._id);
    }).catch(function(e) {
        if (e.message.match('E11000 duplicate key')) {
            req.flash('error', '用户名已被占用，请重新注册');
            return res.redirect('/user/reg');
        }
        next(e);
    });
});

module.exports = router;