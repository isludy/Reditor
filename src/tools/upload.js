import re from './../re';
import Up from './upload/Up';
import Down from './upload/Down';
import Items from './upload/Items';

let context = document.body,
    box = re(`<div class="re-upload">
        <div class="re-upload-wrapper">
            <b class="re-dialog-close">×</b>
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
    </div>`),
    list = box.find('#re-upload-body'),
    reditor = null;

box.on('click',function (e){
    if(e.target === this || re(e.target).hasClass('re-dialog-close')) {
        context.removeChild(box[0]);
    }
});

Down.init(list);
box.find('#re-upload-refresh').on('click', function () {
    Down.reload();
});

Up.init({
    choser: box.find('#re-upload-choser'),
    upload: box.find('#re-upload-upload'),
    clear: box.find('#re-upload-clear'),
    list: list
});
box.find('#re-upload-use').on('click', function(){
    let media,
        item;

    for(let k in Items.items) {
        if (Items.items[k].selected) {
            item = Items.items[k];
            switch (item.type.split(/\//)[0]) {
                case 'image':
                    reditor.addMedia(item.url, 'image');
                    break;
                case 'video':
                    reditor.addMedia(item.url, 'video', item.thumb);
                    break;
                case 'audio':
                    reditor.addMedia(item.url, 'audio');
                    break;
                default:
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
export default (r)=>{
    context.appendChild(box[0]);
    reditor = r;
}