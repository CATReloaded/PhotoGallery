<?php
ini_set('display_errors', 1);
ob_start();

require_once 'inc/header.php';
require_once 'inc/sidebar.php';

if (isset($_GET['depart_id']) && $_GET['depart_id']) {
    $id = $_GET['depart_id'];
    $departement = new departement();
    $result = $departement->getDepartementById($con, $id);
    $old_data = mysqli_fetch_array($result);
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
                        تعديل اقسام المعرض
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
                    if (isset($_POST['updateDepart'])) {
                        $depart_obj = new departement();
                        $departement_name = secure_variable($_POST['depart_name']);

                        $result = $depart_obj->updateDepartement($con, $_GET['depart_id'],$departement_name);
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



                            <div class="form-group">

                                <label for=""> اسم القسم</label>

                                <input type="text" name="depart_name" required="required" class="form-control" placeholder="اسم القسم" value="<?php
                                echo $old_data['depart_name'];
                                ?>">

                            </div>




                    </div>







                    <button type="submit" name="updateDepart"  class="btn btn-default">تعديل قسم</button>

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