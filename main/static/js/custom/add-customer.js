/*Created By Farsana*/
//Below line is for adding active class to layout side menu..
document.getElementById("crm").className += " active";

$().ready(function() {
    if(vm.PageType == "edit"){        
            document.getElementById("customername").value = vm.CustomerName;
            document.getElementById("contactperson").value = vm.ContactPerson;
            document.getElementById("email").value = vm.Email;
            document.getElementById("phone").value = vm.Phone;
            document.getElementById("address").value = vm.Address;
            document.getElementById("state").value = vm.State;
            document.getElementById("zipcode").value = vm.ZipCode;
            document.getElementById("customerEdit").innerHTML = "Edit Customer"
    }
	$("#addcustomerForm").validate({
	  rules: {
          customername:{
              required:"required",
              remote:{
                  url: "/iscustomernameused/" + customername,
                  type: "post"
              }
              
          },
          contactperson:"required",
          email:{
              required:true,
              email:true
          },
          phone:{
              required: true,
              minlength:10,
              maxlength:10
          },
          address:"required",
          state: "required",
          zipcode: "required"
      },
        messages: {
            customername:{
                required: "Please enter Customer Name ",
                remote: "The Customer Name is already in use !"
                },
            contactperson:"Please enter Contact Person",
            phone: {
                required:"Please enter Phone Number",
                minlength:"Enter 10 digit"
            },
            address:"Please enter your Address",
            state: "Please enter your State",
            zipcode:"Please enter Zipcode  ",
            email:"Please enter your Email id"
    },
        submitHandler: function(){//to pass all data of a form serial
            if (vm.PageType == "edit"){
                var formData = $("#addcustomerForm").serialize();
                var customerId = vm.CustomerId;
                $.ajax({
                    url:'/customer/'+ customerId + '/edit',
                    type:'post',
                    datatype: 'json',
                    data: formData,
                    //call back or get response here
                    success : function(response){
                        if(response == "true"){
                            window.location='/customer';
                        }else {
                        }
                    },
                    error: function (request,status, error) {
                    }
                });
            } else {
                var formData = $("#addcustomerForm").serialize();
                $.ajax({
                    url:'/customer/add',
                    type:'post',
                    datatype: 'json',
                    data: formData,
                    //call back or get response here
                    success : function(response){
                        if(response == "true"){
                            window.location='/customer';
                        }else {
                        }
                    },
                    error: function (request,status, error) {
                    }
                });
            }
            return false;
        }
    });
    
    $("#cancel").click(function() {
            window.location = '/customer';
    });
});