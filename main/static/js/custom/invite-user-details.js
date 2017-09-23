

//Below line is for adding active class to layout side menu..
console.log(vm);
document.getElementById("user").className += " active";

var companyTeamName = vm.CompanyTeamName;
var DynamicNotification ="";
    if (vm.NotificationNumber !=0){
        document.getElementById("number").textContent=vm.NotificationNumber;
    }else{
        document.getElementById("number").textContent="";
    }

/*Function for creating Data Array for data table*/
$(function(){ 
    
    var userResponse;
    var mainArray = [];   
    var table = "";
    function createDataArray(values, keys){
        var subArray = [];
        for(i = 0; i < values.length; i++) {
            for(var propertyName in values[i]) {
                subArray.push(values[i][propertyName]);
            }
            subArray.push(keys[i])
            mainArray.push(subArray);
            subArray = [];
        }
    }
    /*Function for assigning data array into data table*/
    function dataTableManipulate(){
        table =  $("#inviteuser-table").DataTable({
            data: mainArray,
            "columnDefs": [{
                       "targets": -1,
                       "width": "10%",
                       "data": null,
                       "defaultContent": '<div class="edit-wrapper"><span class="icn"><i class="fa fa-eye" aria-hidden="true"id="list"></i><i class="fa fa-pencil-square-o" aria-hidden="true" id="edit"></i><i class="fa fa-trash-o" aria-hidden="true" id="delete"></i></span></div>'
            }]
        });
        
        
        
/*Add a plus symbol in webpage for add new groups*/
        var item = $('<span>+</span>');
        item.click(function() {
            window.location = "/" + companyTeamName +"/invite/add";
        });
        $('.table-wrapper .dataTables_filter').append(item);
         $('.table-wrapper .dataTables_filter').prepend($('#sharedDoc'));
        
    }
    /*var link = $('<a>shatata</a>')
    link.click(function(){
        window.location="/"+companyTeamName+"/sharedDocuments";
    });
    $('.table-wrapper .dataTables_filter').append(link);*/
    
    //shared document
    
    
//    $('#inviteuser-table').after($('#sharedDoc'));
/*---------------------------Initial data table calling---------------------------------------------------*/

    if(vm.Values != null) {
        createDataArray(vm.Values, vm.Keys);
    }
    dataTableManipulate();
/*--------------------------Ending Initial data table calling---------------------------------------------*/
    
    /*Edit user details when click on edit icon*/
    $('#inviteuser-table tbody').on( 'click', '#edit', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var key = data[5];
        window.location = '/' + companyTeamName +'/invite/'+ key + '/edit';
        return false;
    });
    
/*List shared documents wheen click on eye icon*/  
    $('#inviteuser-table tbody').on( 'click', '#list', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var key = data[5];
        window.location ='/' + companyTeamName +'/shareddocuments/'+key ;
        return false;
    });
    
     //notification
   //notification
    var notificationSorted =[[]];
    function sortByCol(arr, colIndex){
    notificationSorted=arr.sort(sortFunction);
    function sortFunction(a, b) {
        a = a[colIndex]
        b = b[colIndex]
        return (a === b) ? 0 : (a < b) ? -1 : 1
    }
}

    
     myNotification= function () {
         if (vm.NotificationArray !=null){
        console.log("hiiii");
         sortByCol(vm.NotificationArray, 6);
         console.log("jjjjj",notificationSorted);
         var reverseSorted =[[]];
         reverseSorted=notificationSorted.reverse();

        document.getElementById("notificationDiv").innerHTML = "";
        var DynamicTaskListing="";
        if (reverseSorted !=null){
            DynamicTaskListing ="<h5>"+"Notifications"+ "<button class='no-button-style' method='post' onclick='clearNotification()'>"+"clear all"+"</button>"+"</h5>"+"<ul>";
        for(var i=0;i<reverseSorted.length;i++){
            console.log("sp1");
            var timeDifference =moment(new Date(new Date(reverseSorted[i][6]*1000)), "YYYYMMDD").fromNow();
            DynamicTaskListing += "<li>"+"User"+" "+reverseSorted[i][2]+" "+reverseSorted[i][3]+"  "+"delay to reach location"+" "+reverseSorted[i][4]+" "+"for task"+" "+reverseSorted[i][5]+" <span>"+timeDifference+"</span>"+"</li>";
            
            
        }
            $("#notificationDiv").prepend(DynamicTaskListing+"</ul>");
            document.getElementById("number").textContent="";
            $.ajax({
                url:'/'+ companyTeamName + '/notification/update',
                type: 'post',
                success : function(response) {
                    if (response == "true" ) {
                    } else {
                    }
                },
                error: function (request,status, error) {
                    console.log(error);
                }
            }); 
        }else{
             document.getElementById("notificationDiv").innerHTML = "";
            DynamicTaskListing ="<h5>"+" No New Notifications"+"</h5>";
                        $("#notificationDiv").prepend(DynamicTaskListing);
            
        }
        
        }else{
             document.getElementById("notificationDiv").innerHTML = "";
            DynamicTaskListing ="<h5>"+" No New Notifications"+"</h5>";
            $("#notificationDiv").prepend(DynamicTaskListing);
        }
}
     
     
     
     clearNotification= function () {
          document.getElementById("notificationDiv").innerHTML = "";
          $.ajax({
                url:'/'+ companyTeamName + '/notification/delete',
                type: 'post',
                success : function(response) {
                    if (response == "true" ) {
                        DynamicTaskListing ="<h5>"+" No New Notifications"+"</h5>";
                        $("#notificationDiv").prepend(DynamicTaskListing);
                    } else {
                    }
                },
                error: function (request,status, error) {
                    console.log(error);
                }
            });
     }
    
     
    
    
    /*Delete user details when click on delete icon*/
    $('#inviteuser-table tbody').on( 'click', '#delete', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var key = data[5];
        $.ajax({
            type: "POST",
            url: '/' + companyTeamName +'/invite/'+ key + '/delete',
            data: '',
            success: function(data){
                if(data=="true"){
                    $("#myModalForPendingUsers").modal();
                    $("#deleteNotTask").click(function(){
                        $.ajax({
                            type: "POST",
                            url: '/' + companyTeamName +'/invite/'+ key + '/deletionOfUser',
                            data: '',
                            success: function(feedback){
                                if(feedback=="true"){
                                    $('#inviteuser-table').dataTable().fnDestroy(); 
                                    var index = "";
                                    for(var i = 0; i < mainArray.length; i++) {
                                    index = mainArray[i].indexOf(key);
                                    if(index != -1) {
                                        console.log("dddd", i);
                                        break;
                                    }
                                }
                                mainArray.splice(i, 1);
                                dataTableManipulate()
                                }
                                else {
                                }
                            }
                        });
                    });
                    
                }
                else {
                    $("#myModal").modal();
                    $("#confirm").click(function(){
                        $.ajax({
                            type: "POST",
                            url: '/' + companyTeamName +'/invite/'+ key + '/RemoveTask',
                            data: '',
                            success: function(response){
                                if(response=="true"){
                                    $('#inviteuser-table').dataTable().fnDestroy(); 
                                    var index = "";
                                    for(var i = 0; i < mainArray.length; i++) {
                                    index = mainArray[i].indexOf(key);
                                    if(index != -1) {
                                        console.log("dddd", i);
                                        break;
                                    }
                                }
                                mainArray.splice(i, 1);
                                dataTableManipulate()
                                }
                                else {
                                }
                            }
                        });
                    });
                }
            }
        });
    });
});

