<?php
header("Access-Control-Allow-Origin: *");
/**
 * Multiple files uploading for editor
 * data: 2018-04-24
 * author: lu
 * The id between POST and FILES must be one-to-one
 * @param $servRoot {String}   localhost dir
 * @param $webRoot  {String}   remote url, url for user
 */
class File{
    private $servRoot;
    private $webRoot;
    private $json;
    private $folder;
    private $dataTable;
    private $user;
    function __construct($servRoot='', $webRoot=''){
        $this->servRoot = !!$servRoot ? $servRoot : '/www/assets/';
        $this->webRoot = !!$webRoot ? $webRoot : 'http://assets.wenweipo.com/';
        $this->folder = date('Ymd');
        $this->json = array(
            'code'=>0,
            'data'=>array(),
            'message'=>''
        );
        // if production, user must be replaced with real user's id;
        $this->user = 'user';
        $this->dataTable = $this->user.'log.txt';

        //check & init folder
        $saveDir = $this->servRoot . $this->folder;
        if(!is_dir($saveDir)){
            if(!mkdir($saveDir, 0777, true)){
                $this->json['code'] = 1;
                $this->json['message'] = 'Fail init folder';
                return json_encode($this->json);
            }
        }
    }
    public function upload($size = 1024){//MB
        //check Files
        if(empty($_FILES)){
            $this->json['code'] = 1;
            $this->json['message'] = 'There are not files';
            return json_encode($this->json);
        }
        //check dir
        if(!is_dir($this->servRoot)){
            $this->json['code'] = 1;
            $this->json['message'] = 'Directory does not exist';
            return json_encode($this->json);
        }

        $logPath = $this->servRoot . $this->folder.'/'.$this->dataTable;
        $logJson = @file_get_contents($logPath);
        $dataTable = fopen($logPath, 'w');

        $file = $_FILES['file'];
        $fsize = $file['size'];
        $ferr = $file['error'];
        $ftmp = $file['tmp_name'];
        //check error
        switch ($ferr) {
            case 1: $this->json['message'] = 'Error 1: Size was exceeded the limit on the server.'; break;
            case 2: $this->json['message'] = 'Error 2: Size was exceeded the limit on the browser.'; break;
            case 3: $this->json['message'] = 'Error 3: Incompleted file was uploaded.'; break;
            case 4: $this->json['message'] = 'Error 4: No file'; break;
            case 5: $this->json['message'] = 'Error 5: Temporary folder not found'; break;
            case 6: $this->json['message'] = 'Error 6: Write into temporary folder error'; break;
            case 7: $this->json['message'] = 'Error 7: Fail to write in';break;
        }
        if($ferr > 0){
            $this->json['code'] = 1;
            return json_encode($this->json);
        }

        //Check size
        if($fsize > $size*1048576){
            $this->json['code'] = 1;
            $this->json['message'] = 'File size out of limit '.$size.'MB.';
            return json_encode($this->json);
        }

        //check upload files
        if (!is_uploaded_file($ftmp)) {
            $this->json['code'] = 1;
            $this->json['message'] = 'No access';
            return json_encode($this->json);
        }

        //move file from temp to folder
        $md5 = md5_file($ftmp);
        $rename =  $md5 . strrchr($file['name'], '.');
        $savePath = $this->servRoot . $this->folder . '/' . $rename;
        if (!move_uploaded_file($ftmp, $savePath)){
            $this->json['code'] = 1;
            $this->json['message'] = 'Could not move file to destination directory';
            return json_encode($this->json);
        }

        //response data & save user log
        $url = $this->webRoot . $this->folder . '/' . $rename;

        $usrlog = array(
            'name' => $file['name'],
            'type' => $file['type'],
            'url'  => $url,
            'date' => time()*1000,
            'resid'=> $md5
        );

        //add post params to log
        foreach( $_POST as $key => $val){
            $usrlog[$key] = $val;
        }

        //save thumb & response url
        if(isset($_FILES['thumb'])){
            $thumbName = $md5 . '_' . $_FILES['thumb']['name'];
            $thumbPath = $this->servRoot . $this->folder . '/' . $thumbName;
            if(move_uploaded_file($_FILES['thumb']['tmp_name'], $thumbPath)){
                $usrlog['thumb'] = $this->webRoot . $this->folder . '/' . $thumbName;
            }
        }

        $this->json['data'] = $usrlog;

        $logJson = !$logJson ? array() : json_decode($logJson, true);
        $logJson[$md5] = $usrlog;

        fwrite($dataTable, json_encode($logJson));

        $this->json['code'] = 0;
        $this->json['message'] = 'success';
        fclose($dataTable);
        return json_encode($this->json);
    }
    public function get($date){
        $logPath = $this->servRoot . $date.'/'.$this->dataTable;
        $logJson = @file_get_contents($logPath);
        if(!$logJson){
            $this->json['code'] = 1;
            $this->json['message'] = 'no any files';
            return json_encode($this->json);
        }

        $this->json['data'] = json_decode($logJson, true);
        $this->json['code'] = 0;
        $this->json['message'] = 'success';
        return json_encode($this->json);
    }
    public function del($resid, $date){
        $logPath = $this->servRoot . $date.'/'.$this->dataTable;
        echo $resid;
        echo $date;
        $logJson = @file_get_contents($logPath);
        if(!$logJson){
            $this->json['code'] = 1;
            $this->json['message'] = 'fail to delete, empty folder';
            return json_encode($this->json);
        }

        $logJson = json_decode($logJson, true);

        if(unlink($this->servRoot . $date.'/'.$resid.strrchr($logJson[$resid]['url'] ,'.'))){
            $this->json['code'] = 0;
            $this->json['message'] = 'success';
        }else{
            $this->json['code'] = 1;
            $this->json['message'] = 'no such file';
        }
        unlink($this->servRoot . $date.'/'.substr( strrchr($logJson[$resid]['thumb'] ,'/'), 1));

        unset($logJson[$resid]);

        $dataTable = fopen($logPath, 'w');
        fwrite($dataTable, json_encode($logJson));
        fclose($dataTable);

        $this->json['data'] = $logJson;
        return json_encode($this->json);
    }
}

sleep(1);

if(isset($_GET['Reditor'])){
    $File = new File('./upload/', 'http://localhost/demo/upload/');
    switch ($_GET['Reditor']){
        case 'upload':
            echo $File->upload();
            break;
        case 'manage':
            echo $File->get($_GET['date']);
            break;
        case 'delete':
            echo $File->del($_GET['resid'], $_GET['date']);
            break;
    }
}

?>