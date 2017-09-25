fe.plugin.link = function(){
	var editor = this,
		div = fe('<div>'),
		inputEl = fe('<input class="fe-input" style="width:90%;" type="text" value="'+(eventEl.href || 'http://')+'">'),
		selectEl = fe('<select style="width: 80px;height: 30px;border-radius: 4px;margin: 5px;"><option value="blank">新窗口</option><option value="">当前窗口</option></select>'),
		span1 = fe('<span style="font-size:14px;font-weigth:500;display:block;padding: 5px;">地址：</span>'),
		span2 = fe('<span style="font-size:14px;font-weigth:500;display:block;padding: 5px;">打开方式：</span>');

	div.append(span1).append(inputEl).append(span2).append(selectEl);

	var dialog = editor.dialog({
		header: '插入链接',
		body: div,
		css: {'maxWidth':'360px'},
		onok: function(e,range){
			var v = fe.trim(inputEl[0].value),
				oType = !!selectEl[0].value ? '____fe.'+selectEl[0].value : '';
			document.execCommand('createlink',false,v+oType);
			var aEl = editor.edit.find('a');
			for(var i=0,len=aEl.length; i<len; i++){
				if(/____fe\.blank/i.test(aEl[i].href)){
					aEl[i].href = aEl[i].href.replace(/____fe\.blank/ig,'');
					aEl[i].target = '_blank';
				}
			}
		}
	},'fe-dialog-link');
}
