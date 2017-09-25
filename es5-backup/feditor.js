;(function(window,document,undefined){
/* ====================
 DOM 操作部分
======================*/
/**
* 函数创建Fe实例对象fe，是node/nodeList的包装对象，方便用来操作dom，与jquery相似。
* @param  {fe,node,nodeList,selector,string} s [接收fe对象、节点、节点列表、css选器、html字符串]
* @return {fe}   [Fe的实例对象]
*/
function fe(s){
	return new Fe(s);
}
/**
 * Fe类构造器
 * @param       {fe,node,nodeList,string} s [接收节点、节点列表、html字符串]
 * @constructor
 */
function Fe(s){
	s = __nodes__(s);
	if(this.length = s.length){
		for(var i=0; i<this.length; i++){
			this[i] = s[i];
		}
	}
	s = null;
}
/**
 * Fe原型链的方法和属性
 * @type {Object}
 */
Fe.prototype = {
	v: '1.0.0',
	/**
	 * find: 查找指定选择器的树枝节点
	 * @param {string} s css选择器
	 */
	find: function(s){
		var arr = [];
		if(typeof s === 'string'){
			__for__(this, function(el,index){
				var tmp = el.querySelectorAll(s);
				for(var i=0,len=tmp.length; i<len; i++){
					if(arr.indexOf(tmp[i]) == -1){
						arr.push(tmp[i]);
					}
				}
			});
		}
		return fe(arr);
	},
	/**
	 * children: 查找子节点
	 * @param {string} s 可选，css选择器，表示选择子级中匹配的节点
	 */
	children: function(s){
		var arr = [];
		__for__(this,function(el,index){
			var tmp = el.childNodes;
			for(var i=0,len=tmp.length; i<len; i++){
				if(tmp[i].nodeType === 1 && arr.indexOf(tmp[i]) == -1){
					if(!s){
						arr.push(tmp[i]);
					}else if(typeof s === 'string'){
						var stmp = el.querySelectorAll(s);
						for(var j=0,slen=stmp.length; j<slen; j++){
							if(tmp[i] === stmp[j]){
								arr.push(stmp[j]);
							}
						}
					}
				}
			}
		});
		return fe(arr);
	},
	/**
	 * siblings: 获取兄弟节点集
	 * @param {string} s 可选，css选择器
	 */
	siblings: function(s){
		var that = this,
			arr = [];
		__for__(this.parent().children(s),function(el){
			for(var i=0; i<that.length; i++){
				if(el === that[i]) break;
				arr.push(el);
			}
		});
		return fe(arr);
	},
	/**
	 * parent: 获取父级节点集
	 * @param {string} s 可选，css选择器
	 */
	parent: function(s){
		var arr = [];
		__for__(this,function(el,index){
			var p = el.parentNode;
			if(arr.indexOf(p) == -1){
				if(!s){
					arr.push(p);
				}else{
					var els = (p.parentNode || document).querySelectorAll(s);
					for(var i=0,len=els.length; i<len; i++){
						if(els[i] === p){
							arr.push(p);
						}
					}
				}
			}
		});
		return fe(arr);
	},
	/**
	 * parents: 获取父级及以上的节点集
	 * @param {string} s 可选，css选择器
	 * @param {number} arg[1] 可选，表示获取到第arg[1]个时停止再往上一级查找
	 * @param {node} arg[2] 可选，表示查找范围，默认是标签html以内
	 */
	parents: function(s){
		var arr = [],
            nlimit = typeof arguments[1] === 'number' ? arguments[1] : 0,
			plimit = arguments[2] || document.documentElement;
		__for__(this,rec);
		function rec(el){
			var p = el.parentNode;
			if(arr.indexOf(p) == -1){
				if(!s){
					arr.push(p);
				}else{
					var els = (p.parentNode || document).querySelectorAll(s);
					for(var i=0,len=els.length; i<len; i++){
						if(els[i] === p){
							arr.push(p);
						}
					}
				}
				if(p.parentNode && p.parentNode !== plimit){
					if(!nlimit || arr.length < nlimit){
						rec(p);
					}
				}
			}
		}
		return fe(arr);
	},
	/**
	 * eq: 获取一个指定index的fe
	 * @param {number} index 索引
	 *
	 */
	eq: function(index){
		return fe(this[index]);
	},
	/**
	 * first: 获取第一个fe
	 */
	first: function(){
		return fe(this[0]);
	},
	/**
	 * last: 获取最后一个fe
	 */
	last: function(){
		return fe(this[this.length-1]);
	},
	/**
	 * index: 获取元素节点的索引
	 */
	index: function(){
		var c = this[0].parentNode.childNodes,
			index = 0;
		for(var i=0,len=c.length; i<len; i++){
			if(c[i].nodeType === 1){
				if(c[i] === this[0]) return index;
				index++;
			}
		}
	},
	/**
	 * html: 获取或添加html
	 * @param {string} s 可选，htmlstring，有参数时表示设定innerHTML,无参数时表示返回innerHTML
	 */
	html: function(s){
		if(!s && s != ''){
			return this[0].innerHTML;
		}else{
			__for__(this,function(el){
				el.innerHTML = s;
			});
		}
		return this;
	},
	/**
	 * text: 获取或添加text
	 * @param {string} t 可选，text/html string, 同理于html方法
	 */
	text: function(t){
		if(!t && t != ''){
			return this[0].innerText;
		}else{
			__for__(this,function(el){
				el.innerText = t;
			});
		}
		return this;
	},
    /**
	 * getTextNodes: 获取所有子节点及以下的文字节点
     */
    getTextNodes: function(flag){
    	var arr = [];
        fn(this);
    	function fn(doms) {
            __for__(doms, function (el) {
                if (el.nodeType === 3 && el.data.replace(/\s+/g, '')) {
                	if(flag){
                		arr.push(el.data);
					}else{
                        arr.push(el);
					}
                }else{
                	fn(el.childNodes);
				}
            });
        }
		return arr;
	},
	/**
	 * toHtml: fe转成html string
	 */
	 toHtml: function(){
		 var div = document.createElement('div');
		 if(this[0]){
			 div.appendChild(this[0]);
    		 return div.innerHTML;
		 }
		 div = null;
		 return '';
	 },
	 /*
 	 * toText: fe转成text string
 	 */
 	toText: function(){
 		var div = document.createElement('div');
 		if(this[0]){
			div.appendChild(this[0]);
 		 	return div.innerText;
		}
		div = null;
		return '';
 	},
	/**
	 * css: 设置style
	 * @param {object,string} a 设定样式的json或者样式名
	 * @param {string} b 设定样式值。如果a为object，则b会被忽略
	 */
	css: function(a,b){
		if(typeof a === 'object'){
			b = null;
			__for__(this,function(el){
				for(var k in a){
					el.style[k] = a[k];
				}
			});
		}else if(typeof a === 'string'){
			if(arguments.length >= 2){
				__for__(this,function(el){
					el.style[a] = b;
				});
			}else{
				b = null;
				return this[0].style[a];
			}
		}
		return this;
	},
	/**
	 * addClass : 添加className
	 * @param {string} className
	 */
	addClass: function(c){
		var arr = null;
		__for__(this,function(el){
			arr = el.className.split(/\s+/);
			if(arr.indexOf(c) == -1){
				arr.push(c);
				el.className = arr.join(' ');
			}
		});
		return this;
	},
	/**
	 * removeClass: 移除class
	 * @param {string} className
	 */
	removeClass: function(c){
		var arr = null,
			index = null;
		__for__(this,function(el){
			arr = el.className.split(/\s+/);
			if((index = arr.indexOf(c)) != -1){
				arr.splice(index,1);
				el.className = arr.join(' ');
			}
		});
		return this;
	},
	/**
	 * hasClass: 判断是否有指定的className
	 * @param {string} c className
	 */
	hasClass: function(c){
		if(this[0].className){
			return this[0].className.split(/\s+/).indexOf(c) != -1;
		}else{
			return false;
		}
	},
	/**
	 * each: 遍历fe实现对象的节点
	 * @param {function} fn 回调函数
	 */
	each: function(fn){
		if(typeof fn === 'function'){
			for(var i=0; i<this.length; i++){
				fn.call(this[i],i,this[i]);
			}
		}
		return this;
	},
	/**
	 * attr: 获取元素属性列表，包括自定义属性，无参时返回对象的属性列表
	 * @param {object,string} a 可选，设定多个属性时用object,单个时string:attribute name
	 * @param {string} b 可选，设定的属性值，如果a为object,则此参数被忽略
	 */
	attr: function(a,b){
		switch(arguments.length){
			case 0:
				return this[0].attributes;
				break;
			case 1:
				if(typeof a === 'string'){
					return this[0].getAttribute(a);
				}else if(typeof a === 'object'){
					__for__(this,function(el){
						for(var i in a){
							el.setAttribute(i,a[i]);
						}
					});
				}
				break;
			case 2:
				__for__(this,function(el){
					el.setAttribute(a,b);
				});
				break;
		}
		return this;
	},
	/**
	 * removeAttr: 移除指定的属性或全部属性
	 * @param {string} a 可选，属性名
	 * @param {string} b 可选，属性值
	 */
	removeAttr: function(a,b){
		var len = arguments.length,
			attrs;
		__for__(this,function(el){
			if(a){
				if(len == 1){
					el.removeAttribute(a);
				}else if(len == 2 && el.getAttribute(a) == b){
					el.removeAttribute(a);
				}
			}else{
				attrs = el.attributes;
				for(var i=0,l=attrs.length; i<l; i++){
					try{
						el.removeAttribute(attrs[0].nodeName);
					}catch(err){}
				}
			}
		});
		return this;
	},
	/**
	 * on: 绑定事件
	 * @param {eventType} type 事件名
	 * @param {function} fn 事件函数
	 */
	on: function(type,fn){
		if(fn){
			__for__(this,function(el){
				el.addEventListener(type,fn,false);
			});
		}
		return this;
	},
	/**
	 * off: 移除事件
	 * @param {eventType} type 事件名
	 * @param {function} fn 事件函数
	 */
	off: function(type,fn){
		if(fn){
			__for__(this,function(el){
				el.removeEventListener(type,fn,false);
			});
		}
		return this;
	},
	/**
	 * append: 添加节点到尾部
	 * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
	 */
	append: function(o){
		var that = this;
		o = (o instanceof Fe) ? o : __nodes__(o);
		__for__(this,function(el,index){
			for(var i=0,len=o.length; i<len; i++){
				if(index < that.length-1){
					el.appendChild(o[i].cloneNode(true));
				}else{
					el.appendChild(o[i]);
				}
			}
		});
		return this;
	},
	/**
	 * prepend: 添加节点到首部
	 * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
	 */
	prepend: function(o){
		var that = this;
		o = (o instanceof Fe) ? o : __nodes__(o);
		__for__(this,function(el,index){
			for(var i=0,len=o.length; i<len; i++){
				if(index < that.length-1){
					el.insertBefore(o[i].cloneNode(true),el.childNodes[0]);
				}else{
					el.insertBefore(o[i],el.childNodes[0]);
				}
			}
		});
		return this;
	},
	/**
	 * remove: 删除节点
	 */
	remove: function(){
		__for__(this,function(el){
			try{
				el.parentNode.removeChild(el);
			}catch(err){}
		});
		return this;
	},
	/**
	 * before: 插入节点到指定节点之前
	 * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
	 */
	before: function(o){
		var that = this;
		o = (o instanceof Fe) ? o : __nodes__(o);
		__for__(this,function(el,index){
			for(var i=0,len=o.length; i<len; i++){
				if(index < that.length-1){
					el.parentNode.insertBefore(o[i].cloneNode(true),el);
				}else{
					el.parentNode.insertBefore(o[i],el);
				}
			}
		});
		return this;
	},
	/**
	 * after: 插入节点到指定节点之后
	 * @param {node,nodeList,fe} o 实例对象fe/node/nodeList
	 */
	after: function(o){
		var that = this;
		o = (o instanceof Fe) ? o : __nodes__(o);
		__for__(this,function(el,index){
			for(var i=0,len=o.length; i<len; i++){
				if(index < that.length-1){
					el.parentNode.insertBefore(o[i].cloneNode(true),el.nextSibling);
				}else{
					el.parentNode.insertBefore(o[i],el.nextSibling);
				}
			}
		});
		return this;
	},
    /**
	 * offset:
     */
    offset: function(p){
		var op = __nodes__(p)[0],
			top = this[0].offsetTop,
			left = this[0].offsetLeft,
			o = this[0].offsetParent;
		if(p){
            while(true){
                if(!o || o === op) break;
                top += o.offsetTop;
                left += o.offsetLeft;
                o = o.offsetParent;
            }
		}
		return {
			top: top,
			left: left
		};
	},
	/**
	 * createEditor: 创建编辑器
	 * @param {object} options Object {} 具体到 Editor 类查看具体配置说明
	 */
	createEditor: function(options){
		return new Editor(fe(this[0]),options);
	}
};

/* ===================
 * fe上的属性和方法
 =====================*/
/**
 * ready: 文档加载和lang 的js脚本加载后才执行。
 * @param {string} lang 言语脚本名(即文件名)。默认为 ‘zh-cn’，即对应的脚本是lang/zh-cn.js
 * @param {function} fn 完成时回调函数
 */
fe.ready = function(lang,fn){
	if(typeof lang === 'function'){
		fn = lang;
		lang = 'zh-cn';
	}
	if(fn){
		var doc = fe(document);
		doc.on('DOMContentLoaded',loaded);
		function loaded(){
			doc.off('DOMContentLoaded',loaded);
			fe.loadScript([fe.getRoot+'lang/'+lang+'.js'],fn);
		}
	}
}
/**
 * getRoot：获取本js脚本文件所在的目录
 */
fe.getRoot = (function(){
	var s = fe('#feditor-js');
	if(!s.length || (s.length && !/script/i.test(s[0].tagName)) ){
		s = fe('script');
	}
	for(var i=0,len=s.length; i<len; i++){
		var src = /\?/.test(s[i].src) ? s[i].src.slice(0,s[i].src.indexOf('?')) : s[i].src,
			end = src.lastIndexOf('/')+1;
		if(/^feditor[\s\S]*?\.js$/.test( src.slice(end) )){
			return src.slice(0,end);
		}
	}
	return '';
})();
/**
 * inArray: 判断val是否在arr数组中,只针对不包含object/function等对象的一维数组
 * @param {anyType} val 要判断的值
 * @param {Array}   arr 查找的范围数组
 * @param {boolean}  arguments[2]   确定返回值，如果传入真，则返回找到的index（找不到则返回-1）， 如果传入假，则返回boolean
 */
fe.inArray = function(val,arr){
	var arg = arguments[2],
		b = !!arg && (arg == 1 || arg == true);
	for(var i=0,len=arr.length; i<len; i++){
		if(arr[i] == val) return  b ? i : true;
	}
	return b ? -1 : false;
};
/**
 * browser: 判断当前浏览器内核类型，直接返回String名称
 */
fe.browser = (function(){
	var n = window.navigator;
	if(/Trident/ig.test(n.userAgent)){
		return 'ie';
	}else if(/FireFox/ig.test(n.userAgent)){
		return 'firefox';
	}else if(/Chrome/ig.test(n.userAgent)){
		return 'chrome';
	}
})();
/**
 * browserv: 获取浏览器版本号，直接返回String版本号字符串，直判断了三个主流浏览器，其他浏览器返回-1
 */
fe.browserv = (function(){
	var n = window.navigator.userAgent;
	if(/Trident/ig.test(n)){
		var arr = n.match(/MSIE[\s]+([\.\d]+)/i),
			arr2 = n.match(/rv\:([\.\d]+)/i);
		return arr ? arr[1] : (arr2 ? arr2[1] : '>10');
	}else if(/FireFox/ig.test(n)){
		return n.match(/FireFox\/([\.\d]+)/i)[1];
	}else if(/Chrome/ig.test(n)){
		return n.match(/Chrome\/([\.\d]+)/i)[1];
	}else{
		return -1;
	}
})();
/**
 * trim: 清除空格
 * @param {string} str 要处理的字符串
 * @param {string} tp  处理程度，默认清除两边空格，"g":去除所有空格， "l"：清除左边空格，"r":清除左边空格
 * @return {string}
 */
fe.trim = function(str,deep){
	if(str){
		switch(deep){
			case 'g': return str.replace(/(\s+)|(\&nbsp\;+)/ig,''); break;
			case 'l':
				function lcheck(str){
					str = str.replace(/^\s+/i,'').replace(/^(\&nbsp\;)+/i,'');
					if(/^(\&nbsp\;)+/i.test(str) || /^\s+/.test(str)){
						return lcheck(str);
					}else{
						return str;
					}
				}
				return lcheck(str);
			break;
			case 'r':
				function rcheck(str){
					str = str.replace(/\s+$/i,'').replace(/(\&nbsp\;)+$/i,'');
					if(/(\&nbsp\;)+$/i.test(str) || /\s+$/.test(str)){
						return rcheck(str);
					}else{
						return str;
					}
				}
				return rcheck(str);
			break;
			default:
				function lrcheck(str){
					str = str.replace(/(^\s+)|(^(\&nbsp\;)+)|((\&nbsp\;)+$)|(\s+$)/ig,'');
					if(/^(\&nbsp\;)+/i.test(str) || /^\s+/.test(str) || /(\&nbsp\;)+$/i.test(str) || /\s+$/.test(str)){
						return lrcheck(str);
					}else{
						return str;
					}
				}
				return lrcheck(str);
		}
	}
};
/**
 * loadScript: 加载一个或多个js/css文件
 * @param {Array} arr 文件的路径数组， 如：["js/a.js","js/b.js","css/c.css"]，js和css可以混合。
 * @param {function} fn 所有脚本文件加载完成时执行的回调函数，注：任何一个加载失败都不会执行到此函数。
 */
fe.loadScript = function(arr,fn){
	var count = 0,
		head = document.getElementsByTagName('head')[0];
	for(var i=0,len=arr.length; i<len; i++){
		var start = arr[i].lastIndexOf('\.'),
			end = arr[i].lastIndexOf('\?'),
			ext = arr[i].slice(start+1, (end!=-1 ? end : arr[i].length)),
			s = null;
		if(ext == 'js'){
			s = document.createElement('script');
			s.src = arr[i];
		}else if(ext == 'css'){
			s = document.createElement('link');
			s.type = 'text/css';
			s.rel = 'stylesheet';
			s.href = arr[i];
		}else{
			return;
		}
		s.charset = 'UTF-8';

		head.appendChild(s);
		(function(s,ext){
			s.onload = s.onreadystatechange = function(){
				if(!s.readyState || s.readyState === 'loaded' || s.readyState === 'complete') {
					count++;
					if (count>=len && fn) {
						fn();
					}
					s.onload = s.onreadystatechange = null;
					if(ext == 'js') head.removeChild(s);
				}
			}
		})(s,ext);
	}
};
/**
 * 遍历数组或json
 * @param {Object,Array} obj 要遍历的数组或json
 * @param {function} fn 回调函数
 */
fe.each = function(obj,fn){
	if( /\[\w+ array\]/i.test(Object.prototype.toString.call(obj)) ){
		for (var i = 0, len = obj.length; i < len; i++) {
			if (fn.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}
	}else{
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (fn.call(obj[key], key, obj[key]) === false) {
					break;
				}
			}
		}
	}
}
/**
 * loadimg: 加载图片，加载完成时执行
 * @param {string} url 图片地址
 * @param {function} fn 回调函数
 */
fe.loadimg = function(src,fn){
	var img = new Image();
	img.onload = function(){
		if(fn) fn(img.width,img.height);
		img.onload = null;
		img = null;
	}
	img.onerror = function(e){
		if(fn) fn.call(this,e);
	}
	img.src = src;
}
/**
 * loading: 加载css3动画
 * @param {node/fe} p 容器
 * @param {string} txt 文字
 */
fe.loading = function(p,txt){
	p = p || fe('body');
	var box = fe('<div class="fe-loading"><div class="fe-loading-icon"></div><div class="fe-loading-text">'+(txt||fe.lang.loading)+'</div></div>');
	return {
		hide: function(){
			box.addClass('hide').removeClass('show');
			box.remove();
		},
		show: function(){
			box.addClass('show').removeClass('hide');
			p.append(box);
		}
	}
}
/**
* date: 日期时间处理，返回自定义日期格式。
* @param {string/number} s 空值/时间字符串/时间戳
*/
fe.date = function(s){
	var isTime = /^\d+$/.test(s),
		d = isTime ? new Date(parseInt(s)) : new Date(),
        str = isTime ? arguments[1] : s,
		o = {
			Y: d.getFullYear(),
			m: d.getMonth()+1,
			d: d.getDate(),
			h: d.getHours(),
			i: d.getMinutes(),
			s: d.getSeconds(),
			ms: d.getMilliseconds()
		};
	if(!s){
		return o.Y+'/'+o.M+'/'+o.D+' '+o.H+':'+o.I+':'+o.S+':'+o.ms;
	}else if(/^([ymdhis]\W*)+$/i.test(str)){
		var isms = /^ms$/i.test(str.slice(-2));
		return (isms ? str.slice(0,-2) : str).replace(/[ymdhis]/ig,function($0){
			if($0=='y'){
				return (o.Y+'').slice(2,4);
			}else if(/[MDHIS]/.test($0)){
                return mat(o[$0.toLowerCase()]);
			}else{
				return o[$0];
			}
		})+(isms ? o.ms : '');
	}else{
		return 'Invalid date';
	}
    function mat(n){
        return n < 10 ? '0' + n : n+'';
    }
}
/* =============================
 * 一些不公开的函数
 * =============================*/
/**
 * __nodes__: Fe参数处理为节点集和创建节点集
 * @param {fe,nodeList,node,selector,htmlstring} s [接收fe对象、节点、节点列表、css选器、html字符串]
 */
function __nodes__(s){
	var el = [];
	//is Fe
	if(s instanceof Fe){
		el = s;
	}
	//is node
	else if(s === document || (s && s.nodeType && s.nodeType === 1) ){
		el[0] = s;
	}
	//is nodeList
	else if(s && s.length && s[0] && s[0].nodeType && s[0].nodeType === 1){
		el = s;
	}else if(typeof s === 'string'){
		//create node
		if( /^<(\w+)[^>]*?>([\s\S]*)<\/\1>$/i.test(s) || /^<(\w+)[^>]*?>$/i.test(s)){
			var div = document.createElement('div');
			div.innerHTML = s;
			el[0] = div.childNodes[0];
			div = null;
		}
		//is selector
		else{
			el = document.querySelectorAll(s);
		}
	}
	return el;
}
/**
 * __for__: 遍历处理。一般处理节点集，让每个节点都做同样的fn
 * @param {fe,nodelist} arr 节点集
 * @param {function} fn 处理的函数
 */
function __for__(arr,fn){
	if(arr.length && fn){
		for(var i=0; i<arr.length; i++){
			fn(arr[i],i);
		}
	}
}
/**
 * __checked__: 处理自定义checkbox radio的选择中与反选事件和样式
 */
function __checked__(){
	var doc = fe(document);
	doc.on('mousedown',function(e){
		var target = e.target || e.srcElement;
		target = fe(target);
		if(target.hasClass('fe-checkbox')){
			if(target.hasClass('checked')){
				target.removeClass('checked');
			}else{
				target.addClass('checked');
			}
		}else if(target.hasClass('fe-radio')){
			var group = target.parents('.fe-radio-group');
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
 * __init__: 用于初始化编辑器的函数
 * @param {String} id 编辑器的id
 * @param {Editor} editor Editor实例对象
 */
function __init__(f,editor){
	//添加UI布局
	__ui__(f,editor);
    //自定义checkbox，radio等委托document的事件
    __checked__();
	//点击工具栏按钮执行事件
	__toolClick__(editor);
	//编辑框内一些初始化，事件等逻辑处理
	__editControl__(editor);
	//处理工具栏位置
    __toolbarFixed__(editor);
}
/**
 * __ui__: 编辑器创建UI
 * @param {node} f 整个编辑器容器节点
 * @param {Editor} editor Editor实例对象
 */
function __ui__(f,editor){
	var html = '',
		tools = editor.options['tools'],
		line = [],
		i = 0,
		len = tools.length;
	for(; i<len; i++){
		if(tools[i] != '|'){
			html += '<button type="button" unselectable="on" class="fe-tool fe-tool-'+tools[i]+'" data-name="'+tools[i]+'" title="'+fe.lang[tools[i]]+'"></button>';
		}else{
			html += '<span class="fe-tool-groupseparate"></span>';
			line.push(i);
		}
	}

	editor.toolbar = fe('<div class="fe-toolbar" unselectable="on" onmousedown="return false">'+html+'</div>');
	editor.edit = fe('<div class="fe-edit" spellcheck="false" contenteditable="true">');

	var fbody = fe('<div class="fe-body">'),
    	fleft = fe('<div class="fe-body-left">'),
		fcenter = fe('<div class="fe-body-center">'),
		fright = fe('<div class="fe-body-right">'),
		btns = editor.toolbar.children(),
		len = btns.length;

	//tools style
	btns.first().addClass('fe-tool-first');
	btns.last().addClass('fe-tool-last');
	for(i=0; i<len; i++){
		for(var j=0,jlen=line.length; j<jlen; j++){
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
 * __toolClick__: 分配工具栏中所有按钮的事件的功能
 * @param {Editor} editor Editor实例对象
 */
function __toolClick__(editor){
	var tools = fe(editor.toolbar).children('button');
	tools.on('click',function(evt){
		editor.edit[0].focus();
		if(document.activeElement === editor.edit[0]){
			var that = this,
				dataname = this.getAttribute('data-name');
			if(fe.inArray(dataname,['bold','italic','underline','strikethrough','subscript','superscript','justifyleft','justifycenter','justifyright','justifyfull'])){
				//无需参数时，直接执行
				document.execCommand(dataname);
			}else{
				//有参时，先判断此plugin的js文件是否已被加载，否则再去加载
				if(editor[dataname]){
					editor[dataname](evt, that);
				}else{
					//加载脚本loading动画
					var loading = fe.loading();
					loading.show();
					fe.loadScript([fe.getRoot+'plugins/'+dataname+'/'+dataname+'.js'],function(){
						loading.hide();
						editor[dataname](evt, that);
					});
				}
			}
		}
	});
}

/**
 * __addStyle__: 添加样式，即在选中的区域添加样式
 * @param {String} name 样式名
 * @param {String} val  样式值
 * @param {Editor} editor Editor实例对象
 */
function __addStyle__(name,val,editor){
	var spans = fe.browser == 'ie' ? editor.edit.find('font') : editor.edit.find('span'),
		reg = /background\-color\:[\s]*?rgba\(255\,[\s]*?255\,[\s]*?255\,[\s]*?0\)\;/ig,
		oStyle = '';
	if(spans.length){
		for(var i=0,len=spans.length; i<len; i++){
			oStyle = spans[i].getAttribute('style');
			if(reg.test(oStyle)){
				spans[i].setAttribute('style',oStyle.replace(reg,''));
				spans[i].style[name] = val;
				//移除子级span中重复的样式。
				var child = spans[i].getElementsByTagName('span');
				if(child.length){
					for(var j=0,jlen=child.length; j<jlen; j++){
						child[j].style[name] = '';
					}
				}
			}
		}
	}
}
/**
 * __editControl__： 编辑框点击到图片时，选中图片，右键（自定义）菜单，编辑文件属性
 * @param {Editor} editor Editor实例对象
 */
function __editControl__(editor){
	var edit = editor.edit,
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
				var srcInput = null,
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
						var newsrc = srcInput[0].value,
							newdesc = descInput[0].value,
							localData = JSON.parse(window.localStorage.getItem(editor.localKey));
						for(var i=0,len=localData.length; i<len; i++){
							if(localData[i]['src'] == oldsrc){
								if(oldsrc != newsrc){
									localData[i]['src'] = newsrc;
									target.src = newsrc;
								}
								if(olddesc != newdesc){
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
		var target = e.target || e.srcElement;
		if(target.tagName && target.tagName == 'IMG'){
			e.preventDefault();
		}
	});
	//编辑框内的输入事件处理
	edit.on('keydown',function(e){
		var imgp,
			cn;
		//edit内为空时，生成p
		if(!fe.trim(edit.html())){
            document.execCommand('formatblock', false, '<p>');
		}
		//回车时, 如果光标所在的位置是包含图片的p标签，则不设定formatblock，按默认方式产生标签。
		if(e.keyCode == 13){
			rg = editor.getRange();
			cn = rg.endContainer;
			if(cn.nodeType === 1 && fe(cn).find('img').length){
				//do something
			}else{
                document.execCommand('formatblock', false, '<p>');
			}
		}
        //上下键移动图片换位
		if(e.keyCode == 38 || e.keyCode == 40){
			imgp = document.querySelector('[data-fe-contextmenu=img]');
			if(imgp){
				imgp = imgp.parentNode;
				if(e.keyCode == 38 && imgp.previousSibling){
					edit[0].insertBefore(imgp,imgp.previousSibling);
				}else if(e.keyCode == 40 && imgp.nextSibling){
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
        var clip = e.clipboardData || window.clipboardData,
			textData = clip.getData('text').split(/\n+/),
            htmlData = fe.browser != 'ie' ? clip.getData('text/html') : null,
			tmpdiv = fe('<div>'),
			tmphtml = '',
			img,
			imgs,
			reg = new RegExp('<img[^>]*?>','ig');
        while((img = reg.exec(htmlData)) != null){
        	tmphtml += img;
		}
		tmpdiv.html(tmphtml);
		imgs = tmpdiv.children();
		var arr = [];
        for(var i=0,len=textData.length; i<len; i++){
        	var val = fe.trim(textData[i]);
        	if(!val || arr.indexOf(textData[i]) != -1) continue;
			arr.push(textData[i]);
		}
        for(var i=0,len=arr.length; i<len; i++){
        	if(fe.browser == 'ie'){
        		var p = document.createElement('p');
        		p.innerHTML = arr[i];
        		rg = editor.getRange();
        		rg.insertNode(p);
        		rg.collapse(false);
			}else {
                if (i == 0) {
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

/**
 * __toolbarFixed__: scroll事件，toolbar滚动到窗口顶部时，悬浮工具栏
 * @param editor
 */
function __toolbarFixed__(editor){
    if(editor.options.toolbarFixed){
		var tb = editor.toolbar,
			w = window.innerWidth,
			top = tb.offset(1).top,
			body = document.body || document.documentElement;

		window.onscroll = function(){
			if(top - body.scrollTop < 0){
				tb.addClass('fe-fixed');
			}else{
				tb.removeClass('fe-fixed').removeAttr('style');
			}
		}
	}
}
/**----------------------------
 * Editor 构造器
 * @param {String} id 编辑器id
 * @param {Object} options 配置项目
 *----------------------------*/
 function Editor(f,options){
	if(!f) return;
	var editor = this;
	//默认参数
	editor.options = {
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
	}
	//本地储存的针对fup组件的key
	editor.localKey = 'fupwwp';
	//合并参数
	if(typeof options === 'object'){
		for(var k in options){
			editor.options[k] = options[k];
		}
		options = null;
	}
	editor.dialogIndex = 100;
	__init__(f,editor);
}

fe.plugin = Editor.prototype = {
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
	dialog: function(options, boxid){
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
	},
	/**
	 * dialogMsg: 消息弹窗，如错误、警告、提示等弹窗。
	 * @param {string,html} title 弹窗标题
	 * @param {string,html} msg 消息内容
	 */
	dialogMsg: function(title,msg){
		this.dialog({
			header: '<div class="fe-dialogMsg-header">'+(title || '')+'</div>',
			body: '<div class="fe-dialogMsg-body">'+(msg || '')+'</div>',
			parent: document.body,
			footer: false
		},(arguments[2] ? 'fe-dialog-msgDialog' : '') );
	},
	/**
	 * getRange: 获取range对象
	 */
	getRange: function(){
		if(document.getSelection){
			return document.getSelection().getRangeAt(0);
		}else if(document.selection){
			return document.selection.createRange();
		}
	},
	/**
	 * setRange: 在编辑框内创建选区
	 * @param {range} rg 对象
	 */
	setRange: function(rg){
		if(!rg) return;
		var newRg = document.getSelection();
		newRg.removeAllRanges();
		newRg.addRange(rg);
	},
	/**
	 * insertFile: 插入文件到编辑器
	 * @param {object} o 包含文件信息的object
	 * {
	 *     src: file url
	 *     description: file description
	 * }
	 */
	insertFile: function(o){
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
	},
    /**
	 * getHtml: 获取最后可用于提交给后台保存的代码
     */
    getHtml: function(){
    	return this.edit.innerHTML;
	}
};
window.fe = fe;
})(window,document,undefined);
