<?php
ini_set('display_errors', 1);
ob_start();
?>
<!DOCTYPE html>
<html lang="en">

    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>تسجيل الدخول</title>

        <!-- GLOBAL STYLES -->
        <link href="css/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <link href='http://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700,300italic,400italic,500italic,700italic' rel="stylesheet" type="text/css">
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel="stylesheet" type="text/css">
        <link href="icons/font-awesome/css/font-awesome.min.css" rel="stylesheet">

        <!-- PAGE LEVEL PLUGIN STYLES -->

        <!-- THEME STYLES -->
        <link href="css/style-ar.css" rel="stylesheet">
        <link href="css/plugins.css" rel="stylesheet">

        <!-- THEME DEMO STYLES -->
        <link href="css/demo.css" rel="stylesheet">

        <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->

    </head>

    <body class="login">

        <div class="container">
            <div class="row">
                <div class="col-md-4 col-md-offset-4">
                    <div class="login-banner text-center">
                        <h1><i class="fa fa-users"></i> الدخول للمعرض</h1>
                    </div>
                    <div class="portlet portlet-green">
                        <div class="portlet-heading login-heading">
                            <div class="portlet-title">
                                <h4><strong>من فضلك قم بتسجيل الدخول!</strong>
                                </h4>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <div class="portlet-body">
                            <form accept-charset="UTF-8" role="form" method="post" action="#">
                                <fieldset>
                                    <div class="form-group">
                                        <input class="form-control" required="required" placeholder="الاسم" name="name" type="text">
                                    </div>
                                    <div class="form-group">
                                        <input class="form-control" required="required" placeholder="كلمة المرور" name="password" type="password" value="">
                                    </div>

                                    <br>
                                    <input type="submit" name="login"  class="btn btn-lg btn-green btn-block" value="دخول" />
                                </fieldset>
                                <br>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- GLOBAL SCRIPTS -->
        <script src="../../ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/plugins/bootstrap/bootstrap.min.js"></script>
        <script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
        <!-- HISRC Retina Images -->
        <script src="js/plugins/hisrc/hisrc.js"></script>

        <!-- PAGE LEVEL PLUGIN SCRIPTS -->

        <!-- THEME SCRIPTS -->
        <script src="js/flex.js"></script>

    </body>


</html>
<?php
if (isset($_POST['login']) && $_POST['login'] != '') {
    require_once '../config/config.php';
    $user_name = secure_variable($_POST['name']);
    $password = secure_variable($_POST['password']);


    $admin_obj = new admin();
    $result_set = $admin_obj->adminLogin($con, $user_name, $_POST['password']);
    if (mysqli_num_rows($result_set)) {
        echo 'enter';
        $admin_info = mysqli_fetch_array($result_set);
        session_start();

        $_SESSION['admin_id'] = $admin_info['id'];
        $_SESSION['admin'] = $admin_info['user_name'];
        header('location: index.php');
    } else {
        echo ' تم تسجيل مستخدم او رقم سري خاطي';
    }
}
?>
