fe.plugin.fileupload = function(){
	var editor = this,
		thisRoot = fe.getRoot + 'plugins/fileupload/';
	fe.loadScript([thisRoot+'fup.js',thisRoot+'fileupload.css'],ready);
	function ready(){
		var fleft = fe('.fe-body-left'),
			febody = fe('.fe-body'),
			fupel = fe(
				'<div class="fe-fup">\
					<div class="fe-fup-header">\
						<div id="fe-fup-btnbar" class="fe-fup-btnbar">\
							<button data-fe="fup-chooser" class="fe-btn fe-btn-success fe-btn-sm">选择</button>\
							<button data-fe="fup-upload" class="fe-btn fe-btn-success fe-btn-sm disabled">上传</button>\
							<button data-fe="fup-cancel" class="fe-btn fe-btn-success fe-btn-sm disabled">取消</button>\
							<button data-fe="fup-clear" class="fe-btn fe-btn-success fe-btn-sm disabled">清空</button>\
						</div>\
						<div id="fe-fup-checkbar" class="fe-fup-checkbar">\
							添加水印：<span class="fe-checkbox"></span>\
							全选：<span class="fe-checkbox"></span>\
						</div>\
					</div>\
					<div id="fe-fup-body" class="fe-fup-body"></div>\
					<div class="fe-fup-footer"></div>\
				</div>'
			);

		if(febody.hasClass('showleft')){
			febody.removeClass('showleft');
		}else{
			febody.addClass('showleft');
		}
		fleft.html('').append(fupel);

		var btnbar = fe('#fe-fup-btnbar'),
			checkbar = fe('#fe-fup-checkbar'),
			fileEl = fe('<input type="file" multiple="multiple">'),
			fupbody = fe('#fe-fup-body'),
			fup = new fe.Fup();

		fupbody.css('height',(fupel[0].offsetHeight - fupel.find('.fe-fup-header')[0].offsetHeight-10)+'px');

		btnbar.on('click',function(e){
			var target = e.target;
			switch (target.getAttribute('data-fe')){
				case 'fup-chooser':
					fileEl[0].click();
					break;
				case 'fup-upload':
					//
					break;
				case 'fup-cancel':
					//
					break;
				case 'fup-clear':
					//
			}
		});
        //选择文件后创建预览
        fup.preview({inputEl: fileEl[0]},function(info){
            fupbody.append(uitem(info));
        });

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
						<span>uTools</span>\
					</div>\
				</div>\
			</div>');
        }
        function uimg(info){
            var ext = info.filename.slice(info.filename.lastIndexOf('.')+1);
            if(fup.inArray(ext,['jpg','png','gif','jpeg','svg','webp'])){
                return '<img src="'+info.src+'">';
            }else{
                return '<span>'+ext+'</span>';
            }
        }
    }
};
