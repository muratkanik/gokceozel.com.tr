<?php

	$to = "keyfalan@hotmail.com";  // Your email here
	$from = $_REQUEST['mail'];
	$name = $_REQUEST['ad'];
	$phone = $_REQUEST['telefon'];
	$message = $_REQUEST['mesaj'];
	$headers = "From: $from";
	$subject = "Web Sitesinden Gönderildi";

	$fields = array();
	$fields{"name"} = "First name";
	$fields{"email"} = "Email";
	$fields{"phone"} = "Phone";
	$fields{"message"} = "Message";

	$body = "İşte gönderilenler:\n\n";
	foreach($fields as $a => $b){
		$body .= sprintf("%20s:%s\r\n",$b,$_REQUEST[$a]);
	}
	$send = mail($to, $subject, $body, $headers);

?>
