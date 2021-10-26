var express = require('express');
var router = express.Router();
const path = require('path');
var myServer = require(path.resolve() + '/public/javascripts/myServer.js');

router.get('/', function(req, res) {
  res.render('todo', { title : 'todo' });
});

router.post('/update', function(req, res) {
    //Requestされたファイル名を取得
    var myFileName = req.body.name;

    async function funcSelect() {
        await myServer.insertNeDb('test').then(function(result) {
            checkPass = '';
        }).catch(function(value) {
            // 非同期処理が失敗した場合
            console.log('実行結果:' + value);
        });    

        await myServer.selectNeDb('test').then(function(result) {
            checkPass = result;
        }).catch(function(value) {
            // 非同期処理が失敗した場合
            console.log('実行結果:' + value);
        });

        res.json('aaa');
    }
    funcSelect();

    //保存されているベースパス
    /*
    var folPath = path.resolve() + '/public/logs/'

    folPath = folPath + myFileName
    //var testPath = path.resolve(__dirname, '..');
    //testPath = testPath + '/' + myFileName

    const fs = require("fs");
    let text = fs.readFileSync(folPath, "utf-8");
    */
    
});

module.exports = router;