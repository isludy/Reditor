<?php
header('Access-Control-Allow-Origin:*');
//sleep(2);
if(!empty($_FILES)){
    $r = array('code'=>0,'data'=>array(),'msg'=>'');
    foreach ($_FILES as $id => $file){
        $rename = 'upload/'.$id . strrchr($file['name'], '.');
        if(!is_dir('upload/')){
            $r['code'] = 1;
            $r['msg'] = '目录不存在';
            exit(json_encode($r));
        }
        if(move_uploaded_file($file['tmp_name'], $rename)){
            $r['data'][$id] = 'http://localhost/demo/'. $rename;
        }else{
            $r['code'] = 1;
            $r['msg'] = '临时文件转移失败';
            exit(json_encode($r));
        }
    }
    echo json_encode($r);
}else{
    echo 'empty';
}
?>