import options from './options';
import utils from './utils';
import re from './re';
import contextMenus from './contextMenus';

const RC =  require.context('./tools', false, /\.js$/);

const handlers = {};

class Reditor {
    /**
     * Reditor构造器
     * @param selector 选择器，选择的元素作为编辑的容器
     * @param opt 配置项，参见options.js
     */
    constructor(selector, opt = null){
        if(!selector) throw new Error('The first parameter of Reditor\'s constructor must be a selector');

        if(opt && typeof opt === 'object'){
            for(let k in opt)
                if(opt.hasOwnProperty(k)) options[k] = opt[k];
        }
        opt = null;

        this.selector = selector;
        this.options = options;

        this.update();

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

    /**
     * 渲染编辑器
     */
    update(){
        if(this.selector){
            this.editor = re(this.selector);

            if(!this.editor.length) throw new Error('Can\'t get editor\'s container element by the selector "'+this.selector+'"');

            this.range = '';
            this.editor.html('');
            this.toolbar = this.createToolbar(options.tools);
            this.edit = this.createEdit();
            this.textarea = re('<textarea class="re-edit re-hide" spellcheck="false" name="'+options.name+'"></textarea>');
            this.editor.append(this.toolbar);
            this.editor.append(this.edit);
        }else{
            throw new Error('The editor is already destroyed');
        }
    }

    /**
     * 创建工具栏
     * @param tools
     * @return {*}
     */
    createToolbar(tools){
        let _this = this, toolbar = re('<div class="re-toolbar">'), title, div, k;

        handlers['toolshandler'] = function(e){
            let name = this.getAttribute('data-name');

            _this.edit[0].focus();
            utils.range(_this.range);

            if(name && (document.activeElement === _this.edit[0] || name === 'source')){
                if(tools[name].params === undefined){
                    document.execCommand(name);
                    _this.range = utils.range();
                }else{
                    let toolHandler = RC('./'+name+'.js');
                    if(typeof toolHandler === 'function'){
                        toolHandler(_this, name, e, this);
                    }else if((toolHandler.default) && (typeof toolHandler.default === 'function')){
                        toolHandler.default(_this, name, e, this);
                    }
                }
            }
        };

        for(k in tools){
            if(tools.hasOwnProperty(k)){
                title = typeof tools[k] === 'object' ? tools[k].title : tools[k];
                div = re('<div class="re-tool re-tool-'+k+'" title="'+title+'" data-name="'+k+'">'+(tools[k].icon || '<i class="icon icon-'+k+'"></i>')+'</div>');
                div.on('click', handlers['toolshandler']);
                toolbar.append(div);
            }
        }

        return toolbar;
    }

    /**
     * 创建编辑框(工作区)
     * @return {*}
     */
    createEdit(){
        let _this = this,
            edit = re('<div class="re-edit" contentEditable="true" spellcheck="false"></div>'),
            range = document.createRange();

        function docUpHandler(){
            re(document).off('mouseup', docUpHandler);
            _this.range = utils.range();
        }

        handlers['editmousedown'] = (e)=>{
            range.detach();
            _this.range = null;

            if(/^(img|video|audio|embed|object)$/i.test(e.target.tagName)){
                range.selectNode(e.target);
                _this.range = utils.range(range);
            }else{
                re(document).on('mouseup', docUpHandler);
            }
        };
        handlers['editkeydown'] = ()=>{
            range.detach();
            try{
                _this.range.detach();
            }catch (e) {}
            if(!/^<(p|div)[^>]*?>/i.test(_this.edit.html())){
                document.execCommand('formatBlock', false, 'p');
            }
        };
        handlers['editkeyup'] = ()=>{
            _this.range = utils.range();
            if(options.sync)
                _this.textarea[0].value = edit[0].innerHTML.replace(/<\/(p|div)>\n*/ig, '</$1>\n\n');
        };
        handlers['editcontextmenu'] = (e)=>{
            switch (e.target.tagName){
                case 'IMG':
                    e.preventDefault();
                    utils.menu( contextMenus.IMG(e, e.target) );
                    break;
                case 'A':
                    e.preventDefault();
                    utils.dialog( contextMenus.A(e.target) );
                    break;
            }
        };
        edit.on('mousedown', handlers['editmousedown']);
        edit.on('keyup', handlers['editkeyup']);
        edit.on('keydown', handlers['editkeydown']);
        edit.on('contextmenu', handlers['editcontextmenu']);

        return edit;
    }

    /**
     * 销毁编辑器
     */
    destroy(deep){
        this.edit.off('mousedown', handlers['editmousedown']);
        this.edit.off('keyup', handlers['editkeyup']);
        this.edit.off('keydown', handlers['editkeydown']);
        this.edit.off('contextmenu', handlers['editcontextmenu']);
        this.toolbar.children().off('click', handlers['toolshandler']);

        if(deep) this.editor.children().remove();

        for(let k in this){
            if(!deep && ['selector', 'options'].includes(k)) continue;
            try{
                delete this[k];
            }catch (err) {}
        }
    }
}

export default Reditor;