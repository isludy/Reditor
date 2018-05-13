class Re{
    constructor(s){
        this.length = 0;
        this.find(s, 1);
    }
    find(s){
        let doms;
        if(!arguments[1]){
            doms = document.querySelectorAll(s);
        }else{
            doms = [];
            for(let i=0; i<this.length; i++){
                let tmp = this[i].querySelectorAll(s),
                    len = tmp.length;
                for(let j=0; j<len; j++){
                    doms.push(tmp[j]);
                }
            }
        }
        if(this.length > doms.length){
            for(let m=this.length-1; m>=doms.length; m--){
                delete this[m];
            }
        }
        this.length = doms.length;
        for(let index = 0; index < this.length; index++){
            this[0] = doms[index];
        }
        return this;
    }
}