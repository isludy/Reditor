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
     *      id: {String} 规定弹窗id名，弹窗内框架元素将以此名扩展相应连缀添加id
     *      title: {String} 标题,
     *      colorType: {String} header的样式颜色名，默认success，另外有warning, danger。也可自定义名称如: info，然后添加 .re-info{}到样式中
     *      overlay: {boolean} 是否可以叠加弹窗，默认false。
     *      body: {String} 内容,
     *      css: {String} 弹窗样式,
     *      yes: {String,boolean} “确定”按钮的内容, 如果是false，则隐藏按钮
     *      no: {String,boolean} “取消”按钮的内容, 如果是false，则隐藏按钮
     *      oncreated, onclose, onsure, oncancel, onhide //事件函数
     * }
     * @param context {Node} 可选 上下文，默认body
     */
    dialog(o, context=document.body){
        let nodes = {
            dialog: document.re('.re-dialog'),
            wrapper: document.create('div'),
            header: document.create('div'),
            body: document.create('div'),
            footer: document.create('div'),
            close: document.create('b'),
            yes: document.create('button'),
            no: document.create('button')
        };

        if(o.overlay || !nodes.dialog) nodes.dialog = document.create('div');
        if(o.yes === false) nodes.yes.style.display = 'none';
        if(o.no === false) nodes.no.style.display = 'none';

        if(!o.yes) o.yes = '确定';
        if(!o.no) o.no = '取消';
        nodes.header.innerHTML = '弹窗';
        nodes.close.innerHTML = '&times;';
        nodes.dialog.innerHTML = '';
        nodes.dialog.removeAttr('style');

        for(let n in nodes){
            if(o.id){
                if(n !== 'dialog')
                    nodes[n].id = o.id + '-' + n;
                else
                    nodes[n].id = o.id;
            }

            switch (n){
                case 'dialog':
                    nodes[n].className = 're-dialog';
                    break;
                case 'header':
                    nodes[n].className = 're-dialog-header '+(o.colorType ? 're-'+o.colorType : 're-success');
                    if(o.title) this.observe(nodes[n],'innerHTML', o, 'title');
                    break;
                case 'yes':
                    nodes[n].className = 're-btn-success re-btn-m';
                    break;
                case 'no':
                    nodes[n].className = 're-btn-warning re-btn-m';
                    break;
                default:
                    nodes[n].className = 're-dialog-'+n;
                    if(n === 'wrapper') this.observe(nodes[n], 'style', o, 'css');
            }
            if(['body','yes','no'].includes(n)){
                this.observe(nodes[n],'innerHTML', o, n);
            }

        }

        nodes.footer.append(nodes.yes, nodes.no);
        nodes.wrapper.append(nodes.close, nodes.header, nodes.body, nodes.footer);
        nodes.dialog.append(nodes.wrapper);
        context.append(nodes.dialog);

        nodes.close.on('click', closeFn, false);
        nodes.yes.on('click', sureFn, false);
        nodes.no.on('click', closeFn, false);

        function closeFn(e){
            if(typeof o.oncancel === 'function') o.oncancel(e);
            if(typeof o.onclose === 'function') o.onclose(e);
            destory();
        }
        function sureFn(e){
            let callback;
            if(typeof o.onsure === 'function') callback = o.onsure(e);
            if(callback !== false) destory();
        }
        function destory(){
            nodes.close.off('click', closeFn, false);
            nodes.yes.off('click', sureFn, false);
            nodes.no.off('click', closeFn, false);
            context.removeChild(nodes.dialog);
            if(typeof o.onhide === 'function') o.onhide();
        }

        if(typeof o.oncreated === 'function') o.oncreated(nodes.dialog);
        return nodes.dialog;
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