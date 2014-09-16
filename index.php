<?php
require_once './config/config.php';
ini_set('display_errors', 1);
?>
<!DOCTYPE HTML>
<html >
    <head>

        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="css/style.css" rel="stylesheet" type="text/css" media="all"/>
        <link href="css/slider.css" rel="stylesheet" type="text/css" media="all"/>
        <script type="text/javascript" src="js/jquery.min.js"></script>
        <script type="text/javascript" src="js/jquery.easing.1.3.js"></script> 
        <script type="text/javascript" src="js/camera.min.js"></script> 
        <link href='http://fonts.googleapis.com/css?family=Baumans' rel='stylesheet' type='text/css'>
        <!--<link rel="stylesheet" type="text/css" href="css/align.css" media="screen" />-->

        <script>
            jQuery(function() {

                jQuery('#camera_wrap_1').camera({
                    thumbnails: true
                });
            });
        </script>
        <!--<link href="css/align.css" rel="stylesheet" type="text/css" />-->
        <style>
            /*            html[dir="rtl"] #navigation {
                            float: right;
                            display: inline;
                            margin-left: 0px;
                            margin-right: 360px;
                        }*/
        </style>
    </head>
    <body >
        <div class="header">
            <div class="header_top">
                <div class="wrap">		
                    <div class="logo" style="float: left;">
                        <a href="index.php"><h1><span class="black">معرض</span> <span class="red">للاثاث</span></h1></a>
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

            <div class="slider">						    								     
                <div class="fluid_container">
                    <div class="camera_wrap camera_azure_skin" id="camera_wrap_1" style="margin-bottom:15px">
                        <div data-thumb="images/thumbnails/slider-1.jpg" data-src="images/slider-4.jpg">   </div>
                        <div data-thumb="images/thumbnails/slider-2.jpg" data-src="images/slider-3.jpg">  </div>
                        <div data-thumb="images/thumbnails/slider-1.jpg" data-src="images/slider-1.jpg">   </div>
                        <div data-thumb="images/thumbnails/slider-2.jpg" data-src="images/slider-2.jpg">  </div>
                    </div>
                </div>
                <div class="clear"></div>					       
            </div>
        </div>		
        <div class="main">
            <div class="wrap">
                <div class="icon_grids">
                    <div class="section group" >
                        <div class="grid_1_of_3 images_1_of_3" style="float: right">
                            <div class="grid_icon"><a href="about.php"><img src="images/g1.png"></a></div>
                            <h3>من نحن</h3>
                            <p>
كلا ثم دخول الإقتصادي. بعض الفترة دنكيرك من, ستالين الرايخ دنو بل. وعلى تشرشل المعارك حرب بل
                            </p>
                            <div class="button"><span><a href="about.php">المزيد</a></span></div>
                        </div>
                        <!--                        <div class="grid_1_of_3 images_1_of_3" style="float: right">
                                                    <div class="grid_icon"><a href="services.php"><img src="images/g2.png"></a></div>
                                                    <h3>Custom Design</h3>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                                    <div class="button"><span><a href="services.php">المزيد</a></span></div>
                                                </div>-->
                        <div class="grid_1_of_3 images_1_of_3">
                            <div class="grid_icon"><a href="about.php"><img src="images/g3.png"></a></div>
                            <h3>خدمات للعملاء</h3>
                            <p>
ولم بـ لغات مقاومة الحيلولة, ألمّ وقامت تم يكن. بهجوم للغزو، والإتحاد دون عل. عل وجهان الإنجليز، الأوربيين إيو,
                            </p>
                            <div class="button"><span><a href="about.php">المزيد</a></span></div>
                        </div>
                    </div>
                </div>
                <div class="section group" >						
                    <div class="col_1_of_3 span_1_of_3" style="float: left">
                        <h3>خدماتنا</h3>
                        <ul>
                            <?php
                            $departement = new departement();
                            $result = $departement->getAllDepartemnt($con);
                            while ($all = mysqli_fetch_array($result)) {
//                                var_dump($all);
                                ?>    
                                <li <?php
                                if ($all['depart_id'] == $_GET['depart']) {
                                    echo 'class="active"';
                                }
                                ?> >
                                    <a href="gallery.php?depart=<?php echo $all['depart_id']; ?>" ><?php echo $all['depart_name'] ?></a></li>
                                <?php
                            }
                            ?>
                        </ul>
                    </div>
                    <div class="col_1_of_3 span_1_of_3" style="float:bottom">
                        <div class="new-products">
                            <h3>منتجات جديده</h3>
                            <p><a href="gallery.php"><img src="images/product1.jpg" alt=""></a></p>
                            <p><a href="gallery.php"><img src="images/product2.jpg" alt=""></a></p>
                            <p><a href="gallery.php"><img src="images/product3.jpg" alt=""></a></p>
                            <p><a href="gallery.php"><img src="images/product4.jpg" alt=""></a></p>
                            <p><a href="gallery.php"><img src="images/product5.jpg" alt=""></a></p>
                            <p><a href="gallery.php"><img src="images/product1.jpg" alt=""></a></p>
                            <div class="button"><span><a href="gallery.php">عرض الكل</a></span></div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        <div class="copy-right">
        <div class="wrap">
            <p style="float: left">العنوان : مصر - المنصورة</p>
            <div class="clear"></div>

            <p style="float: left">محمول : 010000000</p>
            <div class="clear"></div>

            <p style="float: left ;direction: rtl">البريد الالكتروني:  <a href="#">mail@mail.com</a></p>
            <div class="clear"></div>

            <p class="copy" > All Rights Reseverd</p> <p class="design"> developed by  <a href="https://www.facebook.com/devAbdallah">abdallah Ragab</a></p>
            <div class="clear"></div>
        </div>	
    </div>
    </body>


</html>
