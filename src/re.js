//re-model re-for re-show re-html re-style re-class re-bind:attr re-child re-on:event
class Re{
    constructor(o){
        let el = document.find(o.el), els = {}, tmp;
        tmp = el.find('*');
        tmp.forEach(node=>{
            let attrs = node.attributes, attr, n;
            for(let attr of attrs){
                if(n = /^re-(\w+)(?::(\w+))*/ig.exec(attr.name+'='+attr.value)){
                    console.log(n);
                }
            }
        });
        ['model', 'for', 'show', 'html', 'style', 'class', 'bind', 'child', 'on'].forEach((val,index)=>{
            els[index] = el.find('[re-'+val+']');
        });

        for(let k in o.data){
            if(o.data.hasOwnProperty(k)) {
                if (typeof o.data[k] === 'object') {
                    console.log(k);
                } else {
                    let oVal = o.data[k];
                    els['model'].forEach(node=>{

                        node.on('input', node.attr('re-model'))
                    });
                    Object.defineProperty(o.data, k, {
                        set(val){

                        },
                        get(){
                            return '';
                        }
                    });
                }
            }
        }
    }
    $set(k, v){

    }
    static directive(n, o){

    }
}
export default Re;