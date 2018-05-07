import utils from '../../utils';
import options from '../../options';
import Files from './Files';
import Logo from './Logo';
import Local from './Local';

const field = options.upload.field,
    path = options.upload.path,
    xhr = new XMLHttpRequest(),
    defaultRes = {code: 1};

let formData, keys, index, tick;

xhr.on('loadstart', ()=>{
    tick = document.getElementById(keys[index]+'-tick');
    tick.addClass('active');
    tick.innerText = '已上传...0%';
});

xhr.upload.on('progress', (e)=>{
    if(e.total>0 && e.loaded > 0){
        tick.innerText = '已上传... '+(Math.round(10000*e.loaded/e.total)/100)+' %';
    }else{
        tick.innerText = '已上传...0%';
    }
});
xhr.on('loadend', ()=>{
    let res;
    try{
       res = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
    }catch(err){
        res = defaultRes;
    }

    if(!res.hasOwnProperty('code')){
        utils.dialog({
            type: 'warning',
            title: '上传失败',
            body: '服务器回应的数据格式错误，需要技术人员检查。',
            css: 'max-width:360px;',
        });
    }else if(res.code > 0){
        utils.dialog({
            type: 'warning',
            title: '上传失败',
            body: '服务器回应消息：' + res.message,
            css: 'max-width:360px;',
        });
    }else{
        let tmp = document.getElementById(keys[index]);
        tmp.id = 're' + res.data.resid;
        tmp.addClass('re-upload-loaded');
        tmp.attr('data-re-src', res.data.url);
        tmp = tmp.querySelector('.re-upload-item-media');
        if(/video/i.test(tmp.tagName)){
            tmp.src = res.data.url;
        }else if(!tmp.hasClass('noview')){
            tmp.style.backgroundImage = 'url('+res.data.url+')';
        }

        tick.id = 're' + res.data.resid + '-tick';
        tick.innerText = '上传于：'+(new Date(res.data.date).format('Y-M-D H:I:S'));

        document.getElementById(keys[index]+'-form').id = 're' + res.data.resid + '-form';

        Logo.remove(keys[index]);
        Files.remove(keys[index]);

        Local.add(res.data);

        index++;
        if(keys[index]) recursion(keys[index]);
    }
});

function recursion(id){
    formData = new FormData();
    formData.append(field, Files.items[id].file);
    formData.append('subid', id);
    document.getElementById(id+'-form').elements.each(el=>{
        formData.append(el.name, el.value);
    });
    xhr.open('post', path+'?Reditor=upload', true);
    xhr.send(formData);
}

const Send = {
    start(){
        Logo.compose(files=>{
            for(let k in files){
                Files.items[k].file = files[k];
            }
            files = null;
            keys = Object.keys(Files.items);
            index = 0;
            if(keys[index]){
                recursion(keys[index]);
            }else{
                utils.dialog({
                    type: 'warning',
                    title: '空文件夹',
                    body: '空文件夹，请添加文件',
                    css: 'max-width:360px;',
                });
            }
        });
    },
    stop(){
        xhr.abort();
    }
};

export default Send;