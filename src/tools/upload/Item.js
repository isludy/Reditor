/**
 * 文件上传面板与管理面板里的列表项的创建。
 */
import utils from '../../utils';
import ajax from "./Ajax";

let Item = {};

//项的选择与反选、关闭按钮等的事件函数
function itemSelect(e){
    let target = e.target, items;
    if(target.hasClass('re-close')){
        itemRemove(this);
        ajax.delete(this.id);
    }else if(!/textarea|input|button/i.test(target.tagName)){
        if(e.ctrlKey){
            this.toggleClass('active');
            items = this.parentNode.find('.re-upload-item');
            if(this.hasClass('active'))
                items.addClass('active');
            else
                items.removeClass('active');
        }else{
            this.toggleClass('active');
        }
    }
}
//项的logo等的右击菜单
function itemMenu(e){
    let _this = this,
        target = e.target;
    if(target.hasClass('re-upload-logo')){
        e.preventDefault();
        utils.menu({
            x: e.x,
            y: e.y,
            items: [{
                html: '删除水印',
                data: {name: 'del'}
            },{
                html: '添加水印',
                data: {name: 'add'}
            },{
                html: '全部删除水印',
                data: {name: 'delAll'}
            },{
                html: '全部添加水印',
                data: {name: 'addAll'}
            }],
            onclick(ctg){
                switch (ctg.data('name')){
                    case 'del':
                        target.removeClass('active');
                        break;
                    case 'add':
                        target.addClass('active');
                        break;
                    case 'delAll':
                        _this.parentNode.find('.re-upload-logo').removeClass('active');
                        break;
                    case 'addAll':
                        _this.parentNode.find('.re-upload-logo').addClass('active');
                        break;
                }
            }
        });
    }
}

function itemRemove(item){
    item.off('click', itemSelect);
    item.off('contextmenu', itemMenu);
    window.revokeURL(item.find('.re-upload-img')[0].attr('src'));
    item.remove();
}

Item.create = function(o){
    let item = document.create('div');
    item.className = 're-upload-item';
    item.id = o.id;
    item.innerHTML = `
    <i class="re-close icon icon-close1"></i>
    <div class="re-upload-item-inner">
        <div class="re-upload-preview alpha">
            <div class="re-upload-imgbox">
                ${o.type === 'video' ? '<video controls': '<img'} class="re-upload-img" src="${o.src}">${o.type === 'video' ? '</video>' : ''}
                ${o.type === 'image' ? '<img class="re-upload-logo active" src="'+o.logo+'">' : ''}
            </div>
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
            itemRemove();
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