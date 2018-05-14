import re from './../re';
import Up from './upload/Up';
import Down from './upload/Down';
let box;

export default (reditor)=>{
    if(!box){
        box = re(`<div class="re-upload">
            <div class="re-upload-wrapper">
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
            </div>
        </div>`);
        box.on('click',function (e){
            if(e.target === this) box.toggleClass('re-upload-hide');
        });
        document.body.appendChild(box[0]);

        Up.init({
            choser: '#re-upload-choser',
            upload: '#re-upload-upload',
            clear: '#re-upload-clear',
            list: '#re-upload-body',
            use: '#re-upload-use'
        });
        Down.init('#re-upload-body');
    }else{
        box.toggleClass('re-upload-hide');
    }
}