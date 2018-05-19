var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.user) {
        res.render('home', {
            body: 'home',
            layout: 'temp',
            nav_success: req.session.user.name == "" ? "" : req.session.user.name
        });
    } else {
        res.render('home', {
            body: 'home',
            layout: 'temp',
            errors: '请先登录！'
        });
    }
});

module.exports = router;