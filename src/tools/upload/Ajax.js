//处理开始上传
import utils from "../../utils";
let xhr = new XMLHttpRequest(),
    status = 1,
    opt,
    Ajax;

//上传进度弹窗配置
opt = {
    type: -1,
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
    send(type, path, bool = true) {
        status = 0;
        opt.title = '准备就绪';
        opt.body = '准备就绪，马上开始！';
        opt.no = '取消';
        utils.dialog(opt);
        if(utils.isEmpty(this.files)) {
            opt.title = '操作失败';
            opt.body = '空文件夹，无法提交！';
            opt.no = '关闭';
            status = 3;
            if(typeof Ajax.catch === 'function') Ajax.catch(status);
            return;
        }

        let fd = new FormData(), file;
        for(let k in this.files){
            file = this.files[k];
            fd.append(k, file.file);
            fd.append(k, JSON.stringify(file.query));
        }
        xhr.open(type, path, bool);
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
    status = 0;
    opt.title = '上传成功';
    opt.body = '上传成功！';
});
//处理上传失败
xhr.on('error', ()=>{
    status = 1;
    opt.title = '上传失败';
    opt.body = '网络连接失败';
});
//处理上传超时
xhr.on('timeout', ()=>{
    status = 2;
    opt.title = '上传超时';
    opt.body = '上传超时！可能网络原因，稍后重试！';
});
//处理上传结果
xhr.on('loadend', ()=>{
    if(status === 0){
        if(typeof Ajax.then === 'function'){
            Ajax.then(xhr.response, xhr.status, xhr);
            opt.no = '完成';
        }
    }else{
        if(typeof Ajax.catch === 'function') {
            Ajax.catch(status);
            opt.no = '关闭';
        }
    }
});

export default Ajax;