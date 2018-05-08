import options from '../../options';

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.on('load',()=>{
    console.log(xhr.response);
});
const Tab2 = {
    start(){
        xhr.open('get',options.upload.path+'?Reditor=manage&date=20180508');
        xhr.send();
    }
};
export default Tab2;