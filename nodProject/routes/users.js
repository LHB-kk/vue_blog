var router = require('koa-router')();
const path = require('path')
const fs = require('fs')
const { login, signup,updateAvatar,updateName} = require('../controller/user')
const { SuccessModel,ErrorModel} = require('../model/resModel');
const { sign } = require('crypto');
const { get } = require('http');
router.prefix('/api/users');
const env = process.env.NODE_ENV

// 登录
router.post('/login',async (ctx,next) => {
  const { username,password } = ctx.request.body
  const data = await login(username,password)
  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realName = data.realName
    ctx.body = new SuccessModel(data)
    return
  }
  ctx.body = new SuccessModel('登录失败')
})

// 注册
router.post('/signup',async (ctx,next) => {
  const { username, password, realName, email } = ctx.request.body
  const data = await signup(username,password,realName,email)
  if (data.num == 0) {
    ctx.body = new SuccessModel("注册成功",data.id)
    return
  }
  ctx.body = new ErrorModel("注册失败")
})

// 退出登录
router.post('/logout',async (ctx) => {
  try {
    if (ctx.session.updateName && ctx.session.realName) {
      ctx.session = null
      ctx.body = { code: 1,message: '退出成功'}
    } else {
      ctx.body = { code: 0,message: "未登录"}
      // 跳转到登录页
      ctx.response.redirect('/login')
  
      // 跳转到登录页或网站首页
  
    }
  } catch (err) {
    throw new Error(err)
  }
})

// 用户修改名字
router.post('/update/name',async (ctx,next) => {
  const { name } = ctx.request.body
  let username = ctx.session.username    //获取操作的对象的账户
  const data = await updateName(username,name)
  if (data) {
    ctx.body = new SuccessModel(name,'修改成功')
  }
  ctx.body = new ErrorModel('修改失败')
})

// 更换用户的头像
 router.post('/update/avatar',async (ctx) => {
  //  上传当个文件
  let { body: getBody,files} = ctx.request
  // const file = ctx.request.files.file  获取上传文件
  // 创建可读流
  if (files) {
    const reader = fs.createReadStream(files.file.path)
    const basename = path.basename(files.file.path)
    let filePath = path.join(__dirname,'../','public/images') + `/${basename}`;

    // 创建可写流
    const upStream = fs.createWriteStream(filePath);

    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    if (env === 'env') {
      avatar_url = `${ctx.origin}:8000/api/file/avatar?pic=${basename}`
    } else {
      avatar_url =`http://47.112.***.***:80/api/file/avatar?pic=&{basename}`
    }
    getBody = {...getBody,avatar_url}

    // 进行对新头像的存入数据库的操作
    let username = ctx.session.username    //获取操作的对象的账户

    const data = await updateAvatar(username,avatar_url)
    if (data) {
      ctx.body = new SuccessModel(getBody,"修改图片成功")
    } else {
      ctx.body = new ErrorModel("修改图片失败")
    }
  }
 })
module.exports = router;
