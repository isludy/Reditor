import options from "../../options";

const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

let ow = options.upload.thumb.width || 480,
    oh = options.upload.thumb.height || 270,
    resolve, reject;

function loaded(e){
    this.removeEventListener(e.type, loaded);
    this.removeEventListener('error', errorFn);
    canvas.width = canvas.height = 0;
    let w = this.width || this.videoWidth,
        h = this.height || this.videoHeight;
    if(ow === 'auto'){
        if(oh === 'auto'){
            ow = 480;
            oh = Math.round(480 * h / w);
        }else{
            ow = Math.round(oh * w / h);
        }
    }else{
        if(oh === 'auto'){
            oh = Math.round(ow * h / w);
        }
    }
    canvas.width = ow;
    canvas.height = oh;
    ctx.drawImage(this, 0, 0, w, h, 0, 0, ow, oh);
    resolve(canvas.toFile(ow+'x'+oh+'.jpg', 'image/jpeg'));
}
function errorFn(err){
    this.removeEventListener('load', loaded);
    this.removeEventListener('loadeddata', loaded);
    this.removeEventListener('error', errorFn);
    reject(err.message);
}

export default (type, src, v) =>{
    if(/^image/i.test(type)){
        let img = new Image();
        img.addEventListener('load', loaded);
        img.addEventListener('error', errorFn);
        img.src = src;

    }else if(/^video/i.test(type)){
        let video = document.createElement('video');

        video.addEventListener('loadeddata', loaded);
        video.addEventListener('error', errorFn);

        video.src = src;
        if(v && v.length)
            video.currentTime = v[0].currentTime || 0;
    }
    return new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
};