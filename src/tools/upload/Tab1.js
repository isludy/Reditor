import Files from './Files';
class Tab1{
    constructor(){
        let _this = this;
        this.input = document.create('input');
        this.input.type = 'file';
        this.input.multiple = true;
        this.choser = null;
        this.upload = null;
        this.clear = null;
        this.list = null;
        this.handlers = {
            choser(){
                _this.input.click();
            },
            upload(){

            },
            clear(){
                Files.remove();
            },
            input(){
                let len = _this.input.files.length, i = 0, file;
                for(; i<len; i++){
                    file = _this.input.files[i];
                    Files.set({file, query:{}});
                }
            }
        };
    }
    init(o){
        this.choser = document.re(o.choser);
        this.upload = document.re(o.upload);
        this.clear = document.re(o.clear);
        this.list = document.re(o.list);

        this.choser.on('click', this.handlers.choser);
        this.upload.on('click', this.handlers.upload);
        this.clear.on('click', this.handlers.clear);
        this.input.on('change', this.handlers.input);
    }
    destroy(){
        this.choser.off('click', this.handlers.choser);
        this.upload.off('click', this.handlers.upload);
        this.clear.off('click', this.handlers.clear);
        this.input.off('change', this.handlers.input);
    }
}

export default new Tab1();