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
                        <li class="active">عرض  العملاء</li>
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
                        <h4>عرض العملاء </h4>
                    </div>
                    <div class="clearfix"></div>

                    <?php
                    if (isset($_GET['client_id']) && $_GET['client_id'] != '') {
                        echo 'jdsakfjskljf';
                        $id = $_GET['client_id'];
                        $client_obj = new client();
                        $result = $client_obj->deleteClient($con, $id);
                        if ($result == 'done') {
                            echo 'تم الحذف';
//                            header("refresh:1;url=shoq.php");
                        } else {
                            echo 'من فضلك قم بحذف  الطلبات الخاصه بهذا العميل ';
                        }
                    }
                    ?>
                </div>
                <div class="portlet-body">
                    

                    <div class="table-responsive">
                        <table id="example-table" class="table table-striped table-bordered table-hover table-green">
                            <thead>
                                <tr>
                                    <th>رقم</th>
                                    <th>اسم  العميل</th>
                                    <th>الايميل</th>
                                    <th>التليفون</th>
                                    <th> حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $num = 1;
                                $client = new client();
                                $result_set = $client->getAllClients($con);

                                if (mysqli_num_rows($result_set)) {

                                    while ($all = mysqli_fetch_array($result_set)) {
                                        ?>
                                        <tr class="odd gradeX">

                                            <td><?php echo '<a href="showDeals.php?client_id=' . $all['client_id'] . '" >' . $num++ . '</a>'; ?></td>

                                            <td><?php echo $all['name']; ?></td>
                                            <td><?php echo $all['email']; ?></td>
                                            <td><?php echo $all['telephone']; ?></td>

                                            <td><?php echo '<a href="?client_id=' . $all['client_id'] . '" >  حذف</a>'; ?></td>
                                        </tr>

                                        <?php
                                    }
                                } else {
                                    echo '<tr>';
                                    echo '<td> </td>';
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