import utils from "../utils";
import options from "../options";

//上传窗口主体
let body = `
    <div id="re-upload" class="re-upload">
        <div class="re-tabs">
            <span class="re-tab active" data-tab="upload">上传</span>
            <span class="re-tab" data-tab="manage">管理</span>
        </div>
        <div class="re-tabbody active" data-tabbody="upload">
            <div class="re-upload-toolbar">
                <button id="re-upload-choser" class="re-btn-m re-btn-success">添加</button>
                <button id="re-upload-start" class="re-btn-m re-btn-warning">上传</button>
                <button id="re-upload-clear" class="re-btn-m re-btn-danger">清空</button>
            </div>
            <div id="re-upload-list-u" class="re-upload-list">upload body</div>
        </div>
        <div class="re-tabbody" data-tabbody="manage">
            <div class="re-upload-toolbar">
                <button class="re-btn-m re-btn-danger">清空</button>
                <button class="re-btn-m re-btn-success">查看今天</button>
                <button class="re-btn-m re-btn-success">查看昨天</button>
                <button class="re-btn-m re-btn-success">查看前天</button>
            </div>
            <div id="re-upload-list-m" class="re-upload-list">manange body</div>
        </div>
    </div>`,
    choser = document.createElement('input'),
    typeLimit = [],    //用来保存可支持的文件类型，以方便判断
    opt = options.upload,
    formData = new FormData(),
    xhr = new XMLHttpRequest(),
    status = 0, //上传状态: 0表示等待，1表示上传中
    uList,
    mList,
    tab,
    choserBtn,
    startBtn,
    clearBtn;

choser.type = 'file';
choser.multiple = true;

//将支持的所有类型都加入到typeLimit
for(let type in opt.type){
    if(opt.type.hasOwnProperty(type))
        opt.type[type].forEach(function(v){
            typeLimit.push(v);
        });
}

//input type=file的change事件
choser.on('change', ()=>{
    let file, len, i=0, ext, type, size, items = '';
    if(choser.files){
        len = choser.files.length;
        for(; i<len; i++){
            file = choser.files[i];
            ext = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
            type = file.type.split(/\//g)[0];
            size = (file.size/1048576).toFixed(2);//MB
            //判断文件类型
            if(!typeLimit.includes(ext)){
                utils.dialog({
                    type: 1,
                    css: 'max-width: 360px; top: 100px;',
                    title: '格式错误',
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
            if( size > opt.size[type]){
                utils.dialog({
                    type: 1,
                    css: 'max-width: 360px; top: 100px;',
                    title: '文件大小超出',
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
            //生成html
            items += item({
                id: i,
                type,
                src: window.createURL(file),
                desc: '',
                name: file.name,
                panel: 0
            });
            //加入到formData备以上传
            formData.append('id'+i, file);
        }
        uList.innerHTML = items;
    }
},false);

//生成item的html，upload和manage面板都通用
function item(o){
    return `
    <div class="re-upload-item">
        <i class="re-close icon icon-close1"></i>
        <div class="re-upload-item-inner">
            选择：
            <span class="re-upload-checkbox re-checkbox-s">
                <input class="re-checkbox-input" type="checkbox" checked name="id${o.id}">
                <i class="icon icon-checkbox1"></i>
            </span>
            ${
                o.panel ? '' : '水印：\
            <span class="re-upload-checkbox re-checkbox-s">\
                <input class="re-checkbox-input" type="checkbox" checked name="logo'+o.id+'">\
                <i class="icon icon-checkbox1"></i>\
            </span>'
            }
            <div class="re-upload-preview">
                <div class="re-upload-imgbox">
                    ${o.type === 'video' ? '<video controls': '<img'} class="re-upload-img" src="${o.src}">${o.type === 'video' ? '</video>' : ''}
                </div>
            </div>
            <div class="re-upload-info">
                <div class="re-upload-filename">${o.name}</div>
                <textarea class="re-upload-textarea" name="desc${o.id}" placeholder="文件描述">${o.desc}</textarea>
            </div>
        </div>
    </div>`;
}

//处理开始上传
xhr.on('loadstart', ()=>{
    status = 1;
    startBtn.innerText = '取消';
    choserBtn.addClass('re-disabled');
    clearBtn.addClass('re-disabled');
    uList.find('.re-close').addClass('re-disabled');
});
//处理上传进度
xhr.upload.on('progress',e=>{
    console.log(e.total,e.loaded);
});
//处理上传成功
xhr.on('load', ()=>{
    console.log(xhr.response);
});
//处理上传失败
xhr.on('error', ()=>{
    utils.dialog({
        title: '上传失败',
        css: 'max-width: 320px',
        body: '上传时发生错误！',
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
    startBtn.innerText = '上传';
});

function fireChoser(){
    document.body.append(choser);
    choser.value = '';
    choser.click();
    choser.remove();
}
function fireStart(){
    let uBtns = uList.parentNode.find('.re-btn-m'),
        uClose = uList.find('.re-close');
    switch (status) {
        case 0:
            xhr.open('post', opt.path, true);
            xhr.send(formData);
            break;
        case 1:
            xhr.abort();
            break;
    }
}
function fireClear() {
    if(status === 1)
        return false;
    else{
        uList.innerHTML = '';
    }
}
export default (reditor)=>{
    utils.dialog({
        title: '文件上传与管理',
        css: 'width: 80%',
        body,
        oncreated(){
            //创建tab
            tab = utils.tab('re-upload');

            //获取上传、管理列表
            uList = document.find('#re-upload-list-u');
            mList = document.find('#re-upload-list-m');

            //获取上传面板按钮，并绑定事件
            choserBtn = document.find('#re-upload-choser');
            startBtn = document.find('#re-upload-start');
            clearBtn = document.find('#re-upload-clear');
            choserBtn.on('click', fireChoser, false);
            startBtn.on('click', fireStart, false);
            clearBtn.on('click', fireClear, false);
        },
        onsure(e){

        },
        onhide(){
            if(tab) tab.destory();
            try{
                choserBtn.off('click', fireChoser, false);
                startBtn.off('click', fireStart, false);
                clearBtn.off('click', fireClear, false);
            }catch (e) {}
        }
    });

}