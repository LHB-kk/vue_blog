const env = process.env.NODE_ENV;
// mysql 与redis 的配置
// mysql 需要配置 域名，用户名，密码，端口号，数据库
// redis 需要配置端口号和域名
let MYSQL_CONF;
let REDIS_CONF;
const password = '2000072140lhb'
const database = 'vue_blog'
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user:'root',
        password,
        port:'3306',
        database
    }

    REDIS_CONF = {
        port: 6379,
        host:'127.0.0.1'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host:'172.29.75.29',
        user:'root',
        password,
        port:'3306',
        // 数据库
        database
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
 