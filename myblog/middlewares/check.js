module.exports = {
    User: function User(req, res, next) {
        return req.session.user;
    },
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登录！');
            return res.redirect('/user/login');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            //req.flash('success', 'Log in success!');
            return res.redirect('back'); //返回之前的页面
        }
        next();
    }
};