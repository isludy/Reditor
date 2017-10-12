window.fe = require('./js/Fe.static');
/**
 * 将组件压缩打包
 */
let plugins = ['backcolor','border','fileupload',
    'findreplace','fontname','fontsize','forecolor',
    'linespacing','link','preview','unlink','zhconvert'];
for(let i=0, len=plugins.length; i<len; i++){
    require('../public/plugins/'+plugins[i]+'/'+plugins[i]);
}
