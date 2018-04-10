import utils from '../utils';
import options from '../options';

let params = options.tools['border'].params,
    len = params.length,
    i = 0,
    items = [];
for(; i<len; i++){
    items.push({
		css: 'border:'+params[i]+';width:100px;margin:10px;padding-bottom:10px;overflow:hidden;',
		data: {
			border: params[i]
		}
    });
}
export default (reditor, name, e)=>{
	utils.menu({
		items,
		x: e.clientX,
		y: e.clientY,
		onclick(target){
            utils.exec(name, target.getAttribute('data-'+name), reditor._range);
		}
	});
}
