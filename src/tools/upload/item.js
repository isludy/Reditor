//生成item的html，upload和manage面板都通用
export default (o)=>{
    return `
    <div class="re-upload-item">
        <i class="re-close icon icon-close1"></i>
        <div class="re-upload-item-inner" data-reid="${o.id}">
            <div class="re-upload-preview alpha">
                <div class="re-upload-imgbox">
                    ${o.type === 'video' ? '<video controls': '<img'} class="re-upload-img" src="${o.src}">${o.type === 'video' ? '</video>' : ''}
                    ${o.type === 'image' ? '<img data-reid="'+o.id+'" class="re-upload-logo active" src="'+o.logo+'">' : ''}
                </div>
            </div>
            <div class="re-upload-info">
                <div class="re-upload-filename">${o.name}</div>
                <textarea class="re-upload-textarea" name="desc${o.id}" placeholder="文件描述">${o.desc}</textarea>
            </div>
        </div>
    </div>`;
}