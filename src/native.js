/**===========================
 * 为了方便操作，对原生进行一些处理
 ===========================*/
/**
 * Array的incudes兼容性
 * @param target
 * @type {Function}
 * @return {boolean}
 */
if(!Array.prototype.includes){
    Array.prototype.includes = function (target) {
        return this.indexOf(target) !== -1;
    };
}
/**
 * Array的forEach兼容性
 * @param fn
 * @type {Function}
 */
if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fn){
        if(typeof fn === 'function')
            for(let i=0, len=this.length; i<len; i++)
                fn(this[i], i);
    }
}
/**
 * Array的isArray兼容
 * @param arg {*}
 * @type {Function}
 * @return {boolean}
 */
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
/**
 * 简化并做兼容createObjectURL
 * @param blob
 * @return {*}
 */
window.createURL = function(blob){
    return window[ window.URL ? 'URL' : 'webkitURL']['createObjectURL'](blob);
};
window.revokeURL = function(url){
    return window[ window.URL ? 'URL' : 'webkitURL']['revokeObjectURL'](url);
};
/**
 * 格式化字节
 * @param bit
 * @param fixed
 * @return {string}
 */
Math.fsize = function(bit, fixed=2){
    if(bit < 1024)
        return bit+'B';
    else if(bit < 1048576)
        return (bit/1024).toFixed(fixed)+'KB';
    else if(bit < 1073741824)
        return (bit/1048576).toFixed(fixed)+'MB';
    else
        return (bit/1073741824).toFixed(fixed)+'GB';
};
/**
 * 格式化时间
 * @param format
 * @return {string}
 */
Date.prototype.format = function(format = 'Y-m-d'){
    let _this = this,
        o = {
            Y: _this.getFullYear(),
            m: _this.getMonth()+1,
            d: _this.getDate(),
            h: _this.getHours(),
            i: _this.getMinutes(),
            s: _this.getSeconds(),
            c: _this.getMilliseconds()
        };
    o.y = (o.Y+'').slice(2);
    o.M = (o.m+100+'').slice(1);
    o.D = (o.d+100+'').slice(1);
    o.H = (o.h+100+'').slice(1);
    o.I = (o.i+100+'').slice(1);
    o.S = (o.s+100+'').slice(1);
    o.C = (o.c+1000+'').slice(1);

    if(typeof format === 'string'){
        format = format.split('');
        for(let len=format.length; len--;){
            let k = format[len];
            if(o[k]) format[len] = o[k];
        }
        return format.join('');
    }
    return o.Y + '-' + o.M + '-' + o.D + ' ' + o.H + ':' + o.I + ':' + o.S + ':' + o.C;
};

/**
 * canvas 转 File对象
 * @param name {String} 文件名
 * @param type {String} mime类型
 * @type {Function}
 * @returns {File}
 */
HTMLCanvasElement.prototype.toFile = function(name = 'file.png', type = 'image/png'){
    let data, binary, len, i;
    data = this.toDataURL(type);
    data = window.atob( data.replace(/^data:(image\/[\w-]+);base64,/, '') );
    binary = new Uint8Array(len = data.length);
    for(i=0; i<len; i++)
        binary[i] = data.charCodeAt(i);
    return new File([binary], name ,{type, endings:'transparent'});
};