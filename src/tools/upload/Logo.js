import utils from '../../utils';

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    img = new Image();

canvas.attr('style','position:fixed;top:-99999px;');

let Logo = {
    contextMenu(x, y, target, item){
        utils.menu({
            x,
            y,
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
                data: {name: 'setLogo'}
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
                        item.parentNode.find('.re-upload-logo').removeClass('active');
                        break;
                    case 'addAll':
                        item.parentNode.find('.re-upload-logo').addClass('active');
                        break;
                    case 'setLogo':
                        let style1 = 'width:5em;font-size:14px;text-align:right;display:inline-block;',
                            style2 = 'width:5em;text-align:center;';
                        utils.dialog({
                            overlay: true,
                            title: '设置logo属性',
                            body: `
                                <b>预估它们在网页中实际显示的宽度：</b>
                                <p>
                                    <span  style="${style1}">图片：</span>
                                    <input class="re-input-m" type="text" name="targetWidth" style="${style2}"> px
                                </p>
                                <p>
                                    <span  style="${style1}">logo：</span>
                                    <input class="re-input-m" type="text" name="logoWidth" style="${style2}"> px
                                </p>
                                <hr>
                                <b>logo的其他属性设置：</b>
                                <p>
                                    <span  style="${style1}">透明度：</span>
                                    <input class="re-input-m" type="text" name="logoAlpha" style="${style2}"> %
                                </p>
                                <p>
                                    <span  style="${style1}">位置：</span>
                                    <select class="re-input-m" name="logoPosition" style="${style2}">
                                        <option value="1">左上</option>
                                        <option value="2">右上</option>
                                        <option value="3">中心</option>
                                        <option value="4">左下</option>
                                        <option value="5">右下</option>
                                    </select>
                                </p>`,
                            oncreated(box){
                                box.find('[name="targetWidth"]')[0].value = target.attr('data-target-width');
                                box.find('[name="logoWidth"]')[0].value = target.attr('data-logo-width');
                                box.find('[name="logoAlpha"]')[0].value = target.attr('data-logo-alpha');
                                box.find('[name="logoPosition"]')[0].value = target.attr('data-logo-position');
                            },
                            onsure(e){
                                target.attr('data-target-width', e.params.targetWidth);
                                target.attr('data-logo-width', e.params.logoWidth);
                                target.attr('data-logo-alpha', e.params.logoAlpha);
                                target.attr('data-logo-position', e.params.logoPosition);
                            }
                        });
                        break;
                }
            }
        });
    },
    canvasFile(targetImg, logoImg, fn){
        if(targetImg && logoImg.hasClass('active') && (typeof fn === 'function')){
            img.src = targetImg.src;
            img.onload = function(){
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

                    fn( canvas.toFile(targetImg.data('name'), targetImg.data('mime')) );

                    document.body.removeChild(canvas);
                }
                img.onload = img = null;
            }
        }
    }
};

export default Logo;
