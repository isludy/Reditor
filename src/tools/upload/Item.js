import Files from './Files';

class Items{
    constructor(){

    }
    static create(id){
        let o = Files.items[id].info,
            item = document.create('div'),
            html;

        item.className = 're-upload-item';
        item.id = id;

        html = `
        <div class="re-upload-item-inner">
            <i class="re-close icon icon-close1"></i>
            <div class="re-upload-preview alpha">`;

        if(o.type === 'image'){
            html += '<div class="re-upload-img" style="background:url('+o.src+') no-repeat center;background-size:contain;"></div>';
            if(o.logo) html += '<img class="re-upload-logo active" src="'+o.logo.path+'">';
        } else if(o.type === 'video' || o.type === 'audio'){
            html +='<video class="re-upload-img" controls src="'+o.src+'">浏览器不支持</video>';
        }else{
            html += '<div class="re-upload-other-file">.'+o.ext+'</div>';
        }

        html += `<div class="re-upload-tick">已上传</div>
            </div>
            <div class="re-upload-info">
                <div class="re-upload-filename">${o.name}</div>
                <textarea class="re-upload-textarea" name="desc" placeholder="文件描述">${o.desc}</textarea>
            </div>
        </div>`;

        item.innerHTML = html;

        item.on('click', Items.clickHandler);
        return item;
    }
    static removeItem(item){
        item.off('click', this.clickHandler);
        try{
            window.revokeURL(Files.items[item.id].info.src);
        }catch(err){}
        item.remove();
        delete Files.items[item.id];
    }
    static clickHandler(e){
        let target = e.target;
        if(target.hasClass('re-close')){
            Items.removeItem(this);
        }
    }
    static remove(item){
        if(item){
            Items.removeItem(item);
        }else{
            for(let k in Files.items){
                Items.removeItem(document.getElementById(k));
            }
        }
    }
}
export default Items;