const Editor = require('./Editor');
const ui = require('./ui');
/**
 * 基类： Fe
 */
class Fe{
    constructor(s){
        s = __nodes__(s);
        if(this.length = s.length){
            for(var i=0; i<this.length; i++){
                this[i] = s[i];
            }
        }
        s = null;
    }
    /**
     * find: 查找指定选择器的树枝节点
     * @param {string} s css选择器
     */
    find(s){
        var arr = [];
        if(typeof s === 'string'){
            __for__(this, function(el){
                var tmp = el.querySelectorAll(s);
                for(var i=0,len=tmp.length; i<len; i++){
                    if(arr.indexOf(tmp[i]) == -1){
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
     */
    children(s){
        var arr = [];
        __for__(this,function(el){
            var tmp = el.childNodes;
            for(var i=0,len=tmp.length; i<len; i++){
                if(tmp[i].nodeType === 1 && arr.indexOf(tmp[i]) == -1){
                    if(!s){
                        arr.push(tmp[i]);
                    }else if(typeof s === 'string'){
                        var stmp = el.querySelectorAll(s);
                        for(var j=0,slen=stmp.length; j<slen; j++){
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
     */
    siblings(s){
        var that = this,
            arr = [];
        __for__(this.parent().children(s),function(el){
            for(var i=0; i<that.length; i++){
                if(el === that[i]) break;
                arr.push(el);
            }
        });
        return fe(arr);
    }
    /**
     * parent: 获取父级节点集
     * @param {string} s 可选，css选择器
     */
    parent(s){
        var arr = [];
        __for__(this,function(el){
            var p = el.parentNode;
            if(arr.indexOf(p) == -1){
                if(!s){
                    arr.push(p);
                }else{
                    var els = (p.parentNode || document).querySelectorAll(s);
                    for(var i=0,len=els.length; i<len; i++){
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
     * @param {number} arg[1] 可选，表示获取到第arg[1]个时停止再往上一级查找
     * @param {node} arg[2] 可选，表示查找范围，默认是标签html以内
     */
    parents(s){
        var arr = [],
            nlimit = typeof arguments[1] === 'number' ? arguments[1] : 0,
            plimit = arguments[2] || document.documentElement;
        __for__(this,rec);
        function rec(el){
            var p = el.parentNode;
            if(arr.indexOf(p) == -1){
                if(!s){
                    arr.push(p);
                }else{
                    var els = (p.parentNode || document).querySelectorAll(s);
                    for(var i=0,len=els.length; i<len; i++){
                        if(els[i] === p){
                            arr.push(p);
                        }
                    }
                }
                if(p.parentNode && p.parentNode !== plimit){
                    if(!nlimit || arr.length < nlimit){
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
     *
     */
    eq(index){
        return fe(this[index]);
    }
    /**
     * first: 获取第一个fe
     */
    first(){
        return fe(this[0]);
    }
    /**
     * last: 获取最后一个fe
     */
    last(){
        return fe(this[this.length-1]);
    }
    /**
     * index: 获取元素节点的索引
     */
    index(){
        var c = this[0].parentNode.childNodes,
            index = 0;
        for(var i=0,len=c.length; i<len; i++){
            if(c[i].nodeType === 1){
                if(c[i] === this[0]) return index;
                index++;
            }
        }
    }
    /**
     * html: 获取或添加html
     * @param {string} s 可选，htmlstring，有参数时表示设定innerHTML,无参数时表示返回innerHTML
     */
    html(s){
        if(!s && s != ''){
            return this[0].innerHTML;
        }else{
            __for__(this,function(el){
                el.innerHTML = s;
            });
        }
        return this;
    }
    /**
     * text: 获取或添加text
     * @param {string} t 可选，text/html string, 同理于html方法
     */
    text(t){
        if(!t && t != ''){
            return this[0].innerText;
        }else{
            __for__(this,function(el){
                el.innerText = t;
            });
        }
        return this;
    }
    /**
     * getTextNodes: 获取所有子节点及以下的文字节点
     */
    getTextNodes(flag){
        var arr = [];
        fn(this);
        function fn(doms) {
            __for__(doms, function (el) {
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
     */
    toHtml(){
        var div = document.createElement('div');
        if(this[0]){
            div.appendChild(this[0]);
            return div.innerHTML;
        }
        div = null;
        return '';
    }
    /*
     * toText: fe转成text string
     */
    toText(){
        var div = document.createElement('div');
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
     */
    css(a,b){
        if(typeof a === 'object'){
            b = null;
            __for__(this,function(el){
                for(var k in a){
                    el.style[k] = a[k];
                }
            });
        }else if(typeof a === 'string'){
            if(arguments.length >= 2){
                __for__(this,function(el){
                    el.style[a] = b;
                });
            }else{
                b = null;
                return this[0].style[a];
            }
        }
        return this;
    }
    /**
     * addClass : 添加className
     * @param {string} className
     */
    addClass(c){
        var arr = null;
        __for__(this,function(el){
            arr = el.className.split(/\s+/);
            if(arr.indexOf(c) == -1){
                arr.push(c);
                el.className = arr.join(' ');
            }
        });
        return this;
    }
    /**
     * removeClass: 移除class
     * @param {string} className
     */
    removeClass(c){
        var arr = null,
            index = null;
        __for__(this,function(el){
            arr = el.className.split(/\s+/);
            if((index = arr.indexOf(c)) != -1){
                arr.splice(index,1);
                el.className = arr.join(' ');
            }
        });
        return this;
    }
    /**
     * hasClass: 判断是否有指定的className
     * @param {string} c className
     */
    hasClass(c){
        if(this[0].className){
            return this[0].className.split(/\s+/).indexOf(c) != -1;
        }else{
            return false;
        }
    }
    /**
     * each: 遍历fe实现对象的节点
     * @param {function} fn 回调函数
     */
    each(fn){
        if(typeof fn === 'function'){
            for(var i=0; i<this.length; i++){
                fn.call(this[i],i,this[i]);
            }
        }
        return this;
    }
    /**
     * attr: 获取元素属性列表，包括自定义属性，无参时返回对象的属性列表
     * @param {object,string} a 可选，设定多个属性时用object,单个时string:attribute name
     * @param {string} b 可选，设定的属性值，如果a为object,则此参数被忽略
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
                    __for__(this,function(el){
                        for(var i in a){
                            el.setAttribute(i,a[i]);
                        }
                    });
                }
                break;
            case 2:
                __for__(this,function(el){
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
     */
    removeAttr(a,b){
        var len = arguments.length,
            attrs;
        __for__(this,function(el){
            if(a){
                if(len == 1){
                    el.removeAttribute(a);
                }else if(len == 2 && el.getAttribute(a) == b){
                    el.removeAttribute(a);
                }
            }else{
                attrs = el.attributes;
                for(var i=0,l=attrs.length; i<l; i++){
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
     * @param {eventType} type 事件名
     * @param {function} fn 事件函数
     */
    on(type,fn){
        if(fn){
            __for__(this,function(el){
                el.addEventListener(type,fn,false);
            });
        }
        return this;
    }
    /**
     * off: 移除事件
     * @param {eventType} type 事件名
     * @param {function} fn 事件函数
     */
    off(type,fn){
        if(fn){
            __for__(this,function(el){
                el.removeEventListener(type,fn,false);
            });
        }
        return this;
    }
    /**
     * append: 添加节点到尾部
     * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
     */
    append(o){
        var that = this;
        o = (o instanceof Fe) ? o : __nodes__(o);
        __for__(this,function(el,index){
            for(var i=0,len=o.length; i<len; i++){
                if(index < that.length-1){
                    el.appendChild(o[i].cloneNode(true));
                }else{
                    el.appendChild(o[i]);
                }
            }
        });
        return this;
    }
    /**
     * prepend: 添加节点到首部
     * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
     */
    prepend(o){
        var that = this;
        o = (o instanceof Fe) ? o : __nodes__(o);
        __for__(this,function(el,index){
            for(var i=0,len=o.length; i<len; i++){
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
     */
    remove(){
        __for__(this,function(el){
            try{
                el.parentNode.removeChild(el);
            }catch(err){}
        });
        return this;
    }
    /**
     * before: 插入节点到指定节点之前
     * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
     */
    before(o){
        var that = this;
        o = (o instanceof Fe) ? o : __nodes__(o);
        __for__(this,function(el,index){
            for(var i=0,len=o.length; i<len; i++){
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
     * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
     */
    after(o){
        var that = this;
        o = (o instanceof Fe) ? o : __nodes__(o);
        __for__(this,function(el,index){
            for(var i=0,len=o.length; i<len; i++){
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
     * offset:
     */
    offset(p){
        var op = __nodes__(p)[0],
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
    createEditor(o){
        if(!fe.lang) throw('Lang wasn\'t loaded. You need to invoke method "fe.ready"');
        fe.plugin = Editor.prototype;
        let editor = new Editor(o);
        ui(this, editor);
        return editor;
    }
};

/**
 * fe函数
 * return Fe对象
 */
function fe(s){
    return new Fe(s);
}

/**
 * ========================= 给 fe 添加静态方法、属性 ============================
 */
/**
 * getRoot：获取本js脚本文件所在的目录
 */
fe.getRoot = (function(){
    var s = fe('#feditor-js');
    if(!s.length || (s.length && !/script/i.test(s[0].tagName)) ){
        s = fe('script');
    }
    for(var i=0,len=s.length; i<len; i++){
        var src = /\?/.test(s[i].src) ? s[i].src.slice(0,s[i].src.indexOf('?')) : s[i].src,
            end = src.lastIndexOf('/')+1;
        if(/^feditor[\s\S]*?\.js$/.test( src.slice(end) )){
            return src.slice(0,end);
        }
    }
    return '';
})();
/**
 * inArray: 判断val是否在arr数组中,只针对不包含object/function等对象的一维数组
 * @param {anyType} val 要判断的值
 * @param {Array}   arr 查找的范围数组
 * @param {boolean}  arguments[2]   确定返回值，如果传入真，则返回找到的index（找不到则返回-1）， 如果传入假，则返回boolean
 */
fe.inArray = function(val,arr){
    var arg = arguments[2],
        b = !!arg && (arg == 1 || arg == true);
    for(var i=0,len=arr.length; i<len; i++){
        if(arr[i] == val) return  b ? i : true;
    }
    return b ? -1 : false;
};
/**
 * browser: 判断当前浏览器内核类型，直接返回String名称
 */
fe.browser = (function(){
    var n = window.navigator;
    if(/Trident/ig.test(n.userAgent)){
        return 'ie';
    }else if(/FireFox/ig.test(n.userAgent)){
        return 'firefox';
    }else if(/Chrome/ig.test(n.userAgent)){
        return 'chrome';
    }
})();
/**
 * browserv: 获取浏览器版本号，直接返回String版本号字符串，直判断了三个主流浏览器，其他浏览器返回-1
 */
fe.browserv = (function(){
    var n = window.navigator.userAgent;
    if(/Trident/ig.test(n)){
        var arr = n.match(/MSIE[\s]+([\.\d]+)/i),
            arr2 = n.match(/rv\:([\.\d]+)/i);
        return arr ? arr[1] : (arr2 ? arr2[1] : '>10');
    }else if(/FireFox/ig.test(n)){
        return n.match(/FireFox\/([\.\d]+)/i)[1];
    }else if(/Chrome/ig.test(n)){
        return n.match(/Chrome\/([\.\d]+)/i)[1];
    }else{
        return -1;
    }
})();
/**
 * trim: 清除空格
 * @param {string} str 要处理的字符串
 * @param {string} tp  处理程度，默认清除两边空格，"g":去除所有空格， "l"：清除左边空格，"r":清除左边空格
 * @return {string}
 */
fe.trim = function(str,deep){
    if(str){
        switch(deep){
            case 'g': return str.replace(/(\s+)|(\&nbsp\;+)/ig,''); break;
            case 'l':
            function lcheck(str){
                str = str.replace(/^\s+/i,'').replace(/^(\&nbsp\;)+/i,'');
                if(/^(\&nbsp\;)+/i.test(str) || /^\s+/.test(str)){
                    return lcheck(str);
                }else{
                    return str;
                }
            }
                return lcheck(str);
                break;
            case 'r':
            function rcheck(str){
                str = str.replace(/\s+$/i,'').replace(/(\&nbsp\;)+$/i,'');
                if(/(\&nbsp\;)+$/i.test(str) || /\s+$/.test(str)){
                    return rcheck(str);
                }else{
                    return str;
                }
            }
                return rcheck(str);
                break;
            default:
            function lrcheck(str){
                str = str.replace(/(^\s+)|(^(\&nbsp\;)+)|((\&nbsp\;)+$)|(\s+$)/ig,'');
                if(/^(\&nbsp\;)+/i.test(str) || /^\s+/.test(str) || /(\&nbsp\;)+$/i.test(str) || /\s+$/.test(str)){
                    return lrcheck(str);
                }else{
                    return str;
                }
            }
                return lrcheck(str);
        }
    }
};
/**
 * loadScript: 加载一个或多个js/css文件
 * @param {Array} arr 文件的路径数组， 如：["js/a.js","js/b.js","css/c.css"]，js和css可以混合。
 * @param {function} fn 所有脚本文件加载完成时执行的回调函数，注：任何一个加载失败都不会执行到此函数。
 */
fe.loadScript = function(arr,fn){
    var count = 0,
        head = document.getElementsByTagName('head')[0];
    for(var i=0,len=arr.length; i<len; i++){
        var start = arr[i].lastIndexOf('\.'),
            end = arr[i].lastIndexOf('\?'),
            ext = arr[i].slice(start+1, (end!=-1 ? end : arr[i].length)),
            s = null;
        if(ext == 'js'){
            s = document.createElement('script');
            s.src = arr[i];
        }else if(ext == 'css'){
            s = document.createElement('link');
            s.type = 'text/css';
            s.rel = 'stylesheet';
            s.href = arr[i];
        }else{
            return;
        }
        s.charset = 'UTF-8';

        head.appendChild(s);
        (function(s,ext){
            s.onload = s.onreadystatechange = function(){
                if(!s.readyState || s.readyState === 'loaded' || s.readyState === 'complete') {
                    count++;
                    if (count>=len && fn) {
                        fn();
                    }
                    s.onload = s.onreadystatechange = null;
                    if(ext == 'js') head.removeChild(s);
                }
            }
        })(s,ext);
    }
};

/**
 * 遍历数组或json
 * @param {Object,Array} obj 要遍历的数组或json
 * @param {function} fn 回调函数
 */
fe.each = function(obj,fn){
    if( /\[\w+ array\]/i.test(Object.prototype.toString.call(obj)) ){
        for (var i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }else{
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fn.call(obj[key], key, obj[key]) === false) {
                    break;
                }
            }
        }
    }
};
/**
 * loadimg: 加载图片，加载完成时执行
 * @param {string} url 图片地址
 * @param {function} fn 回调函数
 */
fe.loadimg = function(src,fn){
    var img = new Image();
    img.onload = function(){
        if(fn) fn(img.width,img.height);
        img.onload = null;
        img = null;
    }
    img.onerror = function(e){
        if(fn) fn.call(this,e);
    }
    img.src = src;
};
/**
 * loading: 加载css3动画
 * @param {node/fe} p 容器
 * @param {string} txt 文字
 */
fe.loading = function(p,txt){
    p = p || fe('body');
    var box = fe('<div class="fe-loading"><div class="fe-loading-icon"></div><div class="fe-loading-text">'+(txt||fe.lang.loading)+'</div></div>');
    return {
        hide: function(){
            box.addClass('hide').removeClass('show');
            box.remove();
        },
        show: function(){
            box.addClass('show').removeClass('hide');
            p.append(box);
        }
    }
};
/**
 * date: 日期时间处理，返回自定义日期格式。
 * @param {string/number} s 空值/时间字符串/时间戳
 */
fe.date = function(s){
    var isTime = /^\d+$/.test(s),
        d = isTime ? new Date(parseInt(s)) : new Date(),
        str = isTime ? arguments[1] : s,
        o = {
            Y: d.getFullYear(),
            m: d.getMonth()+1,
            d: d.getDate(),
            h: d.getHours(),
            i: d.getMinutes(),
            s: d.getSeconds(),
            ms: d.getMilliseconds()
        };
    if(!s){
        return o.Y+'/'+o.M+'/'+o.D+' '+o.H+':'+o.I+':'+o.S+':'+o.ms;
    }else if(/^([ymdhis]\W*)+$/i.test(str)){
        var isms = /^ms$/i.test(str.slice(-2));
        return (isms ? str.slice(0,-2) : str).replace(/[ymdhis]/ig,function($0){
            if($0=='y'){
                return (o.Y+'').slice(2,4);
            }else if(/[MDHIS]/.test($0)){
                return mat(o[$0.toLowerCase()]);
            }else{
                return o[$0];
            }
        })+(isms ? o.ms : '');
    }else{
        return 'Invalid date';
    }
    function mat(n){
        return n < 10 ? '0' + n : n+'';
    }
};
/**
 * 文档准备
 * @param fn
 */
fe.ready = function(lang,fn){
    if(typeof lang === 'function'){
        fn = lang;
        lang = 'zh-cn';
    }
    if(fn){
        var doc = fe(document);
        doc.on('DOMContentLoaded',loaded);
        function loaded(){
            doc.off('DOMContentLoaded',loaded);
            fe.loadScript([fe.getRoot+'lang/'+lang+'.js'],fn);
        }
    }
}
/**
 * ===================================== 以下为私有方法 ==============================================
 */
/**
 * __nodes__: Fe参数处理为节点集和创建节点集
 * @param {fe,nodeList,node,selector,htmlstring} s [接收fe对象、节点、节点列表、css选器、html字符串]
 */
function __nodes__(s){
    var el = [];
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
            var div = document.createElement('div');
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
 * __for__: 遍历处理。一般处理节点集，让每个节点都做同样的fn
 * @param {fe,nodelist} arr 节点集
 * @param {function} fn 处理的函数
 */
function __for__(arr,fn){
    if(arr.length && fn){
        for(var i=0; i<arr.length; i++){
            fn(arr[i],i);
        }
    }
}
module.exports = fe;