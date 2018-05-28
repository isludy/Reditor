import utils from "../utils";

let pAllowLabels = ['abbr', 'audio', 'b', 'bdo', 'br', 'button',
'canvas', 'cite','code', 'command', 'data', 'datalist', 'dfn', 'em',
'embed', 'i', 'iframe', 'img', 'input', 'kbd', 'keygen', 'label',
'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress',
'q', 'ruby', 'samp', 'script', 'select', 'small', 'span','strong', 'sub',
'sup', 'svg', 'textarea', 'time', 'var','video', 'wbr'];

export default (reditor, name)=>{
    utils.dialog({
        title: reditor.options.tools[name].title,
        css: 'max-width: 640px; width:100%;',
        body: '<textarea style="width: 100%; min-height: 150px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;" placeholder="注：多个标签并列则只有第一个有效"></textarea>',
        btns: ['确定',{type: 'warning', html: '取消'}],
        clicked(code, box){
            let val = box.find('textarea').val();
            if(code === 0 && val){
                let div = document.createElement('div'),
                    rootEl;

                div.innerHTML = val;
                rootEl = div.childNodes[0];
                if(rootEl.nodeType === 3 || (rootEl.nodeType ===1 && pAllowLabels.includes(rootEl.tagName.toLowerCase())) ){
                    reditor.range.deleteContents();
                    reditor.range.insertNode(div.childNodes[0]);
                }else{
                    let p = reditor.paragraph();
                    if(p.parentNode === reditor.edit[0]){
                        reditor.edit[0].insertBefore(div.childNodes[0], p);
                    }
                }
                div = null;
            }
        }
    })
}