<?php
ini_set('display_errors', 1);
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
                        الرئسيه
                    </h1>
                    <ol class="breadcrumb">
                        <li><i class="fa fa-dashboard"></i>  <a href="index.php">الرئسيه</a>
                        </li>
                        <li class="active">عرض  الاقسام</li>
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
                        <h4>عرض الاقسام </h4>
                    </div>
                    <div class="clearfix"></div>

                    <?php
                    if (isset($_GET['depart_id']) && $_GET['depart_id'] != '') {
                        $id = $_GET['depart_id'];
                        $depart_obj = new departement();
                        $result = $depart_obj->deleteDepartement($con, $id);
                        if ($result == 'done') {
                            echo 'تم الحذف';
//                            header("refresh:1;url=shoq.php");
                        } else {
                            echo 'من فضلك قم بحذف الصور من هذا القسمs';
                        }
                    }
                    ?>
                </div>
                <div class="portlet-body">
                    <div class="form-group col-md-2 col-md-offset-5">
                        <a href="addDepartement.php" style="margin-top: 27px;" class="btn btn-default">إضافة قسم</a>
                    </div>

                    <div class="table-responsive">
                        <table id="example-table" class="table table-striped table-bordered table-hover table-green">
                            <thead>
                                <tr>
                                    <th>رقم</th>
                                    <th>اسم  القسم</th>
                                    <th>تعديل</th>
                                    <th> حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $num = 1;
                                $department = new departement();
                                $result_set = $department->getAllDepartemnt($con);

                                if (mysqli_num_rows($result_set)) {

                                    while ($all = mysqli_fetch_array($result_set)) {
                                        ?>
                                        <tr class="odd gradeX">

                                            <td><?php echo $num++; ?></td>
                                            <td><?php echo $all['depart_name']; ?></td>



                                            <td><?php echo '<a href="updateDepartement.php?depart_id=' . $all['depart_id'] . '" > تعديل</a>'; ?></td>
                                            <td><?php echo '<a href="?depart_id=' . $all['depart_id'] . '" >  حذف</a>'; ?></td>
                                        </tr>

                                        <?php
                                    }
                                } else {
                                    echo '<tr>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
                                    echo '</td>';
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                    <!-- /.table-responsive -->
                </div>
                <!-- /.portlet-body -->
            </div>
            <!-- /.portlet -->



        </div>


    </div>


    <?php
    require_once 'inc/footer.php';
    ?>