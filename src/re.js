class Re{
    constructor(s){
        this.length = 0;
        if(s.nodeType === 1 || s === document){
            this[0] = s;
            this.length = 1;
        }else if(typeof s === 'string'){
            s = s.trim();
            if(/^<(\w+)[^>]*?>([\s\S]*?<\/\1>)*$/i.test(s)){
                let tmp = document.createElement('div');
                tmp.innerHTML = s;
                this[0] = tmp.childNodes[0];
                this.length = 1;
                tmp = null;
            }else{
                let doms = document.querySelectorAll(s);
                this.length = doms.length;
                for(let index = 0; index < this.length; index++){
                    this[index] = doms[index];
                }
                doms = null;
            }
        }else if(s.length){
            this.length = s.length;
            for(let i=0; i<this.length; i++){
                this[i] = s[i];
            }
        }
        s = null;
    }

    /**
     * 查找节点
     * @param s
     * @return {Re}
     */
    find(s){
        let doms = [];
        for(let i=0; i<this.length; i++){
            let tmp = this[i].querySelectorAll(s),
                len = tmp.length;
            for(let j=0; j<len; j++){
                doms.push(tmp[j]);
            }
        }
        return new Re(doms);
    }

    /**
     * 查找子节点
     * @param s 选择器，匹配选择器的子节点
     * @return {Re}
     */
    children(s=''){
        let doms = [];
        for(let i=0; i<this.length; i++){
            let tmp = s ? this[i].querySelectorAll(s) : this[i].childNodes;
            for(let j=0, len=tmp.length; j<len; j++) {
                if(tmp[j].parentNode === this[i] && tmp[j].nodeType === 1) doms.push(tmp[j]);
            }
        }
        return new Re(doms);
    }

    /**
     * 迭代
     * @param fn
     * @return {*}
     */
    each(fn){
        if(!fn) return this;
        for(let i=0, back; i<this.length; i++){
            back = fn.call(this[i], this[i], i);
            if(back === 'continue') continue;
            if(back === 'break') break;
            if(typeof back !== 'undefined') return back;
        }
        return this;
    }

    /**
     * 事件绑定
     * @param evt
     * @param fn
     * @param capture
     * @return {Re}
     */
    on(evt, fn, capture=false){
        for(let i=0; i<this.length; i++)
            this[i].addEventListener(evt, fn, capture);
        return this;
    }

    /**
     * 事件移除
     * @param evt
     * @param fn
     * @param capture
     * @return {Re}
     */
    off(evt, fn, capture=false){
        for(let i=0; i<this.length; i++)
            this[i].removeEventListener(evt, fn, capture);
        return this;
    }

    /**
     * 在节点尾部插入节点
     * 支持多个参数，支持任意参数类型，但若不是html元素，则当文本节点处理
     * @return {Re}
     */
    append(){
        let frag = Re.argsToFragment(arguments);
        for(let i=0; i<this.length; i++){
            if(i < this.length-1){
                this[i].appendChild(frag.cloneNode(true));
            }else{
                this[i].appendChild(frag);
            }
        }
        return this;
    }

    /**
     * 在节点首部插入节点
     * 支持参数同append方法
     * @return {Re}
     */
    prepend(){
        let frag = Re.argsToFragment(arguments);
        for(let i=0; i<this.length; i++){
            if(i < this.length-1){
                this[i].insertBefore(frag.cloneNode(true), this[i].childNodes[0]);
            }else{
                this[i].insertBefore(frag, this[i].childNodes[0]);
            }
        }
    }

    /**
     * 在节点之后插入节点
     * 支持参数同append方法
     * @return {Re}
     */
    after(){
        let frag = Re.argsToFragment(arguments);
        for(let i=0; i<this.length; i++){
            if(i < this.length-1){
                this[i].insertBefore(frag.cloneNode(true), this[i].nextSibling);
            }else{
                this[i].insertBefore(frag, this[i].nextSibling);
            }
        }
    }

    /**
     * 在节点之前插入节点
     * 支持参数同append方法
     * @return {Re}
     */
    before(){
        let frag = Re.argsToFragment(arguments);
        for(let i=0; i<this.length; i++){
            if(i < this.length-1){
                this[i].insertBefore(frag.cloneNode(true), this[i]);
            }else{
                this[i].insertBefore(frag, this[i]);
            }
        }
    }

    /**
     * 移除节点
     * @return {Re}
     */
    remove(){
        for(let i=0; i<this.length; i++)
            this[i].parentNode.removeChild(this[i]);
        this.length = 0;
        return this;
    }

    /**
     * 将arguments处理成fragMent并返回
     * @param args
     * @return {DocumentFragment}
     */
    static argsToFragment(args){
        if(args[0].nodeType === 11) return args;
        let frag = document.createDocumentFragment();
        for(let i=0, len=args.length, elen=0; i<len; i++){
            if(args[i].nodeType === 1){
                frag.appendChild(args[i]);
            }else if(elen = args[i].length){
                for(let j=0; j<elen; j++){
                    if(args[i][j].nodeType === 1){
                        frag.appendChild(args[i][j]);
                    }else{
                        frag.appendChild(document.createTextNode(args[i][j]));
                    }
                }
            }else{
                frag.appendChild(document.createTextNode(args[i]));
            }
        }
        return frag;
    }

    /**
     * 设置/获取节点属性，获取时，只获取第一个节点的属性
     * @param k
     * @param v
     * @return {*}
     */
    attr(k, v=''){
        if(v){
            for(let i=0; i<this.length; i++)
                this[i].setAttribute('data-'+k, v);
        }else{
            return this[0].getAttribute('data-'+k);
        }
        return this;
    }

    /**
     * 设置/获取节点的data-属性，获取时，只获取第一个节点的属性
     * @param k
     * @param v
     * @return {*}
     */
    data(k, v=''){
        if(document.documentElement.dataset){
            if(v)
                for(let i=0; i<this.length; i++)
                    this[i].dataset[k] = v;
            else
                return this[0].dataset[k];
        }else{
            if(v)
                this.attr(k, v);
            else
                return this.attr(k);
        }
        return this;
    }

    /**
     * 添加className
     * @param cls className
     * @return {Re}
     */
    addClass(cls){
        if(document.documentElement.classList){
            for(let i=0; i<this.length; i++)
                this[i].classList.add(cls);
        }else{
            for(let i=0; i<this.length; i++){
                if(!this[i].className){
                    this[i].className = cls;
                }else{
                    let list = this[i].className.split(/\+/);
                    if(list.indexOf(cls) === -1)
                        list.push(cls);
                    this[i].className = list.join(' ');
                }
            }
        }
        return this;
    }

    /**
     * 移除className
     * @param cls
     * @return {Re}
     */
    removeClass(cls){
        if(document.documentElement.classList){
            for(let i=0; i<this.length; i++)
                this[i].classList.remove(cls);
        }else{
            for(let i=0; i<this.length; i++){
                if(!this[i].className){
                    this[i].className = cls;
                }else{
                    let list = this[i].className.split(/\+/);
                    list.slice(list.indexOf(cls), 1);
                    this[i].className = list.join(' ');
                }
            }
        }
        return this;
    }

    /**
     * 判断是否有指定的 className, 注意的是，当目标是节点集合时，只要其中一个满足，则视为true
     * @param cls className
     * @return {boolean}
     */
    hasClass(cls){
        for(let i=0; i<this.length; i++)
            if(this[i].className.split(/\s+/).indexOf(cls) !== -1) return true;
        return false;
    }

    /**
     * 切换className
     * @param cls
     * @return {Re}
     */
    toggleClass(cls){
        if(document.documentElement.classList){
            for(let i=0; i<this.length; i++)
                this[i].classList.toggle(cls);
        }else{
            for(let i=0; i<this.length; i++){
                let list = this[i].className.split(/\s+/);
                if(list.indexOf(cls) !== -1)
                    list.splice(list.indexOf(cls), 1);
                else
                    list.push(cls);
                this[i].className = list.join(' ');
            }
        }
        return this;
    }

    /**
     * 设置/获取innnerHTML
     * @param v
     * @return {Re, string}
     */
    html(v=''){
        if(v){
            for(let i=0; i<this.length; i++)
                this[i].innerHTML = v;
        }else{
            return this[0].innerHTML;
        }
        return this;
    }

    /**
     * 设置/获取innnerText
     * @param v
     * @return {Re, string}
     */
    text(v=''){
        if(v){
            for(let i=0; i<this.length; i++)
                this[i].innerText = v;
        }else{
            return this[0].innerText;
        }
        return this;
    }

    /**
     * 获取元素下标
     * @param el
     * @return {number}
     */
    indexOf(el){
        for(let i=0; i<this.length; i++)
            if(el === this[i]) return i;
        return -1;
    }

    /**
     * 改变valueOf
     * @return {string}
     */
    static toString(){
        return 're{ [native code] }';
    }
}

function re(s){
    return new Re(s);
}
re.toString = Re.toString;

export default re;