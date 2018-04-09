export default ()=>{
	console.log('border');
	/*
	let div = fe('<div unselectable="on">'),
		editor = this,
		html = '';

	fe.each(editor.options.border,function(){
		html += '<span class="fe-btn fe-btn-default" unselectable="on" style="border:'+this+';width: 40px;height: 20px;" data-fe-val="'+this+'"> </span>';
	});
	div.html(html);

	let dialog = editor.dialog({
		header: '选择边框样式',
		body: div,
		ok: false,
		cancel: false,
		css: {'maxWidth':'600px'}
	});
	
	div.on('click', function handle(e){
		let target = e.target || e.srcElement,
			dataval = target.getAttribute('data-fe-val');

		div.on('click',handle);
		dialog.hide();

		if(!dataval) return;
		dialog.exec('border',dataval);
	});
	*/
}
