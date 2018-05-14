import re from '../../re';
import Items from './Items';

class Up{
    constructor(){
        let _this = this;
        this.input = document.createElement('input');
        this.input.type = 'file';
        this.input.multiple = true;
        this.choser = null;
        this.upload = null;
        this.clear = null;
        this.list = null;
        this.handlers = {
            choser(){
                _this.input.value = '';
                document.body.appendChild(_this.input);
                _this.input.click();
                document.body.removeChild(_this.input);
            },
            upload(){
                Items.upload();
            },
            clear(){
                Items.remove();
            },
            input(){
                let frag = document.createDocumentFragment(),
                    len = _this.input.files.length,
                    i = 0,
                    file;

                for(; i<len; i++){
                    file = _this.input.files[i];
                    frag.appendChild(Items.create('re' + file.lastModified + file.size, {
                        url: window.createURL(file),
                        name: file.name,
                        type: file.type,
                        tick: '<b>等待上传...</b>'
                    }));
                }
                _this.list.prepend(frag);
            },
            use(){
                console.log(Items.items);
            }
        };
    }
    init(o){
        this.choser = re(o.choser);
        this.upload = re(o.upload);
        this.clear = re(o.clear);
        this.list = re(o.list);
        this.use = re(o.use);

        this.choser.on('click', this.handlers.choser);
        this.upload.on('click', this.handlers.upload);
        this.clear.on('click', this.handlers.clear);
        this.input.on('change', this.handlers.input);
        this.use.on('click', this.handlers.use);
    }
    destroy(){
        this.choser.off('click', this.handlers.choser);
        this.upload.off('click', this.handlers.upload);
        this.clear.off('click', this.handlers.clear);
        this.input.off('change', this.handlers.input);
        this.use.off('click', this.handlers.use);
    }
}

export default new Up();