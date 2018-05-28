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

        document.execCommand('formatBlock', false, 'p');
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
     * 注：当destroy方法的参数是false，通过update可以恢复使用。
     */
    update(){
        if(this.selector){
            this.editor = re(this.selector);

            if(!this.editor.length) throw new Error('Can\'t get editor\'s container element by the selector "'+this.selector+'"');

            this.range = '';
            this.editor.html('');
            this.toolbar = this.createToolbar(options.tools);
            this.edit = this.createEdit();
            this.editor.append(this.toolbar);
            this.editor.append(this.edit);
            this.edit[0].focus();
            this.range = utils.range();
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
            edit = re('<div class="re-edit" contentEditable="true" spellcheck="false"></div>');

        function docUpHandler(){
            re(document).off('mouseup', docUpHandler);
            _this.range = utils.range();
        }

        handlers['editmousedown'] = (e)=>{
            if(/^img$/i.test(e.target.tagName)){
                _this.range.selectNode(e.target);
                utils.range(_this.range);
            }else{
                re(document).on('mouseup', docUpHandler);
                _this.range = utils.range();
            }
        };
        handlers['editkeydown'] = (e)=>{
            _this.range = utils.range();
            /*
            //对退格键【backspace】进行处理，让编辑区至少保留一个p标签，
            //其实可以不需要
            if(e.keyCode === 8 && /^<p><br><\/p>$/.test(edit.html().replace(/\s+/g, ''))){
                e.preventDefault();
            }
            */

            if(e.keyCode === 13){
                if(!e.shiftKey){
                    e.preventDefault();
                    _this.paragraph();
                }
            }
        };
        handlers['editkeyup'] = (e)=>{
            if(e.keyCode === 13)
                e.preventDefault();
            _this.range = utils.range();
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
     * 从光标所在位置分成两个段落或产生新段落，相当于在编辑区键入【enter】键，但与默认不同，默认生成段落标签取决于当前range所在的块标签，
     * 并会附带标签的style属性样式，同时，有一些怪异情况，如默认有会发生“p标签里生产p或div”的情况，这是不允许的。所以此方法会统一使用P标
     * 签来生成，一概作为edit的子级，以解决以上怪异情况
     * @return {Element}
     */
    paragraph(){
        let el = this.range.startContainer,
            p = document.createElement('p'),
            start = this.range.startOffset,
            end = this.range.endOffset;
        if(el === this.edit[0] || (el.parentNode === this.edit[0] && el.nodeType === 3)){
            document.execCommand('formatBlock', false, 'p');
        }else{
            while(el.parentNode !== this.edit[0]){
                el = el.parentNode;
            }
            if(el.nodeType === 1){
                if(start !== end)
                    this.range.deleteContents();
                this.range.setEnd(el, el.childNodes.length);
               this.edit[0].insertBefore(p, el.nextSibling);
                p.appendChild(this.range.extractContents());
                if(!p.innerHTML) p.innerHTML = '<br>';
                if(!el.innerHTML) el.innerHTML = '<br>';
                this.range.setStart(p, 0);
                this.range.collapse(true);
            }
        }
        return p;
    }

    /**
     * 销毁编辑器
     * @param deep 默认false,只注销事件，true时移除元素并删除属性。
     */
    destroy(deep = false){
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