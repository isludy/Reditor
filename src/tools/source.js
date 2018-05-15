import re from '../re';

let hide = true,
    el = re('<div style="width:100%; height: 100%;position: absolute;top: 0;left: 0;">');
export default (reditor)=>{
    el.html(reditor.edit.html()
        .replace(/<(\/)?(\w+[^>]*?)>/ig, '#lb#&lt;#rb#$1$2#lb#&gt;#rb#@n@')
        .replace(/#lb#/g, '<b style="color: red;">')
        .replace(/#rb#/g, '</b>')
        .replace(/@n@/g, '<br>'));
    if(hide){
        reditor.edit.append(el);
    }else{
        el.remove();
    }
    hide = !hide;
}