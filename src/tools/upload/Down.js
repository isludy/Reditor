import options from '../../options';
import re from '../../re';
import Items from './Items';

const xhr = new XMLHttpRequest();
let list = null;
xhr.responseType = 'json';
xhr.addEventListener('load',()=>{
    let res = xhr.response,
        frag = document.createDocumentFragment(),
        sort = [];

    for(let k in res.data){
        sort.push(res.data[k]);
    }
    sort.sort((a, b)=>{
       return a.date < b.date;
    });
    sort.forEach(o=>{
        o.tick = '上传于：' + new Date(o.date).format('Y-M-D H:I:S');
        o.status = 0;
        o.selected = false;
        frag.appendChild(Items.create(o.resid, o)[0]);
    });
    list.append(frag);
});
const Down = {
    init(id){
        list = re(id);
        xhr.open('get',options.upload.path+'?Reditor=manage&date='+new Date().format('YMD'));
        xhr.send();
    }
};
export default Down;