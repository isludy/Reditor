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

			if(!/^http[s]?:\/\/[^.\s]+\.\S+/.test(url)) {
				utils.dialog({
					overlay: true,
					title: '地址错误',
					body: '输入的超链接地地不符合。<br>注意：<br>1.不能缺少http://或https://头。<br>2.不能为空链接。',
					colorType: 'danger',
					yes: false,
					no: false
				});
				utils.range(reditor.range);
				return false;
            }

			utils.exec({
				cmdName: 'createLink',
				cmdValue: url+'__target_'+target,
				range: reditor.range
            });

			a = reditor.edit.re('a[href$="__target_'+target+'"]');
			if(a){
                reg = new RegExp('__target_'+target+'[\/]?$','g');
                len = a.length;
                i = 0;

                for(; i<len; i++){
                    a[i].href = a[i].href.replace(reg, '');
                    if(target === '_blank') a[i].target = '_blank';
                }
			}
		}
	});
}