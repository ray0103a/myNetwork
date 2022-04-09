var express = require('express');
var router = express.Router();
var path = require('path');
//var myPost = require(path.resolve() + '/public/javascripts/postgres.js');
var myPost = require('../public/javascripts/postgres.js');
const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('eatMenu', { title: 'eatMenu' });
});

router.get('/getItem', function(req, res) {
    var connectionString = myPost.connectionString();

    const query = {
        text: 'SELECT * FROM WEEKMASTER ORDER BY WEEK,NO',
        values: [],
    }

    async function main() {
        var getUser;
        var client = new Client(connectionString);

        await client.connect()

        client.query(query, (error,result)=>{
            console.log(result);
            //getUser = result.rows[0].userid;

            client.end();

            var test = JSON.stringify(result.rows)

            res.json(result.rows);
        });
    }

    main();
});

router.post('/getCategory', function(req, res) {
    var insQuery, delQuery;
    var json = req.body;
    var connectionString = myPost.connectionString();

    async function main() {
        var rtData;

        if (json.data == 1) {
            //肉
            rtData = [ 
                {no:1, name:'ハンバーグ'}, 
                {no:2, name:'肉巻き豆腐'},
                {no:3, name:'生姜焼き'},
                {no:4, name:'野菜炒め'},
            ];
        } else if(json.data == 2) {
            //魚
            rtData = [ 
                {no:1, name:'鮭のホイル焼き'}, 
                {no:2, name:'サバの味噌煮'},
                {no:3, name:'白身魚のフライ'},
            ];
        }

        res.json(rtData);
    }

    main();
});

router.post('/insData', function(req, res) {
    var insQuery, delQuery;
    var json = req.body;
    var connectionString = myPost.connectionString();

    async function main() {
        var getUser;
        var client = new Client(connectionString);

        try {
            //接続
            await client.connect()
            console.log('接続完了')

            //トランザクション開始
            await client.query("BEGIN");

            //テーブル削除
            var delQuery = {
                text: 'DELETE FROM WEEKMASTER',
                values: [],
            }
            var results1 = await client.query(delQuery)

            //テーブル登録
            for (var i = 0; i < json.length; i++) {
                var ins1 = json[i].week;
                var ins2 = json[i].no;
                var ins3 = json[i].data;
        
                insQuery = {
                    text: 'INSERT INTO WEEKMASTER(week, no, name) VALUES($1, $2, $3)',
                    values: [ins1, ins2, ins3],
                }     
    
                var results2 = await client.query(insQuery)
            }

            await client.query("COMMIT");
            res.status(200).send('OK');
        }
        catch (e) {
            await client.query("ROLLBACK");
            res.status(400).send('NG');
            console.log(e)
        }
        finally {
            await client.end()
        }
    }

    main();
});

module.exports = router;
