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

//document : create -> createElement, id -> getElementById, cmd -> execCommand
document.create = document.createElement;
document.cmd = document.execCommand;
Document.prototype.find = HTMLElement.prototype.find = function(selector){
    let nodes;
    if(/^#/.test(selector)){
        nodes = this.getElementById(selector.slice(1));
        if(nodes) return nodes;
    }
    nodes = this.querySelectorAll(selector);
    if(nodes.length === 1)
        return nodes[0];
    else if(nodes.length > 1)
        return nodes;
    return null;
};

//append, remove
if(!HTMLElement.prototype.append)
    HTMLElement.prototype.append = function () {
        for(let i=0, len=arguments.length; i<len; i++) this.appendChild(arguments[i]);
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