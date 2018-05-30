import re from './re';

export default {
    /**
     * 获取或设置range
     * @param range {Range,Selection} 传入range时为设置，无参时获取
     * @returns {Range} 无参数时返回range
     */
    range(range = null){
        let sel = window.getSelection();
        if(range instanceof Range){
            if(sel.rangeCount > 0)
                sel.removeAllRanges();
            sel.addRange(range);
        }else{
            if(sel.rangeCount)
                return sel.getRangeAt(0);
            else
                return document.createRange();
        }
    },
    /**
     * 判断是否空对象
     * @param o
     * @returns {boolean}
     */
    isEmpty(o){
        return JSON.stringify(o) === '{}';
    },
    /**
     * 创建弹窗
     * @param o {Object} 必需
     * {
     *      title: {String} 标题,
     *      type: {String} header的样式颜色名，默认success，另外有warning, danger。也可自定义名称如: info，然后添加 .re-info{}到样式中
     *      body: {String} 内容,
     *      css: {String} 弹窗样式,
     *      created: {Function} 事件，节点创建并添加完成时触发
     *      clicked: {Function} 事件，点击按钮时触发
     * }
     * @param context {Node,Element,NodeList,HTMLCollection} 可选 上下文，默认body
     */
    dialog(o, context=document.body){
        let dialog = re('<div class="re-dialog">'),
            wrapper = re('<div class="re-dialog-wrapper" style="'+o.css+'">'),
            header = re('<div class="re-dialog-header re-'+(o.type || 'success')+'">'+(o.title || '弹窗')+'</div>'),
            body = re('<div class="re-dialog-body">'+(o.body || '')+'</div>'),
            footer = re('<div class="re-dialog-footer">'),
            close = re('<b class="re-dialog-close">&times;</b>'),
            btns;

        wrapper.append(close, header, body, footer);
        dialog.append(wrapper);
        re(context).append(dialog);

        close.on('click', clickHandler);
        dialog.on('click', dialogHandler);

        if(Array.isArray(o.btns)){
            o.btns.forEach(item=>{
                footer.append(re('<button class="re-btn-m re-btn-'+(item.type || 'success')+'">'+(item.html || item)+'</button>')
                    .on('click', clickHandler));
            });
            btns = footer.find('button');
        }

        function clickHandler(e){
            if(typeof o.clicked === 'function'){
                if(o.clicked.call(this,  (btns ? btns.indexOf(this) : -1), dialog, e) !== false) destroy();
            }else{
                destroy();
            }
        }
        function dialogHandler(e) {
            if (e.target === this) clickHandler.call(this, e);
        }
        function destroy(){
            if(btns) btns.off('click', clickHandler);
            close.off('click', clickHandler);
            dialog.off('click', dialogHandler);
            dialog.remove();
            btns = null;
        }
        if(typeof o.created === 'function') o.created(dialog);
    },

    /**
     * 用于创建菜单
     * @param o {Object}必需
     * {
     *      items:[{
     *          css: {String,Object} 项的style,
     *          html: {String} 项的html,
     *          data: {String} 项的attribute，例如用来保存execCommand命令需要的值
     *      }],
     *      x: 菜单的left,
     *      y: 菜单的top,
     *      onclick, onhide //事件
     * }
     * @param context 可选 上下文，默认body
     */
    menu(o, context = document.body) {
        if(typeof o !== 'object')
            throw new Error('The first parameter of menu must be an object not null!');
        if(!Array.isArray(o.items))
            return;

        let menu = re('<div class="re-menu" style="left: '+(o.x || 0) +'px; top: '+(o.y || 0)+'px">'),
            doc = re(document),
            items;

        o.items.forEach(item=>{
            let div = re('<div class="re-menu-item"'+(item.css ? ' style="'+item.css+'"' : '')+'>'+(item.html || '')+'</div>');
            if (typeof item.data === 'object') {
                for (let k in item.data)
                    div.data(k, item.data[k]);
            }else{
                div.data('name', item.data);
            }
            div.on('click', handle, false);
            menu.append(div);
        });

        items = menu.children();

        re(context).append(menu);

        doc.on('mouseup', upFn, false);

        function handle() {
            if(typeof o.onclick === 'function') o.onclick( re(this) );
            leaveFn();
        }

        function upFn(e) {
            if(!menu.has(e.target)) leaveFn();
        }

        function leaveFn() {
            if(typeof o.onhide === 'function') o.onhide();
            items.off('click', handle, false);
            doc.off('mouseup', upFn, false);
            menu.remove();
        }
    },
    /**
     * 代替execCommand命令来完成文档的一些复杂操作
     * @param o {Object}
     * {
     *      range: {Range,Selection} range对象
     *      name: {String} css样式名
     *      value: {String,Number} 一般是style值，即最终要添加的样式
     *      cmdName: {String} execCommand命令
     *      cmdValue: {String,Number} 提供给execCommand的参数
     *      selector: {Array} 替换标签的选择器
     *      context: {Node,Element} 一般是editor.edit
     *  }
     */
    exec(o){
        if(!o.range || o.range.collapsed) return;
        this.range(o.range);
        document.execCommand(o.cmdName, false, o.cmdValue);
        if(o.value && o.name && o.context && o.selector){
            o.selector.forEach(selector=>{
                o.context.find(selector).each(el=>{
                    el.style[o.name] = o.value;
                    if(el.tagName === 'FONT'){
                        let span = re('<span style="'+el.attr('style')+'">'+el.innerHTML+'</span>');
                        el.parentNode.replaceChild(span[0], el);
                    }
                });
            });
        }
    },
    thumb(el, w, h){
        let cv = document.createElement('canvas'),
            ctx = cv.getContext('2d');
        cv.width = w;
        cv.height = h;

        if(el){
            if(el.tagName === 'VIDEO'){
                el.currentTime = Math.floor(el.duration / 2);
            }
            ctx.drawImage(el, 0, 0, cv.width, cv.height);
        }else{
            ctx.fillStyle = '#ccc';
            ctx.fillRect(0, 0, cv.width, cv.height);
            ctx.font = 'bold 36px "microsoft yahei","Open Sans", sans-serif';
            ctx.fillStyle = '#888';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("AUDIO", cv.width/2, cv.height/2);
        }

        ctx.globalAlpha = 0.7;

        let px = cv.width/2 - 18,
            py = cv.height/2 - 18;
        ctx.beginPath();
        ctx.arc(px+14, py+18, 28, 0, 2*Math.PI);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px+36, py+18);
        ctx.lineTo(px, py+36);
        ctx.fillStyle = '#fff';
        ctx.closePath();
        ctx.fill();
        return window.createURL(cv.toFile('thumb.jpg', 'image/jpeg'));
    }
}