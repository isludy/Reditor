<?php
header("Access-Control-Allow-Origin: *");
/**
 * Multiple files uploading for editor
 * data: 2018-04-24
 * author: lu
 * recieve format: 
 * $_FILES => array(
 *    'id1'=>blob of file1,
 *    'id2'=>blob of file2
 * );
 * $_POST => array(
 *    'id1'=>'{"desc": "file's descipton", "other": "other params"}', //json string
 *    'id2'=>'{"desc": "file's descipton", "other": "other params"}'
 * )
 * The id between POST and FILES must be one-to-one
 * @param $servRoot    localhost dir
 * @param $webRoot     remote url, url for user 
 * @param $folder      folder for saving files
 */

class File{
	private $servRoot;
 	private $webRoot;
 	private $json;
 	private $folder;
 	private $dataTable;
 	private $user;
 	function __construct($servRoot='', $webRoot='', $folder=''){
 		$this->servRoot = !!$servRoot ? $servRoot : '/www/assets/';
    	$this->webRoot = !!$webRoot ? $webRoot : 'http://assets.wenweipo.com/';
    	$this->folder = !!$folder ? $folder : date('Ymd');
    	$this->json = array(
    		'code'=>0,
    		'data'=>array(),
    		'message'=>''
    	);
    	$this->user = 'user';
    	$this->dataTable = $this->user.'data.txt';

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
        $dataTable = fopen($this->servRoot . $this->folder.'/'.$this->dataTable, 'a');
        $time = time();
 		foreach ($_FILES as $id => $file){
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
			$rename = md5_file($ftmp) . strrchr($file['name'], '.');
			$savePath = $this->servRoot . $this->folder . '/' . $rename;
			if (!move_uploaded_file($ftmp, $savePath)){
				$this->json['code'] = 1;
				$this->json['message'] = 'Could not move file to destination directory';
				return json_encode($this->json);
	        }
		    
		    //response data
		    $url = $this->webRoot . $this->folder . '/' . $rename;
		    $query = isset($_POST[$id]) ? $_POST[$id] : '{}';
		    $query = json_decode($query, true);
		    $resData = array(
		    	'url' => $url,
		    	'query' => $query
		    );
		    $this->json['data'][$id] = $resData;
		    //save user log
		    fwrite($dataTable, '#'.$time.':'.json_encode($resData));
	    }

	    $this->json['code'] = 0;
	    $this->json['message'] = 'success';
	    fclose($dataTable);
		return json_encode($this->json);
 	}
 	public function resData($date){
 		$time = strtotime($date);
 		$userData = file_get_contents($this->servRoot . $this->folder.'/'.$this->dataTable);
 		return preg_split("/#+/", substr($userData, 1));
 	}
}

$File = new File('./upload/', 'http://localhost/demo/upload/');
echo $File->upload();
print_r($File->resData('2018/04/24'));
?>