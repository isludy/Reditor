import utils from '../utils';
import options from '../options';

let params = options.tools['backcolor'].params,
    len = params.length,
    i = 0,
    items = [];
for(; i<len; i++){
    items.push({
        css: 'color:'+params[i]+';width:100px;height:15px;margin:5px;border:#ddd 1px solid; background-color: '+params[i]+';',
        data: {
        	backcolor: params[i]
        }
    });
}
export default (reditor, name, e)=>{
    utils.menu({
        items,
        x: e.clientX,
        y: e.clientY,
        onclick(target){
            utils.exec('background-color', target.getAttribute('data-'+name), reditor._range);
        }
    });
}
