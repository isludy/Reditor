fe.plugin.linespacing = function(){
	var editor = this,
		div = fe('<div unselectable="on">'),
		html = '';

	fe.each(editor.options.linespacing,function(){
		html += '<span class="fe-btn fe-btn-default" unselectable="on" data-fe-val="'+this+'">'+this+'</span>';
	});
	div.html(html);
	
	var dialog = editor.dialog({
		header: '选择行距',
		body: div,
		ok: false,
		cancel: false,
		css: {'maxWidth':'320px'}
	},'fe-dialog-linespacing');
	
	div.on('click', function handle(e){
		var target = e.target || e.srcElement,
			dataval = target.getAttribute('data-fe-val');

		div.off('click',handle);
		dialog.hide();

		if(!dataval) return;
		dialog.exec('lineHeight',dataval+'em');
	});
}
