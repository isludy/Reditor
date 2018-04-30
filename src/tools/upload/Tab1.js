//input type=file的change事件
import utils from "../../utils";
import Item from "./Item";
import options from '../../options';
import Logo from "./Logo";
import Ajax from "./Ajax";
import Status from "./Status";

import Files from "./Files";

class Tab1 extends Files{
    constructor(list){
        super();
    }
    render(){
        console.log(this.items);
    }
}
/*
const inputEl = document.createElement('input'),
    opt = options.upload,
    typeLimit = [],
    files = new Files(),
    Tab1 = {
        el: null,
        choser: null,
        upload: null,
        clear: null,
        init(list){
            this.el = list;
            this.choser = document.find('#re-upload-u-choser');
            this.upload = document.find('#re-upload-u-start');
            this.clear = document.find('#re-upload-u-clear');
            inputEl.on('change', changeHandler);
            this.choser.on('click', fireChoser);
            this.upload.on('click', fireUpload);
            this.clear.on('click', fireClear);
            Status.off(this.upload, this.clear);
        },
        destory(){
            inputEl.off('change', changeHandler);
            this.choser.off('click', fireChoser);
            this.upload.off('click', fireUpload);
            this.clear.off('click', fireClear);
        }
    };

inputEl.type = 'file';
inputEl.multiple = true;

//将支持的所有类型都加入到typeLimit
for(let type in opt.type){
    if(opt.type.hasOwnProperty(type)){
        opt.type[type].forEach(function(v){
            typeLimit.push(v);
        });
    }
}

//Files 监听 是否有文件
files.on(function(){
    if(utils.isEmpty(files.items)){
        Status.off(Tab1.upload, Tab1.clear);
    }else{
        Status.on(Tab1.upload, Tab1.clear);
    }
});

//删除时，将文件
Item.onremove(function(){
    files.remove(this.id);
});

//inputEl type=file 的change事件回调
function changeHandler(){
    let file, len, i = 0, ext, type, size, fragMent, id;
    len = inputEl.files.length;
    if (!len) return false;
    fragMent = document.createDocumentFragment();
    for (; i < len; i++) {
        file = inputEl.files[i];
        ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
        type = file.type.split(/\//g)[0];
        size = (file.size / 1048576).toFixed(2);//MB
        id = 're' + file.lastModified + file.size;
        //判断文件类型
        if (!typeLimit.includes(ext)) {
            utils.dialog({
                css: 'max-width: 360px;',
                title: '格式错误',
                colorType: 'danger',
                overlay: true,
                yes: false,
                no: false,
                body: `不支持“${ext}”，仅支持以下类型：
                            <ul>
                                <li>图片：${opt.type.image.join(', ')}</li>
                                <li>视频：${opt.type.video.join(', ')}</li>
                                <li>音频：${opt.type.audio.join(', ')}</li>
                                <li>其他：${opt.type.other.join(', ')}</li>
                            </ul>`
            });
            break;
        }
        //判断文件大小
        if (size > opt.size[type]) {
            utils.dialog({
                colorType: 'danger',
                overlay: true,
                css: 'max-width: 360px;',
                title: '文件大小超出',
                yes: false,
                no: false,
                body: `文件“${file.name}”大小（${size}MB）超出上限，文件大小上限详情如下：
                            <ul>
                                <li>图片：${opt.size.image}(MB)</li>
                                <li>视频：${opt.size.video}(MB)</li>
                                <li>音频：${opt.size.audio}(MB)</li>
                                <li>其他：${opt.size.other}(MB)</li>
                            </ul>`
            });
            break;
        }
        //判断相同的文件
        if (files.get(id)) {
            utils.dialog({
                colorType: 'danger',
                css: 'max-width: 360px;',
                overlay: true,
                title: '文件重复',
                yes: false,
                no: false,
                body: '文件“' + file.name + '”可能是重复的，请检查。'
            });
            break;
        }
        //生成html
        fragMent.appendChild(Item.create({
            id,
            type,
            ext,
            mime: file.type,
            src: window.createURL(file),
            desc: '',
            name: file.name,
            logo: opt.logo
        }));
        //添加数据，以备上传
        files.set(id, {file});
    }
    Tab1.el.append(fragMent);
    fragMent = null;
}

//【添加】按钮点击事件回调：触发inputEl的click事件
function fireChoser() {
    document.body.append(inputEl);
    inputEl.value = '';
    inputEl.click();
    inputEl.remove();
}

//【上传】按钮点击事件回调：发送ajax
function fireUpload() {
    if (utils.isEmpty(Ajax.files)) {
        utils.dialog({
            title: '操作失败',
            body: '空文件夹，无法提交！',
            no: '关闭',
            colorType: 'danger',
            css: 'max-width:360px;',
            yes: false,
            overlay: true
        });
        return;
    }
    //更新上传的数据
    console.log(files);

    Tab1.el.children.forEach(child => {
        files.get(child.id).query = {
            desc: child.find('.re-upload-textarea')[0].value
        };
    });
    //添加水印
    let logoImgs = Tab1.el.find('.re-upload-logo.active'),
        i = 0;

    function recursion(logoImg) {
        Logo.canvasFile(logoImg, file => {
            files.get( logoImg.attr('data-file-id') ).file = file;
            i++;
            if (logoImgs[i]) {
                recursion(logoImgs[i]);
            } else {
                //启动上传
                Ajax.send(files.items, opt.path);
            }
        });
    }

    if (logoImgs && logoImgs[0]) {
        recursion(logoImgs[0]);
    } else {
        Ajax.send(files.items, opt.path);
    }
}

//【清除】按钮事件回调：清除所有item以及files
function fireClear() {
    Item.remove(Tab1.el);
}

//处理上传成功
Ajax.then = function(res){
    //改变状态，禁止编辑文件描述。
    Tab1.el.children.addClass('re-uploaded active');
    Tab1.el.find('textarea').attr('disabled','disabled');

    files.remove();
    console.log(res);
    /*
    //添加到本地缓存，改变url为远程url，并插入到管理面板
    let store = JSON.parse(window.localStorage.getItem('ReditorUpload')),
        udate = new Date(),
        item,
        id,
        type,
        url,
        desc,
        name;
    for(let k in res.data){
        item = document.find('#'+k);
        udate.setTime(res.data[k].query.date);
        desc = res.data[k].query.desc;
        url = res.data[k].url
        item.find('textarea').value = desc;
        item.find('.re-upload-img')[0].src = url;
        name = url.slice(url.lastIndexOf('/')+1);
        id = name.slice(0, name.lastIndexOf('.'));
        type = 'image';
        list[1].prepend(Item.create({
            id,
            type,
            src: url,
            desc,
            name: udate.format('Y-M-D H:I:S')
        }));
        store.push(res.data[k]);
    }
    window.localStorage.setItem('ReditorUpload', JSON.stringify(store));
    *//*
};*/

export default Tab1;