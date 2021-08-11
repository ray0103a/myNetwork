var express = require('express');
var router = express.Router();
const passport = require('passport');

/* TopPage */
let isLogined = function(req, res, next){


    //NeDbテスト
    /*
    const Database = require("nedb");
    const db = new Database({ 
            filename: "../nedb/example.db" ,
            autoload: true
        });
    */

    // 保存したいドキュメント
    const doc = {
        // ID(指定ない場合は16桁のIDを自動生成)
        //_id: "0000000000000001",
        // ユーザーID
        username: "test",
        // パスワード
        password: 111,
    };

    // 新規ドキュメントをデータベースに保存する
    /*
    db.insert(doc, (error, newDoc) => {
        if (error !== null) {
            console.error(error);
        }

        // newDocにはアルファベット16文字の値を持つ_idフィールドが追加されている
        console.log(newDoc);
    });
    */

    /*
    db.find({ username: "r-inoue" }, (error, docs) => {
        console.error(docs);
        if (docs.length){
            a = docs[0].password;
        }
    });
    */




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
