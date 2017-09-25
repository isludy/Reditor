/*--------------------------------------
 * 上传类（可移植到任何地方使用的类库）  start
 *--------------------------------------*/
 ;(function(){
	function Fup(){
		this.limitType = [];
		this.limitSize = {
			image: 2,
			video: 0,
			audio: 0,
			others: 0
		};
		this.files = {};
		this.xhrs = {};
		this.fileId = 0;
		this.autoFreeId = false;
		this.inputEl = null;
		this.blobs = [];
	}
	Fup.prototype = {
		preview: function(options,fn){
			if(!options) return;
			if(typeof options !== 'object'){
				throw ':type of parameter 1 must be object like {inputEl: selector/node, dropEl: selector/node}';
			}
			if(typeof options.inputEl != 'undefined'){
				this.change(options.inputEl,fn);
			}
			if(typeof options.dropEl != 'undefined'){
				this.drop(options.dropEl,fn);
			}
		},
		change: function(selector,fn){
			var self = this,
				el = typeof selector === 'string' ? document.querySelector( selector ) : selector;
			self.inputEl = el;
			selector = null;
			if(el && el.nodeType && el.nodeType === 1){
				el.addEventListener('change',changeFn,false);
				function changeFn(e){
					self.doEvent(e,fn);
				}
			}else{
				throw ':parameter 1 (inputEl) error, it accept selector of string or node';
			}
		},
		drop: function(selector,fn){
			var self = this,
				el = typeof selector === 'string' ? document.querySelectorAll( selector ) : selector,
				events = ['dragenter','dragleave','dragover'];
			selector = null;
			if(el){
				if(el.nodeType === 1){
					bindEvent(el);
				}else if(el.length && el[0].nodeType && el[0].nodeType === 1){
					for(var n=0,elen=el.length; n<elen; n++){
						bindEvent(el[n]);
					}
				}else{
					throw ': parameter 1 (dropEl) error, it accept selector of string or node';
				}
			}else{
				throw ': parameter 1 is null';
			}
			function bindEvent(dom){
				//阻止干扰事件
				for(var i=0,len=events.length; i<len; i++){
					dom.addEventListener(events[i],preventFn,false);
				}
				function preventFn(e){
					e.preventDefault();
				}
				//拖放事件
				dom.addEventListener('drop',dropFn,false);
				function dropFn(e){
					self.doEvent(e,fn);
				}
			}
		},
		doEvent: function(e,fn){
			e.preventDefault();
			var self = this,
				files = (e.type == 'change') ? e.target.files : e.dataTransfer.files,
				url = '';
			if(files && (len = files.length)){
				self.revoke();
				var i = 0, count = 0;
				for(; i<len; i++){
					//过滤文件类型
					var extension = files[i].name.slice(files[i].name.lastIndexOf('.')+1).toLowerCase();
					if(self.limitType.length && !self.inArray(extension,self.limitType)){
						if(self.dialog) self.dialog(self.msgType(files[i].name,extension));
						continue;
					}
					var mime = files[i].type.slice(0,files[i].type.indexOf('/'));
					if(self.limitSize[mime] && self.limitSize[mime] > 0){
						if(files[i].size > self.limitSize[mime]*1024*1024){
							if(self.dialog) self.dialog( self.msgSize( files[i].name, files[i].size, self.limitSize[mime] ) );
							continue;
						}
					}
					self.files[self.fileId+count] = files[i];

		            if (typeof window.URL != 'undefined') {
		                url = window.URL.createObjectURL(files[i]);
		            } else if (typeof window.webkitURL != 'undefined') {
		                url = window.webkitURL.createObjectURL(files[i]);
		            }
		            self.blobs.push(url);
		            if(fn) fn({id: self.fileId+count,'src':url, 'type':files[i].type, 'size':files[i].size, 'filename':files[i].name,'mdate': files[i].lastModified});
		            count++;
				}
				self.fileId += count;
				self.inputEl.value = '';
			}else{
				throw ':version of your browser is too low to support "files"';
			}
		},
		upload: function(options){
			//参数处理
			var self = this,
			o = {
				url: '',
				name: self.inputEl.name || 'fup',
				data: {},
				beforeSend: null,
				progress: null,
				success: null,
				error: null,
				cancel: null,
				timeout: null,
				complete: null
			};
			if(typeof options === 'object'){
				for(var k in options){
					o[k] = options[k];
				}
			}
			options = null;

			if(typeof window.FormData !== 'undefined'){
				for(var k in self.files){
					(function(n){
						var xhr = new XMLHttpRequest(),
							formData = new FormData();
						listenStatus(n,xhr);
						xhr.open('POST',o.url,true);
						formData.append(o.name,self.files[n]);
						if(o.data[n]){
							formData.append(o.name,typeof o.data[n] === 'object' ? JSON.stringify(o.data[n]) : o.data[n]);
						}
                        if(typeof o.timeout === 'number') xhr.timeout =o.timeout;
                        xhr.send(formData);
						self.xhrs[n] = xhr;
					})(k);
				}

				function listenStatus(id,xhr){
					xhr.addEventListener('loadstart',loadstartFn,false);
					xhr.upload.addEventListener('progress',progressFn, false);
					xhr.addEventListener('load',loadFn, false);
					xhr.addEventListener('error', errorFn, false);
					xhr.addEventListener('abort',abortFn, false);
					xhr.addEventListener('timeout',timeoutFn,false);
					xhr.addEventListener('loadend',loadendFn, false);
					function loadstartFn(e){
						xhr.removeEventListener('loadstart',loadstartFn,false);
						if(o.beforeSend) o.beforeSend(e,id);
					}
					function progressFn(e){
						if(e.lengthComputable){
							if(e.total>0 && e.loaded>=e.total)
							xhr.removeEventListener('progress',progressFn,false);
						}
						if(o.progress) o.progress(e.loaded/e.total,id,e);
					}
					function loadFn(e){
						xhr.removeEventListener('load',loadFn,false);
						self.del(id);
						if(o.success) o.success(e.target.response,id);
						if(self.autoFreeId && self.isEmpty(self.files)) self.fileId = 0;
					}
					function errorFn(e){
						xhr.removeEventListener('error',errorFn,false);
						if(o.error) o.error(e,id);
					}
					function abortFn(e){
						xhr.removeEventListener('abort',abortFn,false);
						if(o.cancel) o.cancel(e,id);
					}
					function timeoutFn(e){
						xhr.removeEventListener('timeout',abortFn,false);
						if(typeof o.timeout === 'function') o.timeout(e,id);
					}
					function loadendFn(e){
						xhr.removeEventListener('loadend',loadendFn,false);
						xhr.removeEventListener('progress',progressFn,false);
						if(o.complete) o.complete(e,id);
					}
				}
			}else{
				throw ':version of your browser is too low to support "FormData"'
			}
		},
		revoke: function(){
			var i = 0,
				len = this.blobs.length;
			for(; i<len; i++){
				if (typeof window.URL != 'undefined') {
	               window.URL.revokeObjectURL(this.blobs[i]);
	            } else if (typeof window.webkitURL != 'undefined') {
	                window.webkitURL.revokeObjectURL(this.blobs[i]);
	            }
			}
			this.blobs.splice(0,len);
		},
		freeId: function(){
			this.fileId = 0;
		},
		del: function(id){
            if(id){
    			if(this.files[id]) delete(this.files[id]);
                if(this.xhrs[id]) delete(this.xhrs[id]);
                return 1;
            }else{
                for(var k in this.files) delete(this.files[k]);
                for(var k in this.xhrs) delete(this.xhrs[k]);
                return 1;
            }
			return 0;
		},
		cancel: function(id){
			if(this.xhrs[id]){
				this.xhrs[id].abort();
				return 1;
			}
			return 0;
		},
		msgType: function(filename,type){
			//return '格式错误：不支持'+type+'，仅支持的格式为【'+this.limitType.join('、')+'】';
			return '\u683c\u5f0f\u9519\u8bef\uff1a\u6587\u4ef6\u3010'+filename+'\u3011\u4e0d\u652f\u6301'+type+'\uff0c\u4ec5\u652f\u6301\u3010'+this.limitType.join('\u3001')+'\u3011';
		},
		msgSize: function(filename,fileSize,limitSize){
			//return '大小错误：文件【'+filename+'】大小为：'+fileSize/1024/1024+'M，请限制在 '+limitSize+'M 以内';
			return '\u5927\u5c0f\u9519\u8bef\uff1a\u6587\u4ef6\u3010'+filename+'\u3011\u5927\u5c0f\u4e3a\uff1a'+(fileSize/1024/1024).toFixed(4)+'M\uff0c\u8bf7\u9650\u5236\u5728 '+limitSize+'M \u4ee5\u5185';
		},
		inArray: function(word,arr){
			for(var i=0,len = arr.length; i<len; i++){
				if( arr[i] == word) return arguments[2] ? i : true;
			}
			return false;
		},
		isEmpty: function(obj){
			for(var i in obj) return false;
			return true;
		},
		//此方法是需自己现实的接口
		dialog: function(msg){
			//alert(msg);
		}
	};
    fe.Fup = Fup;
})();
/*------------------------------
 * 上传工具类 end
 *---------------------------- */
