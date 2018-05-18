import options from '../options';
let flag = false, loaded = false;
function CN2HK(txt){
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
function HK2CN(txt){
    let reg;
    for(let k in zh2Hant){
        reg = new RegExp(zh2Hant[k],"ig");
        txt = txt.replace(reg, k);
    }
    for(let k in zh2HK){
        reg = new RegExp(zh2HK[k],"ig");
        txt = txt.replace(reg, k);
    }
    reg = null;
    return txt;
}

export default function(reditor, name, e, tool){
    let edit = reditor.edit;
    e = null;
    if(loaded){
        conv();
    }else{
        let script = document.createElement('script');
        script.onload = conv;
        script.src = options.tools[name].params;
        document.head.appendChild(script);
    }
    function conv(){
        loaded = true;
        tool.innerText = flag ? '简' : '繁';
        if(flag = !flag)
            edit.html(CN2HK(edit.html()));
        else
            edit.html(HK2CN(edit.html()));
    }
}