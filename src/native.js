/**
 * 兼容、扩展、缩写原生的一些东西
 */
// includes
if(!Array.prototype.includes){
    Array.prototype.includes = function (target) {
        return this.indexOf(target) !== -1;
    };
}
// forEach
function forEach(fn){
    if(typeof fn === 'function')
        for(let i=0, len=this.length; i<len; i++)
            fn(this[i], i);
}
if(!Array.prototype.forEach) Array.prototype.forEach = forEach;
if(!HTMLCollection.prototype.forEach) HTMLCollection.prototype.forEach = forEach;
if(!NodeList.prototype.forEach) NodeList.prototype.forEach = forEach;

// event
if(typeof EventTarget !== 'undefined'){
    EventTarget.prototype.on = EventTarget.prototype.addEventListener;
    EventTarget.prototype.off = EventTarget.prototype.removeEventListener;
}else{
    Document.prototype.on = Element.prototype.on = Element.prototype.addEventListener;
    Document.prototype.off = Element.prototype.off = Element.prototype.removeEventListener;
}

HTMLCollection.prototype.on = NodeList.prototype.on = function(type, handle, capture){
    this.forEach((v)=>{
        v.on(type, handle, (capture || false));
    });
};
HTMLCollection.prototype.off = NodeList.prototype.off = function(type, handle, capture){
    this.forEach((v)=>{
        v.off(type, handle, (capture || false));
    });
};

//document : create -> createElement, cmd -> execCommand
document.create = document.createElement;
document.cmd = document.execCommand;
//find, siblings
Document.prototype.find = HTMLElement.prototype.find = function(selector){
    let nodes;
    if(/^#/.test(selector)){
        nodes = this.getElementById(selector.slice(1));
        if(nodes) return nodes;
    }
    nodes = this.querySelectorAll(selector);
    if(nodes.length)
        return nodes;
    return null;
};

//append, prepend, remove
if(!HTMLElement.prototype.append)
    HTMLElement.prototype.append = function () {
        for(let i=0, len=arguments.length; i<len; i++) this.appendChild(arguments[i]);
    };
HTMLElement.prototype.prepend = function(){
    for(let i=0, len=arguments.length; i<len; i++)
        this.insertBefore(arguments[i], this.childNodes[0]);
};

if(!HTMLElement.prototype.remove)
    HTMLElement.prototype.remove = function () {
        this.parentNode.removeChild(this);
    };

// attr, data, removeAttr
HTMLElement.prototype.attr = function(name, val){
    if(!val) return this.getAttribute(name);
    else this.setAttribute(name, val);
};
HTMLElement.prototype.data = function(name, val){
    if(!val) return this.getAttribute('data-'+name);
    else this.setAttribute('data-'+name, val);
};
HTMLElement.prototype.removeAttr = function(name){
    this.removeAttribute(name);
};
HTMLCollection.prototype.attr = NodeList.prototype.attr = function(name, val){
    this.forEach((v)=>{
        v.attr(name, val);
    });
};
HTMLCollection.prototype.removeAttr = NodeList.prototype.removeAttr = function(name){
    this.forEach((v)=>{
        v.removeAttr(name);
    });
};
HTMLCollection.prototype.data = NodeList.prototype.data = function(name, val){
    this.forEach((v)=>{
        v.data(name, val);
    });
};

// hasClass, addClass, removeClass, toggleClass
HTMLElement.prototype.hasClass = function(name){
    return this.className.split(/\s+/g).includes(name);
};
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
HTMLCollection.prototype.hasClass = NodeList.prototype.hasClass = function (name) {
    for(let i=0, len = this.length; i<len; i++)
        if(this[i].hasClass(name)) return true;
    return false;
};
HTMLCollection.prototype.addClass = NodeList.prototype.addClass = function () {
    for(let i=0, len = this.length; i<len; i++)
        this[i].addClass(...arguments);
};
HTMLCollection.prototype.removeClass = NodeList.prototype.removeClass = function () {
    for(let i=0, len = this.length; i<len; i++)
        this[i].removeClass(...arguments);
};
HTMLCollection.prototype.toggleClass = NodeList.prototype.toggleClass = function (name) {
    for(let i=0, len = this.length; i<len; i++)
        this[i].toggleClass(name);
};

//URL
window.createURL = function(blob){
    return window[ window.URL ? 'URL' : 'webkitURL']['createObjectURL'](blob);
};
window.revokeURL = function(url){
    return window[ window.URL ? 'URL' : 'webkitURL']['revokeObjectURL'](url);
};

//Math format filesize
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

//Date format
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

//HTMLCanvasElement上的一些方法
/**
 * canvas 转 File对象
 * @param name {String} 文件名
 * @param type {String} mime类型
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