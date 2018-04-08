class Reditor {
    constructor(id, options){
        let _this = this;
        if(typeof id === 'string'){
            _this.editor = document.getElementById(id);
        }else if(id && id.nodeType === 1){
            _this.editor = id;
        }else{
            throw 'The first parameter of constructor must be id or element';
        }

        _this.editor.contentEditable = true;
        _this.editor.className = 'reditor';

        //toolbar
        if((typeof options === 'object') && (typeof options.tools === 'object')){
            let i = 0,
                len = options.tools.length,
                html = '',
                tool;
            if(len){
                for(; i<len; i++){
                    tool = options.tools[i];
                    html += '<div class="reditor-tool reditor-tool-'+tool.name+'" title="'+tool.title+'" data-name="'+tool.name+'" unselectable="on">B</div>';
                }

                if(options.toolbar){
                    if(typeof options.toolbar === 'string'){
                        _this.toolbar = document.getElementById(options.toolbar);
                    }else if(options.toolbar.nodeType === 1){
                        _this.toolbar = options.toolbar;
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

        //无需要参数的execCommand指令
        let noParamTools = ['bold','italic','underline','strikethrough','subscript','superscript','justifyleft','justifycenter','justifyright','justifyfull'];
        _this.toolbar.onclick = function(e){
            let name = e.target.getAttribute('data-name');
            Reditor.range(_this._range);
            if(name && document.activeElement === _this.editor){
                if(noParamTools.indexOf(name) !== -1){
                    document.execCommand(name);
                }else{
                    console.log(name);
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
}

export default Reditor;