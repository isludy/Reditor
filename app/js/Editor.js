/**----------------------------
 * Editor 构造器
 * @param {String} id 编辑器id
 * @param {Object} options 配置项目
 *----------------------------*/
class Editor{
    constructor(options){
        //默认参数
        this.options = {
            tools: ['bold','italic','underline','strikethrough','subscript','superscript','|',
                'fontname','fontsize','forecolor','backcolor','border','|',
                'justifyleft','justifycenter','justifyright','justifyfull','linespacing','|',
                'link','unlink','|',
                'fileupload','findreplace','zhconvert','preview'],
            colors: ['#ffffff','#eeeeee','#aaaaaa','#000000','#445566','#4477cc','#5599dd','#aa0000','#cc0000','#ee7733','#ffcc00','#77aa44'],
            fontname: ['Helvetica','MicrosoftYaHei','Arial','SimHei','SimSum','FangSong','KaiTi','STKaiti','STSong','STFangSong'],
            fontsize: ['12','13','14','16','18','20','22','24','28','32','36','42','48','56','72'],
            border: ['1px solid #333','1px solid #a00','2px solid #acc'],
            linespacing: ['1','1.5','1.6','1.8','2','2.5','3'],
            uploadPath: '',
            uploadType: ['gif','jpg','jpeg','png','svg','webp','mp4','webm','ogg','mp3','pdf','txt','doc','docx','xls','xlsx','ppt','pptx'],
            uploadSize: { //0表示不限
                image: 2,
                video: 0,
                audio: 0,
                others: 0
            },
            toolbarFixed: true,
            layout: 1
        };

        //合并参数
        if(typeof options === 'object'){
            for(var k in options){
                this.options[k] = options[k];
            }
            options = null;
        }
        //本地储存的针对fup组件的key
        this.localKey = 'fupwwp';
        //弹出层的z-index
        this.dialogIndex = 100;
    }
    /**
     * dialog： 弹窗，可拖拽的弹窗
     * @param {Object}  o  一个json对象，配置所有参数
     * o = {
	 * 	header: '',         //String 标题，可包含html
	 *  body: '',           //String 内容，可包含html
	 *  footer: true,       //boolean 是否需要低部容器，默认true
	 *  close: '&times',    //String 关闭按钮的内容，按钮是button标签
	 *  ok: '确定',          //String 确定按钮的内容，按钮是button标签
	 *  cancel: '取消',      //String 取消按钮的内容，按钮是button标签
	 *	parent: Fe.feditor,  //Dom 规定他的父级，它将被插入其中
	 *	onclose: function(){}, //function 关闭时执行
	 *	onok: function(){},    //function 确定时执行
	 *	oncancel: function(){},    //function 取消时执行
	 *	onhide: function(){},  //function 被移除时执行
	 *	css: {}                //Object{} 弹窗的样式 ，如： {background: '#fff',border:'1px solid red'}
	 * }
     *
     * @param {string} boxid  指定dialog的id，此举主要是为了屏闭多层叠加的情况，如果不给参数，则允许多层，无id。
     */
    dialog(options, boxid){
        if(document.getElementById(boxid)) return;
        var editor = this,
            //默认参数
            o = {
                header: '',
                body: '',
                footer: true,
                close: '&times',
                ok: fe.lang.ok,
                cancel: fe.lang.cancel,
                parent: editor.feditor,
                mask: document.createElement('div'),
                onclose: function(){},
                onok: function(){},
                oncancel: function(){},
                onhide: function(){},
                css: {},
                draggable: true
            },
            //保存选区，非常重要，因为在选择弹窗选项后，才能恢复选区;
            rg = editor.getRange();

        //合并参数
        if(options && typeof options === 'object'){
            for(var k in options){
                o[k] = options[k];
            }
        }
        options = null;

        //是否有底部
        var hasFooter = (typeof o.footer === 'boolean') && !o.footer ? false : true,
            //初始化节点
            box = fe('<div'+(boxid ? ' id="'+boxid+'"' : '')+' class="fe-dialog">'),
            header = fe('<div class="fe-dialog-header">'),
            body = fe('<div class="fe-dialog-body">'),
            footer = hasFooter ? fe('<div class="fe-dialog-footer">') : null,
            close = fe('<span class="fe-close">'),
            ok = (hasFooter && o.ok) ? fe('<span class="fe-btn fe-btn-default">') : null,
            cancel = (hasFooter && o.cancel) ? fe('<span class="fe-btn fe-btn-default">') : null,
            doc = fe(document);

        //给box的子节点添加内容
        function addHtml(html,obj){
            if(!obj) return;
            if(typeof html != 'string'){
                obj.html('');
                if(html instanceof Fe){
                    obj.append(html);
                }else{
                    obj[0].appendChild(html);
                }
            }else{
                obj.html(html);
            }
        }
        header.html(o.header);
        addHtml(o.header,header);
        addHtml(o.body,body);
        addHtml(o.close,close);
        box.append(close).append(header).append(body);

        if(hasFooter){
            addHtml(o.footer.footer);
            if(ok){
                addHtml(o.ok,ok);
                footer.append(ok);
            }
            if(cancel){
                addHtml(o.cancel,cancel);
                footer.append(cancel);
            }
            box.append(footer);
        }

        //添加box到指定容器
        fe(o.parent).append(box);

        //添加遮罩
        if(o.mask){
            o.mask = fe(o.mask);
            o.mask.addClass('fe-dialog-mask');
            fe('body').append(o.mask);
            o.mask.css('zIndex',editor.dialogIndex);
            editor.dialogIndex++;
        }
        //给box添加css样式
        box.css(o.css);
        if(!o.css.zIndex || !o.css['z-index']){
            box.css('zIndex',editor.dialogIndex);
        }
        editor.dialogIndex++;
        //定位dialog
        var top = o.css.top ? parseFloat(o.css.top) : (window.innerHeight - box[0].offsetHeight)/2,
            left = o.css.left ? parseFloat(o.css.left) : (window.innerWidth - box[0].offsetWidth)/2;
        box.css('left',left+'px');
        box.css('top',top+'px');
        //dialog淡入
        box.addClass('fadeIn');
        //拖拽
        if(o.draggable){
            header.on('mousedown',downFn).css('cursor','move');
            var leftStart = 0, topStart = 0;
            function downFn(e){
                e.preventDefault();
                leftStart = e.clientX;
                topStart = e.clientY;
                doc.on('mousemove',moveFn);
                doc.on('mouseup',upFn);
            }
            function moveFn(e){
                e.preventDefault();
                box[0].style.left = (e.clientX - leftStart + left) + 'px';
                box[0].style.top = (e.clientY - topStart + top) + 'px';
            }
            function upFn(e){
                e.preventDefault();
                doc.off('mousemove',moveFn);
                doc.off('mouseup',upFn);
                left = left + (e.clientX - leftStart);
                top = top + (e.clientY - topStart);
            }
        }
        //绑定按钮事件
        close.on('click',closeFn);
        if(ok) ok.on('click',okFn);
        if(cancel) cancel.on('click',cancelFn);
        function closeFn(e){
            //恢复选区，注意：要放到其他操作之前，否则可能失效。(往下同理)
            editor.setRange(rg);
            var bk = o.onclose.call(close,e);
            if(bk === undefined || bk === true) offall();
        }
        function okFn(e){;
            editor.setRange(rg);
            var bk = o.onok.call(ok,e,rg);
            if(bk === undefined || bk === true) offall();
        }
        function cancelFn(e){
            editor.setRange(rg);
            var bk = o.oncancel.call(cancel,e);
            if(bk === undefined || bk === true) offall();
        }
        function offall(){
            editor.setRange(rg);
            var bk = o.onhide();
            if(bk === undefined || bk === true){
                box.remove();
                if(o.mask) o.mask.remove();

                close.off('click',closeFn);
                if(ok) ok.off('click',okFn);
                if(cancel) cancel.off('click',cancelFn);
                try{
                    header.off('mousedown',downFn);
                }catch(e){}
            }
        }

        /* 操作
         * 利用execCommand传入backcolor会给选区创建span的特性(IE创建的是font标签，
         * 不影响，如果不需要font，则最好方式就是最后提交数据时，把所有的font替换成span标签即可)，
         * 创建标签后，到_addStyle函数中把backcolor产生的style的这个背景样式移除，
         * 以替换为最终要设置的样式名和样式值。取参数rgba(255,255,255,0)。
         */
        function doExec(name,value){
            editor.setRange(rg);
            document.execCommand('backcolor',false,"rgba(255,255,255,0)");
            __addStyle__(name,value,editor);
        }

        return {
            box: box,
            hide: offall,
            exec: doExec
        };
    }
    /**
     * dialogMsg: 消息弹窗，如错误、警告、提示等弹窗。
     * @param {string,html} title 弹窗标题
     * @param {string,html} msg 消息内容
     */
    dialogMsg(title,msg){
        this.dialog({
            header: '<div class="fe-dialogMsg-header">'+(title || '')+'</div>',
            body: '<div class="fe-dialogMsg-body">'+(msg || '')+'</div>',
            parent: document.body,
            footer: false
        },(arguments[2] ? 'fe-dialog-msgDialog' : '') );
    }
    /**
     * getRange: 获取range对象
     */
    getRange(){
        if(document.getSelection){
            return document.getSelection().getRangeAt(0);
        }else if(document.selection){
            return document.selection.createRange();
        }
    }
    /**
     * setRange: 在编辑框内创建选区
     * @param {range} rg 对象
     */
    setRange(rg){
        if(!rg) return;
        var newRg = document.getSelection();
        newRg.removeAllRanges();
        newRg.addRange(rg);
    }
    /**
     * insertFile: 插入文件到编辑器
     * @param {object} o 包含文件信息的object
     * {
	 *     src: file url
	 *     description: file description
	 * }
     */
    insertFile(o){
        var that = this, rg, cn, img, edit = this.edit[0];
        if(/^[\s\S]+\.(gif|png|jpg|jpeg|svg|webp)(\?[\s\S]*)*$/i.test(o.src)){
            mediafile('<p><img src="'+o.src+'" data-fe="img:'+o.src+'" alt="'+o.description+'" title="'+o.description+'"></p>');
        }else if(/^[\s\S]+\.(mp4|webm|ogg)(\?[\s\S]*)*$/.test(o.src)){
            mediafile('<p><img src="'+fe.getRoot+'themes/video.jpg" data-fe="video:'+o.src+'" alt="'+o.description+'" title="'+o.description+'"></p>');
        }else if(/^[\s\S]+\.mp3(\?[\s\S]*)*$/.test(o.src)){
            mediafile('<p><img src="'+fe.getRoot+'themes/audio.jpg" data-fe="audio:'+o.src+'" alt="'+o.description+'" title="'+o.description+'"></p>');
        }else{
            rg = arguments[1] || this.getRange();
            document.execCommand('createlink',false,o.src+'____fe.blank');
            var aEl = this.edit.getElementsByTagName('a');
            for(var i=0,len=aEl.length; i<len; i++){
                if(/____fe\.blank/i.test(aEl[i].href)){
                    aEl[i].href = aEl[i].href.replace(/____fe\.blank/ig,'');
                    aEl[i].target = '_blank';
                    aEl[i].innerHTML =  fe.lang.filelink;
                }
            }
        }
        function mediafile(html){
            rg = that.getRange();
            img = fe(html);
            cn = rg.endContainer;
            if(cn === edit){
                rg.insertNode(img[0]);
            }else if(cn.parentNode == edit){
                rg.selectNode(cn);
                rg.insertNode(img[0]);
                edit.removeChild(cn);
                rg.selectNode(img[0]);
            }else if(cn.nodeType === 3){
                if(cn.parentNode === edit){
                    rg.insertNode(img[0]);
                }else{
                    var p = cn.parentNode;
                    while(true){
                        if(p.parentNode === edit) break;
                        p = p.parentNode;
                    }
                    if(p.nextSibling){
                        edit.insertBefore(img[0],p.nextSibling);
                    }else{
                        edit.appendChild(img[0]);
                    }
                    rg.selectNode(img[0]);
                }
            }
            rg.collapse(false);
        }
    }
    /**
     * getHtml: 获取最后可用于提交给后台保存的代码
     */
    getHtml(){
        return this.edit.innerHTML;
    }
}
module.exports = Editor;