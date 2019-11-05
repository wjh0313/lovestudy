const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const router = express.Router();
//连接数据库
let conn = mysql.createConnection({
    host: '192.168.101.226',
    user: 'node',
    password: '123456',
    database: 'lovestudy'
});
conn.connect();
//默认跳转到./index.html页面
// router.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
//     res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
//     res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });
router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/index.html'))
});
// router.use(express.static(path.join(__dirname,"/..","/views")))
//跳转到注册页面
router.get('/RegistrationPage',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/RegistrationPage.html'));
});
//跳转到登陆界面
router.get('/WelcomeInterface',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/WelcomeInterface.html'))
});
//跳转到用户界面
router.get('/userInterface',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/userInterface.html'))
});
//跳转到别人的界面
router.get('/WelcomeMyHome',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/WelcomeMyHome.html'))
});
//跳转到忘记密码界面
router.get('/ForgetPassword',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/views/ForgetPassword.html'))
});
router.get('/game',(req,res)=>{
    res.sendFile(path.join(__dirname,'/..','/static/game.html'))
});




//post请求事务处理逻辑/register 处理注册界面
router.post('/register',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let passWord = req.body.password;
    //查看用户名是否重复
    conn.query(`select name from lovestudys where name="${userName}"`,function(err,file,files){
    if(err) return err;
    if(file.length == 0 )
    {
        // 创建用户将用户信息插入到数据库中
        conn.query('insert into lovestudys (name,passd) values (?,?)', [userName, passWord], function (err, file, files) {
            if (err) return err;
        });
        // try{
        //     conn.query(`CREATE TABLE  xxx (id int(8) unsigned not null,context char(200) not null,time char(20) not null)`, function (err, file, files) {
        //         if (err) return err;
        //         console.log(123);
                
        //     });
        // }catch(x){
        //     console.log(x);
        // }
        res.end('注册成功');
    }else{
        res.end('用户名已存在请更换用户名');
    }
    });
});
//处理登陆逻辑/login
router.post('/login',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let passWord = req.body.password;
    conn.query(`select name,passd from lovestudys where name="${userName}"`,function(err,file,files){
        if(err) return err;
        if(file.length == 0 )
        {
            res.end('用户名不存在请注册账号');
        }else{
            let cmp1 = JSON.stringify(file);
            let cmp2 = JSON.parse(cmp1);
            for (const i of cmp2) {
                if(i.passd == passWord)
                {
                    res.end('登录成功!点击确认跳转到用户界面');
                }else{
                    res.end('密码错误请重新输入密码');
                }
                
            }
            
        }
        });
});
//处理修改密码
router.post('/change',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let passWord = req.body.password;
    conn.query(`UPDATE lovestudys SET passd="${passWord}" WHERE name = "${userName}"`,function(err,file,files){
        if(err) return err;
        res.end('修改成功');
    });
});
//上传文本输入框内容
router.post('/transmission',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let thetext = req.body.thetext;
    let thetime = req.body.thetime;
    conn.query('insert into image (name,text,time) values (?,?,?)', [userName, thetext,thetime], function (err, file, files) {
        if (err) return err;
        res.end('笔记上传成功');
    });
    
});
//查看历史记录
router.post('/showHistory',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    conn.query(`select time,text from image where name="${userName}"`,function(err,file,files){
        if(err) return err;
        let cmp1 = JSON.stringify(file);
        res.end(cmp1);
    });
    
});
//查看其他同学
router.post('/findstudents',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    conn.query(`select name from lovestudys`,function(err,file,files){
        if(err) return err ;
        let cmp = JSON.stringify(file);
        res.end(cmp);
    });
});
//修改历史记录
router.post('/exchangeima',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let theText = req.body.thetext;
    let theTime = req.body.thetime;
    conn.query(`UPDATE image SET text="${theText}" WHERE name = "${userName}" && time = "${theTime}"`,function(err,file,files){
        if(err) return err;
        res.end('修改成功');
    });
});
//删除历史记录
router.post('/delText',(req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    let userName = req.body.username;
    let theTime = req.body.thetime;
    conn.query(`DELETE FROM image WHERE name = "${userName}" && time = "${theTime}"`,function(err,file,files){
        if(err) return err;
        res.end('删除成功');
    });
});

module.exports = router;