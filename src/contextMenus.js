import utils from "./utils";
import re from  './re';
export default {
    A(a){
        let url, target;
        return {
            title: '设置超链接属性',
            body: `<p>输入地址：
				<input class="re-input-m" type="text" name="url" value="${a.href}" style="width: 240px;">
			</p>
			<p>打开模式：
				<select class="re-input-m" name="target">
					<option value="_blank">在新建窗口打开</option>
					<option value="_self">在当前窗口打开</option>
				</select>
			</p>`,
            btns: ['确定',{html: '取消', type: 'warning'}],
            created(box){
                url = box.find('[name=url]');
                target = box.find('[name=target]');
                url[0].value = a.getAttribute('href');
                target[0].value = a.getAttribute('target');
            },
            clicked(){
                a.href = url[0].value;
                a.target = target[0].value;
            }
        }
    },
    IMG(e, img){
        let _this = this,
            css = 'white-space:nowrap;font-size:14px;';
        return {
            x: e.clientX,
            y: e.clientY,
            items:[{
                css,
                html: '添加文件描述',
                data: {name: 'desc'}
            },{
                css,
                html: '修改文件样式',
                data: {name: 'scale'}
            }],
            onclick(target){
                switch (target.data('name')){
                    case 'desc':
                        _this.IMGDesc(img);
                        break;
                    case 'scale':
                        _this.IMGScale(img);
                        break;
                }
            }
        }
    },
    IMGScale(img){
        let els;
        function inputHandler(){
            if(this.name === 'textAlign'){
                img.parentNode.style[this.name] = this.value;
            }else{
                img.style[this.name] = this.value;
            }
        }
        utils.dialog({
            title: '设置图片属性',
            body: `<p>
                        宽度：<input class="re-input-m" type="text" placeholder="自动" name="width">
                        <br>
                        上限：<input class="re-input-m" type="text" placeholder="100%" name="maxWidth">
                        <br>
                        下限：<input class="re-input-m" type="text" placeholder="自动" name="minWidth">
                    </p>
                    <p>
                        高度：<input class="re-input-m" type="text" placeholder="自动" name="height">
                        <br>
                        上限：<input class="re-input-m" type="text" placeholder="自动" name="maxHeight">
                        <br>
                        下限：<input class="re-input-m" type="text" placeholder="自动" name="minHeight">
                    </p>
                    <p>
                        对齐：<select class="re-input-m" name="textAlign">
                            <option value="left">靠左</option>
                            <option value="center">居中</option>
                            <option value="right">靠右</option>
                        </select>
                    </p>
                    <p>
                        浮动：<select class="re-input-m" name="float">
                            <option value="none">默认</option>
                            <option value="left">左浮</option>
                            <option value="right">右浮</option>
                        </select>
                    </p>`,
            created(box){
                els = box.find('[name]').on('input', inputHandler).each(el=>{
                    switch (el.name) {
                        case  'textAlign':
                            el.value = img.parentNode.style[el.name] || 'left';
                            break;
                        case 'float':
                            el.value = img.style[el.name] || 'none';
                            break;
                        default:
                            el.value = img.style[el.name];
                    }
                });
            },
            clicked(){
                els.off('input', inputHandler);
            }
        });
    },
    IMGDesc(img){
        let span = re('<span style="display: inline-block;text-align: left; color: gray; font-size: .9em;">在此输入文件描述</span>'),
            range = document.createRange();
        img.after(span[0]);
        img.after(re('<br>')[0]);

        span[0].parentNode.style.textAlign = 'center';
        range.selectNode(span[0]);
        utils.range(range);
    }
}