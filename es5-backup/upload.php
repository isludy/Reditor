<?php
header('Access-Control-Allow-Origin:*');
//sleep(2);
if(!empty($_FILES)){
    $r = array('code'=>0,'data'=>array(),'msg'=>'');
    $root_dir = 'upload/';
    $root_url = 'http://localhost/demo/upload/';
    foreach ($_FILES as $id => $file){
        $rename = $id . strrchr($file['name'], '.');
        if(!is_dir($root_dir)){
            $r['code'] = 1;
            $r['msg'] = '目录不存在';
            exit(json_encode($r));
        }
        if(move_uploaded_file($file['tmp_name'], $root_dir . $rename)){
            $r['data'][$id] = $root_url . $rename;
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