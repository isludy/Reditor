import utils from "../utils";
import options from "../options";
export default (reditor, name)=>{
    utils.dialog({
        title: options.tools[name].title,
        css: 'max-width: 640px; width:100%;',
        body: `<textarea style="width: 100%;min-height: 150px; box-sizing: border-box; resize: vertical;" name="${name}" placeholder="在此输入您的代码"></textarea>`,
        btns: ['确定',{html: '取消', type: 'warning'}],
        clicked(code, box){
            if(code === 0){
                let el = document.createElement('p');

                el.innerHTML = box.find('[name='+name+']').val();
                if(reditor.range.deleteContents){
                    reditor.range.deleteContents();
                    reditor.range.insertNode(el);
                }
                el = null;
            }
        }
    });
}