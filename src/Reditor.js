import options from './options';
import utils from './utils';

const RC =  require.context('./tools', false, /\.js$/);

class Reditor {
    constructor(id){
        let _this = this,
            editor = document.getElementById(id);

        if(editor){
            editor.className = 'reditor';
            _this.editor = editor;

            _this.toolbar = _this.createToolbar(options.tools);
            _this.edit = _this.createEdit();
            _this.editor.appendChild(_this.toolbar);
            _this.editor.appendChild( _this.edit);
        }
    }
    createToolbar(tools){
        let _this = this,
            toolbar = document.createElement('div');

        let html = '',
            title,
            div,
            k;
        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                div = document.createElement('div');
                div.className = 'reditor-tool reditor-tool-'+k;
                div.title = title;
                div.setAttribute('data-name', k);
                div.innerHTML = '<i class="icon icon-'+k+'"></i>';
                div.addEventListener('click', handle, false);
                toolbar.appendChild(div);
            }
        }
        function handle(e){
            let name = e.currentTarget.getAttribute('data-name');
            _this.edit.focus();
            utils.range(_this._range);
            if(name && document.activeElement === _this.edit){
                if(tools[name].params === undefined){
                    document.execCommand(name);
                    _this._range = utils.range();
                }else{
                    let toolHandle = RC('./'+name+'.js');
                    if(typeof toolHandle === 'function'){
                        toolHandle(_this, name, e);
                    }else if((toolHandle.default) && (typeof toolHandle.default === 'function')){

                        toolHandle.default(_this, name, e);
                    }
                }
            }
        }
        toolbar.className = 'reditor-toolbar';
        return toolbar;
    }
    createEdit(){
        let _this = this,
            edit = document.createElement('div');

        edit.className = 'reditor-edit';
        edit.contentEditable = true;
        edit.addEventListener('mouseup', ()=>{
            _this._range = utils.range();
        });
        return edit;
    }
}

export default Reditor;