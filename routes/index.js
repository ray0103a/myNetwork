var express = require('express');
var router = express.Router();
const passport = require('passport');

/* TopPage */
let isLogined = function(req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        if (req.user.myKey == 'zzz') {
            //ログインOKの場合(router.getの中が処理される)
            return next();
        } else {
            //権限がない場合
            res.redirect("/");
        }
    }else{
        //認証されていない場合
        res.render('index', { title: 'TopPage' , message: 'LOGIN'});
    }
};

router.get('/', isLogined, function(req, res, next) {
    //認証が既にされている場合は、メインメニューを表示する
    res.render('mainMenu', { title : 'mainMenu' });
});

/* ErrorPage */
router.get('/failure', (req, res) => {
    console.log(req.session);
    res.render('index', { title : 'TopPage' , message: 'ID or PASSWORD が間違っています'});
});

/* 認証処理(POST) */
router.post('/',passport.authenticate('local',
    {
        //認証失敗
        session: true,
        failureRedirect : '/failure'
    }
    ),(req, res) => {
        //認証成功
        console.log(req.user);
        
        async function write(){
            //ログを書き込む
            //await myServer.writeLog(req.user.username, "ログインしました。");

            //メインメニューへ遷移
            res.render('mainMenu', { title : 'mainMenu' });
            //res.send('Success');
        }

        write();
    }
);

module.exports = router;
