//video要素を取得
let videoBarcode = document.getElementById('videoBarcode');

//preview要素を取得
let prev = document.getElementById("barPreview");
let prev_ctx = prev.getContext("2d");

// バーコード読み取り用の仮想canvasを生成
//const tmp = document.getElementById("tmp");
let tmp = document.createElement('canvas');
let tmp_ctx = tmp.getContext("2d");

//scanループ用の変数
let intervalHandler;

//画面上の表示サイズの縮小倍率を指定
let resizeNum = 2;

//読み込み成功回数制御
var DetectedCount = 0;
var DetectedCode = "";

//各種変数
var w,h,mw,mh,x1,y1;

let jan = document.getElementById("jan");

/**
 * バーコードスキャンを行う
 */
function scanBarcode() {
    //カメラ使用の許可ダイアログが表示される
    navigator.mediaDevices.getUserMedia(
        //マイクはオフ, カメラの設定   背面カメラを希望する 640×480を希望する
        {"audio":false,
            "video":{
                    "facingMode":"environment",
                    "width":{"ideal":640},
                    "height":{"ideal":480},
                    //"frameRate": { ideal: 5, max: 15 }
                    }
    }).then(function(stream){
        //許可された場合
        videoBarcode.srcObject = stream;

        //この呼び出し方が重要video.playはここから再開する
        videoBarcode.onloadedmetadata = (e) => {
            videoBarcode.play();
            
            setTimeout(() => {
                //画面サイズを制御する
                setElement();

                //カメラを取得して画面のサイズの制御が完了したので、以下の要素を表示する
                document.getElementById("barWrapper").style.display = "inline-block";
                document.getElementById("videoBarcode").style.display = "inline-block";
                document.getElementById("barPreview").style.display = "inline-block";
                document.getElementById("offButton").style.display = "inline-block";

                //スキャン開始
                Scan();
            }, 500);
        };

    }).catch(function(err){
        //許可されなかった場合
        alert('カメラが使用できないため、読み取り処理はできません。')
    });
}

//画面要素の制御
function setElement(){
    //選択された幅高さ
    w = videoBarcode.videoWidth;
    h = videoBarcode.videoHeight;

    //画面上の表示サイズ
    //prev.style.width=(w / resizeNum) -3 + "px";
    //prev.style.height=(h / resizeNum) -3 + "px";

    //video部分を後から再設定
    //videoBarcode.style.width = (w / resizeNum) -3 + "px"
    //videoBarcode.style.height = (h / resizeNum) -3 + "px"

    //外枠divのサイズを合わせる
    document.getElementById("barWrapper").style.width = (w / resizeNum) + "px"
    document.getElementById("barWrapper").style.height = (h / resizeNum) + "px"
    //閉じるボタンを映像部いっぱいに広げたければコメントイン
    //document.getElementById("offButton").style.width = (w / resizeNum) + "px"

    //内部のキャンバスサイズ(線を引くなどの処理や解析などはこのサイズで行われる)
    prev.setAttribute("width", w);
    prev.setAttribute("height", h);
    mw = w * 0.8; //元は0.5 0.9だと認識できてない？
    mh = h * 0.2; //元はh じゃなくて w だったはず
    x1 = (w - mw) / 2;
    y1 = (h - mh) / 3; //元は2
}

function Scan() {
    intervalHandler = setInterval(() => {
        // videoの映像をcanvasにそのまま描画
        prev_ctx.drawImage(videoBarcode, 0, 0, w, h);

        // 描画されたcanvasに読み取り部分(赤枠)を描画
        prev_ctx.beginPath();
        prev_ctx.strokeStyle="rgb(255,0,0)";
        prev_ctx.lineWidth = 5; //2だとresizeNumを4以上にした時に何か重なって？表示されなくなる
        prev_ctx.rect(x1, y1, mw, mh);
        //prev_ctx.rect(x1-20,y1-20,mw-50,mh-50);
        //prev_ctx.rect(64,176,400,300);
        //prev_ctx.rect(50,50,14,100);
        prev_ctx.stroke();

        // canvas(barcode読み取り用)のサイズを設定
        tmp.setAttribute("width", mw);
        tmp.setAttribute("height", mh);
        tmp_ctx.drawImage(prev, x1, y1, mw, mh, 0, 0, mw, mh);

        tmp.toBlob(function(blob){
            let reader = new FileReader();
            reader.onload=function(){
                let config={
                        decoder: {
                            // 規格の指定
                            readers: ["code_128_reader","code_93_reader"],
                            // 同時に複数のバーコードを解析しない
                            multiple: false,
                        },
                        // 距離による大きさの制御？x-small, small, medium, large, x-large
                        // halfSample=true 検索時間短縮 制度下がる false 検索かかるけど制度上がる
                        locator:{patchSize:"large", halfSample:true},
                        locate:false,
                        //読み込んだ画像データ
                        src:reader.result, 
                    };
                // 画像解析処理
                Quagga.decodeSingle(config, function(){});
            }
            // DataURLとして読み込み
            reader.readAsDataURL(blob);
        });
    }, 100)
}

Quagga.onDetected(function (result) {
    //読み取り誤差が多いため、3回連続で同じ値だった場合に成功とする
    if (DetectedCode == result.codeResult.code) {
        DetectedCount++;
    } else {
        DetectedCount = 0;
        DetectedCode = result.codeResult.code;
    }
    if (DetectedCount>=2) {
        //読み取り成功の場合
        //alert(result.codeResult.code);
        console.log(result.codeResult.code);
        
        jan.innerHTML=jan.innerHTML+'\n'+result.codeResult.code;
        jan.scrollTop=jan.scrollHeight;

        //初期化
        DetectedCode = '';
        DetectedCount = 0;

        //とりあえずここの2つコメントアウトすれば、再生は止まらないけど、読み込みは1回になる
        clearInterval(intervalHandler);
        videoBarcode.pause();
    }
});

/**
 * Videoを再び再生する
 */
 function startCamera(){
    prev_ctx.clearRect(0, 0, prev_ctx.width, prev_ctx.height);
    videoBarcode.load();
    videoBarcode.play();
}