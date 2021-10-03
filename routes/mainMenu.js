var express = require('express');
var router = express.Router();

let isLogined = function(req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        //認証されている場合
        if (req.user.myKey == 'zzz') {
            //ログインOKの場合(router.getの中が処理される)
            return next();
        } else {
            //権限がない場合
            res.redirect("/");
        }
    }else{
        //認証されていない場合
        res.redirect("/");
    }
};

router.get('/', isLogined, function(req, res, next) {
    //認証OKの場合に処理される
    res.render('mainMenu', { title : 'Self Introduction' });
});

module.exports = router;