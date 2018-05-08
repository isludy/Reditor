import utils from '../../utils';
import options from '../../options';
import Files from './Files';
import Logo from './Logo';
import Local from './Local';

const field = options.upload.field,
    path = options.upload.path,
    xhr = new XMLHttpRequest(),
    defaultRes = {code: 1, message:''};

let formData, key, tick;

xhr.on('loadstart', ()=>{
    tick = document.getElementById(key+'-tick');
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
xhr.on('timeout', ()=>{
    defaultRes.message = '连接超时！';
});
xhr.on('abort', ()=>{
    defaultRes.message = '已经删除文件并终止上传！';
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
        tick.innerText = '等待上传...';
    }else if(res.code > 0){
        utils.dialog({
            type: 'warning',
            title: '上传失败',
            body: res.message,
            css: 'max-width:360px;',
        });
        tick.innerText = '等待上传...';
    }else{
        let tmp = document.getElementById(key);
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

        document.getElementById(key+'-form').id = 're' + res.data.resid + '-form';

        Logo.remove(key);
        Files.remove(key);

        Local.add(res.data);

        recursion(Object.keys(Files.items)[0]);
    }
});

function recursion(id){
    if(!id) return;
    Send.curid = key = id;
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
    curid: null,
    start(){
        Logo.compose(files=>{
            for(let k in files){
                Files.items[k].file = files[k];
            }
            files = null;
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
        });
    },
    stop(){
        xhr.abort();
    }
};

export default Send;