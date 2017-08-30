
$(function(){
    var unixFromDate = 0;
    var unixToDate = 0;
    var mainArray = [];   
    var table = "";
    var selectedToDate;
    var actualToDate;
    var selectFromDate;
    var actualFromDate;
    var completeTable =[];
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
    completeTable = mainArray;
    $('#refreshButton').click(function(e) {
        $('#shareddocument-table').dataTable().fnDestroy();
        $('#fromDate').datepicker('setDate', null);
        $('#toDate').datepicker('setDate', null);
        dataTableManipulate(completeTable);
     });
    function listSharedDocumentByDate(unixFromDate,unixToDate){
        var tempArray = [];
        var expiryDate =0;
        var unixExpiryDate = 0;
        for (i =0;i<vm.Values.length;i++){
            expiryDate = new Date(vm.Values[i][1]);
            unixExpiryDate = Date.parse(expiryDate)/1000;
            if(unixFromDate <= unixExpiryDate && unixToDate == 0){
                tempArray.push(mainArray[i]);
            
            } else if(unixFromDate ==0 && unixToDate >=unixExpiryDate){
                tempArray.push(mainArray[i]);
            
            }else if(unixFromDate <= unixExpiryDate && unixToDate >=unixExpiryDate ){
                tempArray.push(mainArray[i]);
            
            }
            $('#shareddocument-table').dataTable().fnDestroy();
            dataTableManipulate(tempArray);
        }
    }

    function dataTableManipulate(dataArray){
       table =  $("#shareddocument-table").DataTable({
           data: dataArray,
           "columnDefs": [{
               "targets": -1,
               "width": "3%",
               "data": null,
               "defaultContent": '<span class="dwnl-btn"><i class="fa fa-download fa-lg" aria-hidden="true" id="view"></i></span>'
           }],
           "searching": false,
           "paging": true,
           "info": false,
           "lengthChange":false
       });
       $('#tbl_details_length').after($('.datepic-top'));
   }

/*----------------------------------Initialize Datatable--------------------------------------------------*/
    if(vm.Values != null) {
        createDataArray(vm.Values, vm.Keys);
    }
    dataTableManipulate(mainArray);

/*--------------------------------Download-------------------------------------------------------------*/

    $('#shareddocument-table tbody').on( 'click', '#view', function () {
        var data = table.row( $(this).parents('tr') ).data();
        window.location =   data[3];
        return false;
    });
/*------------------------------------------------------------------------------------------------------*/

    $('#fromDate').change(function () {
        selectFromDate = $('#fromDate').val();
        var fromYear = selectFromDate.substring(6, 10);
        var fromDay = selectFromDate.substring(3, 5);
        var fromMonth = selectFromDate.substring(0, 2);
        $('#toDate').datepicker("option", "minDate", new Date(fromYear, fromMonth-1, fromDay));
        actualFromDate = new Date(selectedToDate);
        actualFromDate.setHours(0);
        actualFromDate.setMinutes(0);
        actualFromDate.setSeconds(0);
        unixFromDate = Date.parse(actualFromDate)/1000;
        listSharedDocumentByDate(unixFromDate,unixToDate);
    });
    
    $('#toDate').change(function () {
        selectedToDate = $('#toDate').val();
        var year = selectedToDate.substring(6, 10);
        var day = selectedToDate.substring(3, 5);
        var month = selectedToDate.substring(0, 2);
        $('#fromDate').datepicker("option", "maxDate", new Date(year, month-1, day));
        actualToDate = new Date(selectFromDate);
        actualToDate.setHours(23);
        actualToDate.setMinutes(59);
        actualToDate.setSeconds(59);
        unixToDate = Date.parse(actualToDate)/1000;
        listSharedDocumentByDate(unixFromDate,unixToDate);
    });
    
    
    
    console.log(vm);
$(document).ready(function() {
    
    //checking plans
    
    if(vm.CompanyPlan == 'family' ){
        var parent = document.getElementById("menuItems");
        var contact = document.getElementById("contact");
        var job = document.getElementById("job");
        var crm = document.getElementById("crm");
        var leave = document.getElementById("leave");
        var timesheet  = document.getElementById("time-sheet");
        var consent = document.getElementById("consent")
        var workLocation = document.getElementById("WorkLocation")
        parent.removeChild(workLocation)
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
            var consent = document.getElementById("consent");
            var workLocation = document.getElementById("workLocation");
            parent.removeChild(workLocation);
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
    
} );

    
    
});

