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
            k;
        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                html += '<div class="reditor-tool reditor-tool-'+k+'" title="'+title+'" data-name="'+k+'">'+title+'</div>';
            }
        }
        toolbar.innerHTML = html;
        toolbar.className = 'reditor-toolbar';
        toolbar.addEventListener('click', (e)=>{
            let name = e.target.getAttribute('data-name');
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
        });
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