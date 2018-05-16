import utils from "../utils";
export default (reditor)=>{
	utils.dialog({
		title: '添加超链接',
		css: 'max-width: 360px;',
		body: `
			<p>输入地址：
				<input class="re-input-m" type="text" name="url" value="http://" style="width: 240px;">
			</p>
			<p>打开模式：
				<select class="re-input-m" name="target">
					<option value="_blank">在新建窗口打开</option>
					<option value="_self">在当前窗口打开</option>
				</select>
			</p>
		`,
		btns: ['确定',{html: '取消', type: 'warning'}],
		clicked(code, box){
			if(code) return;
			let url = box.find('[name="url"]')[0].value,
            	target = box.find('[name="target"]')[0].value,
				a, reg;

			if(!/^http[s]?:\/\/[^.\s]+\.\S+/.test(url)) {
				utils.dialog({
					title: '地址错误',
					body: '输入的超链接地地不符合。<br>注意：<br>1.不能缺少http://或https://头。<br>2.不能为空或无效链接。',
					type: 'danger'
				});
				utils.range(reditor.range);
				return false;
            }

			utils.exec({
				cmdName: 'createLink',
				cmdValue: url+'__target_'+target,
				range: reditor.range
            });

			a = reditor.edit.find('a[href$="__target_'+target+'"]');
			if(a.length){
                reg = new RegExp('__target_'+target+'[\/]?$','g');
                a.each(item=>{
                	item.href = item.href.replace(reg, '');
                    if(target === '_blank') item.target = '_blank';
				});
			}
		}
	});
}