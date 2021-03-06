var companyTeamName = vm.CompanyTeamName;
var thumbnail = "";
var file ="";
var img ="";
var unixDateTime ="";
var thumbUrl = ""; 
var profileUrl = "";
var tempProfilePicture ="";
var tempThumbPicture ="";
var pictureUploded ="";

var originalUploaded=false;
var thumbUploaded=false;
var fileUploaded ="";
console.log("profile picture",vm.ProfilePicture);


//function for displaying image
function displayImage() {
    fileUploaded=true;
    file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();
    reader.onloadend = function () {
        document.getElementById('imageUploads').style.backgroundImage = "url(" + reader.result + ")"; 
       
    }
    console.log("newww",document.getElementById("imageUpload").src);
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
    var btntxt = $("#edit-txt").text();
    if (btntxt == 'Edit') {
        $(".edit-account input").prop( "disabled", false );
        $(".edit-account input").toggleClass("dis-txt");
        $('#edit-txt').text("Save");
        $('#edit-txt').attr('type', 'submit');
        return false;
    }
}

//uploading image

function resizeImg() {
    console.log("inside");
    img  = document.querySelector('input[type=file]').files[0];
    img.height = 100;
    img.width = 100;
}
$().ready(function() {
    if (vm.ProfilePicture.length !=0){
        document.getElementById('imageUploads').style.backgroundImage = "url(" + vm.ProfilePicture + ")"; 
    }
    var x = document.getElementById("imageUpload");
    x.style.display = "none";
//    if(document.getElementById("fileButton").value == "") {
//        console.log("not clickeddddd");
//        originalUploaded=true;
//        thumbUploaded=true;
//    }
    document.getElementById("name").value = vm.FirstName;
    document.getElementById("emailId").value = vm.Email;
    document.getElementById("phoneNumber").value = vm.PhoneNo;
    
    
    
    //to check the plan and load modal according to plan
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
    //function for editing form
   $('#edit-txt').on('click', function() {
       var btntxt = $("#edit-txt").text();
       var x = document.getElementById("imageUpload");
       x.style.display = "block"
        if (btntxt == 'Edit') {
            $(".edit-account input").prop( "disabled", false );
            $(".edit-account input").toggleClass("dis-txt");	
            $('#edit-txt').text("Save");
            $('#edit-txt').attr('type', 'submit');
            document.getElementById("name").removeAttribute('readonly');
            document.getElementById("emailId").removeAttribute('readonly');
            document.getElementById("phoneNumber").removeAttribute('readonly');
            return false;
        }
        $("#adminAccountDetail").validate({
            rules: {
                name:"required",
                emailId:{
                    required:true,
                    email:true
                },
                phoneNumber: "required"
            },
            messages: {
                name:"Please enter your Name ",
                emailId: "Please enter Email Id ",
                phoneNumber:"Please enter Phone Number"
            },
            
            submitHandler: function(){//to pass all data of a form serial
               
                $("#edit-txt").attr('disabled', true);
                if (fileUploaded.length !=0){
                var now = new Date();
                var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate(); 
                datetime += ' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
                unixDateTime = Date.parse(datetime)/1000;
                var tempProfilePicture = file.name.replace(/\s/g, '');
                
                
                var uploadTaskOriginal = firebase.storage().ref().child('profilePicturesOfAdmin/original/'+unixDateTime+tempProfilePicture).put(img);
                uploadTaskOriginal.on('state_changed', function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log('Upload is ' + progress + '% done');
                }, function(error) {
                      // Handle unsuccessful uploads
                }, function() {
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    var downloadURL = uploadTaskOriginal.snapshot.downloadURL;
                    profileUrl=downloadURL;
                    originalUploaded=true;
                });
                var uploadTaskThumb = firebase.storage().ref().child('profilePicturesOfAdmin/thumbnail/'+unixDateTime+tempThumbPicture).put(img);
                    uploadTaskThumb.on('state_changed', function(snapshot){
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    }, function(error) {
                          // Handle unsuccessful uploads
                    }, function() {
                        var downloadURL1 = uploadTaskThumb.snapshot.downloadURL;
                        thumbUrl=downloadURL1;
                        thumbUploaded=true;
                    });
                }else{
                    originalUploaded=true;
                    thumbUploaded=true;
                }
                
                var editProfile=  setInterval(function(){
                    console.log("originalUploaded",originalUploaded)
                   console.log("thumbUploaded",thumbUploaded)
                   if(originalUploaded && thumbUploaded ){
                       var formData = $("#adminAccountDetail").serialize()+ "&profilePicture=" + profileUrl+"&profilePicturePath=" + file+"&thumbPicture=" + thumbUrl;
                       console.log("thumb",thumbUrl);
                       console.log("profile",profileUrl);
                       $.ajax({
                           url:'/'+ companyTeamName + '/editProfile',
                           type:'post',
                           datatype: 'json',
                           data: formData,
                           success : function(response){
                               if(response == "true"){
                                   window.location =  '/'+companyTeamName+'/dashBoard';
                               } else {
                                   $('#edit-txt').text("Edit");
                               }
                           },
                           error: function (request,status, error) {
                           }
                       });
                       clearInterval(editProfile);
                   }
                },3000);
            }
        });
   });

    //function to change password
    
     $('#updateAdminPassword').on('click', function() {
        $("#adminPasswordChangeModal").validate({
            rules: {
                newPassword:{
                            required: true,
                            minlength: 8,
                        },
                confirmpassword:{
                    equalTo : "#newPassword"
                } ,
                oldPassword: {
                required: true,
                remote:{
                    url: '/'+ companyTeamName +"/isOldAdminPasswordCorrect/" + oldPassword,
                    type: "post"
                }
            },
            },
            messages: {
                 oldPassword:{
                     required: "Please enter Old Password ",
                     remote: "The password entered is not correct !!!"
                 },
                newPassword:{
                            required: "Please enter New Password!",
                            minlength: "Password atleast have 8 characters!"
                        },
                confirmpassword:"Retype password is incorrect"
            },
            submitHandler: function(){//to pass all data of a form serial
                 $("#updateAdminPassword").attr('disabled', true);
                var formData = $("#adminPasswordChangeModal").serialize();
                $.ajax({
                    url:'/'+ companyTeamName +'/changePassword',
                    type:'post',
                    datatype: 'json',
                    data: formData,
                    success : function(response){
                        if(response == "true"){
                            window.location =  '/login';
                        } else {
                            alert("password incorrect");
                        }
                    },
                    error: function (request,status, error) {
                    }
                });
                return false;
            }
        });
    });
});
