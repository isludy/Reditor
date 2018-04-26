//处理开始上传
import utils from "../../utils";
let xhr = new XMLHttpRequest(),
    status = 1,
    opt,
    Ajax;

//上传进度弹窗配置
opt = {
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
};

Ajax = {
    files: Object.create(null),
    delete(id = ''){
        if(id){
            delete this.files[id];
        }else{
            for(let k in this.files)
                delete this.files[k];
        }
    },
    send(path) {
        status = 0;
        opt.title = '准备就绪';
        opt.body = '准备就绪，马上开始！';
        opt.no = '取消';
        utils.dialog(opt);

        let fd = new FormData(), file;
        for(let k in this.files){
            file = this.files[k];
            fd.append(k, file.file);
            fd.append(k, JSON.stringify(file.query));
        }
        xhr.open('post', path+'?Reditor=upload', true);
        xhr.send(fd);
    },
    stop(){
        try{
            xhr.abort();
        }catch (err){}
    },
    then: null,
    catch: null
};

xhr.on('loadstart', ()=>{
    status = 0;
    opt.title = '上传中';
    opt.body = '正在拼了老命的上传中...0%';
    opt.no = '取消';
});
//处理上传进度
xhr.upload.on('progress',e=>{
    if(e.total>0 && e.loaded > 0)
        opt.body = '正在拼了老命的上传中...'+Math.round(10000*e.loaded/e.total)/100+'%';
});
//处理上传成功
xhr.on('load', ()=>{
    try{
        let data = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
        if(data.code > 0){
            status = 3;
            opt.title = '上传失败';
            opt.body = '失败消息：' + data.msg;
        }else{
            opt.title = '上传成功';
            opt.body = '上传成功！';
            opt.no = '完成';
            if(typeof Ajax.then === 'function')
                Ajax.then(data, xhr.status, xhr);
        }
    }catch (err){
        status = 3;
        opt.title = '失败';
        opt.body = '失败！响应的数据错误。消息：'+err.message;
    }
});
//处理上传失败
xhr.on('error', ()=>{
    status = 1;
    opt.title = '请求失败';
    opt.body = '连接失败，请求发生错误。';
});
//处理上传超时
xhr.on('timeout', ()=>{
    status = 2;
    opt.title = '请求超时';
    opt.body = '请求超时！可能网络原因，稍后重试！';
});
//处理上传结果
xhr.on('loadend', ()=>{
    if(status > 0){
        if(typeof Ajax.catch === 'function')
            Ajax.catch(status);
        opt.no = '关闭';
    }
});

export default Ajax;