var express=require('express');
var router = express.Router();

var DB = require('../../modules/db.js');

router.get('/',function(req,res){
    DB.find('user',{},function(err,data){
        // console.log('/product的data数据是');
        // console.log(data)
        res.render('admin/user/index',{
            list:data
        });
    })

});


router.get('/add',function(req,res){
    res.send('显示增加用户');
});

module.exports = router;