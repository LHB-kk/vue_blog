const env = process.env.NODE_ENV;
// mysql 与redis 的配置
let MYSQL_CONF;
let REDIS_CONF;
if (env == 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user:'root',
        password:'2000072140lhb',
        port:'3306',
        database:'vue_blog'
    }

    REDIS_CONF = {
        port: 6379,
        host:'127.0.0.1'
    }
}
if (env == 'production') {
    MYSQL_CONF = {
        host:'172.29.75.29',
        user:'root',
        password:'2000072140lhb',
        port:'3306',
        database:'vue_blog'
    }
    REDIS_CONF = {
        port: 6379,
        host:'172.29.75.29'
    }
}
 module.exports = {
     MYSQL_CONF,
     REDIS_CONF
};
 