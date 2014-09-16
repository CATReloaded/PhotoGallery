


<!-- begin SIDE NAVIGATION -->
<nav class="navbar-side" role="navigation">
    <div class="navbar-collapse sidebar-collapse collapse">
        <ul id="side" class="nav navbar-nav side-nav">
            <!-- begin SIDE NAV USER PANEL -->
            <li class="side-user hidden-xs">
                <img class="img-circle" src="img/profile-pic.jpg" alt="">
                <p class="welcome">
                    <i class="fa fa-key"></i> تم تسجيل الدخول
                </p>
                <p class="name tooltip-sidebar-logout">
                    <?php
                    if (isset($_SESSION['admin'])) {
                        echo $_SESSION['admin'];
                    }
//                             
                    ?> 
                    <a style="color: inherit" class="logout_open" href="#logout" data-toggle="tooltip" data-placement="top" title="تسجيل خروج">
                        <i class="fa fa-sign-out"></i></a>
                </p>
                <div class="clearfix"></div>
            </li>
            <!-- end SIDE NAV USER PANEL -->
            <!-- begin SIDE NAV SEARCH -->
            <li class="nav-search">
                <form role="form">
                    <input type="search" class="form-control" placeholder="ابحث هنا ...">
                    <button class="btn">
                        <i class="fa fa-search"></i>
                    </button>
                </form>
            </li>
            <!-- end SIDE NAV SEARCH -->
            <!-- begin DASHBOARD LINK -->
            <li>
                <a class="active" href="index.php">
                    <i class="fa fa-dashboard"></i> الرئيسية
                </a>
            </li>
            <!-- end DASHBOARD LINK -->








<!--            <li class="panel">
                <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#work-affairs">
                    <i class="fa fa-inbox"></i>اعدادت عامه<i class="fa fa-caret-down"></i>
                </a>
                <ul class="collapse nav" id="work-affairs">
                    <li>
                        <a href="showDepartement.php">
                            <i class="fa fa-angle-double-left"></i>اضافه صور  للعرض
                        </a>
                    </li>


                </ul>
            </li>-->

            <!-- begin  DROPDOWN -->
            <li class="panel">
                <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#students-affairs">
                    <i class="fa fa-inbox"></i>الاقسام<i class="fa fa-caret-down"></i>

                </a>
                <ul class="collapse nav" id="students-affairs">
                    <li>
                        <a href="showDepartement.php">
                            <i class="fa fa-angle-double-left"></i>عرض الاقسام
                        </a>
                    </li>

                </ul>
            </li>
            <!-- end  DROPDOWN -->
            <!-- begin  DROPDOWN -->
            <li class="panel">
                <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#control">
                    <i class="fa fa-inbox"></i> داخل المعرض <i class="fa fa-caret-down"></i>
                </a>
                <ul class="collapse nav" id="control">
                    <li>
                        <a href="showalldepart.php">
                            <i class="fa fa-angle-double-left"></i>عرض  ما بداخل المعرض
                        </a>
                    </li>  
                </ul>
            </li>

            <li class="panel">
                <a href="javascript:;" data-parent="#side" data-toggle="collapse" class="accordion-toggle" data-target="#financial">
                    <i class="fa fa-inbox"></i>العملاء<i class="fa fa-caret-down"></i>
                </a>
                <ul class="collapse nav" id="financial">
                    <li>
                        <a href="showAllClients.php">
                            <i class="fa fa-angle-double-left"></i>عرض    كل العملاء
                        </a>
                    </li>  

                </ul>
            </li>






        </ul>
        <!-- /.side-nav -->
    </div>
    <!-- /.navbar-collapse -->
</nav>
<!-- /.navbar-side -->
<!-- end SIDE NAVIGATION -->
