/**
 * 基类，用于处理Dom, 类似jQuery
 * 将与Fe.static静态类合并为fe
 */
class Fe{
    constructor(s){
        s = Fe.__nodes__(s);
        if(this.length = s.length){
            for(let i=0; i<this.length; i++){
                this[i] = s[i];
            }
        }
        s = null;
    }
    /**
     * find: 查找指定选择器的树枝节点
     * @param {string} s css选择器
     * @return {Fe}
     */
    find(s){
        let arr = [];
        if(typeof s === 'string'){
            Fe.__for__(this, function(el){
                let tmp = el.querySelectorAll(s);
                for(let i=0,len=tmp.length; i<len; i++){
                    if(arr.indexOf(tmp[i]) === -1){
                        arr.push(tmp[i]);
                    }
                }
            });
        }
        return fe(arr);
    }
    /**
     * children: 查找子节点
     * @param {string} s 可选，css选择器，表示选择子级中匹配的节点
     * @return {Fe}
     */
    children(s=''){
        let arr = [];
        Fe.__for__(this,function(el){
            let tmp = el.childNodes;
            for(let i=0,len=tmp.length; i<len; i++){
                if(tmp[i].nodeType === 1 && arr.indexOf(tmp[i]) === -1){
                    if(!s){
                        arr.push(tmp[i]);
                    }else if(typeof s === 'string'){
                        let stmp = el.querySelectorAll(s);
                        for(let j=0,slen=stmp.length; j<slen; j++){
                            if(tmp[i] === stmp[j]){
                                arr.push(stmp[j]);
                            }
                        }
                    }
                }
            }
        });
        return fe(arr);
    }
    /**
     * siblings: 获取兄弟节点集
     * @param {string} s 可选，css选择器
     * @return {Fe}
     */
    siblings(s=''){
        let that = this,
            arr = [];
        Fe.__for__(this.parent().children(s),function(el){
            for(let i=0; i<that.length; i++){
                if(el === that[i]) break;
                arr.push(el);
            }
        });
        return fe(arr);
    }
    /**
     * parent: 获取父级节点集
     * @param {string} s 可选，css选择器
     * @return {Fe}
     */
    parent(s=''){
        let arr = [];
        Fe.__for__(this,function(el){
            let p = el.parentNode;
            if(arr.indexOf(p) === -1){
                if(!s){
                    arr.push(p);
                }else{
                    let els = (p.parentNode || document).querySelectorAll(s);
                    for(let i=0,len=els.length; i<len; i++){
                        if(els[i] === p){
                            arr.push(p);
                        }
                    }
                }
            }
        });
        return fe(arr);
    }
    /**
     * parents: 获取父级及以上的节点集
     * @param {string} s 可选，css选择器
     * @param {number} arg1 可选，表示获取到第arg1个时停止再往上一级查找
     * @param {Node} arg2 可选，表示查找范围，默认是标签html以内
     * @return {Fe}
     */
    parents(s='', arg1=0, arg2=document.documentElement){
        let arr = [];
        Fe.__for__(this,rec);
        function rec(el){
            let p = el.parentNode;
            if(arr.indexOf(p) === -1){
                if(!s){
                    arr.push(p);
                }else{
                    let els = (p.parentNode || document).querySelectorAll(s);
                    for(let i=0,len=els.length; i<len; i++){
                        if(els[i] === p){
                            arr.push(p);
                        }
                    }
                }
                if(p.parentNode && p.parentNode !== arg2){
                    if(!arg1 || arr.length < arg1){
                        rec(p);
                    }
                }
            }
        }
        return fe(arr);
    }
    /**
     * eq: 获取一个指定index的fe
     * @param {number} index 索引
     * @return {Fe}
     *
     */
    eq(index){
        return fe(this[index]);
    }
    /**
     * first: 获取第一个fe
     * @return {Fe}
     */
    first(){
        return fe(this[0]);
    }
    /**
     * last: 获取最后一个fe
     * @return {Fe}
     */
    last(){
        return fe(this[this.length-1]);
    }
    /**
     * index: 获取元素节点的索引
     * @return {number}
     */
    index(){
        let c = this[0].parentNode.childNodes,
            index = 0;
        for(let i=0,len=c.length; i<len; i++){
            if(c[i].nodeType === 1){
                if(c[i] === this[0]) return index;
                index++;
            }
        }
    }
    /**
     * html: 获取或添加html
     * @param {string} s 可选，htmlstring，有参数时表示设定innerHTML,无参数时表示返回innerHTML
     * @return {Fe, string}
     */
    html(s){
        if(!s && s !== ''){
            return this[0].innerHTML;
        }else{
            Fe.__for__(this,function(el){
                el.innerHTML = s;
            });
        }
        return this;
    }
    /**
     * text: 获取或添加text
     * @param {string} t 可选，text/html string, 同理于html方法
     * @return {Fe}
     */
    text(t){
        if(!t && t !== ''){
            return this[0].innerText;
        }else{
            Fe.__for__(this,function(el){
                el.innerText = t;
            });
        }
        return this;
    }
    /**
     * getTextNodes: 获取所有子节点及以下的文字节点
     * @param {boolean} flag 保存的是节点内容还是节点
     * @return{NodeList, Array} arr;
     */
    getTextNodes(flag = false){
        let arr = [];
        fn(this);
        function fn(doms) {
            Fe.__for__(doms, function (el) {
                if (el.nodeType === 3 && el.data.replace(/\s+/g, '')) {
                    if(flag){
                        arr.push(el.data);
                    }else{
                        arr.push(el);
                    }
                }else{
                    fn(el.childNodes);
                }
            });
        }
        return arr;
    }
    /**
     * toHtml: fe转成html string
     * @return {string}
     */
    toHtml(){
        let div = document.createElement('div');
        if(this[0]){
            div.appendChild(this[0]);
            return div.innerHTML;
        }
        div = null;
        return '';
    }
    /**
     * toText: fe转成text string
     * @return {string}
     */
    toText(){
        let div = document.createElement('div');
        if(this[0]){
            div.appendChild(this[0]);
            return div.innerText;
        }
        div = null;
        return '';
    }
    /**
     * css: 设置style
     * @param {object,string} a 设定样式的json或者样式名
     * @param {string} b 设定样式值。如果a为object，则b会被忽略
     * @return {Fe}
     */
    css(a,b){
        if(typeof a === 'object'){
            Fe.__for__(this,function(el){
                for(let k in a){
                    el.style[k] = a[k];
                }
            });
        }else if(typeof a === 'string'){
            if(arguments.length >= 2){
                Fe.__for__(this,function(el){
                    el.style[a] = b;
                });
            }else{
                return this[0].style[a];
            }
        }
        return this;
    }
    /**
     * addClass : 添加className
     * @param {string} c
     * @return {Fe}
     */
    addClass(c){
        let arr = null;
        Fe.__for__(this,function(el){
            arr = el.className.split(/\s+/);
            if(arr.indexOf(c) === -1){
                arr.push(c);
                el.className = arr.join(' ');
            }
        });
        return this;
    }
    /**
     * removeClass: 移除class
     * @param {string} c
     * @return {Fe}
     */
    removeClass(c){
        let arr = null,
            index = null;
        Fe.__for__(this,function(el){
            arr = el.className.split(/\s+/);
            if((index = arr.indexOf(c)) !== -1){
                arr.splice(index,1);
                el.className = arr.join(' ');
            }
        });
        return this;
    }
    /**
     * hasClass: 判断是否有指定的className
     * @param {string} c className
     * @return {boolean}
     */
    hasClass(c){
        if(this[0].className){
            return this[0].className.split(/\s+/).indexOf(c) !== -1;
        }else{
            return false;
        }
    }
    /**
     * each: 遍历fe实现对象的节点
     * @param {function} fn 回调函数
     * @return {Fe}
     */
    each(fn){
        if(typeof fn === 'function'){
            for(let i=0; i<this.length; i++){
                fn.call(this[i],i,this[i]);
            }
        }
        return this;
    }
    /**
     * attr: 获取元素属性列表，包括自定义属性，无参时返回对象的属性列表
     * @param {object,string} a 可选，设定多个属性时用object,单个时string:attribute name
     * @param {string} b 可选，设定的属性值，如果a为object,则此参数被忽略
     * @return {Fe, string}
     */
    attr(a,b){
        switch(arguments.length){
            case 0:
                return this[0].attributes;
                break;
            case 1:
                if(typeof a === 'string'){
                    return this[0].getAttribute(a);
                }else if(typeof a === 'object'){
                    Fe.__for__(this,function(el){
                        for(let i in a){
                            el.setAttribute(i,a[i]);
                        }
                    });
                }
                break;
            case 2:
                Fe.__for__(this,function(el){
                    el.setAttribute(a,b);
                });
                break;
        }
        return this;
    }
    /**
     * removeAttr: 移除指定的属性或全部属性
     * @param {string} a 可选，属性名
     * @param {string} b 可选，属性值
     * @return {Fe}
     */
    removeAttr(a,b){
        let len = arguments.length,
            attrs;
        Fe.__for__(this,function(el){
            if(a){
                if(len === 1){
                    el.removeAttribute(a);
                }else if(len === 2 && el.getAttribute(a) === b){
                    el.removeAttribute(a);
                }
            }else{
                attrs = el.attributes;
                for(let i=0,l=attrs.length; i<l; i++){
                    try{
                        el.removeAttribute(attrs[0].nodeName);
                    }catch(err){}
                }
            }
        });
        return this;
    }
    /**
     * on: 绑定事件
     * @param {event.type} type 事件名
     * @param {function} fn 事件函数
     */
    on(type,fn){
        if(fn){
            Fe.__for__(this,function(el){
                el.addEventListener(type,fn,false);
            });
        }
        return this;
    }
    /**
     * off: 移除事件
     * @param {event.type} type 事件名
     * @param {function} fn 事件函数
     * @return {Fe}
     */
    off(type,fn){
        if(fn){
            Fe.__for__(this,function(el){
                el.removeEventListener(type,fn,false);
            });
        }
        return this;
    }
    /**
     * append: 添加节点到尾部
     * @param {Node,NodeList,Fe} dom 实例对象fe/node/nodeList
     * @return {Fe}
     */
    append(dom){
        let that = this;
        for(let n=0, nlen=arguments.length; n<nlen; n++){
            let o = (arguments[n] instanceof Fe) ? arguments[n] : Fe.__nodes__(arguments[n]);
            Fe.__for__(this,function(el,index){
                for(let i=0,len=o.length; i<len; i++){
                    if(index < that.length-1){
                        el.appendChild(o[i].cloneNode(true));
                    }else{
                        el.appendChild(o[i]);
                    }
                }
            });
        }
        return this;
    }
    /**
     * prepend: 添加节点到首部
     * @param {Node,NodeList,Fe} o 实例对象fe/node/nodeList
     * @return {Fe}
     */
    prepend(o){
        let that = this;
        o = (o instanceof Fe) ? o : Fe.__nodes__(o);
        Fe.__for__(this,function(el,index){
            for(let i=0,len=o.length; i<len; i++){
                if(index < that.length-1){
                    el.insertBefore(o[i].cloneNode(true),el.childNodes[0]);
                }else{
                    el.insertBefore(o[i],el.childNodes[0]);
                }
            }
        });
        return this;
    }
    /**
     * remove: 删除节点
     * @return {Fe}
     */
    remove(){
        Fe.__for__(this,function(el){
            try{
                el.parentNode.removeChild(el);
            }catch(err){}
        });
        return this;
    }
    /**
     * before: 插入节点到指定节点之前
     * @param {Node,NodeList,Fe} o 实例对象fe/node/nodeList
     * @return {Fe}
     */
    before(o){
        let that = this;
        o = (o instanceof Fe) ? o : Fe.__nodes__(o);
        Fe.__for__(this,function(el,index){
            for(let i=0,len=o.length; i<len; i++){
                if(index < that.length-1){
                    el.parentNode.insertBefore(o[i].cloneNode(true),el);
                }else{
                    el.parentNode.insertBefore(o[i],el);
                }
            }
        });
        return this;
    }
    /**
     * after: 插入节点到指定节点之后
     * @param {Node,NodeList,Fe} o 实例对象fe/node/nodeList
     * @return {Fe}
     */
    after(o){
        let that = this;
        o = (o instanceof Fe) ? o : Fe.__nodes__(o);
        Fe.__for__(this,function(el,index){
            for(let i=0,len=o.length; i<len; i++){
                if(index < that.length-1){
                    el.parentNode.insertBefore(o[i].cloneNode(true),el.nextSibling);
                }else{
                    el.parentNode.insertBefore(o[i],el.nextSibling);
                }
            }
        });
        return this;
    }

    /**
     * 获取尺寸
     * @param {Node,NodeList,Fe} p
     * @return {{top: (Number|number), left: (Number|number)}}
     */
    offset(p){
        let op = Fe.__nodes__(p)[0],
            top = this[0].offsetTop,
            left = this[0].offsetLeft,
            o = this[0].offsetParent;
        if(p){
            while(true){
                if(!o || o === op) break;
                top += o.offsetTop;
                left += o.offsetLeft;
                o = o.offsetParent;
            }
        }
        return {
            top: top,
            left: left
        };
    }
    /**
     * Fe.__nodes__: Fe参数处理为节点集和创建节点集
     * @param {Fe,NodeList,Node,String,html} s [接收fe对象、节点、节点列表、css选器、html字符串]
     */
    static __nodes__(s){
        let el = [];
        //is Fe
        if(s instanceof Fe){
            el = s;
        }
        //is node
        else if(s === document || (s && s.nodeType && s.nodeType === 1) ){
            el[0] = s;
        }
        //is nodeList
        else if(s && s.length && s[0] && s[0].nodeType && s[0].nodeType === 1){
            el = s;
        }else if(typeof s === 'string'){
            //create node
            if( /^<(\w+)[^>]*?>([\s\S]*)<\/\1>$/i.test(s) || /^<(\w+)[^>]*?>$/i.test(s)){
                let div = document.createElement('div');
                div.innerHTML = s;
                el[0] = div.childNodes[0];
                div = null;
            }
            //is selector
            else{
                el = document.querySelectorAll(s);
            }
        }
        return el;
    }
    /**
     * Fe.__for__: 遍历处理。一般处理节点集，让每个节点都做同样的fn
     * @param {Fe,Node,NodeList} arr 节点集
     * @param {function} fn 处理的函数
     */
    static __for__(arr,fn){
        if(arr.length && fn){
            for(let i=0; i<arr.length; i++){
                fn(arr[i],i);
            }
        }
    }
    /**
     * 定义toString
     * @return {string}
     */
    toString(){
        return 'class Fe{ [native code] }';
    }
    /**
     * 创建editor, 到Fe.static中重写
     * @param o
     * @return {Editor}
     */
    createEditor(o){}
}
module.exports = Fe;