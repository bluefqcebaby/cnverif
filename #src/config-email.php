<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->isSMTP();
$mail->Host = "smtp.gmail.com";
$mail->SMTPAuth = true;
$mail->Username = "idi.v.srakengrad@gmail.com";//Вписывайте свой email с которого будут отправляться письма
$mail->Password = "ozmicblsqctggutc";//Вписываете свой пароль
$mail->SMTPSecure = 'ssl'; 
$mail->Port = 465; 
// $mail->SMTPDebug = 2;

$mail->setLanguage('ru', 'phpmailer/language/');
$mail->isHTML(true);
// От кого письмо
$mail->setFrom('idi.v.srakengrad@gmail.com', 'Андр');
// Кому отправить 
$mail->addAddress('pisuar33@gmail.com');
// $mail->addAddress('pisuar33@gmail.com'); // Если нужно несколько просто дублируете верхнюю строчку и вписываете нужный адресс
