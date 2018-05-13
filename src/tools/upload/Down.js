import options from '../../options';
import Items from './Items';

const xhr = new XMLHttpRequest();
let list = null;
xhr.responseType = 'json';
xhr.on('load',()=>{
    let res = xhr.response,
        frag = document.frag();
    console.log(res.data);
    for(let k in res.data){
        res.data[k].tick = '上传于：' + new Date(res.data[k].date).format('Y-M-D H:I:S');
        console.log(k)
        frag.appendChild(Items.create(k, res.data[k]));
    }
    list.append(frag);
});
const Down = {
    init(id){
        list = document.getElementById(id);
        xhr.open('get',options.upload.path+'?Reditor=manage&date=20180508');
        xhr.send();
    }
};
export default Down;