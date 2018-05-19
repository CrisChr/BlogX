var express = require('express');
var router = express.Router();

var check = require('../middlewares/check');
var articleModel = require('../models/articles');

var blogId;

//编辑博客页
router.get('/', check.checkLogin, function(req, res, next) {
    blogId = req.query.blog_id;
    articleModel.getPostById(blogId)
        .then(function(post) {
            res.render('edit', {
                body: 'edit',
                layout: 'temp',
                post: post,
                nav_success: req.session.user.name == "" ? "" : req.session.user.name
            });
        }).catch(next);
});

//更新一篇博客
router.post('/', check.checkLogin, function(req, res, next) {
    var postId = blogId;
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;
    var date = new Date();

    console.log("data: " + date);

    articleModel.updateBlogById(postId, author, {
            _id: postId,
            title: title,
            content: content,
            date: date
        })
        .then(function(result) {
            req.flash('success', '更新博客成功！');
            // 编辑成功后跳转到上一页
            return res.redirect('/view?blog=' + author);
        }).catch(next);
});
module.exports = router;