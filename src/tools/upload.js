import utils from "../utils";

let body = `
    <div id="re-upload" class="re-upload">
        <div class="re-tabs">
            <span class="re-tab active" data-tab="upload">上传</span>
            <span class="re-tab" data-tab="manage">管理</span>
        </div>
        <div class="re-tabbody active" data-tabbody="upload">
            <div class="re-upload-toolbar">
                <button id="re-upload-choser" class="re-btn-m re-btn-success">添加</button>
                <button class="re-btn-m re-btn-warning">上传</button>
                <button class="re-btn-m re-btn-danger">清空</button>
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
    choser = document.createElement('input');

choser.type = 'file';
choser.multiple = true;

choser.addEventListener('change', ()=>{
    let file, len, i=0, items = '';
    if(choser.files){
        len = choser.files.length;
        for(; i<len; i++){
            file = choser.files[i];
            items += item({
                id: i,
                src: window.URL.createObjectURL(file),
                logo: './themes/logo.png',
                desc: '文件描述',
                name: file.name
            });
        }
        document.getElementById('re-upload-list-u').innerHTML = items;
    }
},false);

function item(o){
    return `
    <div class="re-upload-item">
        <div class="re-upload-item-inner">
            <div class="re-upload-preview">
                <img class="re-upload-img" src="${o.src}" alt="预览">
                <img class="re-upload-logo" src="${o.logo}" alt="水印">
            </div>
            <div class="re-upload-info">
                <div class="re-upload-filename">${o.name}</div>
                <textarea class="re-upload-textarea" name="desc${o.id}" placeholder="文件描述">${o.desc}</textarea>
                <div class="re-progress"></div>
                <div class="re-upload-checkboxs">添加水印：<input name="logo${o.id}" type="checkbox"></div>
            </div>
        </div>
    </div>`;
}

function choserBtnFn(){
    choser.value = '';
    choser.click();
}

export default (reditor)=>{
    let tab, choserBtn;
    utils.dialog({
        title: '文件上传与管理',
        body,
        oncreated(){
            tab = utils.tab('re-upload');
            choserBtn = document.getElementById('re-upload-choser');
            choserBtn.addEventListener('click', choserBtnFn, false);
        },
        onsure(e){
            console.log(e.params)
        },
        onhide(){
            if(tab) tab.destory();
            if(choserBtn) choserBtn.removeEventListener('click', choserBtnFn, false);
        }
    });

}