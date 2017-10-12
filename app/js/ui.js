/**
 * checked: 处理自定义checkbox radio的选择中与反选事件和样式
 */
function checked(){
    let doc = fe(document);
    doc.on('mousedown',function(e){
        let target = e.target || e.srcElement;
        target = fe(target);
        if(target.hasClass('fe-checkbox')){
            if(target.hasClass('checked')){
                target.removeClass('checked');
            }else{
                target.addClass('checked');
            }
        }else if(target.hasClass('fe-radio')){
            let group = target.parents('.fe-radio-group');
            if(group.length) group.find('.fe-radio').removeClass('checked');
            if(target.hasClass('checked')){
                target.removeClass('checked');
            }else{
                target.addClass('checked');
            }
        }
    });
}


/**
 * editControl： 编辑框点击到图片时，选中图片，右键（自定义）菜单，编辑文件属性
 * @param {Editor} editor Editor实例对象
 */
function editControl(editor){
    let edit = editor.edit,
        target = null,
        rg = null,
        timer;
    //文件选中状态
    edit.on('click',function(e){
        target = fe(e.target || e.srcElement);
        edit.find('[data-fe-contextmenu]').removeAttr('data-fe-contextmenu');
        edit.find('.fe-move-img-bg').removeAttr('class');
        if(target[0].tagName){
            switch(target[0].tagName){
                case 'IMG':
                    target.attr('data-fe-contextmenu','img');
                    target.parent().addClass('fe-move-img-bg');
                    rg = editor.getRange();
                    rg.selectNode(target[0]);
                    break;
                case 'A':
                    target.attr('data-fe-contextmenu','link');
                    rg = editor.getRange();
                    rg.selectNode(target[0]);
                    break;
            }
        }
    });
    //右键菜单
    edit.on('contextmenu',function(e){
        target = e.target || e.srcElement;
        rg = editor.getRange();
        switch(fe(target).attr('data-fe-contextmenu')){
            case 'img':
                e.preventDefault();
                let srcInput = null,
                    descInput = null,
                    oldsrc = target.src,
                    olddesc = (target.alt || target.title);
                editor.dialog({
                    header: fe.lang.editattr,
                    body:
                    '<div class="fe-attr-edit">\
                        <div class="fe-attr-edit-row">\
                            <div class="fe-attr-edit-name">'+fe.lang.filepath+' : </div>\
								<input data-fe-editattr="src" class="fe-input fe-attr-edit-input" type="text" value="http://">\
							</div>\
							<div class="fe-attr-edit-row">\
								<div class="fe-attr-edit-name">'+fe.lang.filedescription+' : </div>\
								<input data-fe-editattr="description" class="fe-input fe-attr-edit-input" type="text" value="">\
							</div>\
						</div>',
                    css: {'maxWidth':'640px','height':'210px'},
                    onok: function(){
                        let newsrc = srcInput[0].value,
                            newdesc = descInput[0].value,
                            localData = JSON.parse(window.localStorage.getItem(editor.localKey));
                        for(let i=0,len=localData.length; i<len; i++){
                            if(localData[i]['src'] === oldsrc){
                                if(oldsrc !== newsrc){
                                    localData[i]['src'] = newsrc;
                                    target.src = newsrc;
                                }
                                if(olddesc !== newdesc){
                                    localData[i]['description'] = newdesc;
                                    target.alt = target.title = newdesc;
                                }
                            }
                        }
                        window.localStorage.setItem(editor.localKey,JSON.stringify(localData));
                    }
                });
                srcInput = fe('[data-fe-editattr=src]');
                descInput = fe('[data-fe-editattr=description]');
                srcInput[0].value = oldsrc;
                descInput[0].value = olddesc;
                break;
            case 'link':
                e.preventDefault();
                if(editor.link){
                    editor.link(e,target);
                }else{
                    fe.loadScript([fe.getRoot+'plugins/link/link.js'],function(){
                        editor.link(e,target);
                    });
                }
                break;
        }
    });
    //阻止图片拖拽换位，而改用通过下方keydown事件的上下键实现移位
    edit.on('mousedown',function(e){
        let target = e.target || e.srcElement;
        if(target.tagName && target.tagName === 'IMG'){
            e.preventDefault();
        }
    });
    //编辑框内的输入事件处理
    edit.on('keydown',function(e){
        let imgp,
            cn;
        //edit内为空时，生成p
        if(!fe.trim(edit.html())){
            document.execCommand('formatblock', false, '<p>');
        }
        //回车时, 如果光标所在的位置是包含图片的p标签，则不设定formatblock，按默认方式产生标签。
        if(e.keyCode === 13){
            rg = editor.getRange();
            cn = rg.endContainer;
            if(cn.nodeType === 1 && fe(cn).find('img').length){
                //do something
            }else{
                document.execCommand('formatblock', false, '<p>');
            }
        }
        //上下键移动图片换位
        if(e.keyCode === 38 || e.keyCode === 40){
            imgp = document.querySelector('[data-fe-contextmenu=img]');
            if(imgp){
                imgp = imgp.parentNode;
                if(e.keyCode === 38 && imgp.previousSibling){
                    edit[0].insertBefore(imgp,imgp.previousSibling);
                }else if(e.keyCode === 40 && imgp.nextSibling){
                    edit[0].insertBefore(imgp,imgp.nextSibling.nextSibling);
                }
                if(timer) clearTimeout(timer);
                timer = setTimeout(function(){
                    clearTimeout(timer);
                    edit[0].scrollTop = imgp.offsetTop-(edit[0].offsetHeight-imgp.offsetHeight)/2;
                },20);
            }
        }
    });
    //粘贴事件，过滤粘贴
    edit.on('paste',function(e){
        e.preventDefault();
        let clip = e.clipboardData || window.clipboardData,
            textData = clip.getData('text').split(/\n+/),
            htmlData = fe.browser !== 'ie' ? clip.getData('text/html') : null,
            tmpdiv = fe('<div>'),
            tmphtml = '',
            img,
            imgs,
            reg = new RegExp('<img[^>]*?>','ig');
        while((img = reg.exec(htmlData)) !== null){
            tmphtml += img;
        }
        tmpdiv.html(tmphtml);
        imgs = tmpdiv.children();
        let arr = [];
        for(let i=0,len=textData.length; i<len; i++){
            let val = fe.trim(textData[i]);
            if(!val || arr.indexOf(textData[i]) !== -1) continue;
            arr.push(textData[i]);
        }
        for(let i=0,len=arr.length; i<len; i++){
            if(fe.browser === 'ie'){
                let p = document.createElement('p');
                p.innerHTML = arr[i];
                rg = editor.getRange();
                rg.insertNode(p);
                rg.collapse(false);
            }else {
                if (i === 0) {
                    document.execCommand('inserthtml', false, '<p>' + arr[i] + '</p>');
                    console.log(editor.getRange())
                } else {
                    document.execCommand('inserthtml', false, arr[i]);
                    console.log(editor.getRange())
                }
                if (i < len - 1) {
                    document.execCommand('insertparagraph', false, false);
                }
            }
        }
    });
}