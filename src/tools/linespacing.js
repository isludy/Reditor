import utils from '../utils';
import options from '../options';

let params = options.tools['linespacing'].params,
    len = params.length,
    i = 0,
    items = [];
for(; i<len; i++){
    items.push({
        css: 'white-space:nowrap;font-size:14px;',
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
            if(!reditor.range || reditor.range.collapsed) return;
            let node, newRange, cmp;
            node = reditor.range.startContainer;
            if(node){
                while (node.nodeType !== 1 || node.tagName !== 'P'){
                    node = node.parentNode;
                }
                node.style.lineHeight = target.attr('data-'+name);

                if(!node.nextSibling) return;
                newRange = utils.range();
                newRange.selectNode(node.nextSibling);
                cmp = newRange.compareBoundaryPoints(Range.END_TO_START, reditor.range);
                while(cmp < 1) {
                    node = node.nextSibling;
                    node.style.lineHeight = target.attr('data-' + name);
                    newRange.detach();
                    if(!node.nextSibling) return;
                    newRange.selectNode(node.nextSibling);
                    cmp = newRange.compareBoundaryPoints(Range.END_TO_START, reditor.range);
                }
            }
        }
    });
}
