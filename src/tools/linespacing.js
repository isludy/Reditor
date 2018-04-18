import utils from '../utils';
import options from '../options';

let params = options.tools['linespacing'].params,
    len = params.length,
    i = 0,
    items = [];
for(; i<len; i++){
    items.push({
        css: 'margin:10px;white-space:nowrap;font-size:14px;',
        html: params[i]+' 倍',
        data: {
            linespacing: params[i]
        }
    });
}
export default function(reditor, name, e){
    utils.menu({
        items,
        x: e.clientX,
        y: e.clientY,
        onclick(target){
            utils.exec('line-height', target.getAttribute('data-'+name), reditor.range);
        }
    });
}
