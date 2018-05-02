import utils from '../../utils';
import Files from './Files';

class Logos{
    constructor(){
        this.items = Object.create(null);
        this.style = {
            name: 'width:5.5em;font-size:14px;text-align:right;display:inline-block;',
            value: 'width:5.5em;text-align:center;',
            1: 'top:2px;left:2px;',
            2: 'top:2px;right:2px;',
            3: 'top:0;bottom:0;left:0;right:0;margin:auto;',
            4: 'bottom:2px;left:2px;',
            5: 'bottom:px;right:2px;'
        };
        this.canvas = document.create('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();

        this.attrBody = `<b>预估它们在网页中实际显示的宽度：</b>
        <p>
            <span style="${this.style.name}">图片：</span>
            <input class="re-input-m" type="text" name="targetWidth" style="${this.style.value}"> px
        </p>
        <p>
            <span style="${this.style.name}">logo：</span>
            <input class="re-input-m" type="text" name="width" style="${this.style.value}"> px
        </p>
        <hr>
        <b>logo的其他属性设置：</b>
        <p>
            <span style="${this.style.name}">透明度：</span>
            <input class="re-input-m" type="text" name="alpha" style="${this.style.value}"> %
        </p>
        <p>
            <span style="${this.style.name}">位置：</span>
            <select class="re-input-m" name="position" style="${this.style.value}">
                <option value="1">左上</option>
                <option value="2">右上</option>
                <option value="3">中心</option>
                <option value="4">左下</option>
                <option value="5">右下</option>
            </select>
        </p>
        <hr>
        <b>将此logo属性用于所有图片：</b>
        <p>
            <span style="${this.style.name}">是否：</span>
            <input class="re-checkbox-m" type="checkbox" name="useToAll">
        </p>`;
        this.canvas.attr('style','position:fixed;top:-99999px;');
    }
    create(id){
        let el = document.createElement(id);
        el.className = 're-upload-logo active';
        el.setAttribute('data-re-id', id);
        el.on('contextmenu', this.contextMenu);
        return el;
    }
    contextMenu(e){
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
                        this.removeClass('active');
                        break;
                    case 'add':
                        this.addClass('active');
                        break;
                    case 'delAll':

                        break;
                    case 'addAll':

                        break;
                    case 'setAttr':

                        break;
                }
            }
        });
    }
    setAttr(target){
        utils.dialog({
            overlay: true,
            title: '设置logo属性',
            body: this.attrBody,
            oncreated(box){
                let id = target.getAttribute('data-re-id'),
                    attrs = box.re('[name]');
                attrs.each(attr=>{
                    attr.value = Files.items[id].info.logo[attr.name]
                });
            },
            onsure(e){

            },
            onhide(){

            }
        });
    }
    canvasFile(logoImg, fn){
        if(typeof fn === 'function'){
            let canvas = this.canvas, img = this.image, ctx = this.ctx;
            canvas.width = 0;
            canvas.height = 0;
            img.on('load', loadedFn);
            function loadedFn(){
                let ow = img.width,
                    oh = img.height,
                    tw = parseInt(logoImg.attr('data-target-width')),
                    lw = parseInt(logoImg.attr('data-logo-width')),
                    la = parseInt(logoImg.attr('data-logo-alpha')),
                    lp = parseInt(logoImg.attr('data-logo-position')),
                    lscale = logoImg.offsetHeight / logoImg.offsetWidth,
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
                    ctx.drawImage(logoImg, lx, ly, rlw, rlh);

                    fn( canvas.toFile(logoImg.attr('data-target-name'), logoImg.attr('data-target-mime')) );
                    document.body.removeChild(canvas);
                }
                img.off('load', loadedFn);
            }
            img.src = logoImg.attr('data-target-src');
        }
    }
}

export default new Logos();

