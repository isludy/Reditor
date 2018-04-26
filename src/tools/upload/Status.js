export default {
    on(){
        for(let len=arguments.length; len--;){
            arguments[len].removeAttr('disabled');
            arguments[len].removeClass('re-disabled');
        }
    },
    off(){
        for(let len=arguments.length; len--;){
            arguments[len].attr('disabled','disabled');
            arguments[len].addClass('re-disabled');
        }
    }
}