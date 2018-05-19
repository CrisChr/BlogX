var Articles = require('../lib/mongo').Article;

module.exports = {
    // 创建一篇文章
    create: function create(article) {
        return Articles.create(article).exec();
    },

    // 通过文章 id 获取一篇文章
    getPostById: function getPostById(postId) {
        return Articles
            .findOne({
                _id: postId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .addCreatedAt()
            .exec();
    },

    // 按创建时间和当前页数，降序获取所有用户文章或者某个特定用户的所有文章
    getPostsByPage: function getPosts(author, page) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Articles
            .find(query, {
                skip: (page - 1) * 5,
                limit: 5
            })
            .populate({
                path: '_id',
                model: 'User'
            })
            .sort({
                _id: -1
            })
            .addCreatedAt()
            .exec();
    },

    //通过登录的用户名得到当前用户的所有博客
    getPostsCount: function getPostsCount(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Articles
            .find(query)
            .populate({
                path: '_id',
                model: 'User'
            })
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Articles
            .update({
                _id: postId
            }, {
                $inc: {
                    pv: 1
                }
            })
            .exec();
    },

    //通过用户id和博客id删除一篇文章
    delById: function delById(postId, authorId) {
        return Articles.remove({
            author: authorId,
            _id: postId
        }).exec();
    },

    //通过用户id和博客id更新一篇博客
    updateBlogById: function updateBlogById(postId, authorName, data) {
        return Articles.update({
            _id: postId,
            author: authorName
        }, {
            $set: data
        }) /*.addCreatedAt()*/ .exec();
    }
};