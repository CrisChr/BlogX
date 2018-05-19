var express = require('express');
var router = express.Router();

var check = require('../middlewares/check');
var postModel = require('../models/articles');

//浏览页
router.get('/', check.checkLogin, function(req, res, next) {
    if (check.User) {
        var author = req.session.user._id;
        var page = req.query.p ? parseInt(req.query.p) : 1;

        postModel.getPostsCount(author).then(function(total) {

            postModel.getPostsByPage(author, page)
                .then(function(posts) {
                    if (posts == "") {
                        req.flash('info', '你还没有博客，快去发表吧！');
                        return res.redirect('/write');
                    } else {
                        res.render('view', {
                            body: 'view',
                            layout: 'temp',
                            posts: posts,
                            page: page,
                            isFirstPage: (page - 1) == 0,
                            isLastPage: ((page - 1) * 5 + posts.length) == total.length,
                            nav_success: req.session.user.name == "" ? "" : req.session.user.name
                        });
                    }
                }).catch(next);
        }).catch(next);
    }
});

module.exports = router;