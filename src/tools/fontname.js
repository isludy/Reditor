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
            utils.exec(name, target.data(name), reditor._range);
        }
    });
}
