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
                        <li class="active">عرض  الصور</li>
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
                        <h4>عرض الصور </h4>
                    </div>
                    <div class="clearfix"></div>

                    <?php
//                    if (isset($_GET['id']) && $_GET['id'] != '') {
//                        $id = $_GET['id'];
//                        $depart_obj = new department();
//                        $result = $depart_obj->deleteSpec($con, $id);
//                        if ($result == 'done') {
//                            echo 'تم الحذف';
////                            header("refresh:1;url=showDepartement.php");
//                        } else {
//                            echo 'من فضلك قم  بمسح الطلاب من هذا التخصص';
//                        }
//                    }
                    ?>
                </div>
                <div class="portlet-body">
                    <div class="table-responsive">
                        <table id="example-table" class="table table-striped table-bordered table-hover table-green">
                            <thead>
                                <tr>
                                    <th>رقم</th>
                                    <th>اسم  القسم</th>
                                    <th>العنوان</th>
                                    <th>المحتوي</th>
                                    <th>الصوره</th>
                                    <!--<th>تعديل</th>-->
                                    <!--<th> حذف</th>-->
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $num = 1;
                                $department = new departement();
                                $result_set = $department->selectAllDepartInfo($con);

                                if (mysqli_num_rows($result_set)) {

                                    while ($all = mysqli_fetch_array($result_set)) {
                                        ?>
                                        <tr class="odd gradeX">

                                            <td><?php echo $num++; ?></td>
                                            <td><?php echo $all['depart_name']; ?></td>
                                            <td><?php echo $all['title']; ?></td>
                                            <td><?php echo $all['content']; ?></td>

                                            <td><?php
                                                echo ' <img src="images/' . $all['name'] . '" style="width: 70px;height: 70px;" class="img-circle" /> ';
                                                ?></td>
                                            <!--<td><?php echo '<a href="updateDepart.php?img_id=' . $all['img_id'] . '&&depart_id=' . $all['departement_depart_id'] . '" > تعديل</a>'; ?></td>-->
                                            <!--<td><?php echo '<a href="?img_id=' . $all['img_id'] . '&&depart_id=' . $all['departement_depart_id'] . '" >  حذف</a>'; ?></td>-->
                                        </tr>

                                        <?php
                                    }
                                } else {
                                    echo '<tr>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
                                    echo '<td> </td>';
//                                    echo '<td> </td>';
//                                    echo '<td> </td>';
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