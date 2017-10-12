fe.plugin('backcolor', function(){
	let div = fe('<div unselectable="on">'),
		editor = this,
		html = '';

	fe.each(editor.options.colors,function(){
		html += '<span class="fe-btn fe-btn-default" unselectable="on" style="background:'+this+'" data-fe-val="'+this+'"> </span>';
	});
	div.html(html);

	let dialog = editor.dialog({
		header: '添加背景色',
		body: div,
		ok: false,
		cancel: false,
		css: {'maxWidth':'600px'}
	});
	
	div.on('click', function handle(e){
		let target = e.target || e.srcElement,
			dataval = target.getAttribute('data-fe-val');

		div.off('click',handle);
		dialog.hide();

		if(!dataval) return;
		dialog.exec('backgroundColor',dataval);
	});
});
