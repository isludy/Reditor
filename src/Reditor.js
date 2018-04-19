import options from './options';
import utils from './utils';

const RC =  require.context('./tools', false, /\.js$/);

class Reditor {
    constructor(id){
        let _this = this,
            editor = document.find('#'+id);

        if(editor){
            _this.editor = editor;
            _this.toolbar = _this.createToolbar(options.tools);
            _this.edit = _this.createEdit();
            _this.editor.append(_this.toolbar, _this.edit);
        }
        //使用styleWidthCss模式
        try{
            document.cmd('styleWithCss', false, true);
        }catch (e) {
            utils.dialog({
                title: '注意!',
                css: 'max-width:320px',
                body: '您使用的浏览器（可能是IE）体验会比较差，建议使用其他现代浏览器。',
                type: 1
            });
        }
    }
    createToolbar(tools){
        let _this = this,
            toolbar = document.create('div');

        let title,
            div,
            k;
        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                div = document.create('div');
                div.className = 're-tool re-tool-'+k;
                div.title = title;
                div.attr('data-name', k);
                div.innerHTML = '<i class="icon icon-'+k+'"></i>';
                div.on('click', handle, false);
                toolbar.append(div);
            }
        }
        function handle(e){
            let name = e.currentTarget.attr('data-name');
            _this.edit.focus();
            utils.range(_this.range);
            if(name && document.activeElement === _this.edit){
                if(tools[name].params === undefined){
                    document.cmd(name);
                    _this.range = utils.range();
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