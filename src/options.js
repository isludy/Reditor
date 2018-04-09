const colors = ['#ffffff','#eeeeee','#aaaaaa','#000000','#445566','#4477cc','#5599dd','#aa0000','#cc0000','#ee7733','#ffcc00','#77aa44'];
export default {
    tools: {
        'bold': '加粗',
        'italic': '斜体',
        'underline': '下划线',
        'strikethrough': '删除线',
        'subscript': '下标',
        'superscript': '上标',
        'fontname': {
            title: '字体',
            params: ['Helvetica','MicrosoftYaHei','Arial','SimHei','SimSum','FangSong','KaiTi','STKaiti','STSong','STFangSong']
        },
        'fontsize': {
            title: '字号',
            params: ['12','13','14','16','18','20','22','24','28','32','36','42','48','56','72']
        },
        'linespacing': {
            title: '行高',
            params: ['1','1.5','1.6','1.8','2','2.5','3']
        },
        'forecolor': {
            title: '前景色',
            params: colors
        },
        'backcolor': {
            title: '背景色',
            params: colors
        },
        'border': {
            title: '边框',
            params: ['1px solid #333','1px solid #a00','2px solid #acc']
        },
        'justifyleft': '左对齐',
        'justifycenter': '居中对齐',
        'justifyright': '右对齐',
        'justifyfull': '两端对齐',
        'link': {
            title: '添加超链接',
            params: ''
        },
        'unlink': {
            title: '删除超链接',
            params: ''
        },
        'file': {
            title: '文件上传与管理',
            params: ''
        }
    }
};