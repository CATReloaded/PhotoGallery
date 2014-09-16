    </div>
    <!-- /#wrapper -->
    <!-- GLOBAL SCRIPTS -->
    <script src="js/jquery.min.js"></script>
    <script src="js/plugins/bootstrap/bootstrap.min.js"></script>
    <script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>
    <script src="js/plugins/popupoverlay/jquery.popupoverlay.js"></script>
    <script src="js/plugins/popupoverlay/defaults.js"></script>
            <script src="js/persianumber.min.js"></script>
            <script type="text/javascript">
            $(document).ready(function() {
                $('.num').persiaNumber('ar');
            });
        </script>
    <script language="JavaScript" type="text/JavaScript">
    
$(document).ready(function(){
    
$('.subjects').on('change', function() {
    alert('dfas');
//var id = ($('.subjects').val());
////     alert(id);
//
//var data = 'sub_id='+id;  
////alert(data);
//       $.ajax({
//                url:'getspec.php',
//                type: 'POST',
//                data: data,
//                success: function(data){
////                   alert('sucess')
//                   $(".show").html(data);                
//                } 
//             })
//        return false;
});  

//start 

  $('.sub_branch').on('change', function() {
//      alert('dfas');
var id = ($('.sub_branch').val());
//     alert(id);

var data = 'sub_branch='+id;  
//alert(data);
       $.ajax({
                url:'getspec.php',
                type: 'POST',
                data: data,
                success: function(data){
//                   alert('sucess')
                   $(".depend_depart").html(data);                
                } 
             })
        return false;
});  
  $('.more').on('click', function() {
//      alert('dfas');

var data = 'data='+1;  
//alert(data);
       $.ajax({
                url:'getspec.php',
                type: 'POST',
                data: data,
                success: function(data){
//                 $(".more_div").html(data);  

                } 
             })
        return false;
});  
   
     $('.purpose_pay').on('change', function() { 
        var id = ($('.purpose_pay').val());
        if(id == 'اخري'){
            $(".pay_other").html('<input type="text" name="other" required="required" class="form-control" placeholder="اخري">');                
            return false;
        }else{
            $(".pay_other").html('')
        }
        });
        
         
        $('.student_code').on('focusout', function(){
        
        var id = ($('.student_code').val());
        var data = 'student_code='+id;
        //alert(id);
           $.ajax({ 
                url:'getspec.php',
                type: 'POST',
                data: data,
                success: function(data){

                    if($('.student_code').val !== '') {
                       $(".student_name").html(data);
                    }
                } 
            })
                 return false;
    });
    
    
$('.recieve_type').on('change', function() {
var id = ($('.recieve_type').val());

if($('.recieve_type')[0].selectedIndex !== 0) {
   if(id == 'student'){
       $.ajax({ 
                url:'getspec.php',
                type: 'POST',
                data: 'st_code_script=1',
                success: function(data){
//alert(data);
                   // if($('.student_code').val !== '') {
                       $(".stud_code").html(data);
                    //}
                } 
            })
                 return false;
       


   }else{
       $(".stud_code").html('<input type="text" name="other" required="required" class="form-control" placeholder="اخري"><input type="text" name="other_purpose" required="required" class="form-control" placeholder="الغرض">');                
       $(".studentfullname").html('')
       $(".studentpayment").html('')
       
   }

}else{
    $(".stud_code").html('')
    $(".pay_other").html('')
    $(".studentfullname").html('')
    $(".studentpayment").html('')
}
return false;
});
    $('.department_schedule').on('change', function() {
    var id = ($('.department_schedule').val());
    var data = 'department_schedule='+id;
           $.ajax({
                    url:'getspec.php',
                    type: 'POST',
                    data: data,
                    success: function(data){
                       $(".depend_depart").html(data);                
                    } 
                 })
            return false;
    });
    $('.department').on('change', function() {
    var id = ($('.department').val());
    var data = 'department='+id;
           $.ajax({
                    url:'getspec.php',
                    type: 'POST',
                    data: data,
                    success: function(data){
                       $(".depend_depart").html(data);                
                    } 
                 })
            return false;
    });
    $('.pay_list').on('change', function() {
    var id = ($('.pay_list').val());
    var data = 'pay_list='+id;
           $.ajax({
                    url:'getspec.php',
                    type: 'POST',
                    data: data,
                    success: function(data){

                if($('.pay_list')[0].selectedIndex !== 0) {
                    $(".name_list").html(data);
                }else{
                    $(".name_list").html('');
                }
            } 
                 })
                 return false;
    });
});
$('.term_cl,.grade_cl ,.day_cl,.branch_cl ,.department_schedule ,.term_cl').on('change', function(){
    //            alert('sdc');
    var day = ($('.day_cl').val());
    var grade = ($('.grade_cl').val());
    var department = ($('.department_schedule').val());
    var term = ($('.term_cl').val());
    var branch = ($('.branch_cl').val());
    var spec = ($('.spec').val());
    var data = 'day='+day+'&grade='+grade+'&depart_id='+department+'&term='+term+'&branch='+branch+'&spec_id='+spec;
    $.ajax({
    url:'getspec.php',
    type: 'POST',
    data: data,
    success: function(data){
    $(".depend_subject").html(data);
    } 
    })
    return false;
    });
    $('.term_cl,.grade_cl ,.day_cl,.branch_cl ,.time_cl,.year_cl').on('change', function(){
    //             alert('sdc'); 
    var day = ($('.day_cl').val());
    var data = 'day_update='+day;
    $.ajax({
    url:'getspec.php',
    type: 'POST',
    data: data, 
    success: function(data){
    $(".depend_subject_update").html(data);
    } 
    })
    return false;
    });
    </script>
    <!-- Logout Notification Box -->
    <div id="logout">
        <div class="logout-message">
            <img class="img-circle img-logout" src="img/profile-pic.jpg" alt="">
            <h3>
                <i class="fa fa-sign-out text-green"></i> Ready to go?
            </h3>
            <p>Select "Logout" below if you are ready<br> to end your current session.</p>
            <ul class="list-inline">
                <li>
                    <a href="logout.php" class="btn btn-green">
                        <strong>Logout</strong>
                    </a>
                </li>
                <li>
                    <button class="logout_close btn btn-green">Cancel</button>
                </li>
            </ul>
        </div>
    </div>
    <!-- /#logout -->
    <!-- Logout Notification jQuery -->
    <script src="js/plugins/popupoverlay/logout.js"></script>
    <!-- HISRC Retina Images -->
    <script src="js/plugins/hisrc/hisrc.js"></script>
    <!-- PAGE LEVEL PLUGIN SCRIPTS -->
    <!-- HubSpot Messenger -->
    <script src="js/plugins/messenger/messenger.min.js"></script>
    <script src="js/plugins/messenger/messenger-theme-flat.js"></script>
    <!-- Date Range Picker -->
    <script src="js/plugins/daterangepicker/moment.js"></script>
    <script src="js/plugins/daterangepicker/daterangepicker.js"></script>
    <script src="js/plugins/bootstrap-datepicker/bootstrap-datepicker.js"></script>
    <!-- Moment.js -->
    <script src="js/plugins/moment/moment.min.js"></script>
    <!-- DataTables -->
    <script src="js/plugins/datatables/jquery.dataTables.js"></script>
    <script src="js/plugins/datatables/datatables-bs3.js"></script>
    <!-- THEME SCRIPTS -->
    <script src="js/flex.js"></script>
    <script src="js/demo/advanced-tables-demo.js"></script>
    <script src="js/demo/advanced-form-demo.js"></script>
    </form>
</body>
</html>