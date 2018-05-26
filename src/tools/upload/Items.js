import options from '../../options';
import re from '../../re';
import Logo from './Logo';
import Send from './Send';
import Files from './Files';

class Items{
    constructor(){
        this.items = Object.create(null);
        this.ondelete = null;
    }
    /**
     * 监听数据
     * @param model  数据模型
     * @param name  监听的属性
     * @param initval  初始化
     * @param fn   更新时执行的回调
     */
    static observe(model, name, initval, fn){
        Object.defineProperty(model, name, {
            set(val){
                if(initval !== val){
                    initval = val;
                    if(fn) fn(val);
                }
            },
            get(){
                return initval;
            }
        });
    }
    /**
     * 创建文件文档节点item
     * @param id 对应文件id号
     * @param o 数据模型
     *     {
     *         url: 可预览文件的路径,
     *         type: 文件mime类型,
     *         name: 文件名,
     *         tick: 上传状态信息，用来显示上传前显示等待、上传中进度信息、上传后显示日期信息
     *         status: 状态值，2表示未上传，1表示上传中，0表示已上传，用来控制上传状态样式
     *         selected: 选择状态，boolean类型
     *     }
     * @param file 文件File
     * @return {*}
     */
    create(id, o, file = null){
        if(file)
            if(!Files.add(id, file)) return;
        this.items[id] = o;
        let _this = this,
            item = re('<div class="re-upload-item'+(o.status > 0 ? '' : ' re-upload-loaded')+'">'),
            inner = re('<div class="re-upload-item-inner">'),
            preview = re('<div class="re-upload-item-preview re-alpha">'),
            tick = re('<div class="re-upload-item-tick">'+(o.tick || '')+'</div>'),
            info = re('<div class="re-upload-item-info">'),
            filename = re('<div class="re-upload-item-filename">'+(o.name || '')+'</div>'),
            form = re('<form class="re-upload-item-form">'+(options.upload.form || '')+'</form>'),
            media = null,
            close = re('<i class="re-close icon icon-close1">'),
            time = (new Date()).getTime();

        if(/^(video|audio)\//.test(o.type)){
            media = re('<video class="re-upload-item-media" src="'+o.url+'"'+(o.thumb ? 'poster="'+o.thumb+( o.status === 0 ? '?t='+time : '')+'"' :'')+' controls>浏览器不支持播放器</video>');
            Items.observe(this.items[id], 'url', o.url, val=>{
                media[0].src = val;
            });
        }else{
            media = re('<div class="re-upload-item-media">');
            if(/^image\//.test(o.type)){
                media[0].style = 'background:url('+o.url+( o.status===0 ? '?t='+time : '')+') no-repeat center; background-size: contain;';
                if(o.status > 0) preview.append(Logo.create(id));
                Items.observe(this.items[id], 'url', o.url, val=>{
                    media[0].style.backgroundImage = 'url('+val+')';
                });
            }else{
                media.addClass('noview');
                media[0].innerHTML = (o.name.slice(o.name.lastIndexOf('.')+1)).toUpperCase();
            }
        }

        Items.observe(this.items[id], 'tick', o.tick, val=>{
            tick[0].innerHTML = val;
        });

        Items.observe(this.items[id], 'status', o.status, val=>{
            if(val > 0)
                item.removeClass('re-upload-loaded');
            else
                item.addClass('re-upload-loaded');
        });

        Items.observe(this.items[id], 'selected', o.selected, val=>{
            if(val)
                item.addClass('re-upload-selected');
            else
                item.removeClass('re-upload-selected');
        });

        preview.append(filename, media);
        info.append(form, tick);
        inner.append(close, preview, info);
        item.append(inner);

        item.on('click', handler);
        function handler(e){
            let target = e.target;
            if(re(target).hasClass('re-close')){
                _this.remove(id);
            }else if(!/input|button|textarea/i.test(target.tagName) && _this.items[id].status === 0){
                _this.items[id].selected = !_this.items[id].selected;
                let selected = _this.items[id].selected;
                if(e.ctrlKey){
                    for(let k in _this.items)
                        _this.items[k].selected = selected;
                }else
                    _this.items[id].selected = selected;
            }
        }
        this.items[id].handler = handler;
        this.items[id].el = item;
        return item;
    }

    /**
     * 删除
     * @param id
     */
    remove(id){
        if(id){
            if(this.ondelete) this.ondelete(id);
            Items.del(id, this.items);
        }else{
            for(id in this.items){
                if(this.ondelete) this.ondelete(id);
                Items.del(id, this.items);
            }
            Send.stop();
        }
    }
    /**
     * 删除项
     * @param id
     * @param items
     */
    static del(id, items){
        if(id === Send.curid) Send.stop();
        try{
            items[id].el.off('click', items[id].handler);
            items[id].el.remove();
            if(Logo.items[id]) Logo.remove(id);
            window.revokeURL(items[id].url);
            Files.remove(id);
            delete items[id];
        }catch(err){
            console.log(err.message);
        }
    }
    /**
     * 获取表单元素
     * @param id
     * @return {HTMLFormControlsCollection | ActiveX.ISchemaItemCollection}
     */
    form(id){
        return this.items[id].el.find('form [name]');
    }
    /**
     * 合成logo，并执行上传
     */
    upload(){
        Logo.compose(this.items, Files.items, ()=>{
            Send.start(this);
        });
    }
}
export default new Items();