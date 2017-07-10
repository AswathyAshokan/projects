
document.getElementById("consent").className += "active";
var companyTeamName = vm.CompanyTeamName;
$().ready(function() {
    if(vm.PageType == "edit"){ 
        console.log("instructions",vm.InstructionArrayToEdit[0]);
        var selectArray = vm.SelectedUsersKey;
        document.getElementById("recieptName").value = vm.ReceiptName;
        document.getElementById("addConsentValue").value = vm.InstructionArrayToEdit[0];
        document.getElementById("consentHead").innerHTML = "Edit Consent Receipt";//for display heading of each webpage
        $("#selectedUserIds").val(selectArray);
        var dynamicTextBox= "";
        for (var i = 1; i < vm.InstructionArrayToEdit.length; i++) {
            dynamicTextBox+= '<div class="plus"><input class="form-control"  name = "DynamicTextBox"  id=  "DynamicTextBox"  type="text" value = "' + vm.InstructionArrayToEdit[i] + '" />&nbsp;'+'<button  id="exposureDelete"  class="delete-decl">+</button>';
        }
        $("#TextBoxContainer").prepend(dynamicTextBox);
    }
    $("#btnAdd").on("click", function () {
        var div = $("<div class='plus'/>");
        div.html(GetDynamicTextBox(""));
        $("#TextBoxContainer").append(div);
    });
    $("body").on("click", ".delete-decl", function () {
        $(this).closest("div").remove();
    });
    
    function GetDynamicTextBox(value) {
    return ' <input class="form-control"  name = "DynamicTextBox"  id=  "DynamicTextBox"  type="text" value = "" />&nbsp;' +'<button id="btnAdd"class="delete-decl">+</button>'
    }
    
    $("#addConsentForm").validate({
        rules: {
            recieptName:"required",
            selectedUserIds:"required"
        },
        messages: {
            recieptName:"Please enter consent Reciept Name",
            selectedUserIds: "Please select Users"
        },
        submitHandler: function(){//to pass all data of a form serial
             $("#saveButton").attr('disabled', true);
            var formData = $("#addConsentForm").serialize();
            var selectedUsersNames = [];
            var instructionFromDynamicTextBox = [];
            
            //get the user's name corresponding to  keys selected from dropdownlist 
            $("#selectedUserIds option:selected").each(function () {
                var $this = $(this);
                if ($this.length) {
                    var selectedUsersName = $this.text();
                    selectedUsersNames.push(selectedUsersName);
                }
            });
            
            // Serialialize all the selected invite user name from dropdown list with form data
            for(i = 0; i < selectedUsersNames.length; i++) {
                formData = formData+"&selectedUserNames="+selectedUsersNames[i];
            }
            
            var ConsentValue = document.getElementById("addConsentValue").value;
            if(ConsentValue.length !=0){
                instructionFromDynamicTextBox.push(ConsentValue+"/@@");
                //instructionFromDynamicTextBox.push("&&");
            }
            $("input[name=DynamicTextBox]").each(function () {
                 if($(this).val().length !=0){
                     instructionFromDynamicTextBox.push($(this).val()+"/@@")
                     // instructionFromDynamicTextBox.push("&&");
                     
                 }
            });
            console.log("instructionFromDynamicTextBox",instructionFromDynamicTextBox)
            formData = formData+"&instructionsForUser="+instructionFromDynamicTextBox;
            var ConsentId = vm.ConsentId;
            if (vm.PageType == "edit"){
                $.ajax({
                    url:'/' + companyTeamName +'/consent/'+ ConsentId  +'/edit',
                    type:'post',
                    datatype: 'json',
                    data: formData,
                    //call back or get response here
                    success : function(response){
                        if(response == "true"){
                            window.location='/' + companyTeamName +'/consent';
                        }else {
                             $("#saveButton").attr('disabled', false);
                        }
                    },
                    error: function (request,status, error) {
                    }
                });
            
            } else {
                $.ajax({
                
                    url:'/' + companyTeamName +'/consent/add',
                    type:'post',
                    datatype: 'json',
                    data: formData,
                    //call back or get response here
                    success : function(response){
                        if(response == "true"){
                            window.location='/' + companyTeamName +'/consent';
                        }else {
                        }
                    },
                    error: function (request,status, error) {
                    }
                });
                return false;
            }
        }
    });
    
    $("#cancel").click(function() {
            window.location = '/' + companyTeamName +'/consent';
    });
});
































