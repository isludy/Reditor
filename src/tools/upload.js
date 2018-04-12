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
            <div class="re-upload-list">upload body</div>
        </div>
        <div class="re-tabbody" data-tabbody="manage">
            <div class="re-upload-toolbar">
                <button class="re-btn-m re-btn-danger">清空</button>
                <button class="re-btn-m re-btn-success">查看今天</button>
                <button class="re-btn-m re-btn-success">查看昨天</button>
                <button class="re-btn-m re-btn-success">查看前天</button>
            </div>
            <div class="re-upload-list">manange body</div>
        </div>
    </div>`,
    choser = document.createElement('input');

choser.type = 'file';
choser.multiple = true;

choser.addEventListener('change', ()=>{
    if(choser.files && choser.files.length){
        addItem(choser.files);
    }
},false);

function addItem(files){
    console.log(files);
}

function listen(node){
    node.addEventListener('click', ()=>{
        choser.value = '';
        choser.click();
    }, false);
}

export default (reditor)=>{
    let tab;
    utils.dialog({
        title: '文件上传与管理',
        body,
        oncreated(){
            tab = utils.tab('re-upload');
            listen(document.getElementById('re-upload-choser'));
        },
        onsure(){

        },
        onhide(){
            if(tab) tab.destory();
        }
    });

}