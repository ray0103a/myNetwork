
let qrplayer = document.getElementById('qrplayer');
let qrCanvas = document.getElementById('qrCanvas');
let width = qrCanvas.width;
let height = qrCanvas.height;
const canvasContext = qrCanvas.getContext("2d");

/**
 * 引数(formdata)を送信する
 */
function scanQRcode() {
    navigator.mediaDevices.getUserMedia({
        video: {facingMode: "environment", width: width, height: height},
        audio: false
    })
    .then(function(stream) {
        // デバッグ用
        let currentTrack;
        stream.getVideoTracks().forEach(track => {
        if (track.readyState == 'live') {
            currentTrack = track;
            return;
        }
        });
        let settings = currentTrack.getSettings();
        let setA = currentTrack.getCapabilities();
        let width = settings.width;
        let height = settings.height;
        // ここまでデバッグ用

        qrplayer.srcObject = stream

        qrplayer.onloadedmetadata = (e) => {
            qrplayer.play();
            
            // QRコードのチェック開始
            checkPicture();
        };
    })
    .catch(function(err) {
        alert('Error!!')
    }) 

    function checkPicture(){
        // 500ms間隔でスナップショットを取得し、QRコードの読み取りを行う
        let intervalHandler = setInterval(() => {
            // 取得している動画をCanvasに描画
            canvasContext.drawImage(qrplayer, 0, 0, width, height);

            // Canvasからデータを取得
            const imageData = canvasContext.getImageData(0, 0, width, height);

            // jsQRにデータを渡して解析
            const scanResult = jsQR(imageData.data, imageData.width, imageData.height);

            if (scanResult) {
                // 繰り返し処理の終了を設定
                clearInterval(intervalHandler);
                console.log(scanResult);

                var splitWord = ",";
                var array_suuji = scanResult.data;

                // 見つかった箇所に線を引く
                drawLine(canvasContext, scanResult.location); 
                
                // Videoとcanvasを入れ替える
                qrCanvas.style.display = 'block';
                qrplayer.style.display = 'none';
                qrplayer.pause();   

                let jan = document.getElementById("jan");
                jan.innerHTML=jan.innerHTML+'\n'+array_suuji;
                jan.scrollTop=jan.scrollHeight;

                // モーダルウィンドウを表示
                var modal = document.getElementById('modal');
                modal.style.display = 'block';
                document.querySelector('#js-result').innerText = array_suuji
                document.querySelector('#js-link').setAttribute('href', array_suuji)
            }
        }, 100)
    }
}

/**
 * Videoを再び再生する
 */
function startCamera(){
    canvasContext.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    qrplayer.load();
    qrplayer.play();
    //checkPicture();
}

/**
 * 発見されたQRコードに線を引く
 *
 * @param {Object} ctx
 * @param {Object} pos
 * @param {Object} options
 * @return {void}
 */
function drawLine(ctx, pos, options={color:"blue", size:5}){
    // 線のスタイル設定
    ctx.strokeStyle = options.color;
    ctx.lineWidth   = options.size;

    // 線を描く
    ctx.beginPath();
    ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上からスタート
    ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);       // 右上
    ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y); // 右下
    ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);   // 左下
    ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上に戻る
    ctx.stroke();
}