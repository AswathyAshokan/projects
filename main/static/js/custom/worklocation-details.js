document.getElementById("WorkLocation").className += " active";

var companyTeamName = vm.CompanyTeamName;
if (vm.NotificationNumber !=0){
    document.getElementById("number").textContent=vm.NotificationNumber;
}else{
    document.getElementById("number").textContent="";
}

/*Function for creating Data Array for data table*/
$(function(){ 
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
    
     
    
/*Function for assigning data array into data table*/
    function dataTableManipulate(){
        table =  $("#workLocation-table").DataTable({
            data: mainArray,
            "columnDefs": [{
                "targets": -1,
                "width": "10%",
                "data": null,
                "defaultContent": '<div class="edit-wrapper"><span class="icn"><i class="fa fa-pencil-square-o" aria-hidden="true" id="edit"></i><i class="fa fa-trash-o" aria-hidden="true" id="delete"></i></span></div>'
            }]
        });
        
/*Add a plus symbol in webpage for add new groups*/
        var item = $('<span>+</span>');
        item.click(function() {
            window.location ='/' + companyTeamName + '/worklocation/add';
        });
        
        $('.table-wrapper .dataTables_filter').append(item);
    }
/*---------------------------Initial data table calling---------------------------------------------------*/
    var tempArry = [];
    if(vm.Values != null) {
        for( i=0;i<vm.Values.length;i++){
            for( j=0;j<vm.Users.length;j++){
                for(k=0;k<vm.Users[j].length;k++){
                    console.log("vm.Users[j][k].Name",vm.Users[j][k].Name);
                    if(vm.Values[i][1] == vm.Users[j][k].UserKey){
                        if(vm.Users[j][k].Name != null){
                            
                            console.log("kkk",vm.Values[j][0])
                            vm.Values[i][0] = vm.Values[j][0];
                        }
                        tempArry.push(vm.Users[j][k].Name);
                    }
                }
            }
            console.log("tempArry");
            vm.Values[i][1] = tempArry;
            tempArry = [];
        }
        createDataArray(vm.Values, vm.Keys);
    }
    dataTableManipulate(); 
 /*--------------------------Ending Initial data table calling---------------------------------------------*/


    /*Edit customer details when click on edit icon*/
    $('#workLocation-table tbody').on( 'click', '#edit', function () {
        var data = table.row( $(this).parents('tr') ).data();
        console.log("data",data)
        var workLocationId = data[2];
        window.location = '/' + companyTeamName +'/worklocation/'+ workLocationId + '/edit';
        return false;
    });
    
    $('#workLocation-table tbody').on( 'click', '#delete', function () {
         $("#myGroupModal").modal();
        var data = table.row( $(this).parents('tr') ).data();
        console.log("full data",data);
        console.log("data id",data[2]);
        var workLocationId = data[2];
        $("#confirm").click(function(){
            $.ajax({
                type: "POST",
                url: '/' + companyTeamName +'/worklocation/'+ workLocationId + '/delete',
                data:'',
                success: function(response){
                    if(response=="true"){
                        $('#workLocation-table').dataTable().fnDestroy();
                        var index = "";
                        
                        for(var i = 0; i < mainArray.length; i++) {
                           index = mainArray[i].indexOf(workLocationId);
                           if(index != -1) {
                               console.log("dddd", i);
                             break;
                           }
                        }
                        mainArray.splice(i, 1);
                        dataTableManipulate() 
                    }
                    else {
                        console.log("Removing Failed!");
                    }
                }

            });
        });
    });
});

