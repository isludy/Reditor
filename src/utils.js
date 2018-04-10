export default {
    range(rg){
        let s = window.getSelection();
        if(rg){
            if(s.rangeCount > 0)  s.removeAllRanges();
            if(rg.rangeCount){
                s.addRange(rg.getRangeAt(0))
            }else{
                s.addRange(rg);
            }
        }else{
            if(s.rangeCount) return s.getRangeAt(0);
            else return s;
        }
    },
    dialog(){

    },
    menu(o, context) {
        if(typeof o !== 'object' || typeof o.items !== 'object'){
            throw 'The first parameter (options && options.items) of menu must be given!';
        }
        let menu = document.createElement('div'),
            len = o.items.length,
            i = 0,
            item,
            div,
            target;

        menu.className = 'reditor-menu';
        for (; i < len; i++) {
            item = o.items[i];
            div = document.createElement('div');
            if (typeof item.data === 'object') {
                for (let k in item.data) {
                    if (item.data.hasOwnProperty(k)) div.setAttribute('data-' + k, item.data[k]);
                }
            }
            div.className = 'reditor-menu-item';
            if (typeof item.css === 'string') div.setAttribute('style', item.css);
            if (typeof item.html === 'string') div.innerHTML = item.html;
            div.addEventListener('click', handle, false);
            menu.appendChild(div);
        }

        context = (context) && (context.nodeType === 1) ? context : document.body;
        context.appendChild(menu);

        menu.addEventListener('mouseenter', enterFn, false);
        menu.style.left = (o.x || 0) + 'px';
        menu.style.top  = (o.y || 0) + 'px';

        function handle(e) {
            target = e.currentTarget;
            if(typeof o.onclick === 'function') o.onclick(target);
            leaveFn();
        }

        function enterFn() {
            menu.addEventListener('mouseleave', leaveFn, false);
        }

        function leaveFn() {
            if(typeof o.onhide === 'function') o.onhide();
            menu.removeEventListener('mouseenter', enterFn, false);
            menu.removeEventListener('mouseleave', leaveFn, false);
            if (target) target.removeEventListener('click', handle, false);
            context.removeChild(menu);
        }
        return menu;
    },
    exec(name, val, range){
        if(!range || range.collapsed) return;

        this.range(range);
        
        let uniqid = 'http://reditor.'+new Date().getTime()+'.com';

        document.execCommand('createLink', false, uniqid);

        let spans = document.querySelectorAll('a[href="'+uniqid+'"]'),
            len=spans.length,
            i = 0,
            span;

        for(; i<len; i++){
            spans[i].style[name] = val;
            span = document.createElement('span');
            span.style[name] = val;
            span.innerHTML = spans[i].innerHTML;
            spans[i].parentNode.replaceChild(span, spans[i]);
        }
    }
}