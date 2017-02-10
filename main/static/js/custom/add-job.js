/* Author :Aswathy Ashok */

$().ready(function() {
    
    var pageType = array.PageType;
    
    if(pageType ==    "edit") {
        console.log(array);
            $("#customerName").val(array.CustomerName);
            //document.getElementById("customerName").value = array.CustomerName;
            document.getElementById("jobName").value = array.JobName;
            document.getElementById("jobNumber").value = array.JobNumber;
            document.getElementById("numberOfTask").value = array.NumberOfTask;
            
           
    } 
   

    $("#jobForm").validate({
                rules: {
                    numberOfTask:"required",
                    jobName: {
                        required: true,
                       
                    },
		            jobNumber: {
                        required: true
                    }
                    
                },
           
                messages: {
                    jobName: "Please enter your name",

                    emailAddress: "Please enter a valid email address",
                    jobName: {
                        required: "Please provide a job name",
                        
                    },
		            jobNumber:{
			            required:"please provide a job number"
			        },

                },
	            submitHandler: function() {
                    
                    var form_data = $("#jobForm").serialize();
                    alert(array.JobId)
                    var jobId = array.JobId;
                    if (pageType == "edit") {
                        
                        $.ajax({
                            url: '/job/'+ jobId +'/edit',
                            type: 'post',
                            datatype: 'html',
                            data: form_data,
                            success : function(response) {
                                console.log(response);
                                if (response == "true") {
                                    window.location = '/job';
                                } else {

                               	}
                            },
                            error: function (request,status, error) {
                                console.log(error);
                            }
                            
		               });
                        
                    } else {
                
                        $.ajax({
                                
                            url: '/job/add',
                            type: 'post',
                            datatype: 'json',
                            data: form_data,
                            success : function(response) {
                                if (response =="true") {
                                    window.location = '/job';
                               			} else {

                                }

		                   },
                            error: function (request,status, error) {
       					            console.log(error);
    				          }
		               });
                    }
                }
         });
 });