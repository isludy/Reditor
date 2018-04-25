/**
 * 文件上传面板与管理面板里的列表项的创建。
 */
import ajax from './Ajax';
import Logo from './Logo';

let Item = {};

//项的选择与反选、关闭按钮等的事件函数
function itemSelect(e){
    let target = e.target, items;
    if(target.hasClass('re-close')){
        itemRemove(this);
        ajax.delete(this.id);
    }else if(!/textarea|input|button/i.test(target.tagName)){
        //未上传时，不可选
        if(!this.hasClass('re-uploaded'))
            return false;
        //按ctrl全选/反选
        if(e.ctrlKey){
            this.toggleClass('active');
            items = this.parentNode.find('.re-upload-item');
            if(this.hasClass('active'))
                items.addClass('active');
            else
                items.removeClass('active');
        }
        //单选/反选
        else{
            this.toggleClass('active');
        }
    }
}
//项的logo等的右击菜单
function itemMenu(e){
    let target = e.target;
    if(target.hasClass('re-upload-logo')){
        e.preventDefault();
        if(this.hasClass('re-uploaded'))
            return false;
        Logo.contextMenu(e.x, e.y, target, this);
    }
}

function itemRemove(item){
    item.off('click', itemSelect);
    item.off('contextmenu', itemMenu);
    window.revokeURL(item.find('.re-upload-img')[0].attr('src'));
    item.remove();
}

function itemView(o){
    if(o.type === 'image'){
        let view = '<img class="re-upload-img" src="'+o.src+'">';
        if(o.logo)
            view += `<img class="re-upload-logo active" src="${o.logo.path}"
            data-file-id="${o.id}"
            data-target-src="${o.src}"
            data-target-mime="${o.mime}"
            data-target-name="${o.name}"
            data-target-width="${o.logo.targetWidth}"
            data-logo-width="${o.logo.width}"
            data-logo-alpha="${o.logo.alpha}"
            data-logo-position="${o.logo.position}" alt="logo">`;
        return view;
    } else if(o.type === 'video' || o.type === 'audio'){
        return '<video class="re-upload-img" controls src="'+o.src+'">浏览器不支持</video>';
    }else{
        return '';
    }
}

Item.create = function(o){
    let item = document.create('div');
    item.className = 're-upload-item';
    item.id = o.id;
    item.innerHTML = `
    <div class="re-upload-item-inner">
        <i class="re-close icon icon-close1"></i>
        <div class="re-upload-preview alpha">
            <div class="re-upload-imgbox">
                ${itemView(o)}
            </div>
            <div class="re-upload-tick">已上传</div>
        </div>
        <div class="re-upload-info">
            <div class="re-upload-filename">${o.name}</div>
            <textarea class="re-upload-textarea" name="desc" placeholder="文件描述">${o.desc}</textarea>
        </div>
    </div>`;

    //处理选择与反选
    item.on('click', itemSelect);
    if(o.logo) item.on('contextmenu', itemMenu);
    return item;
};
Item.remove = function(id){
    let nodes;
    if(typeof id === 'string'){
        if(nodes = document.find(id))
            itemRemove(nodes);
        ajax.delete(id);
    }else if(id.nodeType === 1){
        nodes = id.find('.re-upload-item');
        if(nodes && nodes.length)
            nodes.forEach(child=>{
                itemRemove(child);
            });
        ajax.delete();
    }
};
export default Item;