var express=require('express');
var router = express.Router();

var DB = require('../../modules/db.js');
var multiparty = require('multiparty');
var fs = require('fs');


router.get('/',function(req,res){
    DB.find('product',{},function(err,data){
        // console.log('/product的data数据是');
        // console.log(data)
        res.render('admin/product/index',{
            list:data
        });
    })
});


//显示增加商品的页面
router.get('/add',function(req,res){
    res.render('admin/product/add');

})

router.post('/doAdd',function(req,res){
    //获取表单提交的数据 以及表单post过来的图片
    var form = new multiparty.Form();
    form.uploadDir = 'upload'       //上传图片保存地址  目录必须存在
    form.parse(req,function(err,fields,files){
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(fields);        //获取表单的数据
        // console.log('this is ------------------------------------------------')
        // console.log(files);         //图片上传成功返回的地址信息
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        var pic = files.pic[0].path;
        // console.log(pic)

        DB.insert('product',{
            title:title,
            price:price,
            fee:fee,
            description:description,
            pic:pic
        },function(err,data){
            if(!err){
                res.redirect('/admin/product');       /*上传成功跳转product页面*/
            }
        });
    })
})

router.get('/edit',function(req,res){
    // 获取get传值id
    var id = req.query.id;

    //去数据库查询对应的数据 自增长的ID要用new DB.ObjectID(id)
    DB.find('product',{"_id":new DB.ObjectID(id)},function(err,data){
        // console.log(data)
        res.render('admin/product/edit',{
            list:data[0]
        });
    });

});

router.post('/doEdit',function(req,res){

    var form = new multiparty.Form();
    form.uploadDir = 'upload'       //上传图片保存地址
    form.parse(req,function(err,fields,files){
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(fields);        //获取表单的数据
        // console.log('this is ------------------------------------------------')
        // console.log(files);         //图片上传成功返回的地址信息
        var _id = fields._id[0];        //修改的条件
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];

        var originalFilename = files.pic[0].originalFilename;
        var pic = files.pic[0].path;
        var setData;
        if(originalFilename){
            setData = {
                title:title,
                price:price,
                fee:fee,
                description:description,
                pic:pic
            }
        }else {
            setData = {
                title: title,
                price: price,
                fee: fee,
                description: description
            }
            //删除临时文件
            fs.unlink(pic,function(err){
                // if(err){
                //     console.log('删除文件出错，pic是：');
                //     console.log(pic)
                //     throw err;
                // }else{
                //     console.log('删除文件成功，pic是：');
                //     console.log(pic)
                // }
                if(err){
                    throw err;
                }
            });
            // console.log(pic)
        }



        DB.update('product',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
            if(!err){
                // console.log('这次的setData.pic是：');
                // console.log(setData.pic)
                console.log('我要看看我要跳哪儿去了：')
                res.redirect('/admin/product');
            }
        });

    })
});

router.get('/delete',function(req,res){
    var id = req.query.id;
    DB.deleteOne('product',{"_id":new DB.ObjectID(id)},function(err){
        if(!err){
            res.redirect('/admin/product');
        }
    });
    // res.send('productdelete');
});

module.exports = router;