import re from './../re';
import Up from './upload/Up';
import Down from './upload/Down';
import Items from './upload/Items';

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
                    <button id="re-upload-refresh" class="re-btn-m re-btn-warning">刷新</button>
                </div>
            </div>
            <div id="re-upload-slide-left" class="re-upload-slide-left icon icon-arrow-left1"></div>
        </div>`);
        box.on('click',function (e){
            if(e.target === this) box.toggleClass('re-upload-hide');
        });
        document.body.appendChild(box[0]);

        Up.init({
            choser: '#re-upload-choser',
            upload: '#re-upload-upload',
            clear: '#re-upload-clear',
            list: '#re-upload-body'
        });
        Down.init('#re-upload-body');
        re('#re-upload-refresh').on('click', function(){
            Down.init('#re-upload-body');
        });
        re('#re-upload-use').on('click', function(){
            let media,
                item;

            for(let k in Items.items) {
                if (Items.items[k].selected) {
                    item = Items.items[k];
                    if(/image|video|audio/.test(item.type)){
                        reditor.addMedia(item.url, item.thumb, item.type.split(/\//)[0]);
                    }else{
                        media = document.createElement('a');
                        media.href = item.url;
                        media.innerHTML = media.download = item.name;
                        if(reditor.range.deleteContents){
                            reditor.range.deleteContents();
                        }
                        reditor.range.insertNode(media);
                        reditor.range.collapse(false);
                    }
                    item.selected = false;
                }
            }
            box.addClass('re-upload-hide');
        });
        re('#re-upload-slide-left').on('click',()=>{
            box.toggleClass('re-upload-hide');
        });
    }else{
        box.toggleClass('re-upload-hide');
    }
}