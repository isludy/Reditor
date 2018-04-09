export default {
    range(rg){
        let s = window.getSelection();
        if(rg){
            if(s.rangeCount > 0)  s.removeAllRanges();
            if(rg.rangeCount){
                s.addRange(rg.getRangeAt(0))
            }else{
                s.addRange(rg);
            }
        }else{
            if(s.rangeCount) return s.getRangeAt(0);
            else return s;
        }
    }
}