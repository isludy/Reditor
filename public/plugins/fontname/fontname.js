fe.plugin('fontname', function(){
	let div = fe('<div>'),
		editor = this,
		html = '';

	fe.each(editor.options.fontname,function(){
		html += '<span class="fe-btn fe-btn-default" unselectable="on" style="font-family:'+this+'" data-fe-val="'+this+'">'+this+'</span>';
	});
	div.html(html);

	let dialog = editor.dialog({
		header: '选择字体',
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
		dialog.exec('fontFamily',dataval);
	});
});
