//处理开始上传
import utils from "../../utils";
let formData = new FormData(),
    xhr = new XMLHttpRequest(),
    status = 0;
xhr.on('loadstart', ()=>{
    status = 1;
});
//处理上传进度
xhr.upload.on('progress',e=>{
    // console.log(e.total,e.loaded);
});
//处理上传成功
xhr.on('load', ()=>{
    console.log('ok:'+xhr.response);
});
//处理上传失败
xhr.on('error', ()=>{
    utils.dialog({
        title: '上传失败',
        css: 'max-width: 320px',
        body: '网络连接失败',
        type: 1
    });
});
//处理取消上传
xhr.on('abort', ()=>{
    utils.dialog({
        title: '上传取消',
        css: 'max-width: 320px',
        body: '上传已被取消！',
        type: 1
    });
});
//处理上传超时
xhr.on('timeout', ()=>{
    utils.dialog({
        title: '上传超时',
        css: 'max-width: 320px',
        body: '上传超时！可能网络原因，稍后重试！',
        type: 1
    });
});
//处理上传结果
xhr.on('loadend', ()=>{
    status = 0;
    console.log('end')
});

export {xhr, formData}