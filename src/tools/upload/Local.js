import options from '../../options';

class Local{
    constructor(){
        this.name = options.upload.local || 're'+(new Date().getTime());
        this.ls = window.localStorage;
        if(!this.ls.getItem(this.name)){
            this.ls.setItem(this.name, '{}');
        }
    }
    add(arg){
        let tmp = JSON.parse(this.ls.getItem(this.name)),
            len = arg.length;
        if(len){
           for(; len--; ){
               tmp[arg[len].resid] = arg[len];
               delete arg[len].resid;
           }
        }else{
            console.log(arg.resid);
            tmp[arg.resid] = arg;
            delete arg.resid;
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