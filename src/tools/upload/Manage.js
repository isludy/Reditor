let xhr = new XMLHttpRequest(),
    status = 1,
    message = '',
    Manage = {};
xhr.on('error', ()=>{
    status = 2;
    message = '请求错误';
});
xhr.on('timeout', ()=>{
    status = 3;
    message = '请求超时';
});
xhr.on('load', ()=>{
    status = 0;
    message = '成功';
});
xhr.on('loadend', ()=>{
    if(status === 0){
        try{
            let data = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
            if(typeof Manage.then === 'function')
                Manage.then(data);
        }catch(err){
            status = 4;
            message = '响应数据错误。';
            if(typeof Manage.catch === 'function')
                Manage.catch(status, message);
        }
    }else{
        if(typeof Manage.catch === 'function')
            Manage.catch(status, message);
    }
});

Manage.send = (date, path)=>{
    status = 1;
    message = '准备就绪';
    xhr.open('get', path+'?Reditor=manage&date='+date, true);
    xhr.send();
};
Manage.stop = ()=>{
    xhr.abort();
};

export default Manage;