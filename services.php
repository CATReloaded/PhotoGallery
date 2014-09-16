<?php
require_once './config/config.php';
ini_set('display_errors', 1);
?>
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
                            <li><a href="services.php">خدماتنا</a></li>
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
                <div class="services">
                    <div class="section group">
                        <div class="listview_1_of_2 images_1_of_2">
                            <div class="listimg listimg_2_of_1">
                                <img src="images/service-1.png" alt="" />
                            </div>
                            <div class="text list_2_of_1">
                                <h3>Customer Support</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                        </div>			
                        <div class="listview_1_of_2 images_1_of_2"  style="float:left">
                            <div class="listimg listimg_2_of_1">
                                <img src="images/service-2.png" alt="" />
                            </div>
                            <div class="text list_2_of_1"  >
                                <h3>Repair Services</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            </div>
                        </div>
                    </div>
                    <!--                    <div class="section group">
                                            <div class="listview_1_of_2 images_1_of_2">
                                                <div class="listimg listimg_2_of_1">
                                                    <img src="images/service-3.png" alt="">
                                                </div>
                                                <div class="text list_2_of_1">
                                                    <h3>Complete Care</h3>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                                </div>
                                            </div>			
                                            <div class="listview_1_of_2 images_1_of_2">
                                                <div class="listimg listimg_2_of_1">
                                                    <img src="images/service-4.png" alt="">
                                                </div>
                                                <div class="text list_2_of_1">
                                                    <h3>Spare Parts</h3>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                                </div>
                                            </div>
                                        </div>-->
                    <!--                    <div class="section group">
                                            <div class="listview_1_of_2 images_1_of_2">
                                                <div class="listimg listimg_2_of_1">
                                                    <img src="images/service-5.png" alt="">
                                                </div>
                                                <div class="text list_2_of_1">
                                                    <h3>Sales Services</h3>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                                </div>
                                            </div>			
                                            <div class="listview_1_of_2 images_1_of_2">
                                                <div class="listimg listimg_2_of_1">
                                                    <img src="images/service-6.png" alt="">
                                                </div>
                                                <div class="text list_2_of_1">
                                                    <h3>Custom Services</h3>
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt  ut labore et dolore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                                </div>
                                            </div>
                                        </div>-->
                </div>
            </div>
        </div>
        <div class="copy-right">
            <div class="wrap">
                <div class="clear"></div>
            </div>	
        </div>
    </body>
</html>

