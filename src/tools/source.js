export default (reditor)=>{
    if(!reditor.options.sync)
        reditor.textarea.html(reditor.edit.html().replace(/<\/(p|div)>\n*/ig, '</$1>\n\n'));

    reditor.textarea.attr('style','resize: none; height: '+reditor.edit[0].offsetHeight+'px;');
    reditor.edit.toggleClass('re-hide');
    reditor.textarea.toggleClass('re-hide');

    if(reditor.textarea.hasClass('re-hide')){
        reditor.textarea.remove();
        reditor.edit.html(reditor.textarea[0].value);
    }else{
        reditor.editor.append(reditor.textarea);
    }
}