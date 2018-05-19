module.exports = {
    port: 3000,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 1800000
    },
    mongodb: 'mongodb://localhost:27017/myblog'
};