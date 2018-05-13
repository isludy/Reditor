import options from '../../options';
import Logo from './Logo';
import Send from './Send';
import Files from './Files';

class Items{
    constructor(){
        this.items = Object.create(null);
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
     *         tick: 上传状态信息
     *     }
     * @param file 文件File
     * @return {*}
     */
    create(id, o, file = null){
        if(file) {
            if(!Files.add(id, file)) return;
        }
        this.items[id] = o;
        let _this = this,
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

        if(/^(video|audio)\//.test(o.type)){
            nodes.media = document.create('video');
            nodes.media.src = o.url;
            nodes.media.controls = 'controls';
            nodes.media.preload = 'auto';
            nodes.media.innerHTML = '浏览器不支持播放器';
            Items.observe(this.items[id], 'url', o.url, val=>{
                nodes.media.src = val;
            });
        }else{
            nodes.media = document.create('div');
            if(/^image\//.test(o.type)){
                nodes.media.style = 'background:url('+o.url+') no-repeat center; background-size: contain;';
                nodes.preview.append(Logo.create(id));
                Items.observe(this.items[id], 'url', o.url, val=>{
                    nodes.media.style.backgroundImage = 'url('+val+')';
                });
            }else{
                nodes.media.addClass('noview');
                nodes.media.innerHTML = (o.name.slice(o.name.lastIndexOf('.')+1)).toUpperCase();
            }
        }

        for(let k in nodes) nodes[k].addClass('re-upload-item-'+k);
        item.className = 're-upload-item';
        close.className = 're-close icon icon-close1';
        nodes.preview.addClass('alpha');

        nodes.filename.innerHTML = o.name || '';
        nodes.form.innerHTML = options.upload.form || '';
        nodes.tick.innerHTML = o.tick || '';
        Items.observe(this.items[id], 'tick', o.tick, val=>{
            nodes.tick.innerHTML = val;
        });

        nodes.preview.append(nodes.filename, nodes.media);
        nodes.info.append(nodes.form, nodes.tick);
        nodes.inner.append(close, nodes.preview, nodes.info);
        item.append(nodes.inner);

        item.on('click', handler);
        function handler(e){
            let target = e.target;
            if(target.hasClass('re-close')){
                _this.remove(id);
            }
            if(!/input|button|textarea/i.test(target.tagName) && this.hasClass('re-upload-loaded')){
                this.toggleClass('re-upload-selected');
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
            Items.del(id, this.items);
        }else{
            for(id in this.items)
                if(this.items.hasOwnProperty(id))
                    Items.del(id, this.items);
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
            delete items[id];
            delete Files.items[id];
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
        return this.items[id].el.getElementsByTagName('form').elements;
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