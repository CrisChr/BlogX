var express = require('express');
var sha1 = require('sha1');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

//登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('login', {
        body: 'login',
        layout: 'temp'
    });
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.body.username;
    var password = req.body.password;

    UserModel.getUserByName(name)
        .then(function(user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('back');
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                req.flash('error', '用户名或密码错误');
                return res.redirect('back');
            }
            // 用户信息写入 session
            delete user.password;
            req.session.user = user;
            // 跳转到主页
            return res.redirect('/view/?blog=' + req.session.user.name);
        })
        .catch(next);
});

module.exports = router;