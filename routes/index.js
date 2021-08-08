var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'TopPage' , message: 'ログインしてください'});
});

router.get('/failure', (req, res) => {
    console.log(req.session);
    res.render('index', { title : 'TopPage' , message: 'ID PASSWORD が間違っています'});
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
            res.render('mainMenu222', { title : 'mainMenu222' });
            //res.send('Success');
        }

        write();
    }
);

module.exports = router;
