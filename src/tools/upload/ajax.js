//处理开始上传
import utils from "../../utils";
let xhr = new XMLHttpRequest(),
    files = [],
    status = 1,
    opt,
    ajax;

//上传进度弹窗配置
opt = {
    type: -1,
    css: 'position: absolute;max-width:320px;',
    oncancel(){
        xhr.abort();
    },
    onclose(){
        xhr.abort();
    }
};

ajax = {
    append(n, v){
        files.push({
            field: n,
            val: {file: v},
        });
    },
    delete(n = ''){
        let len=files.length;
        if(n){
            for(; len--;){
                if(files[len].field === n){
                    files.splice(len, 1);
                    break;
                }
            }
        }else{
            files.splice(0, len);
        }
    },
    set(field, n, v){
        let len=files.length;
        for(; len--;){
            if(files[len].field === field){
                files[len].val[n] = v;
                break;
            }
        }
    },
    get(field, n){
        let len=files.length;
        for(; len--;){
            if(files[len].field === field){
                if(n)
                    return files[len].val[n];
                return files[len];
            }
        }
    },
    send(type, path, bool = true) {
        status = 0;
        opt.title = '准备就绪';
        opt.body = '准备就绪，马上开始！';
        utils.dialog(opt);
        if(!files.length) {
            opt.title = '操作失败';
            opt.body = '空文件夹，无法提交！';
            opt.no = '关闭';
            status = 3;
            if(typeof this.catch === 'function')
                this.catch(status);
            return;
        }
        let fd = new FormData(), query;
        files.forEach(item=>{
            fd.append(item.field, item.val['file']);
            query = [];
            for(let n in item.val){
                if(n !== 'file')
                    query.push('"'+n+'":"'+item.val[n]+'"');
            }
            fd.append(item.field,'{'+query.join(',')+'}');
            query = null;
        });
        xhr.open(type, path, bool);
        xhr.send(fd);
    },
    stop(){
        try{
            xhr.abort();
        }catch (err){}
    }
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
    if(typeof ajax.then === 'function')
        ajax.then(xhr.response, xhr);
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
    opt.no = '完成';
    console.log(files);
    if(status > 0)
        if(typeof ajax.catch === 'function')
            ajax.catch(status);
});

export default ajax;