fe.plugin('fontsize', function(){
	let div = fe('<div unselectable="on" style="width: 100%;max-height: 100%;overflow-y: auto;">'),
		editor = this,
		html = '<br>',
		inputEl = fe('<input class="fe-input" type="text" placeholder="自定义，不能小于10">'),
		btn = fe('<span class="fe-btn fe-btn-default">确定</span>');

	fe.each(editor.options.fontsize,function(k){
		html += '<span class="fe-btn fe-btn-default" unselectable="on" style="font-size:'+this+'px;" data-fe-val="'+this+'px">'+this+'像素</span>';
	});
	div.html(html);
	fe(div[0].childNodes[0]).before(btn);
	btn.before(inputEl);

	let dialog = editor.dialog({
		header: '选择边框样式',
		body: div,
		ok: false,
		cancel: false,
		css: {'maxWidth':'800px'}
	});
	
	div.on('click', function handle(e){
		let target = e.target || e.srcElement,
			dataval = target.getAttribute('data-fe-val');

		if(target === div[0] || target === inputEl[0]) return;
		if(target === btn[0]) dataval = inputEl[0].value.replace(/\D+/g,'')+'px';
		div.off('click',handle);
		dialog.hide();

		if(!dataval) return;
		dialog.exec('fontSize',dataval);
	});
});
