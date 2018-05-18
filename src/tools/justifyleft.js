import re from '../re';

export default (reditor, name)=>{
    let start = reditor.range.startContainer,
        p = null;

    if(start.nodeType === 1){
        p = re(start);
    }else if(start.nodeType === 3){
        p = re(start.parentNode);
    }

    p.css('text-align', '').parents('p', reditor.edit[0]).css('text-align','');
    p.parents('div', reditor.edit[0]).css('text-align','');
    document.execCommand(name);
}