var express = require('express');
var router = express.Router();
const path = require('path');
var myServer = require(path.resolve() + '/public/javascripts/myServer.js');
const fs = require('fs');
const { Client } = require('pg');

var connectionString;

if (process.env.NODE_ENV !== 'production') {
    connectionString = {
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'post0103',
        port: 5432
    };
}
else {
    connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
}

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

//ログイン制御したい場合はコメントを切り替える
router.get('/', function(req, res) {
//router.get('/', isLogined, function(req, res, next) {
    const query = {
        text: 'SELECT * FROM USERS',
        values: [],
    }

    async function main() {
        var getUser;
        var client = new Client(connectionString);

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
        var client = new Client(connectionString);

        await client.connect()

        client.query(query, (error,result)=>{
            console.log(result);
            //getUser = result.rows[0].NAME;

            client.end();

            var a = [];
            a.push(result.rows)
            //a.push(result.rows[0]);
            //a.push(result.rows[1]);

            res.json(result.rows);
        });
    }

    main();

    
});

router.post('/insData', function(req, res) {
    var insQuery, delQuery;
    var todo = req.body;

    async function main() {
        var getUser;
        var client = new Client(connectionString);

        try {
            await client.connect()
            console.log('接続完了')

            var ins1 = todo.name;
        
            insQuery = {
                text: 'INSERT INTO TODO(name, other) VALUES($1, $2)',
                values: [ins1, 'test'],
            }     

            var results2 = await client.query(insQuery)

            res.status(200).send('OK');
        }
        catch (e) {
            res.status(400).send('NG');
            console.log(e)
        }
        finally {
            await client.end()
        }
    }

    main();
});

router.post('/delData', function(req, res) {
    var delQuery;
    var delID = req.body.id;

    async function main() {
        var getUser;
        var client = new Client(connectionString);

        try {
            await client.connect()
            console.log('接続完了')
        
            delQuery = {
                text: 'DELETE FROM TODO WHERE id = $1',
                values: [delID],
            }     

            var results2 = await client.query(delQuery)

            res.status(200).send('OK');
        }
        catch (e) {
            res.status(400).send('NG');
            console.log(e)
        }
        finally {
            await client.end()
        }
    }

    main();
});








router.post('/update', function(req, res) {
    var insQuery, delQuery;
    var todos = req.body;

    var delQuery = {
        text: 'DELETE FROM TODO',
        values: [],
    }

    async function main() {
        var getUser;
        var client = new Client(connectionString);

        try {
            await client.connect()
            console.log('接続完了')
            var results = await client.query(delQuery)
            //console.table(results.rows)        


            for (i = 0; i < todos.length; i++) {
                var ins1 = todos[i].name;
        
                insQuery = {
                    text: 'INSERT INTO TODO(name, other) VALUES($1, $2)',
                    values: [ins1, 'test'],
                }     

                var results2 = await client.query(insQuery)
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            await client.end()

            res.status(200).send('OK');
        }
    }

    main();
});

module.exports = router;