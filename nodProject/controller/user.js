const { exec, escape } = require('../db/mysql')
const { genPassword }  = require('../utils/cryPassword')
// 登录
const login = async (username,password) => {
    username = escape(username)

    // 生成加密密码
    password = genPassword(password)
    password = escape(password)
    const sql = `
        select username,realName,avatar,likes,goods from users where username=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}

// 注册
const signup = async (username,password,realName,email) => {
    username = escape(username)

    //生成加密密码
    password = genPassword(password)
    password = escape(password)

    let test = `select username from users where username=${username}` //注册时检验有无相同账号
    const testData = await exec(test)
    if (testData.length > 0) {
        return {
            num:testData.length,
            id:0
        }
    }
    const sql = `
        insert into users (username, realName,password,email, likes, goods) values (${username},'${realName}',${password},'${email}','','');
    `    //注册
    const insertData = await exec(sql)
    return {
        num:0,
        id: insertData.insertId
    }
}

// 导出接口
module.exports = {
    login,
    signup
}