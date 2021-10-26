const fs = require("fs");
const path = require('path');

const Database = require("nedb");

var myPath = path.resolve() + '/public/nedb/users.db';

const db = new Database({ 
        filename: myPath ,
        autoload: true
    });

/**
 * ログを書き込む
 * @param {*} user 
 * @param {*} data 
 * @returns 
 */
exports.writeLog = function(user, data){
    return new Promise(function(resolve, reject) {
        //ファイルパスを取得
        var folderPath = path.resolve() + '/public/logs/';

        //今日日付を取得
        var dt = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
        var y = dt.getFullYear();
        var m = ('0' + (dt.getMonth() + 1)).slice(-2);
        var d = ('0' + dt.getDate()).slice(-2);
        var h = ('0' + dt.getHours()).slice(-2);
        var mi = ('0' + dt.getMinutes()).slice(-2);
        var s = ('0' + dt.getSeconds()).slice(-2);        

        //書き込みファイルパスを決定
        var fullFilePath = folderPath + y + m + d + ".txt"

        //書き込み文字を追加
        var writeData = "Date=> " + y + m + d + ":" + h + mi + s + " User=> " + user + " Data=> " + data + "\n"

        try{
            //フラグ指定(a=追加モード:ファイルが存在しない場合新規作成)
            fs.appendFileSync(fullFilePath, writeData, {flag: "a"});
            resolve();
        } catch(e) {
            reject();
        }
    })
};

exports.selectNeDb = function(sql){
    return new Promise(function(resolve, reject) {
        let checkPass;
        try{
            db.find({ username: sql }, (error, docs) => {
                console.error(docs);
                if (docs.length){
                    checkPass = docs[0].password;
                    resolve(checkPass);
                } else {
                    resolve('NotData');
                }
            });
        } catch(e) {
            reject();
        }
    })
};

exports.insertNeDb = function(sql){
    return new Promise(function(resolve, reject) {
        let checkPass;
        try{
            db.insert({username:"test2",password:345});

            resolve();
        } catch(e) {
            reject();
        }
    })
};