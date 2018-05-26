import utils from '../../utils';
import options from '../../options';
import re from '../../re';
import Files from './Files';
import Logo from './Logo';
import Thumb from './Thumb';

const field = options.upload.field,
    path = options.upload.path,
    xhr = new XMLHttpRequest(),
    loading = re('<div class="re-loading"></div>');

let formData, key, Items, errorMsg;

xhr.on = xhr.addEventListener;
xhr.upload.on = xhr.upload.addEventListener;

xhr.responseType = 'json';

xhr.on('loadstart', ()=>{
    errorMsg = '';
    Items.items[key].tick = '已上传...0%';
});

xhr.upload.on('progress', (e)=>{
    if(e.total>0 && e.loaded > 0){
        Items.items[key].tick = '已上传... '+(Math.round(10000*e.loaded/e.total)/100)+' %';
    }else{
        Items.items[key].tick = '已上传...0%';
    }
});
xhr.on('timeout', ()=>{
    errorMsg = '连接超时！';
});
xhr.on('abort', ()=>{
    errorMsg = '删除文件，已终止上传！';
});
xhr.on('loadend', ()=>{
    let res = xhr.response;
    if(res && res.code === 0 && res.data){
        Items.items[key].status = 0;
        Items.items[key].selected = true;
        Items.items[key].url = res.data.url;
        Items.items[key].tick = '上传于：'+(new Date(res.data.date).format('Y-M-D H:I:S'));

        Logo.remove(key);
        Files.remove(key);

        if(/^image/i.test(Items.items[key].type)){
            let img = new Image();
            Items.items[key].el.find('.re-upload-item-preview').append(loading);
            img.onload = function(){
                loading.remove();
                img = img.onload = null;
            };
            img.src = res.data.url;
        }
        if(res.data.thumb){
            Items.items[key].el.find('video').attr('poster', res.data.thumb);
        }

        recursion(Object.keys(Files.items)[0]);
    }else{
        if(!res || !res.hasOwnProperty('code') || !res.data){
            utils.dialog({
                type: 'warning',
                title: '上传失败',
                body: errorMsg || '服务器无响应或响应的数据格式错误。',
                css: 'max-width:360px;',
            });
        }else if(res.code > 0){
            utils.dialog({
                type: 'warning',
                title: '上传失败',
                body: '来自服务器的错误提示：'+res.message,
                css: 'max-width:360px;',
            });
        }
        Items.items[key].tick = '<b>等待上传...</b>';
    }
});

function recursion(id){
    if(!id) return;
    //在上传进行中，如果删除项是正在上传的项，则立即中止上传，所以需要curid来提供给Items.js进行判断
    Send.curid = key = id;

    let hasThumb = false;
    formData = new FormData();

    formData.append(field, Files.items[id]);
    formData.append('subid', id);

    Items.form(id).each(input=>{
        if(/checkbox|radio/i.test(input.type)){
            formData.append(input.name, (input.checked ? 1 : ''));
            hasThumb = (/^(image|video)/i.test(Files.items[id].type) && input.name === 'thumb' && input.checked);
        }else
            formData.append(input.name, input.value);
    });

    if (hasThumb){
        Thumb(Items.items[id].type, Items.items[id].url, Items.items[id].el.find('video')).then(thumb=>{
            formData.append('thumb', thumb);
            startSend();
        }).catch((errmsg)=>{
            utils.dialog({
                type: 'warning',
                title: '上传失败',
                body: '生成缩略图失败。'+ (errmsg ? 'error: '+errmsg : ''),
                css: 'max-width:360px;',
            });
        });
    } else{
        startSend();
    }
}

function startSend(){
    xhr.open('post', path+'?Reditor=upload', true);
    xhr.send(formData);
}

const Send = {
    curid: null,
    start(items){
        Items = items;
        items = null;
        if(utils.isEmpty(Files.items)){
            utils.dialog({
                type: 'warning',
                title: '空文件夹',
                body: '空文件夹，请添加文件',
                css: 'max-width:360px;',
            });
        }else{
            recursion(Object.keys(Files.items)[0]);
        }
    },
    stop(){
        xhr.abort();
    }
};

export default Send;