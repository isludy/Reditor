//处理开始上传
import utils from '../../utils';

const xhr = new XMLHttpRequest(),
    msg = {
        colorType: 'warning',
        overlay: true,
        yes: false,
        css: 'position: absolute;max-width:360px;',
        oncancel(){
            xhr.abort();
        },
        onclose(){
            xhr.abort();
        }
    },
    Send = {
        send(formData,path) {
            msg.title = '准备就绪';
            msg.body = '准备就绪，马上开始！';
            msg.no = '取消';
            utils.dialog(msg);
            xhr.open('post', path+'?Reditor=upload', true);
            xhr.send(formData);
        },
        stop(){
            try{
                xhr.abort();
            }catch (err){}
        }
    };

let percent = 0;

xhr.on('loadstart', ()=>{
    msg.title = '上传中';
    msg.body = '正在拼了老命的上传中...0%';
    msg.no = '取消';
});

xhr.upload.on('progress',e=>{
    if(e.total>0 && e.loaded > 0){
        percent = Math.round(10000*e.loaded/e.total)/100;
    }else{
        percent = 0;
    }
    msg.body = '正在拼了老命的上传中...'+percent+'%';
});

xhr.on('error', ()=>{
    msg.title = '请求失败';
    msg.body = '连接失败，请求发生错误。';
});

xhr.on('timeout', ()=>{
    msg.title = '请求超时';
    msg.body = '请求超时！可能网络原因，稍后重试！';
});

xhr.on('loadend', ()=>{
    try{
        let data = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
        if(data.code > 0){
            msg.title = '上传失败';
            msg.body = '失败消息：' + data.message;
        }else{
            msg.title = '上传成功';
            msg.body = '上传成功！';
            msg.no = '完成';
        }
    }catch (err){
        msg.title = '失败';
        msg.body = '失败！响应的数据错误。消息：'+err.message;
    }
});

export default Send;