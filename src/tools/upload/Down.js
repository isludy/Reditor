import options from '../../options';
import re from '../../re';
import Items from './Items';

const xhr = new XMLHttpRequest();
let list = null;
xhr.responseType = 'json';
xhr.addEventListener('load',()=>{
    let res = xhr.response,
        frag = document.createDocumentFragment();

    for(let k in res.data){
        res.data[k].tick = '上传于：' + new Date(res.data[k].date).format('Y-M-D H:I:S');
        frag.appendChild(Items.create(k, res.data[k])[0]);
    }
    list.append(frag);
});
const Down = {
    init(id){
        list = re(id);
        xhr.open('get',options.upload.path+'?Reditor=manage&date=20180514');
        xhr.send();
    }
};
export default Down;