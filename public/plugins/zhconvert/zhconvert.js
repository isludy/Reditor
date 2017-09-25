fe.plugin.zhconvert = function() {
	var editor = this,
		edit = editor.edit;
	function conv2HK(txt){
		var reg;
		for(var k in zh2Hant){
			reg = new RegExp(k,"ig");
			txt = txt.replace(reg,zh2Hant[k]);
		}
		for(var k in zh2HK){
			reg = new RegExp(k,"ig");
			txt = txt.replace(reg,zh2HK[k]);
		}
		reg = null;
		return txt;
	}
	fe.loadScript([fe.getRoot+'plugins/zhconvert/zh_conv.js'],function(){
		edit.html(conv2HK(edit.html()));
	});
};
