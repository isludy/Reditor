(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)})([function(a,b,c){'use strict';var d=c(1);window.fe=d},function(a,b,c){'use strict';function d(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function e(a){return new l(a)}function f(a){var b=[];if(a instanceof l)b=a;else if(a===document||a&&a.nodeType&&1===a.nodeType)b[0]=a;else if(a&&a.length&&a[0]&&a[0].nodeType&&1===a[0].nodeType)b=a;else if('string'==typeof a)if(/^<(\w+)[^>]*?>([\s\S]*)<\/\1>$/i.test(a)||/^<(\w+)[^>]*?>$/i.test(a)){var c=document.createElement('div');c.innerHTML=a,b[0]=c.childNodes[0],c=null}else b=document.querySelectorAll(a);return b}function g(a,b){if(a.length&&b)for(var c=0;c<a.length;c++)b(a[c],c)}var h='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},i=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),j=c(2),k=c(3),l=function(){function a(b){if(d(this,a),b=f(b),this.length=b.length)for(var c=0;c<this.length;c++)this[c]=b[c];b=null}return i(a,[{key:'find',value:function(a){var b=[];return'string'==typeof a&&g(this,function(c){for(var d=c.querySelectorAll(a),e=0,f=d.length;e<f;e++)-1==b.indexOf(d[e])&&b.push(d[e])}),e(b)}},{key:'children',value:function(a){var b=[];return g(this,function(c){for(var d=c.childNodes,e=0,f=d.length;e<f;e++)if(1===d[e].nodeType&&-1==b.indexOf(d[e]))if(!a)b.push(d[e]);else if('string'==typeof a)for(var g=c.querySelectorAll(a),h=0,i=g.length;h<i;h++)d[e]===g[h]&&b.push(g[h])}),e(b)}},{key:'siblings',value:function(a){var b=this,c=[];return g(this.parent().children(a),function(a){for(var d=0;d<b.length&&a!==b[d];d++)c.push(a)}),e(c)}},{key:'parent',value:function(a){var b=[];return g(this,function(c){var d=c.parentNode;if(-1==b.indexOf(d))if(!a)b.push(d);else for(var e=(d.parentNode||document).querySelectorAll(a),f=0,g=e.length;f<g;f++)e[f]===d&&b.push(d)}),e(b)}},{key:'parents',value:function(a){function b(e){var g=e.parentNode;if(-1==c.indexOf(g)){if(!a)c.push(g);else for(var h=(g.parentNode||document).querySelectorAll(a),j=0,i=h.length;j<i;j++)h[j]===g&&c.push(g);g.parentNode&&g.parentNode!==f&&(!d||c.length<d)&&b(g)}}var c=[],d='number'==typeof arguments[1]?arguments[1]:0,f=arguments[2]||document.documentElement;return g(this,b),e(c)}},{key:'eq',value:function(a){return e(this[a])}},{key:'first',value:function(){return e(this[0])}},{key:'last',value:function(){return e(this[this.length-1])}},{key:'index',value:function(){for(var a=this[0].parentNode.childNodes,b=0,c=0,d=a.length;c<d;c++)if(1===a[c].nodeType){if(a[c]===this[0])return b;b++}}},{key:'html',value:function(a){return a||''==a?(g(this,function(b){b.innerHTML=a}),this):this[0].innerHTML}},{key:'text',value:function(a){return a||''==a?(g(this,function(b){b.innerText=a}),this):this[0].innerText}},{key:'getTextNodes',value:function(a){function b(d){g(d,function(d){3===d.nodeType&&d.data.replace(/\s+/g,'')?a?c.push(d.data):c.push(d):b(d.childNodes)})}var c=[];return b(this),c}},{key:'toHtml',value:function(){var a=document.createElement('div');return this[0]?(a.appendChild(this[0]),a.innerHTML):(a=null,'')}},{key:'toText',value:function(){var a=document.createElement('div');return this[0]?(a.appendChild(this[0]),a.innerText):(a=null,'')}},{key:'css',value:function(c,d){if('object'===('undefined'==typeof c?'undefined':h(c)))d=null,g(this,function(a){for(var b in c)a.style[b]=c[b]});else if('string'==typeof c)if(2<=arguments.length)g(this,function(a){a.style[c]=d});else return d=null,this[0].style[c];return this}},{key:'addClass',value:function(a){var b=null;return g(this,function(c){b=c.className.split(/\s+/),-1==b.indexOf(a)&&(b.push(a),c.className=b.join(' '))}),this}},{key:'removeClass',value:function(a){var b=null,c=null;return g(this,function(d){b=d.className.split(/\s+/),-1!=(c=b.indexOf(a))&&(b.splice(c,1),d.className=b.join(' '))}),this}},{key:'hasClass',value:function(a){return!!this[0].className&&-1!=this[0].className.split(/\s+/).indexOf(a)}},{key:'each',value:function(a){if('function'==typeof a)for(var b=0;b<this.length;b++)a.call(this[b],b,this[b]);return this}},{key:'attr',value:function(c,d){switch(arguments.length){case 0:return this[0].attributes;break;case 1:if('string'==typeof c)return this[0].getAttribute(c);'object'===('undefined'==typeof c?'undefined':h(c))&&g(this,function(a){for(var b in c)a.setAttribute(b,c[b])});break;case 2:g(this,function(a){a.setAttribute(c,d)});}return this}},{key:'removeAttr',value:function(c,a){var b,d=arguments.length;return g(this,function(e){if(c)1==d?e.removeAttribute(c):2==d&&e.getAttribute(c)==a&&e.removeAttribute(c);else{b=e.attributes;for(var f=0,g=b.length;f<g;f++)try{e.removeAttribute(b[0].nodeName)}catch(a){}}}),this}},{key:'on',value:function(a,b){return b&&g(this,function(c){c.addEventListener(a,b,!1)}),this}},{key:'off',value:function(a,b){return b&&g(this,function(c){c.removeEventListener(a,b,!1)}),this}},{key:'append',value:function(b){var c=this;return b=b instanceof a?b:f(b),g(this,function(a,d){for(var e=0,f=b.length;e<f;e++)d<c.length-1?a.appendChild(b[e].cloneNode(!0)):a.appendChild(b[e])}),this}},{key:'prepend',value:function(b){var c=this;return b=b instanceof a?b:f(b),g(this,function(a,d){for(var e=0,f=b.length;e<f;e++)d<c.length-1?a.insertBefore(b[e].cloneNode(!0),a.childNodes[0]):a.insertBefore(b[e],a.childNodes[0])}),this}},{key:'remove',value:function(){return g(this,function(a){try{a.parentNode.removeChild(a)}catch(a){}}),this}},{key:'before',value:function(b){var c=this;return b=b instanceof a?b:f(b),g(this,function(a,d){for(var e=0,f=b.length;e<f;e++)d<c.length-1?a.parentNode.insertBefore(b[e].cloneNode(!0),a):a.parentNode.insertBefore(b[e],a)}),this}},{key:'after',value:function(b){var c=this;return b=b instanceof a?b:f(b),g(this,function(a,d){for(var e=0,f=b.length;e<f;e++)d<c.length-1?a.parentNode.insertBefore(b[e].cloneNode(!0),a.nextSibling):a.parentNode.insertBefore(b[e],a.nextSibling)}),this}},{key:'offset',value:function(a){var b=f(a)[0],c=this[0].offsetTop,d=this[0].offsetLeft,e=this[0].offsetParent;if(a)for(;e&&e!==b;)c+=e.offsetTop,d+=e.offsetLeft,e=e.offsetParent;return{top:c,left:d}}},{key:'createEditor',value:function(a){if(!e.lang)throw'Lang wasn\'t loaded. You need to invoke method "fe.ready"';e.plugin=j.prototype;var b=new j(a);return k(this,b),b}}]),a}();e.getRoot=function(){var a=e('#feditor-js');a.length&&(!a.length||/script/i.test(a[0].tagName))||(a=e('script'));for(var b=0,c=a.length;b<c;b++){var d=/\?/.test(a[b].src)?a[b].src.slice(0,a[b].src.indexOf('?')):a[b].src,f=d.lastIndexOf('/')+1;if(/^feditor[\s\S]*?\.js$/.test(d.slice(f)))return d.slice(0,f)}return''}(),e.inArray=function(a,c){for(var d=arguments[2],e=!!d&&(1==d||!0==d),f=0,g=c.length;f<g;f++)if(c[f]==a)return!e||f;return!!e&&-1},e.browser=function(){var a=window.navigator;if(/Trident/ig.test(a.userAgent))return'ie';return /FireFox/ig.test(a.userAgent)?'firefox':/Chrome/ig.test(a.userAgent)?'chrome':void 0}(),e.browserv=function(){var a=window.navigator.userAgent;if(/Trident/ig.test(a)){var b=a.match(/MSIE[\s]+([\.\d]+)/i),c=a.match(/rv\:([\.\d]+)/i);return b?b[1]:c?c[1]:'>10'}return /FireFox/ig.test(a)?a.match(/FireFox\/([\.\d]+)/i)[1]:/Chrome/ig.test(a)?a.match(/Chrome\/([\.\d]+)/i)[1]:-1}(),e.trim=function(a,b){if(a)switch(b){case'g':return a.replace(/(\s+)|(\&nbsp\;+)/ig,'');break;case'l':var c=function a(b){return b=b.replace(/^\s+/i,'').replace(/^(\&nbsp\;)+/i,''),/^(\&nbsp\;)+/i.test(b)||/^\s+/.test(b)?a(b):b};return c(a);break;case'r':var d=function a(b){return b=b.replace(/\s+$/i,'').replace(/(\&nbsp\;)+$/i,''),/(\&nbsp\;)+$/i.test(b)||/\s+$/.test(b)?a(b):b};return d(a);break;default:var e=function a(b){return b=b.replace(/(^\s+)|(^(\&nbsp\;)+)|((\&nbsp\;)+$)|(\s+$)/ig,''),/^(\&nbsp\;)+/i.test(b)||/^\s+/.test(b)||/(\&nbsp\;)+$/i.test(b)||/\s+$/.test(b)?a(b):b};return e(a);}},e.loadScript=function(a,b){for(var c=0,d=document.getElementsByTagName('head')[0],e=0,f=a.length;e<f;e++){var g=a[e].lastIndexOf('.'),h=a[e].lastIndexOf('?'),i=a[e].slice(g+1,-1==h?a[e].length:h),j=null;if('js'==i)j=document.createElement('script'),j.src=a[e];else if('css'==i)j=document.createElement('link'),j.type='text/css',j.rel='stylesheet',j.href=a[e];else return;j.charset='UTF-8',d.appendChild(j),function(a,e){a.onload=a.onreadystatechange=function(){a.readyState&&'loaded'!==a.readyState&&'complete'!==a.readyState||(c++,c>=f&&b&&b(),a.onload=a.onreadystatechange=null,'js'==e&&d.removeChild(a))}}(j,i)}},e.each=function(a,b){if(/\[\w+ array\]/i.test(Object.prototype.toString.call(a)))for(var c=0,d=a.length;c<d&&!1!==b.call(a[c],c,a[c]);c++);else for(var e in a)if(a.hasOwnProperty(e)&&!1===b.call(a[e],e,a[e]))break},e.loadimg=function(a,b){var c=new Image;c.onload=function(){b&&b(c.width,c.height),c.onload=null,c=null},c.onerror=function(a){b&&b.call(this,a)},c.src=a},e.loading=function(a,b){a=a||e('body');var c=e('<div class="fe-loading"><div class="fe-loading-icon"></div><div class="fe-loading-text">'+(b||e.lang.loading)+'</div></div>');return{hide:function(){c.addClass('hide').removeClass('show'),c.remove()},show:function(){c.addClass('show').removeClass('hide'),a.append(c)}}},e.date=function(a){function b(a){return 10>a?'0'+a:a+''}var c=/^\d+$/.test(a),e=c?new Date(parseInt(a)):new Date,d=c?arguments[1]:a,f={Y:e.getFullYear(),m:e.getMonth()+1,d:e.getDate(),h:e.getHours(),i:e.getMinutes(),s:e.getSeconds(),ms:e.getMilliseconds()};if(!a)return f.Y+'/'+f.M+'/'+f.D+' '+f.H+':'+f.I+':'+f.S+':'+f.ms;if(/^([ymdhis]\W*)+$/i.test(d)){var g=/^ms$/i.test(d.slice(-2));return(g?d.slice(0,-2):d).replace(/[ymdhis]/ig,function(a){return'y'==a?(f.Y+'').slice(2,4):/[MDHIS]/.test(a)?b(f[a.toLowerCase()]):f[a]})+(g?f.ms:'')}return'Invalid date'},e.ready=function(a,b){if('function'==typeof a&&(b=a,a='zh-cn'),b){var c=function c(){d.off('DOMContentLoaded',c),e.loadScript([e.getRoot+'lang/'+a+'.js'],b)},d=e(document);d.on('DOMContentLoaded',c)}},a.exports=e},function(a){'use strict';function b(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var c='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},d=function(){function a(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,'value'in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),e=function(){function a(d){if(b(this,a),this.options={tools:['bold','italic','underline','strikethrough','subscript','superscript','|','fontname','fontsize','forecolor','backcolor','border','|','justifyleft','justifycenter','justifyright','justifyfull','linespacing','|','link','unlink','|','fileupload','findreplace','zhconvert','preview'],colors:['#ffffff','#eeeeee','#aaaaaa','#000000','#445566','#4477cc','#5599dd','#aa0000','#cc0000','#ee7733','#ffcc00','#77aa44'],fontname:['Helvetica','MicrosoftYaHei','Arial','SimHei','SimSum','FangSong','KaiTi','STKaiti','STSong','STFangSong'],fontsize:['12','13','14','16','18','20','22','24','28','32','36','42','48','56','72'],border:['1px solid #333','1px solid #a00','2px solid #acc'],linespacing:['1','1.5','1.6','1.8','2','2.5','3'],uploadPath:'',uploadType:['gif','jpg','jpeg','png','svg','webp','mp4','webm','ogg','mp3','pdf','txt','doc','docx','xls','xlsx','ppt','pptx'],uploadSize:{image:2,video:0,audio:0,others:0},toolbarFixed:!0,layout:1},'object'===('undefined'==typeof d?'undefined':c(d))){for(var e in d)this.options[e]=d[e];d=null}this.localKey='fupwwp',this.dialogIndex=100}return d(a,[{key:'dialog',value:function(a,b){function d(a,b){b&&('string'==typeof a?b.html(a):(b.html(''),a instanceof Fe?b.append(a):b[0].appendChild(a)))}function e(a){j.setRange(m);var b=l.onclose.call(s,a);(void 0===b||!0===b)&&h()}function f(a){j.setRange(m);var b=l.onok.call(t,a,m);(void 0===b||!0===b)&&h()}function g(a){j.setRange(m);var b=l.oncancel.call(u,a);(void 0===b||!0===b)&&h()}function h(){j.setRange(m);var a=l.onhide();if(void 0===a||!0===a){o.remove(),l.mask&&l.mask.remove(),s.off('click',e),t&&t.off('click',f),u&&u.off('click',g);try{p.off('mousedown',downFn)}catch(a){}}}function i(a,b){j.setRange(m),document.execCommand('backcolor',!1,'rgba(255,255,255,0)'),__addStyle__(a,b,j)}if(!document.getElementById(b)){var j=this,l={header:'',body:'',footer:!0,close:'&times',ok:fe.lang.ok,cancel:fe.lang.cancel,parent:j.feditor,mask:document.createElement('div'),onclose:function(){},onok:function(){},oncancel:function(){},onhide:function(){},css:{},draggable:!0},m=j.getRange();if(a&&'object'===('undefined'==typeof a?'undefined':c(a)))for(var n in a)l[n]=a[n];a=null;var k='boolean'!=typeof l.footer||l.footer,o=fe('<div'+(b?' id="'+b+'"':'')+' class="fe-dialog">'),p=fe('<div class="fe-dialog-header">'),q=fe('<div class="fe-dialog-body">'),r=k?fe('<div class="fe-dialog-footer">'):null,s=fe('<span class="fe-close">'),t=k&&l.ok?fe('<span class="fe-btn fe-btn-default">'):null,u=k&&l.cancel?fe('<span class="fe-btn fe-btn-default">'):null,v=fe(document);p.html(l.header),d(l.header,p),d(l.body,q),d(l.close,s),o.append(s).append(p).append(q),k&&(d(l.footer.footer),t&&(d(l.ok,t),r.append(t)),u&&(d(l.cancel,u),r.append(u)),o.append(r)),fe(l.parent).append(o),l.mask&&(l.mask=fe(l.mask),l.mask.addClass('fe-dialog-mask'),fe('body').append(l.mask),l.mask.css('zIndex',j.dialogIndex),j.dialogIndex++),o.css(l.css),l.css.zIndex&&l.css['z-index']||o.css('zIndex',j.dialogIndex),j.dialogIndex++;var w=l.css.top?parseFloat(l.css.top):(window.innerHeight-o[0].offsetHeight)/2,x=l.css.left?parseFloat(l.css.left):(window.innerWidth-o[0].offsetWidth)/2;if(o.css('left',x+'px'),o.css('top',w+'px'),o.addClass('fadeIn'),l.draggable){var y=function(a){a.preventDefault(),B=a.clientX,C=a.clientY,v.on('mousemove',z),v.on('mouseup',A)},z=function(a){a.preventDefault(),o[0].style.left=a.clientX-B+x+'px',o[0].style.top=a.clientY-C+w+'px'},A=function a(b){b.preventDefault(),v.off('mousemove',z),v.off('mouseup',a),x+=b.clientX-B,w+=b.clientY-C};p.on('mousedown',y).css('cursor','move');var B=0,C=0}return s.on('click',e),t&&t.on('click',f),u&&u.on('click',g),{box:o,hide:h,exec:i}}}},{key:'dialogMsg',value:function(a,b){this.dialog({header:'<div class="fe-dialogMsg-header">'+(a||'')+'</div>',body:'<div class="fe-dialogMsg-body">'+(b||'')+'</div>',parent:document.body,footer:!1},arguments[2]?'fe-dialog-msgDialog':'')}},{key:'getRange',value:function(){return document.getSelection?document.getSelection().getRangeAt(0):document.selection?document.selection.createRange():void 0}},{key:'setRange',value:function(a){if(a){var b=document.getSelection();b.removeAllRanges(),b.addRange(a)}}},{key:'insertFile',value:function(a){function b(a){if(c=f.getRange(),e=fe(a),d=c.endContainer,d===g)c.insertNode(e[0]);else if(d.parentNode==g)c.selectNode(d),c.insertNode(e[0]),g.removeChild(d),c.selectNode(e[0]);else if(3===d.nodeType)if(d.parentNode===g)c.insertNode(e[0]);else{for(var b=d.parentNode;b.parentNode!==g;)b=b.parentNode;b.nextSibling?g.insertBefore(e[0],b.nextSibling):g.appendChild(e[0]),c.selectNode(e[0])}c.collapse(!1)}var c,d,e,f=this,g=this.edit[0];if(/^[\s\S]+\.(gif|png|jpg|jpeg|svg|webp)(\?[\s\S]*)*$/i.test(a.src))b('<p><img src="'+a.src+'" data-fe="img:'+a.src+'" alt="'+a.description+'" title="'+a.description+'"></p>');else if(/^[\s\S]+\.(mp4|webm|ogg)(\?[\s\S]*)*$/.test(a.src))b('<p><img src="'+fe.getRoot+'themes/video.jpg" data-fe="video:'+a.src+'" alt="'+a.description+'" title="'+a.description+'"></p>');else if(/^[\s\S]+\.mp3(\?[\s\S]*)*$/.test(a.src))b('<p><img src="'+fe.getRoot+'themes/audio.jpg" data-fe="audio:'+a.src+'" alt="'+a.description+'" title="'+a.description+'"></p>');else{c=arguments[1]||this.getRange(),document.execCommand('createlink',!1,a.src+'____fe.blank');for(var h=this.edit.getElementsByTagName('a'),j=0,i=h.length;j<i;j++)/____fe\.blank/i.test(h[j].href)&&(h[j].href=h[j].href.replace(/____fe\.blank/ig,''),h[j].target='_blank',h[j].innerHTML=fe.lang.filelink)}}},{key:'getHtml',value:function(){return this.edit.innerHTML}}]),a}();a.exports=e},function(a){'use strict';function b(a,b){for(var c='',d=b.options.tools,e=[],f=0,g=d.length;f<g;f++)'|'==d[f]?(c+='<span class="fe-tool-groupseparate"></span>',e.push(f)):c+='<button type="button" unselectable="on" class="fe-tool fe-tool-'+d[f]+'" data-name="'+d[f]+'" title="'+fe.lang[d[f]]+'"></button>';b.toolbar=fe('<div class="fe-toolbar" unselectable="on" onmousedown="return false">'+c+'</div>'),b.edit=fe('<div class="fe-edit" spellcheck="false" contenteditable="true">');var h=fe('<div class="fe-body">'),i=fe('<div class="fe-body-left">'),k=fe('<div class="fe-body-center">'),l=fe('<div class="fe-body-right">'),m=b.toolbar.children(),g=m.length;for(m.first().addClass('fe-tool-first'),m.last().addClass('fe-tool-last'),f=0;f<g;f++)for(var n=0,j=e.length;n<j;n++)m.eq(e[n]-1).addClass('fe-tool-last'),m.eq(e[n]+1).addClass('fe-tool-first');k.append(b.edit),h.append(i).append(k).append(l),a.append(b.toolbar).append(h),a.addClass('fe-editor'),b.feditor=a}function c(){var a=fe(document);a.on('mousedown',function(a){var b=a.target||a.srcElement;if(b=fe(b),b.hasClass('fe-checkbox'))b.hasClass('checked')?b.removeClass('checked'):b.addClass('checked');else if(b.hasClass('fe-radio')){var c=b.parents('.fe-radio-group');c.length&&c.find('.fe-radio').removeClass('checked'),b.hasClass('checked')?b.removeClass('checked'):b.addClass('checked')}})}function d(a){var b=fe(a.toolbar).children('button');b.on('click',function(b){if(a.edit[0].focus(),document.activeElement===a.edit[0]){var c=this,d=this.getAttribute('data-name');if(fe.inArray(d,['bold','italic','underline','strikethrough','subscript','superscript','justifyleft','justifycenter','justifyright','justifyfull']))document.execCommand(d);else if(a[d])a[d](b,c);else{var e=fe.loading();e.show(),fe.loadScript([fe.getRoot+'plugins/'+d+'/'+d+'.js'],function(){e.hide(),a[d](b,c)})}}})}function e(a){var b,c=a.edit,d=null,f=null;c.on('click',function(b){if(d=fe(b.target||b.srcElement),c.find('[data-fe-contextmenu]').removeAttr('data-fe-contextmenu'),c.find('.fe-move-img-bg').removeAttr('class'),d[0].tagName)switch(d[0].tagName){case'IMG':d.attr('data-fe-contextmenu','img'),d.parent().addClass('fe-move-img-bg'),f=a.getRange(),f.selectNode(d[0]);break;case'A':d.attr('data-fe-contextmenu','link'),f=a.getRange(),f.selectNode(d[0]);}}),c.on('contextmenu',function(b){switch(d=b.target||b.srcElement,f=a.getRange(),fe(d).attr('data-fe-contextmenu')){case'img':b.preventDefault();var c=null,e=null,g=d.src,h=d.alt||d.title;a.dialog({header:fe.lang.editattr,body:'<div class="fe-attr-edit">                        <div class="fe-attr-edit-row">                            <div class="fe-attr-edit-name">'+fe.lang.filepath+' : </div>\t\t\t\t\t\t\t\t<input data-fe-editattr="src" class="fe-input fe-attr-edit-input" type="text" value="http://">\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="fe-attr-edit-row">\t\t\t\t\t\t\t\t<div class="fe-attr-edit-name">'+fe.lang.filedescription+' : </div>\t\t\t\t\t\t\t\t<input data-fe-editattr="description" class="fe-input fe-attr-edit-input" type="text" value="">\t\t\t\t\t\t\t</div>\t\t\t\t\t\t</div>',css:{maxWidth:'640px',height:'210px'},onok:function(){for(var b=c[0].value,f=e[0].value,j=JSON.parse(window.localStorage.getItem(a.localKey)),k=0,i=j.length;k<i;k++)j[k].src==g&&(g!=b&&(j[k].src=b,d.src=b),h!=f&&(j[k].description=f,d.alt=d.title=f));window.localStorage.setItem(a.localKey,JSON.stringify(j))}}),c=fe('[data-fe-editattr=src]'),e=fe('[data-fe-editattr=description]'),c[0].value=g,e[0].value=h;break;case'link':b.preventDefault(),a.link?a.link(b,d):fe.loadScript([fe.getRoot+'plugins/link/link.js'],function(){a.link(b,d)});}}),c.on('mousedown',function(a){var b=a.target||a.srcElement;b.tagName&&'IMG'==b.tagName&&a.preventDefault()}),c.on('keydown',function(d){var e,g;fe.trim(c.html())||document.execCommand('formatblock',!1,'<p>'),13==d.keyCode&&(f=a.getRange(),g=f.endContainer,1===g.nodeType&&fe(g).find('img').length||document.execCommand('formatblock',!1,'<p>')),(38==d.keyCode||40==d.keyCode)&&(e=document.querySelector('[data-fe-contextmenu=img]'),e&&(e=e.parentNode,38==d.keyCode&&e.previousSibling?c[0].insertBefore(e,e.previousSibling):40==d.keyCode&&e.nextSibling&&c[0].insertBefore(e,e.nextSibling.nextSibling),b&&clearTimeout(b),b=setTimeout(function(){clearTimeout(b),c[0].scrollTop=e.offsetTop-(c[0].offsetHeight-e.offsetHeight)/2},20)))}),c.on('paste',function(b){b.preventDefault();for(var c,d,e=b.clipboardData||window.clipboardData,g=e.getData('text').split(/\n+/),h='ie'==fe.browser?null:e.getData('text/html'),j=fe('<div>'),k='',l=/<img[^>]*?>/ig;null!=(c=l.exec(h));)k+=c;j.html(k),d=j.children();for(var m,n=[],o=0,i=g.length;o<i;o++)m=fe.trim(g[o]),!m||-1!=n.indexOf(g[o])||n.push(g[o]);for(var o=0,i=n.length;o<i;o++)if('ie'==fe.browser){var q=document.createElement('p');q.innerHTML=n[o],f=a.getRange(),f.insertNode(q),f.collapse(!1)}else 0==o?(document.execCommand('inserthtml',!1,'<p>'+n[o]+'</p>'),console.log(a.getRange())):(document.execCommand('inserthtml',!1,n[o]),console.log(a.getRange())),o<i-1&&document.execCommand('insertparagraph',!1,!1)})}function g(a){if(a.options.toolbarFixed){var b=a.toolbar,c=window.innerWidth,d=b.offset(1).top,e=document.body||document.documentElement;window.onscroll=function(){0>d-e.scrollTop?b.addClass('fe-fixed'):b.removeClass('fe-fixed').removeAttr('style')}}}a.exports=function(a,h){if(!a||!a.length)throw': Element for creating editor is null.\n You may need to invoke method of "fe.ready"';b(a,h),c(),d(h),e(h),g(h)}}]);