export default {
    /**
     * 获取或设置range
     * @param range {Range,Selection} 传入range时为设置，无参时获取
     * @returns s {Range} 无参数时返回range
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
                        node[attr] = newVal;
                        if(typeof fn === 'function') fn(newVal);
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
     *      title: {String} 标题,
     *      type: {Number} 默认普通弹窗，另外的值有: -1, 1, 2,
     *      body: {String} 内容,
     *      css: {String} 弹窗样式,
     *      yes: “确定”按钮的内容,
     *      no: “取消”按钮的内容,
     *      oncreated, onclose, onsure, oncancel, onhide //事件函数
     * }
     * @param context {Node} 可选 上下文，默认body
     */
    dialog(o, context=document.body){
        let box, wrapper, header, body, footer, close, yes, no, inputs;
        box = document.find('.re-dialog');
        wrapper = document.create('div');
        header = document.create('header');
        body = document.create('div');
        footer = document.create('footer');
        close = document.create('b');
        yes = document.create('button');
        no = document.create('button');

        if(o.type || !box) box = document.create('div');
        if(o.type > 0) yes.style.display = no.style.display = 'none';
        if(o.type === -1) yes.style.display = 'none';

        box.className = 're-dialog';
        wrapper.className = 're-dialog-wrapper';
        header.className = 're-dialog-header '+(o.type === 1 ? 're-danger': (o.type === 2 ? 're-warning' : 're-success'));
        body.className = 're-dialog-body';
        footer.className = 're-dialog-footer';
        close.className = 're-dialog-close';
        yes.className = 're-btn-success re-btn-m';
        no.className = 're-btn-warning re-btn-m';

        header.innerHTML = '弹窗';
        close.innerHTML = '&times;';
        yes.innerHTML = o.yes || '确定';
        no.innerHTML = o.no || '取消';
        box.innerHTML = '';
        box.removeAttr('style');

        if(typeof o.title === 'string')
            this.observe(header,'innerHTML', o, 'title');
        if(typeof o.css === 'string')
            this.observe(wrapper, 'style', o, 'css');
        if(typeof o.body === 'string')
            this.observe(body,'innerHTML', o, 'body');
        if(typeof o.yes === 'string')
            this.observe(yes,'innerHTML', o, 'yes');
        if(typeof o.no === 'string')
            this.observe(no,'innerHTML', o, 'no');

        footer.append(yes, no);
        wrapper.append(close, header, body, footer);
        box.append(wrapper);
        context.append(box);

        close.on('click', closeFn, false);
        yes.on('click', sureFn, false);
        no.on('click', closeFn, false);

        function closeFn(e){
            if(typeof o.oncancel === 'function') o.oncancel(e);
            if(typeof o.onclose === 'function') o.onclose(e);
            destory();
        }
        function sureFn(e){
            e.params = {};
            inputs = body.find('[name]');
            for(let i=0, len=inputs.length; i<len; i++)
                e.params[ inputs[i].name ] = (inputs[i].type==='checkbox' || inputs[i].type==='radio') ? inputs[i].checked : inputs[i].value;
            if(typeof o.onsure === 'function') o.onsure(e);
            destory();
        }
        function destory(){
            close.off('click', closeFn, false);
            yes.off('click', sureFn, false);
            no.off('click', closeFn, false);
            context.removeChild(box);
            if(typeof o.onhide === 'function') o.onhide();
        }

        if(typeof o.oncreated === 'function') o.oncreated();
        return box;
    },
    /**
     * 创建tab菜单
     * @param id {String, Node} 必须 选择器或节点
     * @returns {{destory: destory}} 用于注销相关事件，最好养成退出后注销的习惯，即使元素节点可能先被销毁。
     */
    tab(id){
        let context, tabs, tabbody, data, len, i=0;

        if(typeof id === 'string'){
            context = document.find('#'+id);
        }else if(id && id.nodeType === 1){
            context = id;
        }else{
            throw 'The parameter of tab must be id or element!';
        }

        id = null;
        tabs = context.find('[data-tab]');
        tabbody = context.find('[data-tabbody]');
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

        function destory(){
            try{
                tabs.off('click', handle, false);
            }catch (e) {}
        }

        return {destory};
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
    menu(o, context) {
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

        context = (context) && (context.nodeType === 1) ? context : document.body;
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
            o.selector.forEach(selector=>{
                let nodes = o.context.find(selector);
                if(nodes) {
                    if (nodes.length)
                        nodes.forEach(setStyle);
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