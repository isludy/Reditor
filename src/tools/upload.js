import utils from "../utils";

let body = `
    <div class="re-upload">
        <div class="fe-fup-tabbar">
            <span class="fe-fup-tab active">去上传</span>
            <span class="fe-fup-tab">去管理</span>
        </div>
        <div class="fe-fup-body">
            <div class="fe-fup-toolbar">
                添加水印：<button data-fe="water" class="fe-checkbox checked"></button>
            </div>
            <div class="fe-fup-btnbar">
                <button data-fe-btn="fe-file-chooser" class="fe-btn fe-btn-success">添加</button>
                <button data-fe-btn="fe-file-upload" class="fe-btn fe-btn-success disabled">上传</button>
                <button data-fe-btn="fe-file-cancel" class="fe-btn fe-btn-warning disabled">取消</button>
                <button data-fe-btn="fe-file-clear" class="fe-btn fe-btn-warning disabled">清空</button>
            </div>
            <div class="fe-fup-btnbar hide">
                <button data-fe-btn="fe-file-delall" class="fe-btn fe-btn-warning">删除所有文件</button>
                <button data-fe-btn="fe-file-delpaste" class="fe-btn fe-btn-warning">删除剪贴板文件</button>
            </div>
            <div id="fe-fup-tabbody-upload" class="fe-fup-tabbody show"></div>
            <div id="fe-fup-tabbody-manage" class="fe-fup-tabbody"></div>
            <div class="fe-fup-status"></div>
        </div>
    </div>
`;

export default (reditor)=>{
    utils.dialog({
        title: '文件上传与管理',
        body: 'fileupload'
    });
}