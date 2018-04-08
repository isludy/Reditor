const options = {
    editor: 'reditor',
    toolbar: 'reditor-toolbar',
    colors: ['#ffffff','#eeeeee','#aaaaaa','#000000','#445566','#4477cc','#5599dd','#aa0000','#cc0000','#ee7733','#ffcc00','#77aa44'],
    tools: [
        {
            name: 'bold',
            title: '加粗'
        },{
            name: 'italic',
            title: '倾斜'
        },{
            name: 'underline',
            title: '下划线'
        },{
            name: 'strikethrough',
            title: '删除线'
        },{
            name: 'subscript',
            title: '下标'
        },{
            name: 'superscript',
            title: '上标'
        },{
            name: 'fontname',
            title: '字体',
            params: ['Helvetica','MicrosoftYaHei','Arial','SimHei','SimSum','FangSong','KaiTi','STKaiti','STSong','STFangSong']
        },{
            name: 'fontsize',
            title: '字号',
            params: ['12','13','14','16','18','20','22','24','28','32','36','42','48','56','72']
        },{
            name: 'forecolor',
            title: '前景色',
            params: options.colors
        },{
            name: 'backcolor',
            title: '背景色',
            params: options.colors
        },{
            name: 'border',
            title: '边框',
            params: ['1px solid #333','1px solid #a00','2px solid #acc']
        },{
            name: 'justifyleft',
            title: '左对齐'
        },{
            name: 'justifycenter',
            title: '居中对齐'
        },{
            name: 'justifyright',
            title: '右对齐'
        },{
            name: 'justifyfull',
            title: '两端对齐'
        },{
            name: 'linespacing',
            title: '行高',
            params: ['1','1.5','1.6','1.8','2','2.5','3']
        },{
            name: 'link',
            title: '添加超链接',
            params: ''
        },{
            name: 'unlink',
            title: '删除超链接',
            params: ''
        },{
            name: 'file',
            title: '文件上传与管理',
            params: ''
        }
    ]
};

export default options;