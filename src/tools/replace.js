import options from '../options';
import utils from "../utils";

export default (reditor, name)=>{
    let oldval, newval, textNodes, nodeIndex, nodeLen, ovalLen, reg, exec, sel, range;

    function nextNode(){
        sel = document.getSelection();
        range = document.createRange();
        exec = reg.exec(textNodes[nodeIndex].data);

        if(sel.rangeCount) sel.removeAllRanges();

        if(exec !== null){
            range.setStart(textNodes[nodeIndex], exec.index);
            range.setEnd(textNodes[nodeIndex], exec.index+ovalLen);
            sel.addRange(range);
        }else{
            if(nodeIndex < nodeLen-1)
                nodeIndex++;
            else
                nodeIndex = 0;
        }
    }
    utils.dialog({
        title: options.tools[name].title,
        body: `<p>查找字符：<input type="text" name="oldval" value="${reditor.range+''}"></p>
            <p>替换成为：<input type="text" name="newval"></p>`,
        btns: ['下一个','替换','全部'],
        created(box){
            oldval = box.find('[name=oldval]');
            newval = box.find('[name=newval]');
            textNodes = reditor.edit.textNodes();
            reg = new RegExp(oldval[0].value, 'ig');
            nodeLen = textNodes.length;
            nodeIndex = 0;
            ovalLen = oldval[0].value.length;
        },
        clicked(code){
            switch (code){
                case 0:
                    nextNode();
                    return false;
                case 1:
                    document.execCommand('insertText', null, newval[0].value);
                    nextNode();
                    return false;
                case 2:
                    textNodes.forEach(txt=>{
                        txt.data = txt.data.replace(reg, newval[0].value);
                    });
                    break;
            }
        }
    });

}