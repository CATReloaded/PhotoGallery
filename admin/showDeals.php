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
                        <li class="active">عرض  الطلبات الخاصه بالعميل</li>
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
                        <h4>عرض الطلبات الخاصه  بالعميل </h4>
                    </div>
                    <div class="clearfix"></div>


                </div>
                <div class="portlet-body">
                    

                    <div class="table-responsive">
                        <table id="example-table" class="table table-striped table-bordered table-hover table-green">
                            <thead>
                                <tr>
                                    <th>رقم</th>
                                    <th>اسم  العميل</th>
                                    <th>وصف الطلب</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                if (isset($_GET['client_id']) && $_GET['client_id'] != '') {
                                    $num=1;
                                    $id = $_GET['client_id'];
                                    echo $id;
                                    $client_obj = new client();
                                    $result_set = $client_obj->getAllValue($con, $id);
                                    if (mysqli_num_rows($result_set)) {

                                        while ($all = mysqli_fetch_array($result_set)) {
                                            ?>
                                            <tr class="odd gradeX">

                                                <td><?php echo $num++; ?></td>

                                                <td><?php echo $all['name']; ?></td>
                                                <td><?php echo $all['description']; ?></td>


                                            </tr>

                                            <?php
                                        }
                                    }
                                } else {
                                    echo '<tr>';
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