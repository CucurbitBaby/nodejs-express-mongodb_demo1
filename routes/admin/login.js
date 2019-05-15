var express=require('express');
var router = express.Router();

// 引入body-parser  如果项目没有图片上传就用body-parser  有图片上传还得用 multiparty
var bodyParser = require('body-parser');
// 设置body-parser中间件
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
var md5=require('md5-node');
var DB = require('../../modules/db.js');

router.get('/',function(req,res){
    res.render('admin/login')
});

//处理登录的业务逻辑
router.post('/doLogin',function(req,res){


    var username = req.body.username;
    var password = md5(req.body.password);  /*要对用户输入的密码加密*/
    // 2.连接数据库查询数据
    DB.find('user',{
        username:username,
        password:password
    },function(err,data){
        if(data.length>0){
            req.session.userinfo = data[0];
            res.redirect('/admin/product');
        }else{
            res.send("<script>alert('登陆失败');location.href='/admin/login'</script>")
        }
    })
});

router.get('/loginOut',function(req,res){
    // 销毁sesssion
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/login');
        }
    });
})

module.exports = router;