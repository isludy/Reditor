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
		onsure(e){
			let url = e.params.url,
				target = e.params.target,
				a, reg, len, i;

			if(!/^http[s]?:\/\//.test(url)) {
				alert('输入的地址不完整，地址开头缺少http://或https://。');
				utils.range(reditor._range);
				return false;
            }

			utils.exec('link', e.params.url+'__target_'+e.params.target, reditor._range);

			a = reditor.edit.querySelectorAll('a[href$="__target_'+e.params.target+'"]');
			reg = new RegExp('__target_'+e.params.target+'[\/]?$','g');
			len = a.length;
			i = 0;

			for(; i<len; i++){
				a[i].href = a[i].href.replace(reg, '');
				if(e.params.target === '_blank') a[i].target = '_blank';
			}
		}
	});
}