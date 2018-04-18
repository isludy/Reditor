export default {
    /**
     * 获取或设置range
     * @param range {Range,Selection} 传入range时为设置，无参时获取
     * @returns s {Range} 无参数时返回range
     */
    range(range){
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
     * 创建弹窗
     * @param o {Object} 必需 {
     *      title: 标题,
     *      type: 默认普通弹窗，另外的值有 1，2,
     *      body: 内容,
     *      css: 弹窗样式,
     *      yes: “确定”按钮的内容,
     *      no: “取消”按钮的内容,
     *      oncreated, onclose, onsure, oncancel, onhide //事件函数
     * }
     * @param context {Node} 可选 上下文，默认body
     */
    dialog(o, context){
        let box, wrapper, header, body, footer, close, yes, no, inputs;

        context = context && context.nodeType === 1 ? context : document.body;

        box = document.find('.re-dialog');
        wrapper = document.create('div');
        header = document.create('header');
        body = document.create('div');
        footer = document.create('footer');
        close = document.create('b');
        yes = document.create('button');
        no = document.create('button');

        if(o.type || !box) box = document.create('div');

        box.className = 're-dialog';
        wrapper.className = 're-dialog-wrapper';
        header.className = 're-dialog-header '+(o.type === 1 ? 're-danger': (o.type === 2 ? 're-warning' : 're-success'));
        body.className = 're-dialog-body';
        footer.className = 're-dialog-footer';
        close.className = 're-dialog-close';
        yes.className = 're-btn-success re-btn-m';
        no.className = 're-btn-warning re-btn-m';

        header.innerHTML = o.title || '弹窗';
        close.innerHTML = '&times;';
        yes.innerHTML = o.yes || '确定';
        no.innerHTML = o.no || '取消';

        if(o.type === 1) yes.style.display = no.style.display = 'none';

        box.innerHTML = '';
        box.removeAttr('style');

        if(typeof o.css === 'string') wrapper.attr('style', o.css);

        if(o.body){
            if(typeof o.body === 'string') body.innerHTML = o.body;
            if(o.body.nodeType === 1) body.append(o.body);
        }

        header.append(close);
        footer.append(yes, no);
        wrapper.append(header, body, footer);
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
            for(let i=0, len=inputs.length; i<len; i++) e.params[ inputs[i].name ] = inputs[i].value;
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
     * @param o {Object}必需 {
     *      items:[{
     *          css: 项的style,
     *          html: 项的html,
     *          data: 项的attribute，用来保存execCommand命令需要的值
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
            if (typeof item.css === 'string') div.attr('style', item.css);
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
     * @param name {String} 一般是style键名
     * @param val {String} 一般是style值
     * @param range {Range,Selection} range对象
     * @param native {boolean} 使用原生命令，默认false。execCommand支持的话，最好使用原生命令
     */
    exec(name, val, range, native=false){
        if(!range || range.collapsed) return;
        this.range(range);
        if(native)
            document.cmd(name, false, val);
        else{
            // document.cmd()
            /*
            //TODO:遗留的问题，如果选区跨过块级元素的单边，由于DocumentFragment自动补全，会生产换行。
             let  span = document.createElement("span"),
                 frag = range.extractContents();
             console.log(range);
             span.style[name] = val;
             frag.childNodes.forEach(child=>{
                 if(child.nodeType === 3){
                     let newSpan = span.cloneNode();
                     newSpan.style[name] = val;
                     newSpan.innerHTML = child.data;
                     frag.replaceChild(newSpan, child);
                 }else if(child.nodeType === 1){
                     child.style[name] = val;
                     //TODO:后代元素有相同样式时，权重问题
                     // let son = child.find('*');
                 }
             });
             span.appendChild(frag);
             range.insertNode(span);
             span.insertAdjacentHTML('beforebegin', span.innerHTML);
             span.remove();
             */
        }
    }
}