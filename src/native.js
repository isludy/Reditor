/**
 * 为了方便操作，对原生进行一些修改
 * 扩展或兼容新方法
 */
/**
 * Array的incudes兼容性
 * @param target
 * @type {Function}
 * @return {boolean}
 */
if(!Array.prototype.includes){
    Array.prototype.includes = function (target) {
        return this.indexOf(target) !== -1;
    };
}
/**
 * 查找节点,统一使用集合
 * @type {Function}
 * @return {NodeList,HTMLCollection,Array}
 */
Document.prototype.find = HTMLElement.prototype.find = function(selector){
    if(/^#[^\s]+$/.test(selector)){
        return [document.getElementById(selector.slice(1))];
    }else if(/^\.[^\s]+$/.test(selector)){
        return document.getElementsByClassName(selector.slice(1));
    }else if(/^(\w+|\*)$/.test(selector)){
        return document.getElementsByTagName(selector);
    }else{
        return this.querySelectorAll(selector);
    }
};
NodeList.prototype.find  = HTMLCollection.prototype.find = Array.prototype.find = function(selector){
    let arr = [],
        len = this.length,
        i = 0,
        jlen,
        j,
        tmp;
    for(; i<len; i++){
        tmp = this[i].find(selector);
        for(jlen=tmp.length, j=0; j<jlen; j++){
            arr.push(tmp[j]);
        }
    }
    return arr;
};

/**
 * 给节点集合、数组添加each遍历
 * @param fn {Function} 回调，支持return 'continue'/'break'/true/false 来达到跳过、中止循环
 * @type {Function}
 */
NodeList.prototype.each  = HTMLCollection.prototype.each = Array.prototype.each = function(fn){
    if(typeof fn === 'function')
        for(let i=0, len=this.length, callback; i<len; i++){
            callback = fn.call(this[i], this[i], i);
            if( callback === 'continue') continue;
            if( (callback === 'break') || ('boolean' === typeof callback)) break;
        }
};
/**
 * 绑定事件，当数组中push、pop、shift、unshift、splice、sort、reverse被调用时，触发绑定的回调函数
 * @param type 两个值：before、after，分别是变化前和变化后; 如果是Dom节点集合，则视为普通事件绑定
 * @param fn 回调
 * @type {Function}
 */
Array.prototype.on = function (type,fn) {
    if(/before|after/.test(type)){
        if(!this.__before__){
            Object.defineProperty(this, '__before__',{
                value: []
            });
        }
        if(!this.__after__){
            Object.defineProperty(this, '__after__',{
                value: []
            });
        }
        if('function' === typeof fn){
            this['__'+type+'__'].push(fn);
        }
    }
    //如果Array是dom节点集合，则绑定普通事件
    else{
        for(let l = this.length; l--; )
            if(this[l] && this[l].nodeType === 1)
                this[l].addEventListener(type, fn, (arguments[2] || false));
    }
};
/**
 * 解除事件
 * @param type 如果无值或不是before/after，则移除全部
 * @param fn 指定移除的函数，如果无值，则移除对应type的所有
 * @type {Function}
 */
Array.prototype.off = function (type, fn){
    let arr;
    if(!type){
        arr = this['__before__'];
        arr.splice(0,arr.length);
        arr = this['__after__'];
        arr.splice(0,arr.length);
    }else if(/before|after/.test(type)){
        arr = this['__'+type+'__'];
        if(!fn){
            arr.splice(0, arr.length);
        }else{
            arr.splice(arr.indexOf(fn),1);
        }
    }else{
        for(let l=this.length; l--;)
            if(this[l] && this[l].nodeType === 1)
                this[l].removeEventListener(type, fn, (arguments[2] || false));
    }
};
/**
 * 开始处理监听，原理:
 * 1、把原生方法备份到nativeMethods中，
 * 2、重新一一构建对应的方法，在其中加入监听代码
 * 3、执行备份的原生方法，只要把this指针再给回这些备份的方法，即可还原原生方法。
 */
let nativeMethods = Object.create(null);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach( method =>{
    nativeMethods[ method ] = Array.prototype[ method ];
    Array.prototype[ method ] = function(){
        if('object' === typeof this.__before__){
            for(let bl = this.__before__.length; bl--;)
                this.__before__[bl].call(this);
        }
        let r = nativeMethods[ method ].apply(this, arguments);
        if('object' === typeof this.__after__){
            for(let al = this.__after__.length; al--;)
                this.__after__[al].call(this);
        }
        return r;
    }
});

/**
 * 简化原生事件绑定方法
 * on & off => addEventListener & removeEventListener
 * @type {Function}
 */
if('undefined' !== typeof EventTarget){
    EventTarget.prototype.on = EventTarget.prototype.addEventListener;
    EventTarget.prototype.off = EventTarget.prototype.removeEventListener;
}else{
    Document.prototype.on = Element.prototype.on = Element.prototype.addEventListener;
    Document.prototype.off = Element.prototype.off = Element.prototype.removeEventListener;
}
/**
 * 节点集合批量绑定事件
 * @type {Function}
 */
HTMLCollection.prototype.on = NodeList.prototype.on = function(type, handle, capture){
    this.each((v)=>{
        v.on(type, handle, (capture || false));
    });
};
/**
 * 节点集合批量解除事件
 * @type {Function}
 */
HTMLCollection.prototype.off = NodeList.prototype.off = function(type, handle, capture){
    this.each((v)=>{
        v.off(type, handle, (capture || false));
    });
};
/**
 * 简化Document上createElement方法
 * @type {Function}
 * @return {Node,Element}
 */
Document.prototype.create = Document.prototype.createElement;
/**
 * 简化Document上execCommand方法
 * @type {Function}
 */
Document.prototype.cmd = Document.prototype.execCommand;
/**
 * 对append做兼容
 * @type {Function}
 */
if(!HTMLElement.prototype.append)
    HTMLElement.prototype.append = function () {
        for(let i=0, len=arguments.length; i<len; i++) this.appendChild(arguments[i]);
    };
NodeList.prototype.append  = HTMLCollection.prototype.append = Array.prototype.append = function(){
    for(let i=0, len=arguments.length; i<len; i++) this[0].appendChild(arguments[i]);
};
/**
 * 添加prepend方法
 * @type {Function}
 */
HTMLElement.prototype.prepend = function(){
    for(let i=0, len=arguments.length; i<len; i++)
        this.insertBefore(arguments[i], this.childNodes[0]);
};
/**
 * 对remove做兼容
 * @type {Function}
 */
if(!HTMLElement.prototype.remove)
    HTMLElement.prototype.remove = function () {
        this.parentNode.removeChild(this);
    };
/**
 * 对before做兼容
 * @type {Function}
 */
if(!HTMLElement.prototype.before)
    HTMLElement.prototype.before = function (){
        let args = arguments,
            len=args.length,
            i = 0;
        for(; i < len; i++)
            if(args[i].nodeType === 1 || args[i].nodeType === 3){
                this.parentNode.insertBefore(args[i], this);
            }else if('string' === typeof args[i]){
                this.parentNode.insertBefore(document.createTextNode(args[i]), this);
            }
    };
/**
 * 对after做兼容
 * @type {Function}
 */
if(!HTMLElement.prototype.after)
    HTMLElement.prototype.after = function (){
        let args = arguments,
            len=args.length;
        for(; len--;)
            if(args[len].nodeType === 1 || args[len].nodeType === 3){
                this.parentNode.insertBefore(args[len], this.nextSibling);
            }else if('string' === typeof args[len]){
                this.parentNode.insertBefore(document.createTextNode(args[len]), this.nextSibling);
            }
    };

/**
 * 添加attr方法
 * @param name {String}
 * @param val {String,Number}
 * @type {Function}
 */
HTMLElement.prototype.attr = function(name, val){
    if(!val)
        return this.getAttribute(name);
    else
        this.setAttribute(name, val);
};
HTMLCollection.prototype.attr = NodeList.prototype.attr = Array.prototype.attr = function(name, val){
    this.each((v)=>{
        v.attr(name, val);
    });
};
/**
 * 添加removeAttr方法
 * @param name {String}
 * @type {Function}
 */
HTMLElement.prototype.removeAttr = function(name){
    this.removeAttribute(name);
};
HTMLCollection.prototype.removeAttr = NodeList.prototype.removeAttr = Array.prototype.removeAttr = function(name){
    this.each((v)=>{
        v.removeAttr(name);
    });
};
/**
 * 添加data方法
 * @param name {String}
 * @param val {String,Number}
 * @type {Function}
 */
HTMLElement.prototype.data = function(name, val){
    if(!val)
        return this.getAttribute('data-'+name);
    else
        this.setAttribute('data-'+name, val);
};
HTMLCollection.prototype.data = NodeList.prototype.data = Array.prototype.data = function(name, val){
    this.each((v)=>{
        v.data(name, val);
    });
};

/**
 * 添加hasClass
 * @param name
 * @return {boolean}
 */
HTMLElement.prototype.hasClass = function(name){
    return this.className.split(/\s+/g).includes(name);
};
HTMLCollection.prototype.hasClass = NodeList.prototype.hasClass = Array.prototype.hasClass = function (name) {
    for(let i=0, len = this.length; i<len; i++)
        if(this[i].hasClass(name)) return true;
    return false;
};
/**
 * 添加addClass
 * @type {Function}
 */
HTMLElement.prototype.addClass = function(){
    let classList = this.className.split(/\s+/g),
        arg = arguments,
        len = arg.length,
        i = 0;
    for(; i<len; i++)
        if(!classList.includes(arg[i]))
            classList.push(arg[i]);
    this.className = classList.join(' ');
};
HTMLCollection.prototype.addClass = NodeList.prototype.addClass = Array.prototype.addClass = function () {
    for(let i=0, len = this.length; i<len; i++)
        this[i].addClass(...arguments);
};
/**
 * 添加removeClass
 * @type {Function}
 */
HTMLElement.prototype.removeClass = function(){
    let classList = this.className.split(/\s+/g),
        arg = arguments,
        len = arg.length,
        i = 0;
    for(; i<len; i++)
        if(classList.includes(arg[i]))
            classList.splice(classList.indexOf(arg[i]), 1);
    this.className = classList.join(' ');
};
HTMLCollection.prototype.removeClass = NodeList.prototype.removeClass = Array.prototype.removeClass = function () {
    for(let i=0, len = this.length; i<len; i++)
        this[i].removeClass(...arguments);
};
/**
 * 添加toggleClass
 * @param name
 * @type {Function}
 */
HTMLElement.prototype.toggleClass = function(name){
    if(this.classList)
        this.classList.toggle(name);
    else{
        let classList = this.className.split(/\s+/g);
        if(classList.includes(name))
            classList.splice(name, 1);
        else
            classList.push(name);
        this.className = classList.join(' ');
    }
};
HTMLCollection.prototype.toggleClass = NodeList.prototype.toggleClass = Array.prototype.toggleClass = function (name) {
    for(let i=0, len = this.length; i<len; i++)
        this[i].toggleClass(name);
};

/**
 * 简化并做兼容createObjectURL
 * @param blob
 * @return {*}
 */
window.createURL = function(blob){
    return window[ window.URL ? 'URL' : 'webkitURL']['createObjectURL'](blob);
};
window.revokeURL = function(url){
    return window[ window.URL ? 'URL' : 'webkitURL']['revokeObjectURL'](url);
};
/**
 * 格式化字节
 * @param bit
 * @param fixed
 * @return {string}
 */
Math.fsize = function(bit, fixed=2){
    if(bit < 1024)
        return bit+'B';
    else if(bit < 1048576)
        return (bit/1024).toFixed(fixed)+'KB';
    else if(bit < 1073741824)
        return (bit/1048576).toFixed(fixed)+'MB';
    else
        return (bit/1073741824).toFixed(fixed)+'GB';
};

/**
 * 格式化时间
 * @param format
 * @return {string}
 */
Date.prototype.format = function(format = 'Y-m-d'){
    let _this = this,
        o = {
            Y: _this.getFullYear(),
            m: _this.getMonth()+1,
            d: _this.getDate(),
            h: _this.getHours(),
            i: _this.getMinutes(),
            s: _this.getSeconds(),
            c: _this.getMilliseconds()
        };
    o.y = (o.Y+'').slice(2);
    o.M = (o.m+100+'').slice(1);
    o.D = (o.d+100+'').slice(1);
    o.H = (o.h+100+'').slice(1);
    o.I = (o.i+100+'').slice(1);
    o.S = (o.s+100+'').slice(1);
    o.C = (o.c+1000+'').slice(1);

    if(typeof format === 'string'){
        format = format.split('');
        for(let len=format.length; len--;){
            let k = format[len];
            if(o[k]) format[len] = o[k];
        }
        return format.join('');
    }
    return o.Y + '-' + o.M + '-' + o.D + ' ' + o.H + ':' + o.I + ':' + o.S + ':' + o.C;
};

/**
 * canvas 转 File对象
 * @param name {String} 文件名
 * @param type {String} mime类型
 * @type {Function}
 * @returns {File}
 */
HTMLCanvasElement.prototype.toFile = function(name = 'file.png', type = 'image/png'){
    let data, binary, len, i;
    data = this.toDataURL(type);
    data = window.atob( data.replace(/^data:(image\/[\w-]+);base64,/, '') );
    binary = new Uint8Array(len = data.length);
    for(i=0; i<len; i++)
        binary[i] = data.charCodeAt(i);
    return new File([binary], name ,{type, endings:'transparent'});
};