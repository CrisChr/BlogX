var express = require('express');
var router = express.Router();

var check = require('../middlewares/check');
var postModel = require('../models/articles');

router.get('/', check.checkLogin, function(req, res, next) {
    var blog_id = req.query.blog_id;
    var re = /\r\n/g;
    postModel.incPv(blog_id);
    postModel.getPostById(blog_id)
        .then(function(post) {
            res.render('viewdetails', {
                body: 'viewdetails',
                layout: 'temp',
                post: post,
                blog_content: post.content.replace(re, '</br>'),
                nav_success: req.session.user.name == "" ? "" : req.session.user.name
            });
        }).catch(next);
});

router.get('/del', check.checkLogin, function(req, res, next) {
    var authorId = req.session.user._id;
    var blogId = req.query.blog_id;
    postModel.delById(blogId, authorId).then(function(result) {
        req.flash('success', '删除成功');
        return res.redirect('/view?blog=' + authorId);
    }).catch(next);
});

module.exports = router;