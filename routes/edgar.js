const { json } = require('express');
var express = require('express');
var router = express.Router();
var https = require('https');

//var fetch2 = require('node-fetch');

router.get('/', function(req, res, next) {
    res.render('edgar', { title: 'edgar' });
});

/* GET home page. */
router.get('/aaaaa', function(req, res, next) {
    /*
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Custom-Header'
    )
    */

    async function main() {
        const fs = require('fs');

        const jsonObject = await JSON.parse(fs.readFileSync('./kabu.json', 'utf8'));

        var a = jsonObject['facts']['us-gaap']['Assets']['units']['USD']
        var b = jsonObject['facts']['us-gaap']['Cash']['units']['USD']
        const result = []
    
        result.push(a);
        result.push(b);


        // モジュールロード
        
        

    // ダウンロード先URLを指定する
    var url2 = 'https://www.sec.gov/files/company_tickers.json';
    //url = 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json';
    
    var options2 = {
        url: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            'User-Agent': 'Node/14.17',
            "Accept-Encoding": "gzip, deflate",
            Host: "www.sec.gov",
        },
        method: 'GET',
      };

      //大事なのはhostnameの'data.sec.gov'　←ここのdata.sec.gov なのか www.sec.govなのか
      //一覧のCIKのやつはwwwになってて、ほしいデータはdataになってたので、そのせいでエラーになってた
      //修正箇所は、hostname と Hostの2箇所になるので注意
      var options = {
        hostname: 'data.sec.gov',
        //port: 443,
        path: 'https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json',
        headers: {
            'User-Agent': 'Node/14.17',
            "Accept-Encoding": "*",
            Host: "data.sec.gov",
        }
      };

      options.agent = new https.Agent(options);
/*
      var opt = {
        headers: {
            'user-agent': 'Node/14.17',
            "Accept-Encoding": "*",
            Host: "www.sec.gov",
        }
      };

      
    fetch2('https://www.sec.gov/files/company_tickers.json', {opt})
      .then(res => {
        if (!res.ok) {
          // 200 系以外のレスポンスはエラーとして処理
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      // これがレスポンス本文のテキスト
      .then(text => console.log(text))
      // エラーはここでまとめて処理
      .catch(err => console.error(err));
*/

    // ダウンロードする
    var rss = ''; 
    var req = https.get(options, function (res) {
        
        // テキストファイルの場合は、エンコード指定は重要！
        res.setEncoding('utf8');

        // データを受け取るたびに、文字列を追加
        res.on('data', function (xml) {
            rss += xml;
        });

        // ファイルのダウンロードが終わるとendイベントが呼ばれる
        res.on('end', function () {
            console.log('finish loading rss feed.');
        }); 
    });


/*
      jsonObject.list.forEach((obj) => {
          result[obj.id] = obj;
      });
      */

      res.render('edgar', { title: 'edgar' });
    }

    main();
});

router.post('/getList', function(req, res, next) {
    var seaKey = req.body["inputKey"];

    async function main() {
        //大事なのはhostnameの'data.sec.gov'　←ここのdata.sec.gov なのか www.sec.govなのか
        //一覧のCIKのやつはwwwになってて、ほしいデータはdataになってたので、そのせいでエラーになってた
        //修正箇所は、hostname と Hostの2箇所になるので注意
        var options = {
            hostname: 'www.sec.gov',
            //port: 443,
            path: 'https://www.sec.gov/files/company_tickers.json',
            headers: {
                'User-Agent': 'Node/14.17',
                "Accept-Encoding": "*",
                Host: "www.sec.gov",
            }
        };

        options.agent = new https.Agent(options);

        // ダウンロードする
        var rss = ''; 
        var req = https.get(options, function (resData) {
            // テキストファイルの場合は、エンコード指定は重要！
            resData.setEncoding('utf8');

            // データを受け取るたびに、文字列を追加
            resData.on('data', function (xml) {
                rss += xml;
            });

            // ファイルのダウンロードが終わるとendイベントが呼ばれる
            resData.on('end', function () {
                console.log('finish loading rss feed.');
                
                var rrr = JSON.parse(rss);

                var result = {};

                result[0] = '';

                var keyCount = 1;

                //var seaKey = 'AP';

                seaKey = seaKey.toUpperCase();

                for(var key of Object.keys(rrr)){
                    // 連想配列のキーと配列の値が一致するか検索
                    if(rrr[key].title.toUpperCase().search(seaKey) > -1){
                    //if(rrr[key].title.toUpperCase().search(seaKey)){
                        result[keyCount] = rrr[key]; // 連想配列に格納
                        keyCount++;
                        //break;
                    }
                }

                //var first_airport = rrr.find((v) => v.ticker == "AAPL");

                res.json(result);
            }); 
        });
    }

    main();
    
});

router.post('/getCompany', function(req, res, next) {
    var cikKey = req.body["cik"];

    var l = cikKey.toString().length;
    var e = 10 - l;

    for (i = 0; i < e; i++) {
        cikKey = '0' + cikKey;
    }

    //https://data.sec.gov/api/xbrl/companyconcept/CIK0000320193/us-gaap/CashAndCashEquivalentsAtCarryingValue.json
    var myPath = 'https://data.sec.gov/api/xbrl/companyfacts/CIK' + cikKey + '.json'
    //myPath = 'https://data.sec.gov/api/xbrl/companyconcept/CIK' + cikKey + '/us-gaap/CashAndCashEquivalentsAtCarryingValue.json'

    async function main() {
        //大事なのはhostnameの'data.sec.gov'　←ここのdata.sec.gov なのか www.sec.govなのか
        //一覧のCIKのやつはwwwになってて、ほしいデータはdataになってたので、そのせいでエラーになってた
        //修正箇所は、hostname と Hostの2箇所になるので注意
        var options = {
            hostname: 'data.sec.gov',
            //port: 443,
            path: myPath,
            headers: {
                'User-Agent': 'Node/14.17',
                "Accept-Encoding": "*",
                Host: "data.sec.gov",
            }
        };

        options.agent = new https.Agent(options);

        // ダウンロードする
        var rss = ''; 
        var req = https.get(options, function (resData) {
            if (resData.statusCode == '200') {
                // テキストファイルの場合は、エンコード指定は重要！
                resData.setEncoding('utf8');

                // データを受け取るたびに、文字列を追加
                resData.on('data', function (xml) {
                    rss += xml;
                });

                // ファイルのダウンロードが終わるとendイベントが呼ばれる
                resData.on('end', function () {
                    console.log('finish loading rss feed.');
                    
                    var rrr = JSON.parse(rss);

                    var rtJsonList = {};

                    var assets;
                    var netIncome;

                    try {
                        //資産
                        var assets = rrr['facts']['us-gaap']['Assets']['units']['USD']
                        //当期純利益
                        var netIncome = rrr['facts']['us-gaap']['NetIncomeLoss']['units']['USD']
                        //売上
                        var uriage = rrr['facts']['us-gaap']['RevenueFromContractWithCustomerExcludingAssessedTax']['units']['USD']
                        //営業利益
                        var operatingIncomeLoss = rrr['facts']['us-gaap']['OperatingIncomeLoss']['units']['USD']

                        if (!assets) {
                            //CNYが何かわからないので、エラー処理として現状は処理する
                            rtJsonList.Not = '{data : NotFoundDayo}'
                            //assets = rrr['facts']['us-gaap']['Assets']['units']['CNY']
                            //netIncome = rrr['facts']['us-gaap']['NetIncomeLoss']['units']['CNY']
                        }
                        else {
                            rtJsonList.Assets = assets;
                            rtJsonList.NetIncomeLoss = netIncome;
                            rtJsonList.uriage = uriage;
                            rtJsonList.operatingIncomeLoss = operatingIncomeLoss;
                        }
                    } catch (error) {
                        rtJsonList.Not = '{data : NotFoundDayo}'
                    }

                    res.json(rtJsonList);
                }); 
            }
            else {
                //res.status(resData.statusCode);
                //res.send('error');

                res.status(200);
                //res.send('OK')
                var rtJsonList = {};
                rtJsonList.Not = '{data : NotFoundDayo}'
                res.json(rtJsonList);
            }
        });
    }

    main();
    
});

module.exports = router;
