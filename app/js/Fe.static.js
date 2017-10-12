const Fe = require('./Fe.class');
const Editor = require('./Editor');
/**
 * 外露的对象
 * @param {String | Node | NodeList | Fe | Array} s
 * @return {Fe}
 */
function fe( s = undefined ){
    return new Fe(s);
}
/**
 * lang.js内的语言配置对象
 * 在ready中加载
 */
fe.lang = null;
/**
 * 判断当前浏览器内核类型，直接返回String名称
 * @type {String}
 */
fe.browse = (()=>{
    let n = window.navigator;
    if(/Trident/ig.test(n.userAgent)){
        return 'ie';
    }else if(/FireFox/ig.test(n.userAgent)){
        return 'firefox';
    }else if(/Chrome/ig.test(n.userAgent)){
        return 'chrome';
    }
})();
/**
 * 获取浏览器版本号，直接返回String版本号字符串，直判断了三个主流浏览器，其他浏览器返回-1
 * @type {string, number}
 */
fe.browserv = (()=>{
    let n = window.navigator.userAgent;
    if(/Trident/ig.test(n)){
        let arr = n.match(/MSIE[\s]+([\.\d]+)/i),
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
 * 获取 feditor 所在的目录
 * @type {String}
 */
fe.getRoot = (()=>{
    let s = fe('#feditor-js');
    if(!s.length || (s.length && !/script/i.test(s[0].tagName)) ){
        s = fe('script');
    }
    for(let i=0,len=s.length; i<len; i++){
        let src = /\?/.test(s[i].src) ? s[i].src.slice(0,s[i].src.indexOf('?')) : s[i].src,
            end = src.lastIndexOf('/')+1;
        if(/^feditor[\s\S]*?\.js$/.test( src.slice(end) )){
            return src.slice(0,end);
        }
    }
    return '';
})();

/**
 * trim: 清除空格
 * @param {string} str 要处理的字符串
 * @param {string} deep  处理程度，默认"lr"清除两边空格，"g":去除所有空格， "l"：清除左边空格，"r":清除左边空格
 * @return {string}
 */
fe.trim = (str,deep='lr')=>{
    if(str){
        switch(deep){
            case 'g': return str.replace(/(\s|&nbsp[;]?)/g,''); break;
            case 'l': return str.replace(/^(\s|&nbsp[;]?)+/, ''); break;
            case 'r': return str.replace(/(\s|&nbsp[;]?)+$/g,''); break;
            default: return str.replace(/^(\s|&nbsp[;]?)+/, '').replace(/(\s|&nbsp[;]?)+$/g,''); break;
        }
    }
    return '';
};
/**
 * 加载js,css,img
 * @param {Array, String} a 文件的路径数组或单个文件路径
 * @param {function} fn 回调
 * @param {String} charset 编码类型
 */
fe.loadSource = (a, fn, charset = 'utf-8')=>{
    let arr = typeof a === 'string' ? [a] : a,
        count = 0,
        head = document.head,
        loading = fe.loadui();
    loading.show();
    for(let i=0,len=arr.length; i<len; i++){
        if(!arr[i]) throw ': fe.loadjs not allow empty value';
        let ext = /\.\w{2,3}(?=$|\?)/.exec(arr[i])[0];
        ((path, extension)=>{
            let el;
            switch (extension){
                case '.js':
                    el = document.createElement('script');
                    el.charset = charset;
                    el.src = path;
                    head.appendChild(el);
                    break;
                case '.css':
                    el = document.createElement('link');
                    el.charset = charset;
                    el.type = 'text/css';
                    el.rel = 'stylesheet';
                    el.href = path;
                    head.appendChild(el);
                    break;
                default:
                    el = new Image();
                    el.src = path;
            }

            el.onload = el.onreadystatechange = function(){
                if(!el.readyState || el.readyState === 'loaded' || el.readyState === 'complete') {
                    count++;
                    if (count>=len && fn) {
                        fn();
                        loading.hide();
                    }
                    el.onload = el.onreadystatechange = null;
                    if(extension === '.js'){
                        head.removeChild(el);
                    }
                }
            };

            el.onerror = function(){
                console.error('Fail to load '+ path);
                el.onerror = null;
            };
        })(arr[i], ext);
    }
};
/**
 * 加载过程动画
 * @param p 此ui的容器，默认body
 * @param txt 此ui的文字
 * @returns {{hide: hide, show: show}}
 */
fe.loadui = ( p = new Fe('body'), txt='loading...')=>{
    let box;
    return {
        hide: function(){
            box.remove();
        },
        show: function(){
            box = fe('<div class="fe-loadui"><div class="fe-loadui-icon"></div><div class="fe-loadui-text">'+txt+'</div></div>');
            p.append(box);
        }
    }
};
/**
 * date: 日期时间处理，返回自定义日期格式。
 * @param {string,number} s 可选，时间字符串/时间戳, 当参数一是时间戳时，参数二将是时间格式
 * @param {string} format 可选，时间格式
 */
fe.date = ( s=undefined, format='')=>{
    let isTime = /^\d+$/.test(s),
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
        return o.Y+'/'+mat(o.m)+'/'+mat(o.d)+' '+mat(o.h)+':'+mat(o.i)+':'+mat(o.s)+':'+o.ms;
    }else if(/^([ymdhis]\W*)+$/i.test(str)){
        let isms = /^ms$/i.test(str.slice(-2));
        return (isms ? str.slice(0,-2) : str).replace(/[ymdhis]/ig,function($0){
            if($0 === 'y'){
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
 * 遍历数组或json
 * @param {Object,Array} obj 要遍历的数组或json
 * @param {function} fn 回调函数
 */
fe.each = (obj, fn)=>{
    if( /\[\w+\s*array\]/i.test(Object.prototype.toString.call(obj)) ){
        for (let i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj[i], i, obj[i]) === false) {
                break;
            }
        }
    }else{
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (fn.call(obj[key], key, obj[key]) === false) {
                    break;
                }
            }
        }
    }
};
/**
 * 弹窗
 * @param options
 * @param editor
 * @return {{box: Fe, hide: offall, exec: doExec}|boolean}
 *
 * options
 * {
        header: '',         //String 标题，可包含html
        body: '',           //String 内容，可包含html
        footer: true,       //boolean 是否需要低部容器，默认true
        close: '&times',    //String 关闭按钮的内容，按钮是button标签
        ok: '确定',          //String 确定按钮的内容，按钮是button标签
        cancel: '取消',      //String 取消按钮的内容，按钮是button标签
        parent: Fe.feditor,  //Dom 规定他的父级，它将被插入其中
        onclose: function(){}, //function 关闭时执行
        onok: function(){},    //function 确定时执行
        oncancel: function(){},    //function 取消时执行
        onhide: function(){},  //function 被移除时执行
        css: {}                //Object{} 弹窗的样式 ，如： {background: '#fff',border:'1px solid red'}
 * }
 */
fe.dialog = (options, editor)=>{
    if(editor.hasDialog) return true;
    editor.hasDialog = true;
    //默认参数
    let o = {
            header: '',
            body: '',
            footer: true,
            close: '&times',
            ok: fe.lang.ok,
            cancel: fe.lang.cancel,
            parent: editor.feditor,
            mask: document.createElement('div'),
            onclose: function(){},
            onok: function(){},
            oncancel: function(){},
            onhide: function(){},
            css: {},
            draggable: true
        },
        //保存选区，非常重要，因为在选择弹窗选项后，才能恢复选区;
        rg = fe.getRange();

    //合并参数
    if(options && typeof options === 'object'){
        for(let k in options){
            o[k] = options[k];
        }
    }
    options = null;

    //是否有底部
    let hasFooter = !((typeof o.footer === 'boolean') && !o.footer),
        //初始化节点
        box = fe('<div class="fe-dialog">'),
        header = fe('<div class="fe-dialog-header">'),
        body = fe('<div class="fe-dialog-body">'),
        footer = hasFooter ? fe('<div class="fe-dialog-footer">') : null,
        close = fe('<span class="fe-close">'),
        ok = (hasFooter && o.ok) ? fe('<span class="fe-btn fe-btn-default">') : null,
        cancel = (hasFooter && o.cancel) ? fe('<span class="fe-btn fe-btn-default">') : null,
        doc = fe(document);

    //给box的子节点添加内容
    function addHtml(html,obj){
        if(!obj) return;
        if(typeof html !== 'string'){
            obj.html('');
            try{
                obj.append(html);
            }catch(err){
                obj[0].appendChild(html);
            }
        }else{
            obj.html(html);
        }
    }
    header.html(o.header);
    addHtml(o.header,header);
    addHtml(o.body,body);
    addHtml(o.close,close);
    box.append(close).append(header).append(body);

    if(hasFooter){
        addHtml(o.footer.footer);
        if(ok){
            addHtml(o.ok,ok);
            footer.append(ok);
        }
        if(cancel){
            addHtml(o.cancel,cancel);
            footer.append(cancel);
        }
        box.append(footer);
    }

    //添加box到指定容器
    fe(o.parent).append(box);

    //添加遮罩
    if(o.mask){
        o.mask = fe(o.mask);
        o.mask.addClass('fe-dialog-mask');
        fe('body').append(o.mask);
        o.mask.css('zIndex',editor.dialogIndex);
        editor.dialogIndex++;
    }
    //给box添加css样式
    box.css(o.css);
    if(!o.css.zIndex || !o.css['z-index']){
        box.css('zIndex',editor.dialogIndex);
    }
    editor.dialogIndex++;
    //定位dialog
    let top = o.css.top ? parseFloat(o.css.top) : (window.innerHeight - box[0].offsetHeight)/2,
        left = o.css.left ? parseFloat(o.css.left) : (window.innerWidth - box[0].offsetWidth)/2;
    box.css('left',left+'px');
    box.css('top',top+'px');
    //dialog淡入
    box.addClass('fadeIn');
    //拖拽
    if(o.draggable){
        header.on('mousedown',downFn).css('cursor','move');
        let leftStart = 0, topStart = 0;
        function downFn(e){
            e.preventDefault();
            leftStart = e.clientX;
            topStart = e.clientY;
            doc.on('mousemove',moveFn);
            doc.on('mouseup',upFn);
        }
        function moveFn(e){
            e.preventDefault();
            box[0].style.left = (e.clientX - leftStart + left) + 'px';
            box[0].style.top = (e.clientY - topStart + top) + 'px';
        }
        function upFn(e){
            e.preventDefault();
            doc.off('mousemove',moveFn);
            doc.off('mouseup',upFn);
            left = left + (e.clientX - leftStart);
            top = top + (e.clientY - topStart);
        }
    }
    //绑定按钮事件
    close.on('click',closeFn);
    if(ok) ok.on('click',okFn);
    if(cancel) cancel.on('click',cancelFn);
    function closeFn(e){
        let bk = o.onclose.call(close,e);
        if(bk === undefined || bk === true) offall();
    }
    function okFn(e){
        let bk = o.onok.call(ok,e,rg);
        if(bk === undefined || bk === true) offall();
    }
    function cancelFn(e){
        let bk = o.oncancel.call(cancel,e);
        if(bk === undefined || bk === true) offall();
    }
    function offall(){
        editor.edit[0].focus();
        fe.setRange(rg);
        let bk = o.onhide();
        if(bk === undefined || bk === true){
            box.remove();
            editor.hasDialog = false;
            if(o.mask) o.mask.remove();

            close.off('click',closeFn);
            if(ok) ok.off('click',okFn);
            if(cancel) cancel.off('click',cancelFn);
            try{
                header.off('mousedown',downFn);
            }catch(e){}
        }
    }

    /* 操作
     * 利用execCommand传入backcolor会给选区创建span的特性(IE创建的是font标签，
     * 不影响，如果不需要font，则最好方式就是最后提交数据时，把所有的font替换成span标签即可)，
     * 创建标签后，到_addStyle函数中把backcolor产生的style的这个背景样式移除，
     * 以替换为最终要设置的样式名和样式值。取参数rgba(255,255,255,0)。
     */
    function doExec(name,value){
        fe.setRange(rg);
        document.execCommand('backcolor',false,"rgba(255,255,255,0)");
        Editor.__addStyle__(name,value,editor);
    }

    return {
        box: box,
        hide: offall,
        exec: doExec
    };
};
//===========================================================================================
/**
 * get Range
 * @return {*}
 */
fe.getRange = ()=>{
    let s;
    if(s = window.getSelection){
        if(!s().rangeCount) return null;
        return s().getRangeAt(0);
    }else if(s = document.selection){
        return s.createRange();
    }
};
/**
 * set Range
 * @param {Selection,Range} rg
 */
fe.setRange = (rg)=>{
    if(!rg || !rg.rangeCount) return;
    let s = window.getSelection();
    if(s.rangeCount > 0)  s.removeAllRanges();
    if(rg.getRangeAt){
        s.addRange(rg.getRangeAt(0))
    }else{
        s.addRange(rg);
    }
};
//==========================================================================
/**
 * 文档准备
 * @param {String,function} lang
 * @param {function} fn
 */
fe.ready = (lang='zh-cn', fn=null)=>{
    let callback, langtype;
    if(typeof lang === 'function'){
        callback = lang;
        langtype = 'zh-cn';
    }else{
        callback = fn;
        langtype = lang;
    }
    if(callback){
        let doc = fe(document);
        doc.on('DOMContentLoaded',loaded);
        function loaded(){
            doc.off('DOMContentLoaded',loaded);
            fe.loadSource(fe.getRoot+'lang/'+langtype+'.js', callback);
        }
    }
};
/**
 * 定义toString
 * @return {string}
 */
fe.toString = ()=>{
    return 'function Fe(s){ [native code] }';
};
/**
 * 将plugin接口，将函数添加到Editor的原型
 * @param {string} name
 * @param {function} fn
 */
fe.plugin = (name, fn = null)=>{
    if(!name) throw ': Parameter 1 accept a string name of "fe.plugin", the name must be given!';
    if(fn) Editor.prototype[name] = fn;
};
/**
 * 创建编辑器
 * @param options
 * @returns {Editor}
 */
Fe.prototype.createEditor = function(options){
    if(!fe.lang) throw('Lang wasn\'t loaded. You need to invoke method "fe.ready"');
    return new Editor(this, options);
};

module.exports = fe;
