
/* Author :Aswathy Ashok */
//Below line is for adding active class to layout side menu..
//document.getElementById("log").className += " active";
console.log(vm.Values[0][3]);
$(function(){ 
    var mainArray = [];   
    var table = "";
    var unixFromDate = 0;
    var unixToDate = 0;
    var mainArray = [];   
    var table = "";
    var selectedToDate;
    var actualToDate;
    var selectFromDate;
    var actualFromDate;
    var completeTable =[];
    /*var dat = new Date(vm.Values[0][3]);
    var localTime = (dat.toLocaleTimeString())
     console.log("values",localTime);
    function createDataArray(values, keys){
        console.log("inside create");*/
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
    completeTable = mainArray;
    $('#refreshButton').click(function(e) {
        $('#log-details').dataTable().fnDestroy();
        $('#fromDate').datepicker('setDate', null);
        $('#toDate').datepicker('setDate', null);
        dataTableManipulate(completeTable);
     });
    function listLogDetails(unixFromDate,unixToDate){
        var tempArray = [];
        var startDate =0;
        var unixStartDate = 0;
        for (i =0;i<vm.Values.length;i++){
            startDate = new Date(vm.Values[i][5]);
            unixStartDate = Date.parse(startDate)/1000;
           if( (unixFromDate <= unixStartDate && unixStartDate <= unixToDate) || (unixFromDate <= unixStartDate && unixStartDate <= unixToDate) || (unixFromDate >= startDate && unixStartDate >= unixToDate)) {
               
                tempArray.push(mainArray[i]);
           }
            
            $('#log-details').dataTable().fnDestroy();
            dataTableManipulate(tempArray);
        }
    } 
    
    
    function dataTableManipulate(mainArray){
        table =  $("#log-details").DataTable({
            data: mainArray,
            "searching": false,
            "info": false,
            "lengthChange":false
        });
        $('#tbl_details_length').after($('.datepic-top'));
        
    }
    if(vm.Values != null) {
        console.log("inside if");
        createDataArray(vm.Values, vm.Keys);
    }
    dataTableManipulate(mainArray);   
    
    
    
    $('#fromDate').change(function () {
        selectFromDate = $('#fromDate').val();
        var fromYear = selectFromDate.substring(6, 10);
        var fromDay = selectFromDate.substring(3, 5);
        var fromMonth = selectFromDate.substring(0, 2);
        $('#toDate').datepicker("option", "minDate", new Date(fromYear, fromMonth-1, fromDay));
        actualFromDate = new Date(selectFromDate);
        actualFromDate.setHours(0);
        actualFromDate.setMinutes(0);
        actualFromDate.setSeconds(0);
        unixFromDate = Date.parse(actualFromDate)/1000;
        listLogDetails(unixFromDate,unixToDate);
    });
    
    $('#toDate').change(function () {
        selectedToDate = $('#toDate').val();
        var year = selectedToDate.substring(6, 10);
        var day = selectedToDate.substring(3, 5);
        var month = selectedToDate.substring(0, 2);
        $('#fromDate').datepicker("option", "maxDate", new Date(year, month-1, day));
        actualToDate = new Date(selectedToDate);
        actualToDate.setHours(23);
        actualToDate.setMinutes(59);
        actualToDate.setSeconds(59);
        unixToDate = Date.parse(actualToDate)/1000;
        listLogDetails(unixFromDate,unixToDate);
    });
    
    
    
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
    


    
});


