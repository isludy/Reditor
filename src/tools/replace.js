import options from '../options';
import utils from "../utils";

export default (reditor, name)=>{
    let oldval, newval, matchcase, textNodes, nodeIndex, nodeLen, ovalLen, reg, exec, sel, range;
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
            <p>替换成为：<input type="text" name="newval"></p>
            <p>区分大小写：<input class="re-checkbox-s" type="checkbox" name="matchcase"></p>`,
        btns: ['下一个','替换','全部'],
        created(box){
            oldval = box.find('[name=oldval]');
            newval = box.find('[name=newval]');
            matchcase = box.find('[name=matchcase]');

            textNodes = reditor.edit.textNodes();
            nodeLen = textNodes.length;
            nodeIndex = 0;
            ovalLen = oldval[0].value.length;

            let str = oldval[0].value, iCase = 'ig';

            reg = new RegExp(str, iCase);

            oldval.on('change', function () {
                ovalLen = this.value.length;
                str = this.value;
                reg = new RegExp(str, iCase);
            });

            matchcase.on('change', function(){
                iCase = this.checked ? 'g' : 'ig';
                reg = new RegExp(str, iCase);
            });
        },
        clicked(code){
            switch (code){
                case 0:
                    nextNode();
                    return false;
                case 1:
                    oldval[0].blur();
                    newval[0].blur();
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