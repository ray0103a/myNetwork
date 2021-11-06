/*
 内　容：ServerURLを取得する
 引　数：なし
 戻り値：ServerURL
 */
 function getServerURL(){
    var serverURL;

    //serverURL = 'http://192.168.0.11:3000';
    //serverURL = 'https://test-heroku-34819.herokuapp.com';
    serverURL = location.protocol + '//' + location.host

    return serverURL;
}

function sqlSelect(url,params) {
    return new Promise(function(resolve, reject) {
        fetchSendArrayGetJSON(url,params).then(function(data){
            resolve(data);
        });
    });

}

function fetchSendArrayGetJSON(url,params) {
    return new Promise(function(resolve, reject) {
        var jsonData;

        fetch(url,
            {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json'
                            },
                body: JSON.stringify(params)
            })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                } else {
                    alert('エラー(001)が発生しました。管理者に連絡してください。');
                    throw new Error();
                }
            })
            .then(json => {
                //データを返却する
                resolve(json);
            })         
            .catch(function (error) {
                alert(error);
                reject();
            });
    });
}