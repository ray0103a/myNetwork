var express = require('express');
var router = express.Router();
//var sqliteDB = require('../public/javascripts/sqlite.js');
const passport = require('passport');
//var myServer = require('../public/javascripts/myServer.js');

/* 初期ログイン */
router.get('/', function(req, res, next) {
    res.render('login', { title : 'Login' });
});

/* ログインエラー */
router.get('/failure', (req, res) => {
    console.log(req.session);
    res.render('login', { title : 'ID PASSWORD が間違っています' });
});

/* 認証処理(POST) */
router.post('/',passport.authenticate('local',
    {
        //認証失敗
        session: true,
        failureRedirect : '/login/failure'
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