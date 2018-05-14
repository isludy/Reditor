import options from './options';
import utils from './utils';
import re from './re';
const RC =  require.context('./tools', false, /\.js$/);
class Reditor {
    constructor(id){
        let editor = re('#'+id);
        if(!editor)
            throw new Error('Element of id "'+id+'" not found');

        this.range = '';
        this.editor = editor;
        this.toolbar = this.createToolbar(options.tools);
        this.edit = this.createEdit();
        this.editor.append(this.toolbar);
        this.editor.append(this.edit);
        //使用styleWidthCss模式
        try{
            document.execCommand('styleWithCss', false, true);
        }catch (e) {
            utils.dialog({
                title: '提醒!',
                css: 'max-width:320px',
                body: '您的浏览器兼容性差，建议使用其他现代浏览器',
                type: 'warning'
            });
        }
    }
    createToolbar(tools){
        let _this = this, toolbar = re('<div class="re-toolbar">'), title, div, k;
        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                div = re('<div class="re-tool re-tool-'+k+'" title="'+title+'" data-name="'+k+'"><i class="icon icon-'+k+'"></i></div>');
                div.on('click', handler);
                toolbar.append(div);
            }
        }
        function handler(e){
            let name = this.getAttribute('data-name');
            _this.edit[0].focus();
            utils.range(_this.range);
            if(name && document.activeElement === _this.edit[0]){
                if(tools[name].params === undefined){
                    document.execCommand(name);
                    _this.range = utils.range();
                }else{
                    let toolHandler = RC('./'+name+'.js');
                    if(typeof toolHandler === 'function'){
                        toolHandler(_this, name, e);
                    }else if((toolHandler.default) && (typeof toolHandler.default === 'function')){
                        toolHandler.default(_this, name, e);
                    }
                }
            }
        }
        return toolbar;
    }
    createEdit(){
        let _this = this,
            edit = re('<div class="re-edit" contentEditable="true"></div>');

        edit.on('mouseup', ()=>{
            _this.range = utils.range();
        });
        edit.on('mousedown', ()=>{
            try{
                _this.range.detach();
            }catch (e) {}
        });
        re(document).on('keydown', (e)=>{
            if(e.keyCode === 13 || !edit.children().length)
                document.execCommand('formatBlock', false, 'p');
        });
        return edit;
    }
}

export default Reditor;