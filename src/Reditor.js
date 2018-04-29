import options from './options';
import utils from './utils';

const RC =  require.context('./tools', false, /\.js$/);
class Reditor {
    constructor(id){
        let editor = document.getElementById(id);
        if(!editor)
            throw new Error('Element of id "'+id+'" not found');

        this.range = '';
        this.editor = editor;
        this.toolbar = this.createToolbar(options.tools);
        this.edit = this.createEdit();
        this.editor.append(this.toolbar, this.edit);
        //使用styleWidthCss模式
        try{
            document.cmd('styleWithCss', false, true);
        }catch (e) {
            utils.dialog({
                title: '提醒!',
                css: 'max-width:320px',
                body: '您的浏览器兼容性差，建议使用其他现代浏览器',
                colorType: 'warning',
                overlay: true,
                yes: false,
                no: false
            });
        }
    }
    createToolbar(tools){
        let _this = this, toolbar = document.create('div'), title, div, k;
        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                div = document.create('div');
                div.className = 're-tool re-tool-'+k;
                div.title = title;
                div.attr('data-name', k);
                div.innerHTML = '<i class="icon icon-'+k+'"></i>';
                div.on('click', handler, false);
                toolbar.append(div);
            }
        }
        function handler(e){
            let name = e.currentTarget.attr('data-name');
            _this.edit.focus();
            utils.range(_this.range);
            if(name && document.activeElement === _this.edit){
                if(tools[name].params === undefined){
                    document.cmd(name);
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
        toolbar.className = 're-toolbar';
        return toolbar;
    }
    createEdit(){
        let _this = this,
            edit = document.create('div');

        edit.className = 're-edit';
        edit.contentEditable = true;
        edit.on('mouseup', ()=>{
            _this.range = utils.range();
        });
        edit.on('mousedown', ()=>{
            try{
                _this.range.detach();
            }catch (e) {}
        });
        document.on('keydown', (e)=>{
            if(e.keyCode === 13 || !edit.childNodes.length)
                document.cmd('formatBlock',false,'p');
        });
        return edit;
    }
}

export default Reditor;