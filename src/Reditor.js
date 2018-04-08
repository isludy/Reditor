import options from './options';
import toolControl from './toolControl';
//execCommand方法无需第二、三个参数的指令
const noParamTools = ['bold','italic','underline','strikethrough','subscript','superscript','justifyleft','justifycenter','justifyright','justifyfull'];

class Reditor {
    constructor(o){
        let _this = this;
        if(typeof o.editor === 'string'){
            _this.editor = document.getElementById(o.editor);
        }else if(o.editor && o.editor.nodeType === 1){
            _this.editor = o.editor;
        }else{
            throw 'The first parameter of constructor must be id or element';
        }

        _this.editor.contentEditable = true;
        _this.editor.className = 'reditor';

        //toolbar
        if((typeof o === 'object') && (typeof o.tools === 'object')){
            let i = 0,
                len = o.tools.length,
                html = '',
                tool;
            if(len){
                for(; i<len; i++){
                    tool = o.tools[i];
                    html += '<div class="reditor-tool reditor-tool-'+tool.name+'" title="'+tool.title+'" data-name="'+tool.name+'" unselectable="on">B</div>';
                }

                if(o.toolbar){
                    if(typeof o.toolbar === 'string'){
                        _this.toolbar = document.getElementById(o.toolbar);
                    }else if(o.toolbar.nodeType === 1){
                        _this.toolbar = o.toolbar;
                    }else{
                        throw 'The value of options.toolbar must be id or element';
                    }
                }else{
                    _this.toolbar = document.createElement('div');
                    document.body.appendChild(this.toolbar);
                }

                _this.toolbar.className = 'reditor-toolbar';
                _this.toolbar.innerHTML = html;
            }
        }
        _this.editor.addEventListener('mouseup', ()=>{
            _this._range = Reditor.range();
        });

        _this.toolbar.onclick = function(e){
            let name = e.target.getAttribute('data-name');
            Reditor.range(_this._range);
            if(name && document.activeElement === _this.editor){
                if(noParamTools.indexOf(name) !== -1){
                    document.execCommand(name);
                    _this._range = Reditor.range();
                }else{
                    if(typeof toolControl[name] === 'function') toolControl[name](_this, name, e);
                }
            }
        }
    }
    static range(rg){
        let s = window.getSelection();
        if(rg){
            if(s.rangeCount > 0)  s.removeAllRanges();
            if(rg.rangeCount){
                s.addRange(rg.getRangeAt(0))
            }else{
                s.addRange(rg);
            }
        }else{
            if(s.rangeCount) return s.getRangeAt(0);
            else return s;
        }
    }
    static create(o){

        if(typeof o === 'object'){
            for(let k in o){
                if(o.hasOwnProperty(k)){
                   if(options.hasOwnProperty(k)){
                       options[k] = o[k];
                       delete o[k];
                   }
                }
            }
            o = null;
        }

        if(o && typeof o !== 'object') throw 'The parameter of create must be object';

        return new Reditor(options);
    }
}

export default Reditor;