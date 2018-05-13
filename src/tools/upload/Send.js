import utils from '../../utils';
import options from '../../options';
import Files from './Files';
import Logo from './Logo';
import Local from './Local';

const field = options.upload.field,
    path = options.upload.path,
    xhr = new XMLHttpRequest(),
    defaultRes = {code: 1, message:''};

let formData, key, items;

xhr.responseType = 'json';

xhr.on('loadstart', ()=>{
    items[key].tick = '已上传...0%';
});

xhr.upload.on('progress', (e)=>{
    if(e.total>0 && e.loaded > 0){
        items[key].tick = '已上传... '+(Math.round(10000*e.loaded/e.total)/100)+' %';
    }else{
        items[key].tick = '已上传...0%';
    }
});
xhr.on('timeout', ()=>{
    defaultRes.message = '连接超时！';
});
xhr.on('abort', ()=>{
    defaultRes.message = '已经删除文件并终止上传！';
});
xhr.on('loadend', ()=>{
    let res = xhr.response;
    if(!res){
        utils.dialog({
            type: 'warning',
            title: '上传失败',
            body: '服务器无回应或回应的数据格式错误，需要技术人员检查。',
            css: 'max-width:360px;',
        });
        items[key].tick = '等待上传...';
    }else{
        if(res.code > 0){
            utils.dialog({
                type: 'warning',
                title: '上传失败',
                body: res.message,
                css: 'max-width:360px;',
            });
            items[key].tick = '等待上传...';
        }else{
            let tmp = items[key].el;
            tmp.id = 're' + res.data.resid;
            tmp.addClass('re-upload-loaded');
            tmp.attr('data-re-src', res.data.url);

            items[key].url = res.data.url;

            items[key].tick = '上传于：'+(new Date(res.data.date).format('Y-M-D H:I:S'));

            Logo.remove(key);
            Files.remove(key);

            Local.add(res.data);

            recursion(Object.keys(Files.items)[0]);
        }
    }
});

function recursion(id){
    if(!id) return;
    Send.curid = key = id;
    formData = new FormData();
    formData.append(field, Files.items[id]);
    formData.append('subid', id);
    // document.getElementById(id+'-form').elements.each(el=>{
    //     formData.append(el.name, el.value);
    // });
    xhr.open('post', path+'?Reditor=upload', true);
    xhr.send(formData);
}

const Send = {
    curid: null,
    start(args){
        items = args.items;
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