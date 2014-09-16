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
                        اضافه اقسام المعرض
                    </h1>

                    <ol class="breadcrumb">

                        <li><i class="fa fa-dashboard"></i>  <a href="index.php">الرئيسية</a>

                        </li>

                        <li class="active">إضافة قسم </li>

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

                        <h4>إضافة قسم</h4>

                    </div>

                    <div class="portlet-widgets">

                        <a data-toggle="collapse" data-parent="#accordion" href="#basicFormExample"><i class="fa fa-chevron-down"></i></a>

                    </div>

                    <div class="clearfix"></div>
                    <?php
                    if (isset($_POST['addDepart'])) {
                        $depart_obj = new departement();
                        $departement_name =  secure_variable($_POST['depart_name']);
                        
                        $result =$depart_obj->addDepartment($con, $departement_name);
                        if ($result=='done') {
                            echo 'تم الاضافه';
                            header("refresh:1;url=showDepartement.php");
                        }
                    }
                    ?>
                </div>



                <div id="basicFormExample" class="panel-collapse collapse in">

                    <div class="portlet-body">

                        <form action="#" method="POST" enctype="multipart/form-data"   >



                            <div class="form-group">

                                <label for=""> اسم القسم</label>

                                <input type="text" name="depart_name" required="required" class="form-control" placeholder="اسم القسم">

                            </div>




                    </div>







                    <button type="submit" name="addDepart"  class="btn btn-default">اضافة قسم</button>

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