fe.plugin.findreplace = function(){
	var editor = this,
		div = document.createElement('div'),
		rangeTxt = editor.getRange() || '';

	div.setAttribute('style','margin: 15px;');

	div.innerHTML =
		'<p>\
			<b>操作方法：</b>\
			<span style="color:#666;display:block;padding:10px 0;font-size:14px;">输入查找的词，不确定的字用*号代替，多个*则代表多个字</span>\
		</p>\
		<p>查找字符：<input id="fe-find-keywords" class="fe-input" type="text"></p>\
		<p>替换成为：<input id="fe-find-replacedwords" class="fe-input" type="text"></p>\
		<p>\
			不区分大小写：<input id="fe-find-case" type="checkbox" style="margin:0;vertical-align:middle;"/>\
			&nbsp;<i id="fe-find-count"></i></p>\
		<p>\
			<button id="fe-find-replace-one" class="fe-btn fe-btn-default">逐个替换</button>\
			<button id="fe-find-replace-all" class="fe-btn fe-btn-default">全部替换</button>\
		</p>';



	editor.dialog({
		header: '查找替换',
		body: div,
		footer: true,
		css: {'maxWidth':'500px'},
		onhide: function(){
			fe(btnOne).off('click',btnOneFn);
			fe(btnAll).off('click',btnAllFn);
			fe(kw).off('change',kwChangeFn);
			removeTempMark();
		}
	},'fe-dialog-findreplace');

	var kw = fe('#fe-find-keywords')[0],
		btnOne = fe('#fe-find-replace-one')[0],
		btnAll = fe('#fe-find-replace-all')[0],
		rpw = fe('#fe-find-replacedwords')[0],
		fcount = fe('#fe-find-count')[0],
		fcase = fe('#fe-find-case')[0],
		reg = null,
		regStr = '',
		txtNodes = [],
		count = 0;

	kw.value = rangeTxt;

	//kw内容改变时count重置
	fe(kw).on('change',kwChangeFn);
	function kwChangeFn(){
		count = 0;
	}

	//刷新正则，以随便获取最新的匹配规则
	function refrashkw(flag){
		regStr = kw.value.replace(/\*/g,'.');
		reg = new RegExp(regStr, (fcase.checked ? 'i' : '')+(flag ? 'g':''));
	}
	refrashkw();

	//递归获取所有包含查找的内容的文本节点
	function getNodes(nodes){
		for(var i=0,len=nodes.length; i<len; i++){
			if(nodes[i].nodeType === 3 && reg.test(nodes[i].data)){
				txtNodes.push(nodes[i]);
			}else{
				getNodes(nodes[i].childNodes);
			}
		}
	}
	getNodes(editor.edit[0].childNodes);

	//逐个替换。
	fe(btnOne).on('click',btnOneFn);
	function btnOneFn(){
		var flag = false;
		refrashkw();
		for(var i=0,len=txtNodes.length; i<len; i++){
			if(flag) break;
			if(txtNodes[i].data.search(reg) != -1){
				removeTempMark();
				/* 思路：用search从数组txtNodes中查找最先匹配的位置,并从这个位置分割为两个文本节点，
				 * 两个文本节点之间插入替换的新内容并用span包裹，给span加上一些style以模拟选中样式。
				 * 同时也加上一个data-fe-mark=findreplace的属性，以方便关闭窗口时移除。
				 * 把后面的文本节点after替换掉原来的txtNodes[i]，这样可以保证下一次执行的时候，
				 * 不会被重复查找。
				 */
				var txt = txtNodes[i].data,
					before = txt.slice(0,txt.search(reg)),
					after = txt.slice(txt.search(reg)+kw.value.length),
					newNode = document.createElement('span');
				newNode.innerText = rpw.value;
				newNode.setAttribute('data-fe-mark','findreplace');
				newNode.style.background = '#58e';
				newNode.style.color = '#fff';
				txtNodes[i].data = after;
				txtNodes[i].parentNode.insertBefore(newNode,txtNodes[i]);
				txtNodes[i].parentNode.insertBefore(document.createTextNode(before),newNode);
				count++;
				fcount.innerHTML = '被替换了 <b style="color:#a00;">'+count+'</b> 处';
				flag = true;
			}else if(i>=txtNodes.length-1){
				editor.dialog({
					header: '<b>消息：</b>',
					body: '已全部被查找！',
					ok: false,
					cancel:false
				},1);
			}
		}
	}
	function removeTempMark(){
		var tmpmark = document.querySelector('[data-fe-mark=findreplace]');
		if(tmpmark){
			tmpmark.parentNode.replaceChild(document.createTextNode(tmpmark.innerText),tmpmark);
		}
	}
	// 全部替换，不用添加选中样式。
	fe(btnAll).on('click',btnAllFn);
	function btnAllFn(){
		refrashkw(true);
		for(var i=0,len=txtNodes.length; i<len; i++){
			txtNodes[i].data = txtNodes[i].data.replace(reg,function(){
				count++;
				return rpw.value;
			});
		}
		fcount.innerHTML = '被替换了 <b style="color:#a00;">'+count+'</b> 处';
	}
}
