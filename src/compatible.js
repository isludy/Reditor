/**
 * Array includes
 */
if(!Array.prototype.includes){
    Array.prototype.includes = function (target) {
        return this.indexOf(target) !== -1;
    }
}
if(!Array.prototype.forEach){
    Array.prototype.forEach = function (fn) {
        if(typeof fn === 'function')
            for(let i=0, len=this.length; i<len; i++)
                fn(this[i], i);
    }
}
/**
 * Element classList
 */
if (!('classList' in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            let _this = this,
                classList = this.className.split(/\s+/g);
                function update() {
                    _this.className = classList.join(' ');
                }
            return {
                add(){
                    let args = arguments,
                        len = args.length,
                        i = 0;
                    for(; i<len; i++)
                        if(!classList.includes(args[i]))
                            classList.push(args[i]);
                    update();
                },
                remove(){
                    let args = arguments,
                        len = args.length,
                        i = 0;
                    for(; i<len; i++)
                        if(classList.includes(args[i]))
                            classList.splice(classList.indexOf(args[i]),1);
                    update();
                },
                toggle(val, bool){
                    if(typeof bool !== 'boolean'){
                        if(classList.includes(val)) this.remove(val);
                        else this.add(val);
                    }else{
                        if(bool) this.add(val);
                        else this.remove(val);
                    }
                    update();
                },
                contains: function(val) {
                    return classList.includes(val);
                }
            };
        }
    });
}