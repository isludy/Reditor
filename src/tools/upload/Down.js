import options from '../../options';
import re from '../../re';
import Items from './Items';

const xhr = new XMLHttpRequest();
let list = null,
    loading = re('<div class="re-loading"></div>');
xhr.responseType = 'json';
xhr.addEventListener('load',()=>{
    let res = xhr.response,
        frag = document.createDocumentFragment(),
        sort = [];
    if(res){
        for(let k in res.data){
            sort.push(res.data[k]);
        }
        sort.sort(function(a, b){
           return a.date < b.date;
        });
        sort.forEach(o=>{
            o.tick = '上传于：' + (new Date(o.date)).format('Y-M-D H:I:S');
            o.status = 0;
            o.selected = false;
            frag.appendChild(Items.create(o.resid, o)[0]);
        });
        list.find('.re-upload-loaded').remove();
        list.append(frag);
    }
});
xhr.addEventListener('loadend', ()=>{
    try{
        loading.remove();
    }catch(err){}
});
Items.ondelete = function(id){
    if(Items.items[id].status === 0){
        xhr.open('get', options.upload.path+'?Reditor=delete&resid='+id+'&date='+(new Date(Items.items[id].date)).format('YMD'));
        xhr.send();
    }
};
const Down = {
    init(id){
        list = re(id);
        list.append(loading);
        xhr.open('get',options.upload.path+'?Reditor=manage&date=20180531');//+new Date().format('YMD'));
        xhr.send();
    }
};
export default Down;