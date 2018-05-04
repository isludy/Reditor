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
     * 监听数据模型改变node的一些属性
     * @param node 数据改变时，影响的节点
     * @param attr 影响的节点属性
     * @param obj  数据模型
     * @param name 监听的属性
     * @param fn 回调
     */
    observe(node, attr, obj, name, fn){
        if(/(style)|(^data-*)|(name)/i.test(attr)){
            node.attr('style', obj[name]);
            Object.defineProperty(obj, 'css', {
                set(newVal){
                    if(newVal !== node.attr('style')){
                        node.attr('style', newVal);
                        if(typeof fn === 'function') fn(newVal);
                    }
                },
                get(){
                    return node.attr('style');
                }
            });
        }else{
            node[attr] = obj[name];
            Object.defineProperty(obj, name, {
                set(newVal){
                    if(newVal !== node[attr]){
                        if(newVal === false){
                            node.style.display = 'none';
                        }else{
                            node[attr] = newVal;
                            if(typeof fn === 'function') fn(newVal);
                        }
                    }
                },
                get(){
                    return node[attr];
                }
            });
        }
    },
    /**
     * 创建弹窗
     * @param o {Object} 必需
     * {
     *      id: {String} 规定弹窗id名
     *      title: {String} 标题,
     *      colorType: {String} header的样式颜色名，默认success，另外有warning, danger。也可自定义名称如: info，然后添加 .re-info{}到样式中
     *      body: {String} 内容,
     *      css: {String} 弹窗样式,
     *      yes: {String}
     *      no: {String} “取消”按钮的内容, 如果是false，则隐藏按钮
     *      oncreated, onclose, onsure, oncancel, onhide //事件函数
     * }
     * @param context {Node,Element,NodeList,HTMLCollection} 可选 上下文，默认body
     */
    dialog(o, context=document.body){
        let dialog = document.create('div'),
            nodes = {
            wrapper: document.create('div'),
            header: document.create('div'),
            body: document.create('div'),
            footer: document.create('div'),
            close: document.create('b')
        },
        btns,
        btn;

        nodes.header.innerHTML = o.title || '弹窗';
        nodes.close.innerHTML = '&times;' ;
        nodes.body.innerHTML = o.body || '';
        nodes.wrapper.attr('style', o.css);

        if(o.id) dialog.id = o.id;

        for(let n in nodes){
            nodes[n].addClass('re-dialog-'+n);
        }
        nodes.header.addClass(o.type ? 're-'+o.type : 're-success');
        dialog.addClass('re-dialog');

        nodes.wrapper.append(nodes.close, nodes.header, nodes.body, nodes.footer);
        dialog.append(nodes.wrapper);
        context.append(dialog);

        nodes.close.on('click', clickHandler, false);

        if(o.btns && o.btns.length){
            btns = [];
            o.btns.each((item)=>{
                btn = document.create('button');
                if(typeof item === 'string'){
                    btn.className = 're-btn-m re-btn-success';
                    btn.innerHTML = item;
                }else if(typeof item === 'object'){
                    btn.className = 're-btn-m re-btn-' + item.type;
                    btn.innerHTML = item.html;
                }
                btn.on('click', clickHandler);
                btns.push(btn);
                nodes.footer.append(btn);
            });
        }

        function clickHandler(e){
            if(typeof o.clicked === 'function'){
                if(o.clicked.call(this, btns.indexOf(this), dialog, e) !== false) destroy();
            }else{
                destroy();
            }
        }
        function destroy(){
            if(btns) btns.each(btn=>{
                btn.off('click', clickHandler);
            });
            btns = btn = null;
            nodes.close.off('click', clickHandler);
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

        if(typeof id === 'string'){
            context = document.re('#'+id);
        }else if(id && id.nodeType === 1){
            context = id;
        }else{
            throw new Error('The parameter of tab must be id or element!');
        }

        id = null;
        tabs = context.re('[data-tab]');
        tabbody = context.re('[data-tabbody]');
        len = tabbody.length;

        tabs.on('click', handle, false);

        function handle(e){
            tabs.removeClass('active');
            this.addClass('active');
            if(data = e.currentTarget.attr('data-tab')){
                for(i=0; i<len; i++){
                    if(tabbody[i].attr('data-tabbody') === data){
                        tabbody[i].addClass('active');
                    }else{
                        tabbody[i].removeClass('active');
                    }
                }
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
     * @param context {Node} 可选 上下文，默认body
     * @returns menu {Node} 菜单节点
     */
    menu(o, context = document.body) {
        if(typeof o !== 'object' || typeof o.items !== 'object'){
            throw 'The first parameter (options && options.items) of menu must be given!';
        }
        let menu = document.create('div'),
            len = o.items.length,
            i = 0,
            item,
            div,
            target;

        menu.className = 're-menu';
        for (; i < len; i++) {
            item = o.items[i];
            div = document.create('div');
            if (typeof item.data === 'object') {
                for (let k in item.data) {
                    if (item.data.hasOwnProperty(k)) div.attr('data-' + k, item.data[k]);
                }
            }
            div.className = 're-menu-item';
            if (typeof item.css === 'string')
                div.attr('style', item.css);
            else if(typeof item.css === 'object')
                for(let k in item.css)
                    if(item.css.hasOwnProperty(k))
                        div.style[k] = item.css[k];

            if (typeof item.html === 'string') div.innerHTML = item.html;

            div.on('click', handle, false);
            menu.append(div);
        }
        context.append(menu);

        document.on('mouseup', upFn, false);
        menu.style.left = (o.x || 0) + 'px';
        menu.style.top  = (o.y || 0) + 'px';

        function handle(e) {
            target = e.currentTarget;
            if(typeof o.onclick === 'function') o.onclick(target);
            leaveFn();
        }

        function upFn(e) {
            if(!menu.contains(e.target) && e.target !== menu) leaveFn();
        }

        function leaveFn() {
            if(typeof o.onhide === 'function') o.onhide();
            if (target) target.off('click', handle, false);
            document.off('mouseup', upFn, false);
            context.removeChild(menu);
        }
        return menu;
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
        document.cmd(o.cmdName, false, o.cmdValue);
        if(o.value && o.name && o.context && o.selector){
            o.selector.each(selector=>{
                let nodes = o.context.re(selector);
                if(nodes) {
                    if (nodes.length)
                        nodes.each(setStyle);
                    else
                        setStyle(nodes);
                }
            });
        }
        function setStyle(node){
            node.style[o.name] = o.value;
            if(node.tagName === 'FONT'){
                let span = document.create('span');
                span.attr('style', node.attr('style'));
                span.innerHTML = node.innerHTML;
                node.parentNode.replaceChild(span, node);
            }
        }
    }
}