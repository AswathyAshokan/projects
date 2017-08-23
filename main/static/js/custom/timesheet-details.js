
/* Author :Aswathy Ashok */
//Below line is for adding active class to layout side menu..
//add contact.js


 console.log(vm);
$(function(){ 
    //checking plans
    
    if(vm.CompanyPlan == 'family' ){
        var parent = document.getElementById("menuItems");
        var contact = document.getElementById("contact");
        var job = document.getElementById("job");
        var crm = document.getElementById("crm");
        var leave = document.getElementById("leave");
        var timesheet  = document.getElementById("time-sheet");
        var consent = document.getElementById("consent")
        parent.removeChild(timesheet);
        parent.removeChild(consent);
        parent.removeChild(leave);
        parent.removeChild(contact);
        parent.removeChild(job);
        parent.removeChild(crm);
        
    } else if(vm.CompanyPlan == 'campus'){
            var parent = document.getElementById("menuItems");
            var contact = document.getElementById("contact");
            var job = document.getElementById("job");
            var crm = document.getElementById("crm");
            var leave = document.getElementById("leave");
            var timesheet  = document.getElementById("time-sheet");
            var consent = document.getElementById("consent")
            parent.removeChild(timesheet);
            parent.removeChild(consent);
            parent.removeChild(leave);
            parent.removeChild(contact);
            parent.removeChild(job);
            parent.removeChild(crm);
     }
    document.getElementById("username").textContent=vm.AdminFirstName;
    document.getElementById("imageId").src=vm.ProfilePicture;
    if (vm.ProfilePicture ==""){
        document.getElementById("imageId").src="/static/images/default.png"
    }
    if(vm.CompanyPlan == "family")
    {
        $('#planChange').attr('data-target','#family');
    } else if (vm.CompanyPlan == "campus") {
        $('#planChange').attr('data-target','#campus');
    }else if (vm.CompanyPlan == "business") {
        $('#planChange').attr('data-target','#business');
    }else if (vm.CompanyPlan == "businessPlus") {
        $('#planChange').attr('data-target','#business-plus');
    }
    var timeSlice =[];
//    var mainArray = [];   
//    var table = "";
//    var unixFromDate = 0;
//    var unixToDate = 0;
//    var mainArray = [];   
//    var table = "";
//    var selectedToDate;
//    var actualToDate;
//    var selectFromDate;
//    var actualFromDate;
//    var completeTable =[];
//    var lattitude;
//    var longitude;
//    var Values =[][];
//    function createDataArray(values, keys){
//        console.log("inside create");
//        var subArray = [];
//        for(i = 0; i < values.length; i++) {
//            for(var propertyName in values[i]) {
//                subArray.push(values[i][propertyName]);
//            }
//            subArray.push(keys[i])
//            mainArray.push(subArray);
//            subArray = [];
//            
//        }
//    }
//    completeTable = mainArray;
//    $('#refreshButton').click(function(e) {
//        $('#log-details').dataTable().fnDestroy();
//        $('#fromDate').datepicker('setDate', null);
//        $('#toDate').datepicker('setDate', null);
//        dataTableManipulate(completeTable);
//     });
//    function listLogDetails(unixFromDate,unixToDate){
//        var tempArray = [];
//        var startDate =0;
//        var unixStartDate = 0;
//        for (i =0;i<vm.Values.length;i++){
//            startDate = new Date(vm.Values[i][6]);
//            unixStartDate = Date.parse(startDate)/1000;
//           if( (unixFromDate <= unixStartDate && unixStartDate <= unixToDate) || (unixFromDate <= unixStartDate && unixStartDate <= unixToDate) || (unixFromDate >= startDate && unixStartDate >= unixToDate)) {
//               
//                tempArray.push(mainArray[i]);
//           }
//            $('#timeSheet_details').dataTable().fnDestroy();
//            dataTableManipulate(tempArray);
//        }
//    } 
//    function dataTableManipulate(mainArray){
//        table =  $("#timeSheet_details").DataTable({
//            data: mainArray,
//            "searching": true,
//            "info": false,
//            "lengthChange":false,
//           "columnDefs": [{
//               
//           }]
//        });
//        $('#tbl_details_length').after($('.datepic-top'));
//        
//    }
//     if(vm.Values != null) {
//        for( i=0;i<vm.Values.length;i++){
//            var utcTime = vm.Values[i][3];
//            var utcInDateForm = new Date(utcTime);
//            console.log("utcInDateForm",utcInDateForm);
//            var localTime = (utcInDateForm.toLocaleTimeString());
//            var localDate = (utcInDateForm.toLocaleDateString());
//            var timeSplitArray = localTime.split(":");
//            var hours = timeSplitArray[0];
//            var minutes = timeSplitArray[1];
//            var duration = vm.Values[i][2];
//            var durationSplitArray = duration.split(":");
//            var duartionHours = durationSplitArray[0];
//            var durationMinutes = durationSplitArray[1];
//            var localTimeInMinutes = parseFloat(hours)*60 + parseFloat(minutes);
//            if (localTimeInMinutes>durationMinutes){
//                var loggedTime = localTimeInMinutes - durationMinutes
//                var loggedHours = window.parseInt(loggedTime/60);
//                var loggedMins = loggedTime%60;
//            }
//            var actualloggedTime =loggedHours +   ":" +loggedMins
//            var between = actualloggedTime + " &nbspto&nbsp" +hours +    ":"    +minutes;
//            vm.Values[i][2]= localDate;
//            vm.Values[i][3] = hours +    ":"    +minutes;
//            lattitude = vm.Values[i][4];
//            longitude= vm.Values[i][5];
//            
//        }
//         createDataArray(vm.Values, vm.Keys);
//    }
    if (vm.TaskDetails != null){
        for(i=0;i<vm.TaskDetails.length;i++){
            var userName =vm.TaskDetails[i][5];
            var taskName =vm.TaskDetails[i][2];
            console.log("username",taskName);
            timeSlice.push(userName);
            timeSlice.push(taskName);
            var taskStartDate =vm.TaskDetails[i][0];
            var taskEndDate =vm.TaskDetails[i][1];
            
            
        }
    }
    
    
    
//    dataTableManipulate(mainArray);   
//     $('#fromDate').change(function () {
//        selectFromDate = $('#fromDate').val();
//        var fromYear = selectFromDate.substring(6, 10);
//        var fromDay = selectFromDate.substring(3, 5);
//        var fromMonth = selectFromDate.substring(0, 2);
//        $('#toDate').datepicker("option", "minDate", new Date(fromYear, fromMonth-1, fromDay));
//        actualFromDate = new Date(selectFromDate);
//        actualFromDate.setHours(0);
//        actualFromDate.setMinutes(0);
//        actualFromDate.setSeconds(0);
//        unixFromDate = Date.parse(actualFromDate)/1000;
//        listLogDetails(unixFromDate,unixToDate);
//    });
//    
//    $('#toDate').change(function () {
//        selectedToDate = $('#toDate').val();
//        var year = selectedToDate.substring(6, 10);
//        var day = selectedToDate.substring(3, 5);
//        var month = selectedToDate.substring(0, 2);
//        $('#fromDate').datepicker("option", "maxDate", new Date(year, month-1, day));
//        actualToDate = new Date(selectedToDate);
//        actualToDate.setHours(23);
//        actualToDate.setMinutes(59);
//        actualToDate.setSeconds(59);
//        unixToDate = Date.parse(actualToDate)/1000;
//        listLogDetails(unixFromDate,unixToDate);
//    });
//    
});