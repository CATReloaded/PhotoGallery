<?php
ini_set('display_errors', 1);
ob_start();

require_once 'inc/header.php';
require_once 'inc/sidebar.php';
?>


<!-- begin MAIN PAGE CONTENT -->

<div id="page-wrapper">



    <div class="page-content">





        <!-- begin PAGE TITLE ROW -->

        <div class="row">

            <div class="col-lg-12">

                <div class="page-title">

                    <h1>
                        اضافه صور   اقسام المعرض
                    </h1>

                    <ol class="breadcrumb">

                        <li><i class="fa fa-dashboard"></i>  <a href="index.php">الرئيسية</a>

                        </li>

                        <li class="active">اضافه صور لقسم</li>

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

                        <h4>اضافه صور لقسم</h4>

                    </div>

                    <div class="portlet-widgets">

                        <a data-toggle="collapse" data-parent="#accordion" href="#basicFormExample"><i class="fa fa-chevron-down"></i></a>

                    </div>

                    <div class="clearfix"></div>
                    <?php
                    if (isset($_POST['addImage'])) {
                        $depart_obj = new departement();
                        $depart_id = secure_variable($_POST['depart']);
                        $title = secure_variable($_POST['address']);
                        $image_name =$_FILES['image']['name'];
                        $content=  secure_variable($_POST['desc']);
                       
                        if (isset($image_name)) {
                            move_uploaded_file($_FILES['image']['tmp_name'], 'images/'.$image_name);
                        }
                        
                        $result = $depart_obj->addImg($con, $image_name, $title, $content, $depart_id);
                        if ($result == 'done') {
                            echo 'تم الاضافه';
                            header("refresh:1;url=showalldepart.php");
                        }
                    }
                    ?>
                </div>



                <div id="basicFormExample" class="panel-collapse collapse in">

                    <div class="portlet-body">

                        <form action="#" method="POST" enctype="multipart/form-data"   >




                            <div class="form-group">

                                <label class="control-label">اختر القسم</label>

                                <div>

                                    <select class="form-control " name="depart">

                                        <?php
                                        $departement = new departement();
                                        $result = $departement->getAllDepartemnt($con);

                                        while ($all_depart = mysqli_fetch_array($result)) {
                                            ?>

                                            <option value="<?php echo $all_depart['depart_id'] ?>"><?php echo $all_depart['depart_name'] ?></option>

                                            <?php
                                        }
                                        ?>



                                    </select>

                                </div>

                            </div>

                            <div class="form-group">
                                <label for="">عنوان رئيسي </label>
                                <input type="text"  class="form-control" name="address" required="required" placeholder="ادخل عنوان"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputFile">صوره </label>
                                <input type="file" id="exampleInputFile" name="image">
                                <p class="help-block">من فضلك قم برفع صوره</p>
                            </div>
                            <div class="form-group">
                                <label for="">وصف الصوره</label>
                                <textarea  class="form-control" name="desc" required="required" placeholder="من فضلك قم بكتابه وصف "></textarea>
                            </div>


                    </div>





                   

                    <button type="submit" name="addImage"  class="btn btn-default">اضافه صوره</button>

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