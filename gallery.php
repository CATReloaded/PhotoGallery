<?php
ini_set('display_errors', 1);
require_once 'config/config.php';
if (isset($_GET['depart']) && $_GET['depart'] != '') {
    $depart_obj = new departement();
    $id = $_GET['depart'];

    $result_set = $depart_obj->getAllInfoImagByDepartId($con, $id);
}
?>

<!DOCTYPE HTML>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link href="css/style.css" rel="stylesheet" type="text/css" media="all"/>
        <link href='http://fonts.googleapis.com/css?family=Baumans' rel='stylesheet' type='text/css'>
        <script type="text/javascript" src="js/jquery-1.10.1.min.js"></script>
        <script type="text/javascript" src="js/jquery.fancybox.js"></script>
        <link rel="stylesheet" type="text/css" href="css/jquery.fancybox.css" media="screen" />
        <script type="text/javascript">
            $(document).ready(function() {
                $('.fancybox').fancybox();
            });
        </script>
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
                                if ($all['depart_id'] == $_GET['depart']) {
                                    echo 'class="active"';
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

        <div class="main"  >
            <div class="clear"></div>

            <div class="wrap">
                <div class="clear"></div>

                <div class="gallery"  >
                    <div class="clear"></div>

                    <div class="section group">

                        <?php
                        if (isset($_GET['depart']) && $_GET['depart'] != '') {

                            $perpage = 10;

                            $current_page = !empty($_GET['page']) ? $_GET['page'] : 1;
//                        echo $current_page;
                            $total_count = $depart_obj->getCountAllImgByDepart($con, $_GET['depart']);
                            $total_count_fetch = mysqli_fetch_array($total_count);
//                        echo $total_count_fetch['num'];
                            $pagnition = new Pagnition($current_page, $total_count_fetch['num'], $perpage);
                            $offset = $pagnition->offset();
//                        echo 'fdsf' . $offset;

                            $result_set = $depart_obj->selectAllDepartInfoLimited($con, $_GET['depart'], $perpage, $offset);

                            while ($img_info = mysqli_fetch_array($result_set)) {
                                ?>
                                <div class = "gallery_1_of_4 images_1_of_4" style="height:270px ;width:240px" >
                                    <a class = "fancybox" href = "admin/images/<?php echo $img_info['name']; ?>" data-fancybox-group = "gallery" title = "<?php echo $img_info['title']; ?>"><img src = "admin/images/<?php echo $img_info['name']; ?>" alt = ""><span> </span></a>
                                    <h3><?php echo $img_info['title']; ?></h3>
                                    <p><?php echo $img_info['content']; ?><span><a href = "#">[...]</a></span></p>
                                </div>

                                <?php
                            }
                        }
                        ?>


                        <div class="clear"></div>


                    </div>

                    <div class="clear"></div>


                    <div class="projects-bottom-paination">
                        <ul>

                            <?php
                            if (isset($_GET['depart']) && $_GET['depart'] != '') {

                                for ($i = 1; $i <= round($total_count_fetch['num'] / $perpage); $i++) {
                                    ?>
                                    <li <?php
                                    if ($current_page == $i) {
                                        echo 'class="active"';
                                    }
                                    ?>><a href="?depart=<?php echo $_GET['depart']; ?>&&page=<?php echo $i; ?>"><?php echo $i; ?></a></li>
                                        <?php
                                    }
                                }
                                ?>
                        </ul>
                    </div>
                </div>
                <div class="clear"></div>

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

                <p style="float: left">البريد الالكتروني:  <a href="#">mail@mail.com</a></p>
                <div class="clear"></div>

                <p class="copy" > All Rights Reseverd</p> <p class="design"> developed by  <a href="https://www.facebook.com/devAbdallah">abdallah Ragab</a></p>
                <div class="clear"></div>
            </div>	
        </div>
    </body>
</html>
