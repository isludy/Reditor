/*
//处理管理面板查询文件
import Mange from "./Manage";
import utils from "../../utils";
//获取管理面板查询按钮，并绑定事件
dateInput = document.re('#re-upload-m-date');
seartchBtn = document.re('#re-upload-m-search');
seartchBtn.on('click', fireSearch);
dateInput.value = date.format('YMD');

function fireSearch(){
    console.log(dateInput.value)
    if(/\d{8}/.test(dateInput.value)){
        Mange.send(dateInput.value, opt.path);
    }else{
        utils.dialog({
            title: '日期错误',
            css: 'max-width:360px',
            body: '输入用于查询的日期错误，必须是8位数字，如：'+date.format('YMD'),
            colorType: 'danger',
            overlay: true,
            yes: false,
            no: false
        });
    }
}
//处理管理面板请求数据成功
Mange.then = function(data){
    console.log(data);
};
*/