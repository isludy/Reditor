import utils from '../../utils';
import options from '../../options';
import re from '../../re';

const canvas = re('<canvas style="position: fixed; top: -99999px;"></canvas>'),
    ctx = canvas[0].getContext('2d'),
    img = new Image(),
    logoPath = options.upload.logo.path,
    positions = ['top:2px;left:2px;', 'top:2px;right:2px;', 'top:0;bottom:0;left:0;right:0;margin:auto;', 'bottom:2px;left:2px;', 'bottom:2px;right:2px;'],
    style1 = 'width:7.5em;font-size:14px;text-align:right;display:inline-block;',
    style2 = 'width:6em;text-align:center;';

class Logo{
    constructor(){
        this.items = Object.create(null);
        this.handlers = Object.create(null);
    }
    create(id){
        let _this = this,
            logo = re('<img src="'+logoPath+'" class="re-upload-item-logo active">'),
            pos;
        this.items[id] = {
            el: logo,
            status: 1,
            targetWidth: 600,
            width: 120,
            alpha: 65,
            position: 4
        };
        pos = this.items[id].position;
        Object.defineProperty(this.items[id], 'position', {
            set(n){
                if(n !== pos){
                    logo.attr('style', positions[n]);
                    pos = n;
                }
            },
            get(){
                return pos;
            }
        });
        logo.on('contextmenu', handler);
        function handler(e){
            e.preventDefault();
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
                    switch (ctg.data('name')){
                        case 'del':
                            logo.removeClass('active');
                            _this.items[id].status = 0;
                            break;
                        case 'add':
                            logo.addClass('active');
                            _this.items[id].status = 1;
                            break;
                        case 'delAll':
                            for(let k in _this.items){
                                _this.items[k].el.removeClass('active');
                                _this.items[k].status = 0;
                            }
                            break;
                        case 'addAll':
                            for(let k in _this.items){
                                _this.items[k].el.addClass('active');
                                _this.items[k].status = 1;
                            }
                            break;
                        case 'setAttr':
                            _this.setAttr(id);
                            break;
                    }
                }
            });
        }
        this.handlers[id] = handler;
        return logo;
    }
    setAttr(id){
        let _this = this,
            names = null,
            all = null;
        utils.dialog({
            title: '设置logo属性',
            body: `<b>在网页中的实际属性：</b>
            <p>
                <span style="${style1}">图片宽度：</span>
                <input class="re-input-m" type="text" name="targetWidth" style="${style2}"> px
            </p>
            <p>
                <span style="${style1}">logo宽度：</span>
                <input class="re-input-m" type="text" name="width" style="${style2}"> px
            </p>
            <p>
                <span style="${style1}">logo透明度：</span>
                <input class="re-input-m" type="text" name="alpha" style="${style2}"> %
            </p>
            <p>
                <span style="${style1}">logo位置：</span>
                <select class="re-input-m" name="position" style="${style2}">
                    <option value="0">左上</option>
                    <option value="1">右上</option>
                    <option value="2">中心</option>
                    <option value="3">左下</option>
                    <option value="4">右下</option>
                </select>
            </p>
            <p>
                <span style="${style1}; color:#b2512f;">应用于所有：</span>
                <input class="re-checkbox-s" type="checkbox" name="all">
            </p>`,
            btns: ['确定',{html: '取消', type: 'warning'}],
            created(box){
                names = box.find('[name]');
                names.each(n=>{
                    if(n.name === 'all') all = n;
                    if(_this.items[id].hasOwnProperty(n.name))
                        n.value = _this.items[id][n.name];
                });
            },
            clicked(code){
                if(code) return;
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
            if(this.items[id]){
                this.items[id].el.off('contextmenu', this.handlers[id]);
                this.items[id].el.remove();
                delete this.items[id];
            }
        }else{
            for(let k in this.items){
                this.items[k].el.off('contextmenu', this.handlers[id]);
                this.items[k].el.remove();
                delete this.items[k];
            }
        }
    }
    compose(optItems, fileItems, fn){
        if(typeof fn !== 'function') return;

        let _this = this,
            keys = Object.keys(_this.items),
            index = 0,
            item, o;

        if(keys[index]){
            recursion(keys[index]);
        }else{
            fn();
        }
        function recursion(id) {
            item = _this.items[id];
            if(item.status !== 1){
                index++;
                if(keys[index]) {
                    recursion(keys[index]);
                }else{
                    fn();
                }
                return;
            }
            o = optItems[id];

            canvas.width = 0;
            canvas.height = 0;

            img.addEventListener('load', loadedFn);

            function loadedFn() {
                let ow = img.width,
                    oh = img.height,
                    tw = item.targetWidth,
                    lw = item.width,
                    la = item.alpha,
                    lp = item.position,
                    lscale = item.el[0].offsetHeight / item.el[0].offsetWidth,
                    lx,
                    ly,
                    rlw,
                    rlh,
                    space;

                if (tw && lw) {
                    canvas[0].width = ow;
                    canvas[0].height = oh;

                    ctx.drawImage(img, 0, 0, ow, oh);

                    rlw = (ow / tw) * lw;
                    rlh = rlw * lscale;
                    space = ow * .008;
                    if (space > 5) space = 5;
                    switch (lp) {
                        case 0:
                            lx = ly = space;
                            break;
                        case 1:
                            lx = ow - rlw - space;
                            ly = 5;
                            break;
                        case 2:
                            lx = (ow - rlw) / 2;
                            ly = (oh - rlh) / 2;
                            break;
                        case 3:
                            lx = 5;
                            ly = oh - rlh - space;
                            break;
                        default:
                            lx = ow - rlw - space;
                            ly = oh - rlh - space;
                    }
                    ctx.globalAlpha = la / 100;
                    ctx.drawImage(item.el[0], lx, ly, rlw, rlh);
                    fileItems[id] = canvas[0].toFile(o.name, o.type);
                }
                img.removeEventListener('load', loadedFn);
                img.removeEventListener('error', errorFn);

                index++;
                if(keys[index]) {
                    recursion(keys[index]);
                }else{
                    fn();
                }
            }

            img.addEventListener('error', errorFn);

            function errorFn() {
                img.removeEventListener('load', loadedFn);
                img.removeEventListener('error', errorFn);

                index++;
                if(keys[index]) {
                    recursion(keys[index]);
                }else{
                    fn();
                }
            }
            img.src = o.url;
        }
    }
}

export default new Logo();

