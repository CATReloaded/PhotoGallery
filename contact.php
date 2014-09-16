<?php
require_once './config/config.php';
ini_set('display_errors', 1);
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="css/style.css" rel="stylesheet" type="text/css" media="all"/>
        <link href='http://fonts.googleapis.com/css?family=Baumans' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="css/align.css" media="screen" />

    </head>
    <body>
        <div class="header_top">
            <div class="wrap">		
                <div class="logo" style="float: left;">
                    <a href="index.php"><h1><span class="black">الحصري</span> <span class="red">للاثاث</span></h1></a>
                </div>	
                <div class="logo" style="float: right;">
                    <img style="height:90px;width:250px" src="images/logo.png">
                </div>	


                <div class="menu" style="float: left;position: relative;margin-top: 3%">
                    <ul>
                        <li  style="direction: rtl"><a href="index.php">الرئيسيه</a></li>
                        <?php
                        $departement = new departement();
                        $result = $departement->getAllDepartemnt($con);
                        while ($all = mysqli_fetch_array($result)) {
//                                var_dump($all);
                            ?>    
                            <li <?php
                            if (isset($_GET['depart']) && $_GET['depart'] != '') {
                                if ($all['depart_id'] == $_GET['depart']) {
                                    echo 'class="active"';
                                }
                            }
                            ?> >
                                <a href="gallery.php?depart=<?php echo $all['depart_id']; ?>" ><?php echo $all['depart_name'] ?></a></li>
                            <?php
                        }
                        ?>
                        <li><a href="about.php">من نحن</a></li>

                        <li><a href="contact.php">راسلنا</a></li>
                        <!--<div class="clear"> </div>-->
                    </ul>
                </div>						
                <div class="clear"></div>
            </div>

        </div>

    </div>	
    <div class="clear"></div>

    <div class="main">
        <div class="wrap">
            <div class="section group">				
                <div class="col span_1_of_3" >

                    <div class="company_address">
                        <h3>معلومات المعرض</h3>
                        <p>العنوان : مصر - المنصورة</p>
                        <p>محمول : 010000000</p>
                        <p>البريد الالكتروني:  <a href="#">mail@mail.com</a></p>
                        <p>تابعونا:<a href="#">الفيس بوك</a></p>

                    </div>
                    <div style="float: left">
                        <img src="images/gallery-img1.jpg" alt="" style=" width:1500px;height:200px; margin-right:180% ;margin-top:-250px  ">

                    </div>
                </div>				
                <div class="col span_2_of_3" >
                    <div class="contact-form">
                        <h3>تواصل معنا</h3>
                        <form method="post" action="#"  enctype="multipart/form-data" >
                            <div>
                                <span><label>اسم العميل</label></span>
                                <span><input name="userName" type="text" class="textbox" required="required"></span>
                            </div>
                            <div>
                                <span><label>والايميل</label></span>
                                <span><input name="userEmail" type="text" class="textbox" required="required"></span>
                            </div>
                            <div>
                                <span><label>الموبايل</label></span>
                                <span><input name="userPhone" type="text" class="textbox" required="required"></span>
                            </div>
                            <div>
                                <span><label>الطلب</label></span>
                                <span><textarea name="userMsg" required="required"> </textarea></span>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">صوره للطلب</label>
                                <input type="file" id="exampleInputFile" name="image">
                                <p class="help-block">من فضلك قم برفع صوره</p>
                            </div>
                            <span><input type="submit" name="addorder" class="mybutton" value="ارسال"></span>
                    </div>
                    </form>
                    <?php
                    if (isset($_POST['addorder']) && $_POST['addorder'] != '') {
                        $name = secure_variable($_POST['userName']);
                        $email = secure_variable($_POST['userEmail']);
                        $phone = secure_variable($_POST['userPhone']);
                        $message = secure_variable($_POST['userMsg']);
                        $attach = $_FILES['image']['name'];
                        if (isset($attach)) {
                            move_uploaded_file($_FILES['image']['tmp_name'], 'admin/order_img/' . $attach);
                        }
                        $client = new client();
                        $addClient = $client->addClient($con, $name, $email, $phone);
                        $last_insert_id = mysqli_insert_id($con);
                        if ($addClient == 'done') {
                            $contact = $client->insertOrder($con, $message, $last_insert_id);
                            if ($contact == 'done') {

                                echo 'تم الارسال';
//                                require_once('classes/class.phpmailer.php');
//
//                                $mail = new PHPMailer();
//
//                                $mail->IsSendmail(); // telling the class to use SendMail transport
////                                $body = file_get_contents('contents.html');
//                                $body = eregi_replace("[\]", '', $body);
//
//                                $mail->AddReplyTo("dev.abdallah.ragab@gmail.com", "First Last");
//
//                                $mail->SetFrom($email, 'First Last');
//
////                                $mail->AddReplyTo("name@yourdomain.com", "First Last");
//
//
//
//                                $mail->Subject = "order";
//
////                                $mail->AltBody = ""; // optional, comment out and test
//
//                                $mail->MsgHTML($body);
//
//                                $mail->AddAttachment("admin/order_img/'.$attach.'");      // attachment
//
//                                if (!$mail->Send()) {
//                                    echo "Mailer Error: " . $mail->ErrorInfo;
//                                } else {
//                                    echo "Message sent!";
//                                }
                            }
                        }
                    }
                    ?>
                </div>
            </div>				
        </div>
    </div>
</div>
<div class="copy-right">
    <div class="wrap">
        <div class="clear"></div>
    </div>	
</div>
<div class="copy-right">
    <div class="wrap">
        <p style="float: left">العنوان : مصر - المنصورة</p>
        <div class="clear"></div>

        <p style="float: left">محمول : 010000000</p>
        <div class="clear"></div>

        <p style="float: left">البريد الالكتروني:  <a href="#">mai@mail.com</a></p>
        <div class="clear"></div>

        <p class="copy" > All Rights Reseverd</p> <p class="design"> developed by  <a href="https://www.facebook.com/devAbdallah">abdallah Ragab</a></p>
        <div class="clear"></div>
    </div>	
</div>
</body>
</html>
