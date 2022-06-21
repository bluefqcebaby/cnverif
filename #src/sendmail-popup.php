<?php

require 'config-email.php';


// Тело письма
$mail->Subject = "Новая заявка"; //Тема письма
$body = "<h1>Заявка</h1>";


if (trim(!empty($_POST['user-name']))) {
    $body .= '<p><strong>Имя: </strong> ' . $_POST['user-name'] . '</p>';
}
if (trim(!empty($_POST['user-email']))) {
    $body .= '<p><strong>Email: </strong> ' . $_POST['user-email'] . '</p>';
}
if (trim(!empty($_POST['user-message']))) {
    $body .= '<p><strong>Сообщение: </strong> ' . $_POST['user-message'] . '</p>';
}


$mail->Body = $body;


//Отправляем
if (!$mail->send()) {
    $message = "error";
} else {
    $message = "ok";
}
$response = ['message' => $message];
header('Content-type: application/json');
echo json_encode($response);
