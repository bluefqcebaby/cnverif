<?php

require 'config-email.php';

    // Тело письма
    $mail->Subject = "Новая заявка"; //Тема письма
    $body = "<h1>Заявка</h1>";
    $optionReview = "Базовая проверка";
    if ($_POST['option'] == 'full'){
        $optionReview = 'Полная проверка';
    }
    if (trim(!empty($_POST['option']))){
        $body.='<p><strong>Тип проверки: </strong> '.$optionReview.'</p>';
    }
    if (trim(!empty($_POST['company-name']))){
        $body.='<p><strong>Имя компании: </strong> '.$_POST['company-name'].'</p>';
    }
    if (trim(!empty($_POST['adress']))){
        $body.='<p><strong>Адрес: </strong> '.$_POST['adress'].'</p>';
    }
    if (trim(!empty($_POST['second-adress']))){
        $body.='<p><strong>Адрес сайта на стороннем ресурсе: </strong> '.$_POST['second-adress'].'</p>';
    }
    if (trim(!empty($_POST['user-message']))){
        $body.='<p><strong>Сообщение: </strong> '.$_POST['user-message'].'</p>';
    }
    if (trim(!empty($_POST['user-name']))){
        $body.='<p><strong>Имя: </strong> '.$_POST['user-name'].'</p>';
    }
    if (trim(!empty($_POST['user-tel']))){
        $body.='<p><strong>Телефон: </strong> '.$_POST['user-tel'].'</p>';
    }
    if (trim(!empty($_POST['user-email']))){
        $body.='<p><strong>Email: </strong> '.$_POST['user-email'].'</p>';
    }
    if (trim(!empty($_POST['user-messenger']))){
        $body.='<p><strong>WhatsApp: </strong> '.$_POST['user-messenger'].'</p>';
    }

    // Прикрепляем файлы
    $body .= "<p>Файлы:</p>";
    if (!empty($_FILES)){
        foreach($_FILES as $file) {
            $mail->addAttachment($file['tmp_name'], $file['name']);
        }
    }
    $mail->Body = $body;


    //Отправляем
    if (!$mail->send()){
        $message = "error";
    } else{
        $message = "ok";
    }
    $response = ['message' => $message];
    header('Content-type: application/json');
    echo json_encode($response);
