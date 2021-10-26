var express = require('express');
var router = express.Router();
const path = require('path');
var myServer = require(path.resolve() + '/public/javascripts/myServer.js');
const fs = require('fs')

router.get('/', function(req, res) {
  res.render('todo', { title : 'todo' });
});

router.post('/getItem', function(req, res) {
    var todoPath = path.resolve() + '/public/json/todo.json';

    var data = fs.readFileSync(todoPath, 'utf8')

    res.json(data);
});

router.post('/update', function(req, res) {
    //Requestされたファイル名を取得
    var data = req.body;
    var todoPath = path.resolve() + '/public/json/todo.json';

    async function writeJson() {
        try {
            fs.writeFileSync(todoPath, JSON.stringify(data))
        } catch (err) {
            console.error(err)
        }
    }

    async function funcSelect() {



        /*
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
        */
        var data = 'aaa';
        res.status(200).send('OK');
    }
    writeJson();
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