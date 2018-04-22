import utils from '../utils';
import options from '../options';
import item from './upload/item';
import ajax from "./upload/ajax";

let dialog,
    choser = document.createElement('input'),
    typeLimit = [],    //用来保存可支持的文件类型，以方便判断
    opt = options.upload,
    list,
    tab,
    uInners,
    mInners,
    logos,
    choserBtn,
    startBtn,
    clearBtn;

choser.type = 'file';
choser.multiple = true;

//将支持的所有类型都加入到typeLimit
for(let type in opt.type){
    if(opt.type.hasOwnProperty(type))
        opt.type[type].forEach(function(v){
            typeLimit.push(v);
        });
}

//input type=file的change事件
choser.on('change', ()=>{
    let file, len, i=0, ext, type, size, items = '';
    if(choser.files){
        len = choser.files.length;
        for(; i<len; i++){
            file = choser.files[i];
            ext = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase();
            type = file.type.split(/\//g)[0];
            size = (file.size/1048576).toFixed(2);//MB
            //判断文件类型
            if(!typeLimit.includes(ext)){
                utils.dialog({
                    type: 1,
                    css: 'max-width: 360px;',
                    title: '格式错误',
                    body: `不支持“${ext}”，仅支持以下类型：
                    <ul>
                        <li>图片：${opt.type.image.join(', ')}</li>
                        <li>视频：${opt.type.video.join(', ')}</li>
                        <li>音频：${opt.type.audio.join(', ')}</li>
                        <li>其他：${opt.type.other.join(', ')}</li>
                    </ul>`
                });
                break;
            }
            //判断文件大小
            if( size > opt.size[type]){
                utils.dialog({
                    type: 1,
                    css: 'max-width: 360px;',
                    title: '文件大小超出',
                    body: `文件“${file.name}”大小（${size}MB）超出上限，文件大小上限详情如下：
                    <ul>
                        <li>图片：${opt.size.image}(MB)</li>
                        <li>视频：${opt.size.video}(MB)</li>
                        <li>音频：${opt.size.audio}(MB)</li>
                        <li>其他：${opt.size.other}(MB)</li>
                    </ul>`
                });
                break;
            }
            //生成html
            items += item({
                id: 'reid'+i,
                type,
                src: window.createURL(file),
                desc: '',
                name: file.name,
                logo: './themes/logo.png'
            });
            //加入到formData备以上传
            ajax.append('reid'+i, file);
        }
        if(items){
            list[0].innerHTML = items;
            uInners = list[0].find('.re-upload-item-inner');
            uInners.on('click', selectHandle);
            logos = list[0].find('.re-upload-logo');
            logos.on('contextmenu', logoHandle);
        }
    }
},false);

ajax.then = function(data){
    console.log(data)
};

//添加文件
function fireChoser(){
    try{
        uInners.off('click', selectHandle);
    }catch (err){}
    document.body.append(choser);
    choser.value = '';
    choser.click();
    choser.remove();
}
//开始上传
function fireStart(){
    uInners.forEach(inner=>{
        let reid = inner.data('reid');
        if(!inner.hasClass('active'))
            ajax.delete(reid);
        else{
            ajax.set(reid, 'logo', inner.find('.re-upload-logo').hasClass('active'));
            ajax.set(reid, 'desc', (inner.find('textarea')[0].value || ''));
        }
    });
    ajax.send('post', opt.path, true);
}
//清除
function fireClear() {
    try{
        uInners.off('click', selectHandle);
        logos.off('click', logoHandle);
        ajax.delete();
    }catch (err){}
    list[0].innerHTML = '';
}
//处理选择与反选
function selectHandle(e){
    if(!/textarea/i.test(e.target.tagName)){
        if(e.ctrlKey){
            this.toggleClass('active');
            let inners = this.parentNode.parentNode.find('.re-upload-item-inner');
            if(this.hasClass('active'))
                inners.addClass('active');
            else
                inners.removeClass('active');
        }else{
            this.toggleClass('active');
        }
    }
}
//logo的右击菜单
function logoHandle(e){
    e.preventDefault();
    let _this = e.currentTarget;
    utils.menu({
        x: e.x,
        y: e.y,
        items: [{
            html: '删除水印',
            data: {name: 'del'}
        },{
            html: '添加水印',
            data: {name: 'add'}
        },{
            html: '全部删除水印',
            data: {name: 'delAll'}
        },{
            html: '全部添加水印',
            data: {name: 'addAll'}
        }],
        onclick(target){
            switch (target.data('name')){
                case 'del':
                    _this.removeClass('active');
                    break;
                case 'add':
                    _this.addClass('active');
                    break;
                case 'delAll':
                    list[0].find('.re-upload-logo').removeClass('active');
                    break;
                case 'addAll':
                    list[0].find('.re-upload-logo').addClass('active');
                    break;
            }
        }
    });
}
export default (reditor)=>{
    utils.dialog({
        title: '文件上传与管理',
        css: 'width: 80%',
        body: `
        <div id="re-upload" class="re-upload">
            <div class="re-tabs">
                <span class="re-tab active" data-tab="upload">上传</span>
                <span class="re-tab" data-tab="manage">管理</span>
            </div>
            <div class="re-tabbody active" data-tabbody="upload">
                <div class="re-upload-toolbar">
                    <button id="re-upload-choser" class="re-btn-m re-btn-success">添加</button>
                    <button id="re-upload-start" class="re-btn-m re-btn-warning">上传</button>
                    <button id="re-upload-clear" class="re-btn-m re-btn-danger">清空</button>
                </div>
                <div class="re-upload-list"></div>
            </div>
            <div class="re-tabbody" data-tabbody="manage">
                <div class="re-upload-toolbar">
                    <button class="re-btn-m re-btn-danger">清空</button>
                    <button class="re-btn-m re-btn-success">查看今天</button>
                    <button class="re-btn-m re-btn-success">查看昨天</button>
                    <button class="re-btn-m re-btn-success">查看前天</button>
                </div>
                <div class="re-upload-list"></div>
            </div>
        </div>`,
        oncreated(){
            dialog = document.find('#re-upload');
            //创建tab
            tab = utils.tab(dialog);

            //获取上传、管理列表
            list = dialog.find('.re-upload-list');

            //获取上传面板按钮，并绑定事件
            choserBtn = document.find('#re-upload-choser');
            startBtn = document.find('#re-upload-start');
            clearBtn = document.find('#re-upload-clear');
            choserBtn.on('click', fireChoser, false);
            startBtn.on('click', fireStart, false);
            clearBtn.on('click', fireClear, false);
        },
        onsure(e){

        },
        onhide(){
            if(tab) tab.destory();
            try{
                choserBtn.off('click', fireChoser, false);
                startBtn.off('click', fireStart, false);
                clearBtn.off('click', fireClear, false);
            }catch (e) {}
        }
    });

}