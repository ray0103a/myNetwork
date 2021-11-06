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
            a.push(result.rows)
            //a.push(result.rows[0]);
            //a.push(result.rows[1]);

            res.json(result.rows);
        });
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

        try {
            await client.connect()
            console.log('接続完了')
            var results = await client.query(delQuery)
            //console.table(results.rows)        


            for (i = 0; i < todos.length; i++) {
                var ins1 = todos[i].name;
        
                insQuery = {
                    text: 'INSERT INTO TODO VALUES($1, $2)',
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





        //await client.connect()

        //client.query(delQuery, (error,result)=>{
        //    console.log(result);
        //});


        //client.end();
        
    }

    main();
});

module.exports = router;