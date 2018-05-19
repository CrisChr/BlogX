var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

//用户模型
exports.User = mongolass.model('User', {
    name: {
        type: 'string'
    },
    password: {
        type: 'string'
    }
});
exports.User.index({
    name: 1
}, {
    unique: true
}).exec(); // 根据用户名找到用户，用户名全局唯一

//文章模型
exports.Article = mongolass.model('Article', {
    author: {
        type: Mongolass.Types.ObjectId
    },
    title: {
        type: 'string'
    },
    content: {
        type: 'string'
    },
    pv: {
        type: 'number'
    },
    date: {
        type: 'date'
    }
});
exports.Article.index({
    author: 1
}, {
    _id: -1
}).exec(); // 按创建时间降序查看用户的文章列表

//使用了 addCreatedAt 自定义插件（通过 _id 生成时间戳）
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function(results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss');
        });
        return results;
    },
    afterFindOne: function(result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss');
        }
        return result;
    }
});