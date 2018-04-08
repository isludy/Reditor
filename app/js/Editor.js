/**----------------------------
 * Editor 构造器
 * @param {String} id 编辑器id
 * @param {Object} options 配置项目
 *----------------------------*/
class Editor{
    constructor(f,options){
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
            for(let k in options){
                this.options[k] = options[k];
            }
            options = null;
        }
        //init, 在ui.js赋值
        this.toolbar = null;
        this.edit = null;
        this.feditor = null;

        //本地储存的针对fup组件的key
        this.localKey = 'fupwwp';
        //弹出层的z-index
        this.dialogIndex = 100;
        //是否有打开的弹窗
        this.hasDialog = false;
        Editor.__UI__(f,this);
        Editor.__toolListener__(this);
        Editor.__toolbarFixed__(this);
    }
    /**
     * 创建UI
     * @param f
     * @param editor
     * @private
     */
    static __UI__(f, editor){
        if(!f || !f.length) throw(': Element for creating editor is null.\n You may need to invoke method of "fe.ready"');
        let html = '',
            tools = editor.options['tools'],
            line = [],
            i = 0,
            len = tools.length;
        for(; i<len; i++){
            if(tools[i] !== '|'){
                html += '<button type="button" unselectable="on" class="fe-tool fe-tool-'+tools[i]+'" data-name="'+tools[i]+'" title="'+fe.lang[tools[i]]+'"></button>';
            }else{
                html += '<span class="fe-tool-groupseparate"></span>';
                line.push(i);
            }
        }
        editor.toolbar = fe('<div class="fe-toolbar" unselectable="on" onmousedown="return false">'+html+'</div>');
        editor.edit = fe('<div class="fe-edit" spellcheck="false" contenteditable="true">');

        let fbody = fe('<div class="fe-body">'),
            fleft = fe('<div class="fe-body-left">'),
            fcenter = fe('<div class="fe-body-center">'),
            fright = fe('<div class="fe-body-right">'),
            btns = editor.toolbar.children();

        //tools style
        btns.first().addClass('fe-tool-first');
        btns.last().addClass('fe-tool-last');
        for(i=0,len = btns.length; i<len; i++){
            for(let j=0,jlen=line.length; j<jlen; j++){
                btns.eq(line[j]-1).addClass('fe-tool-last');
                btns.eq(line[j]+1).addClass('fe-tool-first');
            }
        }

        fcenter.append(editor.edit);

        fbody.append(fleft).append(fcenter).append(fright);
        f.append(editor.toolbar).append(fbody);

        f.addClass('fe-editor');

        editor.feditor = f;
    }

    /**
     * 给 tools 们添加事件
     * @param editor
     * @private
     */
    static __toolListener__(editor){
        let tools = fe(editor.toolbar).children('button');
        tools.on('click', function(evt){
            editor.edit[0].focus();
            if(document.activeElement === editor.edit[0]){
                let that = this,
                    dataname = this.getAttribute('data-name');
                if(Editor.toolnoparams.indexOf(dataname) >= 0 ){
                    //无需参数时，直接执行
                    document.execCommand(dataname);
                }else{
                    //有参时，先判断此plugin的js文件是否已被加载，否则再去加载
                    if(editor[dataname]){
                        editor[dataname](evt, that);
                    }else{
                        //加载脚本loading动画
                        let loading = fe.loadui();
                        loading.show();
                        fe.loadSource([fe.getRoot+'plugins/'+dataname+'/'+dataname+'.js'],function(){
                            loading.hide();
                            editor[dataname](evt, that);
                        });
                    }
                }
            }
        });
    }
    /** addStyle: 添加样式，即在选中的区域添加样式，在fe.dialog中被使用
     * @param {String} name 样式名
     * @param {String} val  样式值
     * @param {Editor} editor Editor实例对象
     */
    static __addStyle__( name, val, editor ){
        let spans = fe.browser === 'ie' ? editor.edit.find('font') : editor.edit.find('span'),
            reg = /background-color:[\s]*?rgba\(255,[\s]*?255,[\s]*?255,[\s]*?0\);/ig,
            oStyle = '';
        if(spans.length){
            for(let i=0,len=spans.length; i<len; i++){
                oStyle = spans[i].getAttribute('style');
                if(reg.test(oStyle)){
                    spans[i].setAttribute('style',oStyle.replace(reg,''));
                    spans[i].style[name] = val;
                    //移除子级span中重复的样式。
                    let child = spans[i].getElementsByTagName('span');
                    if(child.length){
                        for(let j=0,jlen=child.length; j<jlen; j++){
                            child[j].style[name] = '';
                        }
                    }
                }
            }
        }
    }

    /**
     * 让工具条置顶
     * @param editor
     * @private
     */
    static __toolbarFixed__(editor){
        if(editor.options.toolbarFixed){
            let tb = editor.toolbar,
                top = tb.offset(1).top,
                body = document.body || document.documentElement;

            window.onscroll = function(){
                if(top - body.scrollTop < 0){
                    tb.addClass('fe-fixed');
                }else{
                    tb.removeClass('fe-fixed');
                }
            }
        }
    }
    /**
     * 弹窗
     * @param options
     * @return {{box: Fe, hide: offall, exec: doExec}|boolean}
     */
    dialog(options){
        return fe.dialog(options, this);
    }

    /**
     * dialogMsg: 消息弹窗，如错误、警告、提示等弹窗。
     * @param {string,html} title 弹窗标题
     * @param {string,html} msg 消息内容
     */
    dialogMsg(title,msg){
        this.hasDialog = false;
        fe.dialog({
            header: '<div class="fe-dialogMsg-header">'+(title || '')+'</div>',
            body: '<div class="fe-dialogMsg-body">'+(msg || '')+'</div>',
            parent: document.body,
            footer: false
        },this);
    }
}

/**
 * 这些工具不需要参数
 * @type {Array}
 */
Editor.toolnoparams = ['bold','italic','underline','strikethrough',
    'subscript','superscript',
    'justifyleft','justifycenter','justifyright','justifyfull'];


module.exports = Editor;