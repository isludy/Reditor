/**
 * 操作（添加，删除，更改，获取）上传文件的数据信息
 * 可绑定事件监听添加与删除
 */
import utils from '../../utils';
import options from '../../options';
const opt = options.upload;
const typeLimit = [],
    errorOpt = {
        css: 'max-width: 360px;',
        colorType: 'danger',
        overlay: true,
        yes: false,
        no: false
    },
    typeMsg = `仅支持以下类型：
        <ul>
            <li>图片：${opt.type.image.join(', ')}</li>
            <li>视频：${opt.type.video.join(', ')}</li>
            <li>音频：${opt.type.audio.join(', ')}</li>
            <li>其他：${opt.type.other.join(', ')}</li>
        </ul>`,
    sizeMsg = `文件大小上限详情如下：
        <ul>
            <li>图片：${opt.size.image}(MB)</li>
            <li>视频：${opt.size.video}(MB)</li>
            <li>音频：${opt.size.audio}(MB)</li>
            <li>其他：${opt.size.other}(MB)</li>
        </ul>`;
//将支持的所有类型都加入到typeLimit
for(let type in opt.type){
    if(opt.type.hasOwnProperty(type)){
        opt.type[type].forEach(function(v){
            typeLimit.push(v);
        });
    }
}
class Files {
    constructor(){
        Object.defineProperty(this, 'items', {
            value: Object.create(null),
        });
        Object.defineProperty(this, 'handlers', {
            value: [],
        });
    }
    set(k,v){
        let file = v.file,
            ext = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
            type = file.type.split(/\//g)[0],
            size = (file.size / 1048576).toFixed(2),//MB
            id = 're' + file.lastModified + file.size;
        //判断文件类型
        if (!typeLimit.includes(ext)) {
            errorOpt.title = '格式错误';
            errorOpt.body = '不支持“'+ext+'”，'+typeMsg;
            utils.dialog(errorOpt);
            return;
        }
        //判断文件大小
        if (size > opt.size[type]) {
            errorOpt.title = '文件过大';
            errorOpt.body = '文件“'+file.name+'大小（'+size+'MB）超出上限，'+sizeMsg;
            utils.dialog(errorOpt);
            return;
        }
        //判断相同的文件
        if (this.get(id)) {
            errorOpt.title = '文件重复';
            errorOpt.body = '文件“' + file.name + '”可能是重复的，请检查。';
            utils.dialog(errorOpt);
            return;
        }
        this.items[k] = v;
        this.handlers.forEach(fn=>{
            fn.call(this);
        });
    }
    get(k){
        if(k !== undefined)
            return this.items[k];
        else
            return this.items;
    }
    format(){
        let fd = new FormData();
        for(let k in this.items){
            fd.append(k, this.items[k].file);
            fd.append(k, JSON.stringify(this.items[k].query));
        }
        return fd;
    }
    remove(k){
        if(k !== undefined){
            delete(this.items[k]);
        }else{
            for(k in this.items)
                delete(this.items[k]);
        }
        this.handlers.forEach(fn=>{
            fn.call(this);
        });
    }
    on(fn){
        if('function' === typeof fn)
            this.handlers.push(fn);
    }
    off(fn){
        for(let l=this.handlers.length; l--;){
            if(fn){
                if(this.handlers[l] === fn){
                    this.handlers.splice(l,1);
                    break;
                }
            }else{
                this.handlers.splice(l,1);
            }
        }
    }
}
export default Files;