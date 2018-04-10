import utils from '../utils';
import options from '../options';

let params = options.tools['fontname'].params,
    len = params.length,
    i = 0,
    items = [];
for(; i<len; i++){
    items.push({
        css: 'font-family:'+params[i]+';margin:10px;white-space:nowrap;',
		html: params[i],
        data: {
            fontname: params[i]
        }
    });
}
export default function(reditor, name, e){

    utils.menu({
        items,
        x: e.clientX,
        y: e.clientY,
        onclick(target){
            utils.exec(name, target.getAttribute('data-'+name), reditor._range);
        }
    });

	/*
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
	*/
}
