document.on('click', e=>{
    let target = e.target;
    //close icon
    if(target.hasClass('re-close'))
        target.parentNode.remove();
});