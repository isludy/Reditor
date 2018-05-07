import options from '../../options';

class Local{
    constructor(){
        this.name = options.upload.local || 're'+(new Date().getTime());
        this.ls = window.localStorage;
        if(!this.ls.getItem(this.name)){
            this.ls.setItem(this.name, '{}');
        }
    }
    add(arr){
        let tmp = JSON.parse(this.ls.getItem(this.name)),
            len = arr.length;
        if(len){
           for(; len--; ){
               tmp[arr[len].resid] = tmp[arr[len]];
               delete arr[len].resid;
           }
        }else{
            tmp[arr.resid] = tmp[arr];
            delete arr.resid;
        }
        this.ls.setItem(this.name, JSON.stringify(tmp));
    }
    remove(resid){
        let tmp = JSON.parse(this.ls.getItem(this.name));
        delete tmp[resid];
        this.ls.setItem(this.name, JSON.stringify(tmp));
    }
    clear(){
        this.ls.clear();
    }
}
export default new Local();