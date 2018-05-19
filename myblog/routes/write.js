var express = require('express');
var router = express.Router();

var check = require('../middlewares/check');
var articleModel = require('../models/articles');

//创建博客页
router.get('/', check.checkLogin, function(req, res, next) {
    if (check.User) {
        res.render('write', {
            body: 'write',
            layout: 'temp',
            nav_success: req.session.user.name == "" ? "" : req.session.user.name
        });
    }
});

//发表一篇博客
router.post('/', check.checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;

    var blog = {
        author: author,
        title: title,
        content: content,
        pv: 0,
        date: new Date()
    };

    articleModel.create(blog).then(function(result) {
        blog = result.ops[0];
        req.flash('success', '发表成功！');
        return res.redirect('/view?blog=' + blog.author);
    }).catch(next);
});
module.exports = router;