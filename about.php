<?php
require_once './config/config.php';
//ini_set('display_errors', 1);
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
        <div class="header">
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
                <div class="section group about_desc" >
                    <div class="col_1_of_3 grid_1_of_3" >
                        <h2>من نحن</h2>
                        <img src="images/about_img.jpg" alt="">
                        <p style="font-size:17px;">
كلا ثم دخول الإقتصادي. بعض الفترة دنكيرك من, ستالين الرايخ دنو بل. وعلى تشرشل المعارك حرب بل, ولم بـ لغات مقاومة الحيلولة, ألمّ وقامت تم يكن. بهجوم للغزو، والإتحاد دون عل. عل وجهان الإنجليز، الأوربيين إيو, أعلنت بينيتو شيء بل. وعلى هزيمة الحربي، أي لها, أم يتم وبداية للأراضي.

لقهر بتطويق بالولايات لمّ بل. تُصب يتمكن الإحتلال شبح إذ. أم وأزيز أدولف الأسيوي يكن, ذات أن مساعدة الألماني. تم دول دارت وباءت بولندا،, المدن الياباني ٣٠ قهر. ثم على غضون بالقنابل الإنذار،, عل أهّل التنازلي الا. إذ فقامت الأخذ بها, ٣٠ فعل خطّة نورمبرغ. ٣٠ عام الساحل التاريخ، اقتصادية, وتعدد تجهيز الربيع، ٣٠ عرض.
                        </p>
                    </div>

                    <div class="col_1_of_3 grid_1_of_3" style="float: left">
                        <h2>خدماتنا</h2>
                        <p>
                            <span >

                                <p class="copy" style="font-size: 20px"> يمكنك ارسال  اي طلب  عن طريق ارسال صوره  تحتوي علي الطلب ومعه بعض البيانات وسوف نقوم بالبدأ في العمل  من خلاص صفحه    </p> <p class="design" style="font-size: 20px"><a href="contact.php">راسلنا</a></p>

                            </span> 
                        </p>

                        <div class="list" style="margin-top: 80px;position: relative">
                            <ul>
                                <li class="active" style="direction: rtl"><a href="index.php">الرئيسيه</a></li>
                                <li ><a href="about.php">غرف نوم</a></li>
                                <li><a href="gallery.php">غرف اطفال</a></li>
                                <li><a href="gallery.php">غرف سفره</a></li>
                                <li><a href="gallery.php">انتريه</a></li>
                                <li><a href="gallery.php">مطابخ</a></li>
                                <li><a href="gallery.php">مكتبات</a></li>
                                <li><a href="gallery.php">ابواب</a></li>
                                <li><a href="services.php">خدماتنا</a></li>
                                <li><a href="contact.php">راسلنا</a></li>
                                <!--<div class="clear"> </div>-->
                            </ul>
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
    </div>
    <div class="copy-right">
        <div class="wrap">
            <p style="float: left">العنوان : مصر - المنصورة</p>
            <div class="clear"></div>

            <p style="float: left">محمول : 0100000000</p>
            <div class="clear"></div>

            <p style="float: left">البريد الالكتروني:  <a href="#">mail@mail.com</a></p>
            <div class="clear"></div>

            <p class="copy" > All Rights Reseverd</p> <p class="design"> developed by  <a href="https://www.facebook.com/devAbdallah">abdallah Ragab</a></p>
            <div class="clear"></div>
        </div>	
    </div>
</body>
</html>
