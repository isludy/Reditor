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
     *      id: {String} 规定弹窗id名
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
        let dialog = re('<div'+(o.id ? ' id='+o.id : '')+' class="re-dialog">'),
            wrapper = re('<div class="re-dialog-wrapper" style="'+o.css+'">'),
            header = re('<div class="re-dialog-header re-'+(o.type || 'success')+'">'+(o.title || '弹窗')+'</div>'),
            body = re('<div class="re-dialog-body">'+(o.body || '')+'</div>'),
            footer = re('<div class="re-dialog-footer">'),
            close = re('<b class="re-dialog-close">&times;</b>'),
            btns,
            btn;

        wrapper.append(close, header, body, footer);
        dialog.append(wrapper);
        context.appendChild(dialog[0]);

        close.on('click', clickHandler);
        dialog.on('click', dialogHandler);

        if(Array.isArray(o.btns)){
            btns = [];
            o.btns.forEach(item=>{
                btn = re('<button class="re-btn-m re-btn-'+(item.type || 'success')+'">'+(item.html || item)+'</button>');
                btn.on('click', clickHandler);
                btns.push(btn[0]);
                footer.append(btn);
            });
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
            if(btns) btns.forEach(btn=>{
                re(btn).off('click', clickHandler);
            });
            btns = btn = null;
            close.off('click', clickHandler);
            dialog.off('click', dialogHandler);
            dialog.remove();
        }
        if(typeof o.created === 'function') o.created(dialog);
    },
    /**
     * 创建tab菜单
     * @param id {String, Node} 必须 选择器或节点
     * @returns {Object} 用于注销相关事件，最好养成退出后注销的习惯，即使元素节点可能先被销毁。
     */
    tab(id){
        let context, tabs, tabbody, data, len, i=0;

        context = re('#'+id);

        tabs = context.find('[data-tab]');
        tabbody = context.find('[data-tabbody]');
        len = tabbody.length;

        tabs.on('click', handle, false);

        function handle(){
            let _this = re(this);
            tabs.removeClass('active');
            _this.addClass('active');
            if(data = _this.data('tab')){
                tabbody.each(v=>{
                    if(v.data('tabbody') === data){
                        v.addClass('active');
                    }else{
                        v.removeClass('active');
                    }
                });
            }
        }

        return {
            tabs: tabs,
            bodys: tabbody,
            destroy(){
                try{
                    tabs.off('click', handle, false);
                }catch (e) {}
            }
        };
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
        if(typeof o !== 'object' || typeof o.items !== 'object'){
            throw 'The first parameter (options && options.items) of menu must be given!';
        }
        let menu = re('<div class="re-menu" style="left: '+(o.x || 0) +'px; top: '+(o.y || 0)+'px">'),
            len = o.items.length,
            i = 0,
            item,
            div,
            target;

        for (; i < len; i++) {
            item = o.items[i];
            div = re('<div class="re-menu-item"'+(item.css ? ' style="'+item.css+'"' : '')+'>'+(item.html || '')+'</div>');
            if (typeof item.data === 'object') {
                for (let k in item.data) {
                    if (item.data.hasOwnProperty(k)) div.data(k, item.data[k]);
                }
            }

            div.on('click', handle, false);
            menu.append(div);
        }
        context.appendChild(menu[0]);

        re(document).on('mouseup', upFn, false);

        function handle() {
            target = re(this);
            if(typeof o.onclick === 'function') o.onclick(target);
            leaveFn();
        }

        function upFn(e) {
            if(!menu[0].contains(e.target) && e.target !== menu[0]) leaveFn();
        }

        function leaveFn() {
            if(typeof o.onhide === 'function') o.onhide();
            if (target) target.off('click', handle, false);
            re(document).off('mouseup', upFn, false);
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
                o.context.find(selector).each(setStyle);
            });
        }
        function setStyle(node){
            node.style[o.name] = o.value;
            if(node.tagName === 'FONT'){
                let span = re('<span style="'+node.attr('style')+'">'+node.innerHTML+'</span>');
                node.parentNode.replaceChild(span[0], node);
            }
        }
    }
}