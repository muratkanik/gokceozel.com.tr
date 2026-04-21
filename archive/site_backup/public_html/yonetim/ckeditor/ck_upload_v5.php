<?php 
// TinyMCE Image Upload Handler
header('Content-Type: application/json; charset=utf-8');

// Define file upload path 
$upload_dir = '../dosya/';

// Allowed image properties  
$imgset = array( 
    'maxsize' => 2000, // KB
    'maxwidth' => 5024,
    'maxheight' => 3000,
    'minwidth' => 10,
    'minheight' => 10,
    'type' => array('bmp', 'gif', 'jpg', 'jpeg', 'png'), 
); 

// If 0, will OVERWRITE the existing file 
define('RENAME_F', 1); 

/** 
 * Set filename 
 * If the file exists, and RENAME_F is 1, set "img_name_1" 
 */ 
function setFName($p, $fn, $ex, $i){ 
    if(RENAME_F == 1 && file_exists($p . $fn . $ex)){ 
        return setFName($p, $fn . '_' . ($i + 1), $ex, ($i + 1)); 
    } else { 
        return $fn . $ex; 
    } 
} 

$response = array('uploaded' => false);

// TinyMCE uses 'file' as the file field name
$file = null;
if(isset($_FILES['file']) && strlen($_FILES['file']['name']) > 1) {
    $file = $_FILES['file'];
} elseif(isset($_FILES['upload']) && strlen($_FILES['upload']['name']) > 1) {
    // Fallback for CKEditor compatibility
    $file = $_FILES['upload'];
}

if($file) {
    
    // Get filename without extension 
    $filename = preg_replace('/\.(.+?)$/i', '', basename($file['name']));   
    $sepext = explode('.', strtolower($file['name'])); 
    $type = end($sepext);
    
    // Validate file type 
    if(in_array($type, $imgset['type'])){
        // Image width and height 
        list($width, $height) = getimagesize($file['tmp_name']); 

        $error = '';
        
        if(isset($width) && isset($height)) { 
            if($width > $imgset['maxwidth'] || $height > $imgset['maxheight']){
                $error = 'Maksimum boyut: ' . $imgset['maxwidth'] . ' x ' . $imgset['maxheight'];
            } 

            if($width < $imgset['minwidth'] || $height < $imgset['minheight']){
                $error = 'Minimum boyut: ' . $imgset['minwidth'] . ' x ' . $imgset['minheight'];
            } 

            if($file['size'] > $imgset['maxsize'] * 1024){
                $error = 'Maksimum dosya boyutu: ' . $imgset['maxsize'] . ' KB';
            } 
        }
        
        if(empty($error)) {
            // File upload path 
            $f_name = setFName($upload_dir, $filename, ".$type", 0); 
            $uploadpath = $upload_dir . $f_name;
            
            // Ensure directory exists
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            // Move uploaded file
            if(move_uploaded_file($file['tmp_name'], $uploadpath)) {
                // Return JSON response for TinyMCE
                // TinyMCE expects relative URL from the document root
                $url = 'ckeditor/' . $upload_dir . $f_name;
                $response = array(
                    'location' => $url
                );
            } else {
                $response = array(
                    'error' => 'Dosya yüklenemedi'
                );
            }
        } else {
            $response['error'] = array(
                'message' => $error
            );
        }
    } else {
        $response['error'] = array(
            'message' => 'İzin verilmeyen dosya tipi: ' . $type
        );
    }
} else {
    $response['error'] = array(
        'message' => 'Dosya seçilmedi'
    );
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;

