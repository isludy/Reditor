/**
 * 操作（添加，删除，更改，获取）上传文件的数据信息
 * 可绑定事件监听添加与删除
 */
class Files {
    constructor(){
        Object.defineProperty(this, 'items', {
            value: Object.create(null),
        });
        Object.defineProperty(this, 'handlers', {
            value: [],
        });
    }
    set(k,v){
        this.items[k] = v;
        this.handlers.forEach(fn=>{
            fn.call(this);
        });
    }
    get(k){
        if(k !== undefined)
            return this.items[k];
        else
            return this.items;
    }
    format(){
        let fd = new FormData();
        for(let k in this.items){
            fd.append(k, this.items[k].file);
            fd.append(k, JSON.stringify(this.items[k].query));
        }
        return fd;
    }
    remove(k){
        if(k !== undefined){
            delete(this.items[k]);
        }else{
            for(k in this.items)
                delete(this.items[k]);
        }
        this.handlers.forEach(fn=>{
            fn.call(this);
        });
    }
    on(fn){
        if('function' === typeof fn)
            this.handlers.push(fn);
    }
    off(fn){
        for(let l=this.handlers.length; l--;){
            if(fn){
                if(this.handlers[l] === fn){
                    this.handlers.splice(l,1);
                    break;
                }
            }else{
                this.handlers.splice(l,1);
            }
        }
    }
}
export default new Files();