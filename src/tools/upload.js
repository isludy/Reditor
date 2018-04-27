import utils from '../utils';
import options from '../options';
import Mange from './upload/Manage';
import Status from './upload/Status';
import Tab1 from './upload/Tab1';

let panel,
    opt = options.upload,
    date = new Date(),
    yesBtn,
    tab,
    dateInput,
    seartchBtn;

//准备本地缓存
if(!window.localStorage.getItem('ReditorUpload')){
    window.localStorage.setItem('ReditorUpload','[]');
}


//处理管理面板查询文件
function fireSearch(){
    console.log(dateInput.value)
    if(/\d{8}/.test(dateInput.value)){
        Mange.send(dateInput.value, opt.path);
    }else{
        utils.dialog({
            title: '日期错误',
            css: 'max-width:360px',
            body: '输入用于查询的日期错误，必须是8位数字，如：'+date.format('YMD'),
            colorType: 'danger',
            overlay: true,
            yes: false,
            no: false
        });
    }
}
//处理管理面板请求数据成功
Mange.then = function(data){
   console.log(data);
};

export default (reditor)=>{
    utils.dialog({
        id: 're-dialog-upload',
        title: '文件上传与管理',
        css: 'width: 80%',
        body: `
        <div id="re-upload" class="re-upload">
            <div class="re-tabs">
                <span class="re-tab active" data-tab="upload">上传</span>
                <span class="re-tab" data-tab="manage">管理</span>
            </div>
            <div class="re-tabbody active" data-tabbody="upload">
                <div class="re-upload-toolbar">
                    <button id="re-upload-u-choser" class="re-btn-m re-btn-success">添加</button>
                    <button id="re-upload-u-start" class="re-btn-m re-btn-warning">上传</button>
                    <button id="re-upload-u-clear" class="re-btn-m re-btn-danger">清空</button>
                </div>
                <div class="re-upload-list"></div>
            </div>
            <div class="re-tabbody" data-tabbody="manage">
                <div class="re-upload-toolbar">
                    <input id="re-upload-m-date" class="re-input-m" type="text" placeholder="输入日期">
                    <button id="re-upload-m-search" class="re-btn-m re-btn-success">查看</button>
                </div>
                <div class="re-upload-list"></div>
            </div>
        </div>`,
        oncreated(){
            panel = document.find('#re-upload');
            //创建tab
            tab = utils.tab(panel);

            //获取上传、管理列表
            let list = panel.find('.re-upload-list');

            //获取上传面板按钮，并绑定事件
            Tab1.init(list[0]);

            //获取确定【按钮】
            yesBtn = document.find('#re-dialog-upload-yes');

            //设置初始状态
            Status.off(yesBtn);

            //获取管理面板查询按钮，并绑定事件
            dateInput = document.find('#re-upload-m-date');
            seartchBtn = document.find('#re-upload-m-search');
            seartchBtn.on('click', fireSearch);
            dateInput.value = date.format('YMD');
        },
        onsure(e){

        },
        onhide(){
            tab.destory();
            Tab1.destory();
        }
    });
}