var express=require('express');
var router = express.Router();
//后台的路由 所有的后台处理都要经过这里

var login = require('./admin/login.js');
var product = require('./admin/product.js');
var user = require('./admin/user.js');

// 自定义中间件，判断登录状态
router.use(function(req,res,next){

    // console.log(req.url);
    //next();
    if(req.url=='/login' || req.url=='/login/doLogin'){
        next();

    }else{

        if(req.session.userinfo&&req.session.userinfo.username!=''){   /*判断有没有登录*/
            req.app.locals['userinfo'] = req.session.userinfo;/*配置全局变量 任何模板使用*/
            next();
        }else{
            res.redirect('/admin/login')
        }
    }
})


router.use('/login',login);
router.use('/product',product);
router.use('/user',user);

module.exports = router;