<?php
ini_set('display_errors', 1);
ob_start();

require_once 'inc/header.php';
require_once 'inc/sidebar.php';
if (isset($_GET['img_id']) && $_GET['img_id'] != '') {
    $img_id = $_GET['img_id'];
    $depar_obj = new departement();
    $result_set = $depar_obj->getimgById($con, $img_id);
    $old_data = mysqli_fetch_array($result_set);
    $depart_id = $old_data['departement_depart_id'];
}
?>


<!-- begin MAIN PAGE CONTENT -->

<div id="page-wrapper">



    <div class="page-content">





        <!-- begin PAGE TITLE ROW -->

        <div class="row">

            <div class="col-lg-12">

                <div class="page-title">

                    <h1>
                        تعديل صور   اقسام المعرض
                    </h1>

                    <ol class="breadcrumb">

                        <li><i class="fa fa-dashboard"></i>  <a href="index.php">الرئيسية</a>

                        </li>

                        <li class="active">تعديل صور لقسم</li>

                    </ol>

                </div>

            </div>

            <!-- /.col-lg-12 -->

        </div>

        <!-- /.row -->

        <!-- end PAGE TITLE ROW -->



        <div class="row">



            <div class="portlet portlet-default">

                <div class="portlet-heading">

                    <div class="portlet-title">

                        <h4>تعديل صور لقسم</h4>

                    </div>

                    <div class="portlet-widgets">

                        <a data-toggle="collapse" data-parent="#accordion" href="#basicFormExample"><i class="fa fa-chevron-down"></i></a>

                    </div>

                    <div class="clearfix"></div>
                    <?php
                    if (isset($_POST['updateImage'])) {
                        $depart_obj = new departement();
                        $depart_id = secure_variable($_POST['depart']);
                        $title = secure_variable($_POST['address']);
                        $content=  secure_variable($_POST['desc']);
                        if (isset($_FILES['image']['name']) && $_FILES['image']['name'] != '') {
                            $image_name = $_FILES['image']['name'];
                        }  else {
                            $image_name=$_POST['old_img'];
                        }
                        $content = secure_variable($_POST['desc']);

                        if (isset($image_name)) {
                            move_uploaded_file($_FILES['image']['tmp_name'], 'images/' . $image_name);
                        }

                        $result = $depart_obj->updateImg($con,$_GET['img_id'] ,$image_name, $title, $content, $depart_id);
                        if ($result == 'done') {
                            echo 'تم التعديل';
                            header("refresh:1;url=showalldepart.php");
                        }
                    }
                    ?>
                </div>



                <div id="basicFormExample" class="panel-collapse collapse in">

                    <div class="portlet-body">

                        <form action="#" method="POST" enctype="multipart/form-data"   >


                            <input type="hidden" name="old_img"  value="<?php echo $old_data['name'];?>"/>

                            <div class="form-group">

                                <label class="control-label">اختر القسم</label>

                                <div>

                                    <select class="form-control " name="depart">

                                        <?php
                                        $departement = new departement();

                                        $result = $departement->getAllDepartemnt($con);

                                        while ($all_depart = mysqli_fetch_array($result)) {
                                            ?>

                                            <option value="<?php echo $all_depart['depart_id'] ?>" <?php
                                        if ($all_depart['depart_id'] == $depart_id) {
                                            echo 'selected=selected';
                                        }
                                            ?> ><?php echo $all_depart['depart_name'] ?></option>

                                            <?php
                                        }
                                        ?>



                                    </select>

                                </div>

                            </div>

                            <div class="form-group">
                                <label for="">عنوان رئيسي </label>
                                <input type="text"  class="form-control" name="address" required="required" placeholder="ادخل عنوان" value="<?php
                                        if (isset($old_data['title'])) {
                                            echo $old_data['title'];
                                        }
                                        ?>"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">صوره </label>
                                <input type="file" id="exampleInputFile" name="image">
                                <p class="help-block">من فضلك قم برفع صوره</p>
                            </div>
                            <div class="form-group">
                                <label for="">وصف الصوره</label>
                                <textarea  class="form-control" name="desc" required="required" placeholder="من فضلك قم بكتابه وصف "><?php
                                if (isset($old_data['content'])) {
                                    echo $old_data['content'];
                                }
                                        ?></textarea>
                            </div>


                    </div>







                    <button type="submit" name="updateImage"  class="btn btn-default">تعديل صوره</button>

                    </form>

                </div>

            </div>

        </div>

        <!-- /.portlet -->





        <!-- /.col-lg-12 -->

    </div>

    <!-- /.row -->





</div>

<!-- /.page-content -->



</div>

<?php
require 'inc/footer.php';
?>       