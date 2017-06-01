document.getElementById("consent").className += " active";

var companyTeamName = vm.CompanyTeamName;
console.log(vm);
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
    
/*Function for assigning data array into data table*/
    function dataTableManipulate(){
        table =  $("#consent-details").DataTable({
            data: mainArray,
            "columnDefs": [
                
                { className: "details-control" , "targets": [ 0 ] },
                {
                    "order": [[1, 'asc']]
                },
                {
                "targets": -1,
                "width": "10%",
                "data": null,
                "defaultContent": '<div class="edit-wrapper"><span class="icn"><i class="fa fa-pencil-square-o" aria-hidden="true" id="edit"></i><i class="fa fa-trash-o" aria-hidden="true" id="delete"></i></span></div>'
            }]
           
        });
        $('#consent-details tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if ( row.child.isShown()){
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                row.child( format(vm.InnerContent,row.data())).show();
                tr.addClass('shown');
            }
        });
        
        //function to display data inside expanded area
        function format ( InnerContent,data) {
            var userId  = data[2];
            var result  ='<div class="pull-left dropdown-tbl" style="padding-right: 50px;">';
             result += "<table cellpadding='5' cellspacing='0'  style='padding-left:50px; border: 1px solid #dddddd !important;'>";
            result += '<th>Instructions</th>';
            result += '<th>Accepted Users</th>';
            result += '<th>Rejected Users</th>';
            result += "<tr>";
            for (var i=0; i<InnerContent.length;i++){
                for (var j=0; j<InnerContent[i].length ;j++){
                    if(InnerContent[i][j].UserKey ==userId){
                        for(var k=0;k<InnerContent[i][j].InstructionArray.length;k++){
                            result += "<td>"+InnerContent[i][j].InstructionArray[k]+"</td>";
                            result += "<td>"+InnerContent[i][j].AcceptedUsers+"</td>"; 
                            result += "<td>"+InnerContent[i][j].RejectedUsers+"</td>";
                            result += "</tr>";
                        }
                       
                    }
                }
            }
            result += "</table>";
            result +="</div>";
             return result;
        }
        
/*Add a plus symbol in webpage for add new groups*/
        var item = $('<span>+</span>');
        item.click(function() {
            window.location ="/" + companyTeamName + "/consent/add";
        });
        
        $('.table-wrapper .dataTables_filter').append(item);
    }
    /*---------------------------Initial data table calling---------------------------------------------------*/

    if(vm.Values != null) {
        createDataArray(vm.Values, vm.Keys);
    }
    dataTableManipulate(); 
    
    $('#consent-details tbody').on( 'click', '#edit', function () {
        var data = table.row( $(this).parents('tr') ).data();
        var consentId = data[2];
        window.location = "/" + companyTeamName + "/consent/"+consentId+"/edit";
        return false;
    });
    
     $('#consent-details tbody').on( 'click', '#delete', function () {
        $("#myModal").modal();
        var data = table.row( $(this).parents('tr') ).data();
        var  consentId = data[2];
        console.log(data, consentId);
        $("#confirm").click(function(){
            console.log("cp1");
            $.ajax({
                type: "POST",
                url: '/' + companyTeamName +'/consent/'+ consentId + '/delete',
                data: '',
                success: function(data){
                    if(data=="true"){
                        $('#consent-details').dataTable().fnDestroy();
                        var index = "";
                        for(var i = 0; i < mainArray.length; i++) {
                            index = mainArray[i].indexOf(consentId);
                            if(index != -1) {
                                console.log("dddd", i);
                                break;
                            }
                        }
                        mainArray.splice(i, 1);
                        console.log(mainArray);
                        dataTableManipulate(); 
                    }
                    else {
                        console.log("Removing Failed!");
                    }
                }
            });
        });
    });
    
});