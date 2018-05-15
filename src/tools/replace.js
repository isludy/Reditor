import options from '../options';
import utils from "../utils";

export default (reditor, name)=>{
    let oldval, newval, textNodes, reg;
    utils.dialog({
        title: options.tools[name].title,
        body: `<p>查找字符：<input type="text" name="oldval" value="${reditor.range+''}"></p>
            <p>替换成为：<input type="text" name="newval"></p>`,
        btns: ['上一个','下一个','替换','全部'],
        created(box){
            oldval = box.find('[name=oldval]');
            newval = box.find('[name=newval]');
            textNodes = reditor.edit.textNodes();
            reg = new RegExp(oldval[0].value, 'i');
        },
        clicked(code){
            switch (code){
                case 0:
                    return false;
                case 1:
                    return false;
                case 2:
                    return false;
                case 3:
                    textNodes.forEach(txt=>{
                        txt.data = txt.data.replace(reg, newval[0].value);
                    });
                    break;
            }
        }
    });
}