<?php
header('Access-Control-Allow-Origin: *');

if(isset($_FILES['fup'])){
    $oname = $_FILES['fup']['name'];
    preg_match("/(\.\w+)(\?[\s\S]+)*$/i",$oname,$arr);
    $rename = md5_file($_FILES['fup']['tmp_name']).$arr[1];
    if(move_uploaded_file($_FILES['fup']['tmp_name'],$rename)){
        exit('http://localhost/feditor/'.$rename);
    }else{
        exit(0);
    }
}


?>
