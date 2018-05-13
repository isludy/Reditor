import options from '../../options';
import Items from './Items';

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.on('load',()=>{
    console.log(xhr.response);
    let res = xhr.response,
        frag = document.frag();
    for(let k in res.data){
        res.data[k].ext = 'pdf';
        frag.appendChild(Items.create(k, res.data[k]));
    }
    console.log(frag);
});
const Tab2 = {
    start(){
        xhr.open('get',options.upload.path+'?Reditor=manage&date=20180508');
        xhr.send();
    }
};
export default Tab2;