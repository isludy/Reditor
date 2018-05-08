import Tab1 from './upload/Tab1';
import Tab2 from './upload/Tab2';

let box;

export default (reditor)=>{
    if(!box){
        box = document.create('div');
        box.className = 're-upload';
        box.on('click',(e)=>{
            if(e.target === box) box.toggleClass('re-upload-hide');
        });
        box.innerHTML = `<div class="re-upload-wrapper">
            <div class="re-upload-header re-success">文件系统</div>
            <div class="re-upload-toolbar">
                <button id="re-upload-choser" class="re-btn-m re-btn-success">添加</button>
                <button id="re-upload-upload" class="re-btn-m re-btn-warning">上传</button>
                <button id="re-upload-clear" class="re-btn-m re-btn-danger">清空</button>
            </div>
            <div id="re-upload-body" class="re-upload-body"></div>
            <div class="re-upload-footer">
                <button id="re-upload-use" class="re-btn-m re-btn-success">使用</button>
            </div>
        </div>;`;
        document.body.append(box);
        Tab1.init({
            choser: 're-upload-choser',
            upload: 're-upload-upload',
            clear: 're-upload-clear',
            list: 're-upload-body'
        });
        Tab2.start();
    }else{
        box.toggleClass('re-upload-hide');
    }
    /*
    utils.dialog({
        id: 're-dialog-upload',
        title: '文件上传与管理',
        css: 'width: 80%',
        body: `
        <div class="re-upload">
            <div class="re-tabs">
                <span class="re-tab active" data-tab="upload">上传</span>
                <span class="re-tab" data-tab="manage">管理</span>
            </div>
            <div class="re-tabbody active" data-tabbody="upload">
                <div class="re-upload-toolbar">
                    <button id="re-upload-u-choser" class="re-btn-m re-btn-success">添加</button>
                    <button id="re-upload-u-upload" class="re-btn-m re-btn-warning">上传</button>
                    <button id="re-upload-u-clear" class="re-btn-m re-btn-danger">清空</button>
                </div>
                <div id="re-upload-u-list" class="re-upload-list"></div>
            </div>
            <div class="re-tabbody" data-tabbody="manage">
                <div class="re-upload-toolbar">
                    <input id="re-upload-m-date" class="re-input-m" type="text" placeholder="输入日期">
                    <button id="re-upload-m-search" class="re-btn-m re-btn-success">查看</button>
                </div>
                <div class="re-upload-list"></div>
            </div>
        </div>`,
        btns: ['确定', {
            html: '取消',
            type: 'warning'
        }],
        created(box){
            tab = utils.tab(box);
            Tab1.init({
                choser: 're-upload-u-choser',
                upload: 're-upload-u-upload',
                clear: 're-upload-u-clear',
                list: 're-upload-u-list'
            });
        },
        clicked(){
            tab.destroy();
            Tab1.destroy();
        }
    });
    */
}