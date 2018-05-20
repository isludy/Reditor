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
                    file,
                    item;

                for(; i<len; i++){
                    file = _this.input.files[i];
                    item = Items.create('re' + file.lastModified + file.size, {
                        url: window.createURL(file),
                        name: file.name,
                        type: file.type,
                        tick: '<b>等待上传...</b>',
                        status: 1
                    }, file);

                    if(item && item[0])
                        frag.appendChild(item[0]);
                    else
                        break;
                }
                _this.list.prepend(frag);
            }
        };
    }
    init(o){
        this.choser = re(o.choser);
        this.upload = re(o.upload);
        this.clear = re(o.clear);
        this.list = re(o.list);

        this.choser.on('click', this.handlers.choser);
        this.upload.on('click', this.handlers.upload);
        this.clear.on('click', this.handlers.clear);
        re(this.input).on('change', this.handlers.input);
    }
    destroy(){
        this.choser.off('click', this.handlers.choser);
        this.upload.off('click', this.handlers.upload);
        this.clear.off('click', this.handlers.clear);
        re(this.input).off('change', this.handlers.input);
    }
}

export default new Up();