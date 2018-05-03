import utils from '../../utils';
import options from '../../options';
import Files from './Files';

class Logo{
    constructor(){
        let _this = this;
        this.items = Object.create(null);
        this.src = options.upload.logo.path;
        this.canvas = document.create('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.canvas.attr('style','position:fixed;top:-99999px;');
        this.style = {
            name: 'width:7.5em;font-size:14px;text-align:right;display:inline-block;',
            value: 'width:6em;text-align:center;',
            1: 'top:2px;left:2px;',
            2: 'top:2px;right:2px;',
            3: 'top:0;bottom:0;left:0;right:0;margin:auto;',
            4: 'bottom:2px;left:2px;',
            5: 'bottom:2px;right:2px;'
        };
        this.attrBody = `<b>在网页中的实际属性：</b>
        <p>
            <span style="${this.style.name}">上标图片宽度：</span>
            <input class="re-input-m" type="text" name="targetWidth" style="${this.style.value}"> px
        </p>
        <p>
            <span style="${this.style.name}">logo宽度：</span>
            <input class="re-input-m" type="text" name="width" style="${this.style.value}"> px
        </p>
        <p>
            <span style="${this.style.name}">logo透明度：</span>
            <input class="re-input-m" type="text" name="alpha" style="${this.style.value}"> %
        </p>
        <p>
            <span style="${this.style.name}">logo位置：</span>
            <select class="re-input-m" name="position" style="${this.style.value}">
                <option value="1">左上</option>
                <option value="2">右上</option>
                <option value="3">中心</option>
                <option value="4">左下</option>
                <option value="5">右下</option>
            </select>
        </p>
        <p>
            <span style="${this.style.name}; color:#b2512f;">应用于所有：</span>
            <input class="re-checkbox-m" type="checkbox" name="all">
        </p>`;

        this.menuHandler = function(e){
            e.preventDefault();
            _this.menu(e);
        };
    }
    create(id){
        let _this = this,
            logo = document.create('img'),
            pos;
        logo.attr('data-re-id', id);
        logo.className = 're-upload-item-logo active';
        logo.src = this.src;
        this.items[id] = {
            el: logo,
            targetWidth: 600,
            width: 120,
            alpha: 65,
            position: 5
        };
        pos = this.items[id].position;
        Object.defineProperty(this.items[id], 'position', {
            set(n){
                if(n !== pos){
                    logo.attr('style', _this.style[n]);
                    pos = n;
                }
            },
            get(){
                return pos;
            }
        });
        logo.on('contextmenu', this.menuHandler);
        return logo;
    }
    menu(e){
        let _this = this,
            logo = e.target;
        utils.menu({
            x: e.clientX,
            y: e.clientY,
            items: [{
                html: '开启logo',
                data: {name: 'add'}
            },{
                html: '关闭logo',
                data: {name: 'del'}
            },{
                html: '开启所有logo',
                data: {name: 'addAll'}
            },{
                html: '关闭所有logo',
                data: {name: 'delAll'}
            },{
                html: '设置logo属性',
                data: {name: 'setAttr'}
            }],
            onclick(ctg){
                switch (ctg.attr('data-name')){
                    case 'del':
                        logo.removeClass('active');
                        break;
                    case 'add':
                        logo.addClass('active');
                        break;
                    case 'delAll':
                        for(let k in _this.items)
                            _this.items[k].el.removeClass('active');
                        break;
                    case 'addAll':
                        for(let k in _this.items)
                            _this.items[k].el.addClass('active');
                        break;
                    case 'setAttr':
                        _this.setAttr(logo);
                        break;
                }
            }
        });
    }
    setAttr(logo){
        let _this = this,
            id = logo.attr('data-re-id'),
            names = null,
            all = null;
        utils.dialog({
            overlay: true,
            title: '设置logo属性',
            body: _this.attrBody,
            oncreated(box){
                names = box.re('[name]');
                names.each(n=>{
                    if(n.name === 'all') all = n;
                    if(_this.items[id].hasOwnProperty(n.name))
                        n.value = _this.items[id][n.name];
                });
            },
            onsure(){
                names.each(n=>{
                    if(all.checked){
                        for(let k in _this.items)
                            if( _this.items[k].hasOwnProperty(n.name) )
                                _this.items[k][n.name] = parseFloat(n.value);
                    }else{
                        if(_this.items[id].hasOwnProperty(n.name))
                            _this.items[id][n.name] = parseFloat(n.value);
                    }
                });
            }
        });
    }
    remove(id){
        if(id){
            this.items[id].el.off('contextmenu', this.menuHandler);
            this.items[id].el.remove();
            delete this.items[id];
        }else{
            for(let k in this.items){
                this.items[k].el.off('contextmenu', this.menuHandler);
                this.items[k].el.remove();
                delete this.items[k];
            }
        }
    }
    compose(id, fn){
        if(typeof fn === 'function'){
            let item = this.items[id],
                canvas = this.canvas,
                img = this.image,
                ctx = this.ctx,
                o = Files.items[id].info;
            canvas.width = 0;
            canvas.height = 0;
            img.on('load', loadedFn);
            function loadedFn(){
                let ow = img.width,
                    oh = img.height,
                    tw = item.targetWidth,
                    lw = item.width,
                    la = item.alpha,
                    lp = item.position,
                    lscale = item.el.offsetHeight / item.el.offsetWidth,
                    lx,
                    ly,
                    rlw,
                    rlh,
                    space;

                if(tw && lw){
                    canvas.width = ow;
                    canvas.height = oh;
                    document.body.append(canvas);
                    ctx.drawImage(img, 0, 0, ow, oh);

                    rlw = (ow / tw) * lw;
                    rlh = rlw * lscale;
                    space = ow * .008;
                    if(space > 5) space = 5;
                    switch (lp){
                        case 1:
                            lx = ly = space;
                            break;
                        case 2:
                            lx = ow - rlw - space;
                            ly = 5;
                            break;
                        case 3:
                            lx = (ow - rlw) / 2;
                            ly = (oh - rlh) / 2;
                            break;
                        case 4:
                            lx = 5;
                            ly = oh - rlh - space;
                            break;
                        default:
                            lx = ow - rlw - space;
                            ly = oh - rlh - space;
                    }
                    ctx.globalAlpha = la/100;
                    ctx.drawImage(item.el, lx, ly, rlw, rlh);

                    fn( canvas.toFile(o.name, o.mime) );
                    document.body.removeChild(canvas);
                }
                img.off('load', loadedFn);
                img.off('error', errorFn);
            }
            img.on('error', errorFn);
            function errorFn(){
                fn(null);
                img.off('load', loadedFn);
                img.off('error', errorFn);
            }
            img.src = o.src;
        }
    }
}

export default new Logo();

