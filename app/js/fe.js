const Base = require('./Base');
/**
 * fe函数
 * return Fe对象
 */
function fe(s){
    return new Base(s);
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
};
module.exports = fe;