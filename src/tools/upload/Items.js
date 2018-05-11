import options from '../../options';
import Files from './Files';
import Logo from './Logo';
import Send from './Send';

class Items{
    static create(id, opt){
        let o = opt || Files.items[id].info,
            item = document.create('div'),
            nodes = {
                inner: document.create('div'),
                preview: document.create('div'),
                tick: document.create('div'),
                info: document.create('div'),
                filename: document.create('div'),
                form: document.create('form'),
                media: null
            },
            close = document.create('i');

        if(o.type === 'video' || o.type === 'audio'){
            nodes.media = document.create('video');
            nodes.media.src = o.src;
            nodes.media.controls = 'controls';
            nodes.media.preload = 'auto';
            nodes.media.innerHTML = '浏览器不支持';
        }else{
            nodes.media = document.create('div');
            if(o.type === 'image'){
                nodes.media.style = 'background:url('+o.src+') no-repeat center;background-size:contain;';
                nodes.preview.append(Logo.create(id));
            }else{
                nodes.media.className = 'noview';
                nodes.media.innerHTML = o.ext.toUpperCase();
            }
        }

        for(let k in nodes){
            if(k === 'media'){
                nodes[k].addClass('re-upload-item-'+k);
            }else{
                nodes[k].className = 're-upload-item-'+k;
            }
        }

        item.id = id;
        nodes.tick.id = id + '-tick';
        nodes.form.id = id + '-form';

        item.className = 're-upload-item';
        close.className = 're-close icon icon-close1';
        nodes.preview.addClass('alpha');

        nodes.filename.innerHTML = o.name || '';
        nodes.form.innerHTML = options.upload.form || '';
        nodes.tick.innerText = '等待上传...';

        nodes.preview.append(nodes.filename, nodes.media);
        nodes.info.append(nodes.form, nodes.tick);
        nodes.inner.append(close, nodes.preview, nodes.info);
        item.append(nodes.inner);

        item.on('click', Items.clickHandler);
        return item;
    }
    static removeItem(item){
        if(item.id === Send.curid) Send.stop();
        item.off('click', Items.clickHandler);
        try{
            window.revokeURL(Files.items[item.id].info.src);
        }catch(err){}
        item.remove();
        if(Logo.items[item.id]) Logo.remove(item.id);
        delete Files.items[item.id];
    }
    static clickHandler(e){
        let target = e.target;
        if(target.hasClass('re-close')){
            Items.removeItem(this);
        }
        if(!/input|button|textarea/i.test(target.tagName) && this.hasClass('re-upload-loaded')){
            this.toggleClass('re-upload-selected');
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