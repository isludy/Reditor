/*
 * 本组件目前只实现多文件、异步上传，支持拖放添加。添加水印暂时由后台处理
 *
 * TODO:未来想实现的功能如下：
 * 图片类：利用canvas添加水印，裁剪图片，生成缩略图，后再提交给后台，可能还希望实现图片类的明暗，滤镜的调节等。
 * （以下两条，因考虑服务器压力，所以可能不需要这么做，而使用本地程序处理后再上传）
 * 视频、音频类：提交“截取时长信息”给后台进行裁剪处理
 * 视频类：提交“水印、头片和片尾等信息”给后台进行处理
 */
fe.plugin('fileupload', function(fupevent){
	let editor = this;
	fe.loadSource([fe.getRoot+'plugins/fileupload/fup.js',fe.getRoot+'plugins/fileupload/fileupload.css'],ready);
	function ready(){
		//初始化
		let inputEl = fe('<input type="file" name="fup" multiple="multiple">'),
			//本地储一些文件信息
			ls = window.localStorage,
			lskey = editor.localKey,
			localData = null,
			//实例化fup上传工具对象
			fup = new fe.Fup(),

			//暂存要插入编辑器的文件的本地储存的id号
			insertId = [];
		//实现fup的弹窗接口
		fe.Fup.prototype.dialog = function(msg){
			if(arguments.length == 1){
				statusbar.append('<div>'+msg+'</div>');
			}else if(arguments.length == 2){
				editor.dialogMsg(msg, arguments[1]);
			}
		}
		//配置fup
		fup.limitType = editor.options.uploadType;
		fup.limitSize = editor.options.uploadSize;
		//初始化 localStorage的内容
		if(!ls.getItem(lskey)){
			ls.setItem(lskey,'[]');
		}

		//文件上传、预览dialog
		let dialog = editor.dialog({
			header: 'FUP文件处理器',
			body:
				'<div id="fe-fup">\
					<div class="fe-fup-tabbar">\
						<span class="fe-fup-tab active">去上传</span>\
						<span class="fe-fup-tab">去管理</span>\
					</div>\
					<div class="fe-fup-body">\
						<div class="fe-fup-toolbar">\
							添加水印：<button data-fe="water" class="fe-checkbox checked"></button>\
						</div>\
						<div class="fe-fup-btnbar">\
							<button data-fe-btn="fe-file-chooser" class="fe-btn fe-btn-success">添加</button>\
							<button data-fe-btn="fe-file-upload" class="fe-btn fe-btn-success disabled">上传</button>\
							<button data-fe-btn="fe-file-cancel" class="fe-btn fe-btn-warning disabled">取消</button>\
							<button data-fe-btn="fe-file-clear" class="fe-btn fe-btn-warning disabled">清空</button>\
						</div>\
						<div class="fe-fup-btnbar hide">\
							<button data-fe-btn="fe-file-delall" class="fe-btn fe-btn-warning">删除所有文件</button>\
							<button data-fe-btn="fe-file-delpaste" class="fe-btn fe-btn-warning">删除剪贴板文件</button>\
						</div>\
						<div id="fe-fup-tabbody-upload" class="fe-fup-tabbody show"></div>\
						<div id="fe-fup-tabbody-manage" class="fe-fup-tabbody"></div>\
						<div class="fe-fup-status"></div>\
					</div>\
				</div>',
			ok:'确定',
			parent: document.body,
			css: {'maxWidth':'90%'},
			mask: false,
			onok: function(e,range){
				//TODO: 以后可能需要自定义一个confirm弹窗，来提示如果有文件未被上传，则选择是否上传后关闭
				//本地数据
				localData = JSON.parse(ls.getItem(lskey));
				//插入管理面板中选择的插入的id号对应的文件
				managePanel.find('[data-fe=add]').each(function(){
					let that = fe(this);
					if(that.hasClass('checked')){
						editor.insertFile( localData[parseInt(that.parents('[data-fupid]',1).attr('data-fupid'))] , range);
					}
				});
				//插入文件
				for(let i=0; i<insertId.length; i++){
					editor.insertFile(localData[insertId[i]]);
				}
				insertId.splice(0,insertId.length);
			},
			onhide: function(){
				fup = null;
				tabs.off('click',tabsFn);
				btnbar.off('click',btnbarFn);
				uploadPanel.off('click',uploadPanelFn);
				toolbar.off('click',toolbarFn);
				managePanel.off('click',managePanelFn);
				managePanel.off('scroll',mScrollFn);
			}
		},'fe-dialog-fup');
		//获取要操作的节点
		let fefup = fe('#fe-fup'),
			tabs = fefup.find('.fe-fup-tab'),
			uploadPanel = fe('#fe-fup-tabbody-upload'),
			managePanel = fe('#fe-fup-tabbody-manage'),
			toolbar = fefup.find('.fe-fup-toolbar'),
			btnbar = fefup.find('.fe-fup-btnbar'),
			statusbar = fefup.find('.fe-fup-status'),
			uTools = toolbar.html(),
			mTools = '选择：<button data-fe="add" class="fe-checkbox"></button>';

		//事件：面板之间的切换
		tabs.on('click', tabsFn);
		if(fupevent.type=='paste') tabsFn(1);//当粘贴时，启用管理面板
		function tabsFn(){
			let isPaste = arguments[0] == 1,
				that = isPaste ? tabs.eq(1) : fe(this),
				index = isPaste ? 1 : that.index();
			if(index == 0){
				if(!uploadPanel.hasClass('show')){
					uploadPanel.addClass('show');
					managePanel.removeClass('show');
				}
				toolbar.html(uTools);
				btnbar.eq(0).removeClass('hide');
				btnbar.eq(1).addClass('hide');
			}else if(index == 1){
				if(!managePanel.hasClass('show')){
					managePanel.addClass('show');
					uploadPanel.removeClass('show');
				}
				toolbar.html(mTools);
				btnbar.eq(0).addClass('hide');
				btnbar.eq(1).removeClass('hide');
				//延迟加载的图片预览加载
				managePanel.on('scroll',mScrollFn);
				let tmpTimer = setTimeout(function(){
					fupimgLazy(0);
				},200);
			}
			that.addClass('active').siblings().removeClass('active');
		}

		//事件：btnbar按钮面板事件委托的功能分配
		btnbar.on('click',btnbarFn);
		function btnbarFn(e){
			let target = e.target || e.srcElement,
				febtn;
			if(febtn = target.getAttribute('data-fe-btn')){
				switch(febtn){
					case 'fe-file-chooser':
						chooserFn.call(target,e);
					break;
					case 'fe-file-upload':
						uploadFn.call(target,e);
					break;
					case 'fe-file-cancel':
						cancelFn.call(target,e);
					break;
					case  'fe-file-clear':
						clearFn.call(target,e);
					break;
					case 'fe-file-delall':
						mdelAllFn.call(target,e);
					break;
					case 'fe-file-delpaste':
						mdelpasteFn.call(target,e);
				}
			}
		}
		//事件函数：文件选择按钮事件
		function chooserFn(e){
			inputEl[0].click();
			statusbar.html('');
		}
		//事件：上传
		function uploadFn(){
			//选择检查有没有文件数据
			if(fup.isEmpty(fup.files)){
				fup.dialog('提示：','文件夹是空的。');
				return false;
			}
			let sentData = {},
				doms = [];
			//获取上传面板的数据
			uploadPanel.find('.fe-fup-item-outer').each(function(){
				let that = fe(this),
					id = that.attr('data-fupid');
				//暂存需要用到的节点
				doms[id] = {
					description: that.find('textarea'),
					slider: that.find('.fe-progress-slider'),
					percent: that.find('.fe-progress-percent')
				};
				//需要发送的数据
				sentData[id] = {
					description: doms[id].description[0].value,
					water: that.find('[data-fe=water]').hasClass('checked')
				}
			});

			//开始上传
			fup.upload({
				url: editor.options.uploadPath,
				data: sentData,
				beforeSend: function(){
					btnStatusFn('beforesend');
					statusbar.html('');
				},
				progress: function(percent,id,e){
					if(isNaN(parseFloat(percent))){
						percent = 0;
					}
					percent = Math.round(percent*100)+'%';
					//上传进度条和进度百分比
					doms[id].percent.text(percent);
					doms[id].slider.css('width',percent);
				},
				success: function(data,id){
					if(!!data){
						//将响应的图片地址等信息添加到备用容器中。
						let fileInfo = {
								'date': new Date().getTime(),
								'src': data,
								'description': sentData[id]['description']
							};
						localData = JSON.parse(ls.getItem(lskey));
						//检查本地是否存在相同的图片，如果存在则删除后再添加更新的
						for(let i=0,len=localData.length; i<len; i++){
							if(localData[i]['src'] == fileInfo.src){
								localData.splice(i,1);
								break;
							}
						}
						localData.push(fileInfo);
						ls.setItem(lskey,JSON.stringify(localData));

						let localId = localData.length-1;
						//添加到管理面板
						managePanel.prepend(mitem(localId,fileInfo));
						//保存到insertId
						insertId.push(localId);
					}else{
						fup.dialog('失败：后台程序响应错误！');
					}
				},
				error: function(e,id){
					fup.dialog('失败：文件【'+fup.files[id].name+'】上传失败！');
				},
				timeout: function(e,id){
					fup.dialog('超时：文件【'+fup.files[id].name+'】上传超时！');
				},
				complete: function(){
					btnStatusFn('oncomplete');
				}
			});
		}
		//事件函数：全部取消正在进行的上传
		function cancelFn(){
			fe.each(fup.xhrs,function(){
				this.abort();
			});
		}
		//事件函数：清空面板内的所有item
		function clearFn(){
			uploadPanel.html('');
			fup.del();
			btnStatusFn('onclear');
		}

		//选择文件后创建预览
		fup.preview({inputEl: inputEl[0], dropEl: uploadPanel[0]},function(info){
			uploadPanel.append(uitem(info));
			//改变按钮状态
			btnStatusFn('onpreview');
		});
		//函数：改变btnbar里按钮的disabled状态
		function btnStatusFn(status){
			let btns = btnbar.children();
			switch(status){
				//预览时
				case 'onpreview':
					if(!fup.isEmpty(fup.files)) btns.eq(1).removeClass('disabled');
					if(uploadPanel.children().length) btns.eq(3).removeClass('disabled');
				break;
				//上传开始时
				case 'beforesend':
					btns.eq(0).addClass('disabled');
					btns.eq(1).addClass('disabled');
					btns.eq(2).removeClass('disabled');
				break;
				//上传完成时
				case 'oncomplete':
					btns.eq(0).removeClass('disabled');
					btns.eq(2).addClass('disabled');
					if(fup.isEmpty(fup.files)){
						btns.eq(1).addClass('disabled');
					}else{
						btns.eq(1).removeClass('disabled');
					}
				break;
				//item被删除时
				case 'ondelete':
					if(fup.isEmpty(fup.files)){
						btns.eq(0).addClass('disabled');
					}
					if(!uploadPanel.children().length){
						btns.eq(3).addClass('disabled');
					}
				break;
				case 'onclear':
					btns.eq(3).addClass('disabled');
					if(fup.isEmpty(fup.files)){
						btns.eq(0).addClass('disabled');
					}
				default:
					btns.eq(0).removeClass('disabled');
					btns.eq(1).addClass('disabled');
					btns.eq(2).addClass('disabled');
					btns.eq(3).addClass('disabled');
			}
		}

		//事件：上传面板的item的删除
		uploadPanel.on('click',uploadPanelFn);
		function uploadPanelFn(e){
			let target = fe(e.target || e.srcElement);
			if(target.hasClass('fe-close')){
				let p = target.parents('[data-fupid]',1),
					id = p.attr('data-fupid');
				fup.del(id);
				p.remove();
				//如果正在上传，则终止上传
				if(fup.xhrs[id]){
					fup.cancel(id);
				}
				//改变按钮状态
				btnStatusFn('ondelete');
			}
		}

		//事件：全选与反选
		toolbar.on('click',toolbarFn);
		function toolbarFn(e){
			let target = fe(e.target || e.srcElement),
				datafe = null;
			if((datafe = target.attr('data-fe')) && (target.hasClass('fe-checkbox') || target.hasClass('fe-radio')) ){
				if(fe(target).hasClass('checked')){
					uploadPanel.find('[data-fe='+datafe+']').addClass('checked');
					managePanel.find('[data-fe='+datafe+']').addClass('checked');
				}else{
					uploadPanel.find('[data-fe='+datafe+']').removeClass('checked');
					managePanel.find('[data-fe='+datafe+']').removeClass('checked');
				}
			}
		}

		//----管理面板-----
		//UI：管理面板添加item
		function mview(json){
			let len = json.length;
			if(len){
				managePanel.html('');
				while(len--){
					managePanel.append(mitem(len,json[len]));
				}
			}
		}
		mview(JSON.parse(ls.getItem(lskey)));

		//事件函数：延迟加载
		function mScrollFn(){
			fupimgLazy(this.scrollTop);
		}
		function fupimgLazy(sctop){
			managePanel.children().each(function(){
				let oftop = this.offsetTop;
				if(oftop-sctop-managePanel[0].offsetHeight < 0){
					let img = this.querySelector('[data-fupsrc]'),
						src = '';
					if(img){
						src = img.getAttribute('data-fupsrc');
						fe.loadimg(src,function(rs){
							if(rs.type == 'error') {
								img.src = fe.getRoot+'themes/imgfail.jpg';
							}else{
                                img.src = src;
							}
                            img.removeAttribute('style');
                            img.removeAttribute('class');
						});
					}
				}
			});
		}
		//事件函数： 删除所有文件
		function mdelAllFn(){
			managePanel.html('');
			ls.setItem(lskey,'[]');
		}
		//事件函数：删除剪贴板文件
		function mdelpasteFn(){
			localData = JSON.parse(ls.getItem(lskey));
			let len = localData.length,
				tmpArr = [];
			for(let i=0; i<len; i++){
				if(!localData[i]['from']){
					tmpArr.push(localData[i]);
				}
			}
			localData.splice(0,len);
			ls.setItem(lskey,JSON.stringify(tmpArr));
			mview(tmpArr);
			fupimgLazy(0);
			tmpArr = null;
		}
		//事件：管理面板的单个item删除与修改
		managePanel.on('click',managePanelFn);
		function managePanelFn(e){
			let target = fe(e.target || e.srcElement),
				id = null;
			//删除
			if(target.hasClass('fe-close')){
				let p = target.parents('[data-fupid]',1);

				localData = JSON.parse(ls.getItem(lskey));
				id = p.attr('data-fupid');
				p.remove();
				localData.splice(id,1);
				ls.setItem(lskey,JSON.stringify(localData));
				//刷新item的fupid
				let len = localData.length;
				managePanel.children().each(function(){
					this.setAttribute('data-fupid',--len);
				});
			}
			//修改描述
			else if(target[0].tagName == 'TEXTAREA'){
				target.on('change',changeFn);
				function changeFn(){
					target.off('change',changeFn);
					localData = JSON.parse(ls.getItem(lskey));
					id = target.parents('[data-fupid]',1).attr('data-fupid');
					localData[id]['description'] = target[0].value;
					ls.setItem(lskey,JSON.stringify(localData));
				}
				target.on('blur',function blurFn(){
					target.off('blur',blurFn);
					target.off('change',changeFn);
				});
			}
		}

		/* ===============
		 *  一些html模板 start
		 * =============== */
		//上传面板的
		function uitem(info){
			return fe(
			'<div class="fe-fup-item-outer" data-fupid="'+info.id+'">\
				<div class="fe-fup-item-inner">\
					<span class="fe-close">&times;</span>\
					<div class="fe-fup-item-infobar">\
						<div class="fe-fup-item-imgbox">\
							<div>'+uimg(info)+'</div>\
						</div>\
						<div class="fe-fup-item-infobox">\
							<div class="fe-fup-item-filename"><input type="text" value="'+info.filename+'"/></div>\
							<div class="fe-fup-item-description"><textarea placeholder="文件描述..."></textarea></div>\
						</div>\
					</div>\
					<div class="fe-fup-item-progressbar">\
						<div class="fe-progress">\
							<div class="fe-progress-trackbox">\
								<div class="fe-progress-track"><i class="fe-progress-slider"></i></div>\
							</div>\
							<div class="fe-progress-percent">0%</div>\
						</div>\
					</div>\
					<div class="fe-fup-item-toolbar">\
						<span>'+uTools+'</span>\
					</div>\
				</div>\
			</div>');
		}
		function uimg(info){
			let ext = info.filename.slice(info.filename.lastIndexOf('.')+1);
			if(fup.inArray(ext,['jpg','png','gif','jpeg','svg','webp'])){
				return '<img src="'+info.src+'">';
			}else{
				return '<span>'+ext+'</span>';
			}
		}

		//管理面板的
		function mitem(id,info){
			return fe(
			'<div class="fe-fup-item-outer" data-fupid="'+id+'">\
				<div class="fe-fup-item-inner'+(info.from? ' paste':'')+'">\
					<span class="fe-close">&times;</span>\
					<div class="fe-fup-item-infobar">\
						<div class="fe-fup-item-imgbox">\
							<div>'+mimg(info)+'</div>\
						</div>\
						<div class="fe-fup-item-infobox">\
							<div class="fe-fup-item-filename"><input readonly type="text" value="'+info.src.slice(info.src.lastIndexOf('/')+1)+'"/></div>\
							<div class="fe-fup-item-description"><textarea placeholder="文件描述...">'+info.description+'</textarea></div>\
						</div>\
					</div>\
					<div class="fe-fup-item-toolbar">\
						<span>'+mTools+'</span>\
					</div>\
					<div class="fe-fup-item-date">来源：'+(info.from?'剪贴板':'FUP上传')+'<br>'+fe.date(parseInt(info.date),'Y-M-D H:I:S')+'</div>\
				</div>\
			</div>');
		}
		function mimg(info){
			let ext = info.src.slice(info.src.lastIndexOf('.')+1);
			if(/^(git|jpg|jpeg|png|svg|webp)$/i.test(ext)){
				return '<img data-fupsrc="'+info.src+'" class="fe-loading-gif" src="'+fe.getRoot+'themes/loading.gif">';
			}else{
				return '<span data-fupsrc="'+info.src+'">'+ext+'</span>';
			}
		}
		/* ===============
		 *  一些html模板 end
		 * =============== */
	}
});
