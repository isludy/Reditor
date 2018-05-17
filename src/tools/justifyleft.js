export default (reditor, name)=>{
    console.log(reditor.range);
    document.execCommand(name);
}