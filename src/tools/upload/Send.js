import utils from '../../utils';
import options from '../../options';
import Files from './Files';
import Logo from './Logo';

const field = options.upload.field,
    path = options.upload.path,
    xhr = new XMLHttpRequest();

let formData, keys, index, progress;

xhr.on('loadstart', ()=>{
    progress = document.getElementById(keys[index]+'-tick');
    progress.addClass('active');
    progress.innerText = '已上传...0%';
});

xhr.upload.on('progress', (e)=>{
    if(e.total>0 && e.loaded > 0){
        progress.innerText = '已上传... '+(Math.round(10000*e.loaded/e.total)/100)+' %';
    }else{
        progress.innerText = '已上传...0%';
    }
});
xhr.on('loadend', ()=>{
    try{
        let data = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
        if(data.code > 0){
            utils.dialog({
                type: 'warning',
                title: '上传失败',
                body: '服务回应失败消息：' + data.message,
                css: 'max-width:360px;',
            });
        }else{
            Files.remove(keys[index]);
            Logo.remove(keys[index]);
            index++;
            if(keys[index]){
                recursion(keys[index]);
            }
        }
    }catch (err){
        utils.dialog({
            type: 'warning',
            title: '上传失败',
            body: '连接失败或响应的数据错误',
            css: 'max-width:360px;',
        });
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