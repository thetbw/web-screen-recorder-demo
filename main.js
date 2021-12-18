console.info("屏幕捕捉测试")


var mediaRecord //用于录制视频 
var mediaStream //视频流
var videoBuffer = [] //保存的视频数据

const startButton = document.getElementById('start-button')
const stopButton = document.getElementById('stop-button')
const downloadButton = document.getElementById('download-button')
const videoPreview = document.getElementById('preview')

stopButton.setAttribute("disabled", "disabled")
downloadButton.setAttribute("disabled", "disabled")

/**
 * 开始录屏
 */
async function startRecord() {
    if (!navigator.mediaDevices && !navigator.mediaDevices.getDisplayMedia){
        alert("当前浏览器不支持屏幕捕捉")
        return
    }
    reset()

    //获取视频流，这时候会弹出用户选择框，前提用户设备支持
    mediaStream = await navigator.mediaDevices.getDisplayMedia()
    mediaRecord = new MediaRecorder(mediaStream,{
        mimeType: 'video/webm;codecs=vp9',
        audioBitsPerSecond : 128000, //音频码率
        videoBitsPerSecond : 250000000, //视频码率
    })
    mediaRecord.ondataavailable = function(e){
        if (e.data.size > 0){
            console.info("视频数据可用",e)
            videoBuffer.push(e.data)
            downloadButton.removeAttribute("disabled")
        }
    }
    mediaRecord.start(1000) //每隔1s保存一下

    //视频预览
    videoPreview.srcObject = mediaStream

    stopButton.removeAttribute("disabled")
    startButton.setAttribute("disabled", "disabled")
}


function reset() {
    stopRecord()
    mediaRecord = null
    mediaStream = null
    videoBuffer = []
}


/**
 * 停止录制
 */
function stopRecord() {
    if (mediaStream){
        for (let track of mediaStream.getTracks()) {
            track.stop()
        }
    }
    mediaRecord && mediaRecord.state !== 'inactive' && mediaRecord.stop()
    startButton.removeAttribute("disabled")
}


function download() {
    console.log(videoBuffer)
    if (videoBuffer == null || videoBuffer.length == 0){
        alert("没有视频数据")
        return
    }
    let blob = new Blob(videoBuffer, {
        type: "video/webm"
    });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
}