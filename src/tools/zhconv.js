import options from '../options';
let lib = null;
function conv2HK(txt){
    let reg;
    for(let k in zh2Hant){
        reg = new RegExp(k,"ig");
        txt = txt.replace(reg, zh2Hant[k]);
    }
    for(let k in zh2HK){
        reg = new RegExp(k,"ig");
        txt = txt.replace(reg, zh2HK[k]);
    }
    reg = null;
    return txt;
}
export default (reditor, name)=>{
    let edit = reditor.edit;
    if(!lib){
        let script = document.createElement('script');
        script.onload = function(){
            edit.html(conv2HK(edit.html()));
        };
        script.src = options.tools[name].params;
        document.head.appendChild(script);
    }
}