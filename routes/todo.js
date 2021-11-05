var express = require('express');
var router = express.Router();
const path = require('path');
var myServer = require(path.resolve() + '/public/javascripts/myServer.js');
const fs = require('fs');
const { Client } = require('pg');



router.get('/', function(req, res) {
    const query = {
        text: 'SELECT * FROM USERS',
        values: [],
    }

    async function main() {
        var getUser;
        var client;

        if (process.env.NODE_ENV !== 'production') {
            client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'postgres',
                password: 'post0103',
                port: 5432
            })
        }
        else {
            client = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
        }

        await client.connect()

        client.query(query, (error,result)=>{
            console.log(result);
            getUser = result.rows[0].userid;

            client.end();

            res.render('todo', { title : getUser });
        });
    }

    main();
});

router.post('/getItem', function(req, res) {
    var todoPath = path.resolve() + '/public/json/todo.json';

    var data = fs.readFileSync(todoPath, 'utf8')

    const query = {
        text: 'SELECT * FROM TODO',
        values: [],
    }

    async function main() {
        var getUser;
        var client;

        if (process.env.NODE_ENV !== 'production') {
            client = new Client({
                user: 'postgres',
                host: 'localhost',
                database: 'postgres',
                password: 'post0103',
                port: 5432
            })
        }
        else {
            client = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
        }

        await client.connect()

        client.query(query, (error,result)=>{
            console.log(result);
            //getUser = result.rows[0].NAME;

            client.end();

            var a = [];
            a.push(result.rows[0]);
            a.push(result.rows[0]);

            res.json(a);
        });
    }

    main();

    
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