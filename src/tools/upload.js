import utils from "../utils";

let body = `
    <div class="re-upload">
        <div class="re-upload-tabs">
            <span class="re-upload-tab active">上传</span>
            <span class="re-upload-tab">管理</span>
        </div>
        <div class="re-upload-body">
            <div class="re-upload-tab-body">
                <div class="re-upload-tools">
                    <button class="re-btn-m">添加</button>
                    <button class="re-btn-m">上传</button>
                    <button class="re-btn-m">清空</button>
                </div>
                <div class="re-upload-tab-content"></div>
            </div>
            <div class="re-upload-tabbody">
                <div class="re-upload-tab-content"></div>
            </div>
            <div class="re-upload-status">状态栏</div>
        </div>
    </div>`;

export default (reditor)=>{
    utils.dialog({
        title: '文件上传与管理',
        body,
        onsure(){

        }
    });
}