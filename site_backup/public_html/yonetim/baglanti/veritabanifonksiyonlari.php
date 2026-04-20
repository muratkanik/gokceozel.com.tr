<?php  
     
    function sorgu($sorgusonucal,$baglandb) {
	  
  return $baglandb->prepare($sorgusonucal);
        
  } 
   
 
   
   function guncel($guncelsonucal,$baglangunceldb) {
	  
  return $baglangunceldb->prepare($guncelsonucal);
        
  } 
   
 
  function veriliste($verilistealfon) {
      $row = $verilistealfon->fetch(PDO::FETCH_ASSOC);
      return $row;
  } 
 
  function topluveriliste($topluverilistealfon) {
      
      return $topluverilistealfon->fetchAll(PDO::FETCH_ASSOC);
  } 	

function temizlikimandan($zararlisil) {
    if ($zararlisil === null || $zararlisil === '') {
        return '';
    }
    // Only strip dangerous tags, preserve Unicode
    $zararlisil = preg_replace('/&.+?;/', '', $zararlisil);
    // REMOVED THE AGGRESSIVE REGEX LINE THAT KILLED UNICODE
    // $zararlisil = preg_replace('/[^%a-z0-9 _-]/', '', $zararlisil); 
    
    $zararlisil = preg_replace('/\s+/', '-', $zararlisil);
    $zararlisil = preg_replace('|-+|', '-', $zararlisil);
    $zararlisil = trim($zararlisil, '-');
    $zararlisil = addslashes($zararlisil);
 
    return $zararlisil;
}
	
	function TrGozat($tr) {
			 return @iconv("ISO-8859-9", "UTF-8",$tr);
			 
			 }
			 
	function TrKaydet($tr) {
			 return @iconv("UTF-8", "ISO-8859-9",$tr);
			 }

function clean($data)
{
// Fix &entity\n;
$data = str_replace(array('&amp;','&lt;','&gt;'), array('&amp;amp;','&amp;lt;','&amp;gt;'), $data);
$data = preg_replace('/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data);
$data = preg_replace('/(&#x*[0-9A-F]+);*/iu', '$1;', $data);
$data = html_entity_decode($data, ENT_COMPAT, 'UTF-8');

// Remove any attribute starting with "on" or xmlns
$data = preg_replace('#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data);

// Remove javascript: and vbscript: protocols
$data = preg_replace('#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data);
$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data);
$data = preg_replace('#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data);

// Only works in IE: <span style="width: expression(alert('Ping!'));"></spa)n>
$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?expression[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?behaviour[\x00-\x20]*\([^>]*+>#i', '$1>', $data);
$data = preg_replace('#(<[^>]+?)style[\x00-\x20]*=[\x00-\x20]*[`\'"]*.*?s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:*[^>]*+>#iu', '$1>', $data);

// Remove namespaced elements (we do not need them)
$data = preg_replace('#</*\w+:\w[^>]*+>#i', '', $data);
 $data = preg_replace('/&.+?;/', '', $data);
    // REMOVED AGGRESSIVE REGEX HERE TOO
    // $data = preg_replace('/[^%a-z0-9 _-]/', '', $data);
    $data = preg_replace('/\s+/', '-', $data);
    $data = preg_replace('|-+|', '-', $data);
    $data = trim($data, '-');
    $data = addslashes($data);


do
{
    // Remove really unwanted tags
    $old_data = $data;
    $data = preg_replace('#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data);
}
while ($old_data !== $data);

// we are done...
return $data;
}
?>