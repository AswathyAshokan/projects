/*Author: Sarath
Date:01/02/2017*/
$(function(){
   /* $("#register").click(function(){
        $.ajax({
            type    : 'POST',
            url     : '/register',
            data    : {
                'firstName'     : $("#firstName").val(),
                'lastName'      : $("#lastName").val(),
                'phoneNo'       : $("#phoneNo").val(),
                'emailId'       : $("#emailId").val(),
                'password'      : $("#password").val(),
                'companyName'   : $("#companyName").val(),
                'address'       : $("#address").val(),
                'state'         : $("#state").val(),
                'zipCode'       : $("#zipCode").val()
            },
            success : function(data){
                if(data=="true"){
                    window.location='';
                }
                else{

                }
            },
            error: function (request,status, error) {
           					            console.log(error);
            }

        });
        return false;
    });*/
    
    //Enabling Register button when if I Agree check box is chechked
    $("#agree").click(function() {
      $("#register").attr("disabled", !this.checked);
    });
    
    //Validate and Register Company Admin
    $("#companyRegisterForm").validate({
                    
                    rules: {
                        firstName :{
                            minlength: 3,
                            required: true,
                        },
                        lastName :{
                            required: true
                        },
                        emailId:{
                            required: true,
                            email: true,
                            remote:{
                                url: "/isEmailUsed/" + emailId,
                                type: "post"
                            }
                        },
                        password:{
                            required: true,
                            minlength: 8,
                        },
                        confirmPassword:{
                            required: true,
                            equalTo: "#password",
                        },
                        companyName:{
                            required: true,
                        },
                        teamName:{
                            required: true,
                            teamRegEx: true,
                        }
                    },
                    messages: {
                        firstName:{
                            required: "Please enter your First name!",
                            minlength: "First Name atleast have 3 characters!",
                        },
                        lastName:{
                            required: "Please enter your Last name!"
                        },
                        emailId:{
                            required: "Please enter your Email address!",
                            email: "Please enter a valid Email address!",
                            remote: "The Email you have entered is already in use!"
                        },
                        password:{
                            required: "Please enter a Password!",
                            minlength: "Password atleast have 8 characters!"
                        },
                        confirmPassword:{
                            required: "Please re-type your Password!",
                            equalTo: "Password doesnot match!",
                        },
                        companyName: "Please enter your Company Name!",
                        teamName:{
                            required: "Please enter your Passporte Team Name!",
                            teamRegEx: "Only lower case alphanumeric characters and '-' is allowed!",
                        },
                    },
    	            submitHandler: function() {
                        var formData = $("#companyRegisterForm").serialize();
    				    $.ajax({
                                type    : 'POST',
                                url     : '/register',
                                data    : formData,
                                success : function(data){
                                   
                                    if(data=="true"){
                                   
                                        window.location = '/login';
                                    }
                                    else{
                                            console.log("false");
                                    }
                                },
                                error: function (request,status, error) {
                                    console.log(error);
                                }

                        });
                    }
    });
    
    $.validator.addMethod("teamRegEx", function(value, element){
            return this.optional(element) || /^[a-z0-9\-]+$/.test(value);
        },
            "Team Name must contain only letters, numbers, dashes"
    );
    
});