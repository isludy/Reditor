class Find {
    constructor(selector){
        this.selector = selector;
        this.items = [document];
        this.find(selector);
    }
    find(selector){
        let doms = [];
        for(let len = this.items.length, i=0; i<len; i++){
            if(/^#[^\s]+$/.test(selector)){
                doms.push(document.getElementById(selector.slice(1)));
            }else if(/^\.[^\s]+$/.test(selector)){
                doms.push(this.items[i].getElementsByClassName(selector.slice(1)));
            }else if(/^(\w+|\*)$/.test(selector)){
                doms = this.items[i].getElementsByTagName(selector);
            }else{
                doms = this.items[i].querySelectorAll(selector);
            }
        }
        this.items = doms;
        return this;
    }
    assign(){
        if(Object.assign){
           return Object.assign();
        }
    }
}