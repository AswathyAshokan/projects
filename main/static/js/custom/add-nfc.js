/*Author: Sarath
Date:01/02/2017*/
//Below line is for adding active class to layout side menu..
document.getElementById("nfc").className += " active";
var companyTeamName = vm.CompanyTeamName
$(function(){
    var pageType = array.PageType;
    //Chech whether Pagtype is Add or Edit NFC Tag 
    if(pageType ==  "edit") {
        console.log(array);
            document.getElementById("customerName").value = array.CustomerName;
            document.getElementById("site").value = array.Site;
            document.getElementById("location").value = array.Location;
            document.getElementById("nfcNumber").value = array.NFCNumber;
            } 
    //Add new NFC Tag and perform Validation
    $("#addNfcForm").validate({
                    
                    rules: {
                        customerName : "required",
                        nfcNumber: "required",
                        location: "required"
                    },
                    messages: {
                        customerName: "Please enter a Customer Name",
                        nfcNumber: "Please enter a valid NFC Number",
                        location: "Please enter a Location"
                    },
    	            submitHandler: function() {
                         $("#save").attr('disabled', true);
                        var form_data = $("#addNfcForm").serialize();
                        //alert(form_data);
                        var nfcId = array.NfcId;
                        if (pageType == "edit") {
                            $.ajax({
                                url: '/'+ companyTeamName +'/nfc/'+ nfcId +'/edit',
                                type: 'post',
                                datatype: 'json',
                                data: form_data,
                                success : function(response) {
                                    console.log(response);
                                    if (response == "true") {
                                        window.location = '/'+companyTeamName+'/nfc';
                                    } else {
                                        $("#save").attr('disabled', false);
                                    }
                                },
                                error: function (request,status, error) {
                                    console.log(error);
                                }

                           });

                        } else {
                            $.ajax({
                                    type : 'POST',
                                    url  : '/'+companyTeamName+'/nfc/add',
                                    data : form_data,
                                    success : function(data){
                                                    if(data=="true"){
                                                        window.location ='/'+companyTeamName+'/nfc';
                                                    }
                                                    else{
                                                    }
                                    },
                                    error: function (request,status, error) {
                                            console.log(error);
                                    }
                            });
                    }
                }
    });

    $("#cancel").click(function() {
            window.location = '/'+companyTeamName+'/nfc';
    });

});