import utils from '../../utils';
import options from '../../options';
import Files from './Files';
import Logo from './Logo';

const xhr = new XMLHttpRequest(),
    msg = {
        colorType: 'warning',
        overlay: true,
        yes: false,
        css: 'position: absolute;max-width:360px;',
        oncancel(){
            xhr.abort();
        },
        onclose(){
            xhr.abort();
        }
    },
    Send = {
        start() {
            if(utils.isEmpty(Files.items)){
                msg.title = '上传失败';
                msg.body = '空文件夹，请先添加文件。';
                msg.no = false;
                utils.dialog(msg);
                return;
            }
            msg.title = '准备就绪';
            msg.body = '准备就绪，马上开始！';
            msg.no = '取消';
            utils.dialog(msg);

            let formData = new FormData(),
                keys = Object.keys(Logo.items),
                index = 0;

            //处理logo
            function recursion(){
                if(Logo.items[keys[index]].el.hasClass('active')){
                    Logo.compose(keys[index], file=>{
                        if(file){
                            Files.items[ keys[index] ].file = file;
                            index++;
                            if(keys[index]){
                                recursion();
                            }else{
                                addData();
                            }
                        }else{
                            msg.title = 'LOGO添加失败';
                            msg.body = '文件“'+Files.items[keys[index]].name+'”无法添加LOGO，可能某些操作不当造成的。';
                        }
                    });
                }else{
                    index++;
                    if(keys[index]){
                        recursion();
                    }else{
                        addData();
                    }
                }
            }
            //添加到formData, 并提交
            function addData(){
                for(let k in Files.items){
                    formData.append(k, Files.items[k].file);
                    formData.append(k, JSON.stringify({
                        desc: document.getElementById(k).re('[name=desc]')[0].value
                    }));
                }
                xhr.open('post', options.upload.path+'?Reditor=upload', true);
                xhr.send(formData);
            }

            recursion();
        },
        stop(){
            try{
                xhr.abort();
            }catch (err){}
        }
    };

let percent = 0;

xhr.on('loadstart', ()=>{
    msg.title = '上传中';
    msg.body = '正在拼了老命的上传中...0%';
    msg.no = '取消';
});

xhr.upload.on('progress',e=>{
    if(e.total>0 && e.loaded > 0){
        percent = Math.round(10000*e.loaded/e.total)/100;
    }else{
        percent = 0;
    }
    msg.body = '正在拼了老命的上传中...'+percent+'%';
});

xhr.on('error', ()=>{
    msg.title = '上传失败';
    msg.body = '连接失败，请求发生错误。';
});

xhr.on('timeout', ()=>{
    msg.title = '上传失败';
    msg.body = '请求超时！可能网络原因，稍后重试！';
});

xhr.on('loadend', ()=>{
    try{
        let data = typeof xhr.response === 'object' ? xhr.response : JSON.parse(xhr.response);
        if(data.code > 0){
            msg.title = '上传失败';
            msg.body = '失败消息：' + data.message;
        }else{
            msg.title = '上传成功';
            msg.body = '上传成功！';
            msg.no = '完成';
        }
    }catch (err){
        msg.title = '上传失败';
        msg.body = '失败！响应的数据错误。消息：'+err.message;
    }
});

export default Send;