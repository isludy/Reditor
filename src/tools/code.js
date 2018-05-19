import utils from "../utils";
import options from "../options";
import re from "../re";
export default (reditor, name)=>{
    utils.dialog({
        title: options.tools[name].title,
        css: 'max-width: 640px; width:100%;',
        body: `<textarea style="width: 100%;min-height: 150px; box-sizing: border-box; resize: vertical;" name="${name}" placeholder="在此输入您的代码"></textarea>`,
        btns: ['确定',{html: '取消', type: 'warning'}],
        clicked(code, box){
            if(code === 0){
                let div = re('<div>'),
                    frag = document.createDocumentFragment();

                div.html(box.find('[name='+name+']').val());
                div.children().each(child=>{
                    frag.appendChild(child);
                });
                if(reditor.range.deleteContents){
                    reditor.range.deleteContents();
                    reditor.range.insertNode(frag);
                }
                div = frag = null;
            }
        }
    });
}