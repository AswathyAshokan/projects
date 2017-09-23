console.log("company name",vm);
  $(document).ready(function(){
    
    //for notification
    var PersentageOfStartedUser;
    var PersentageOfCompletedUsers;
    var persentageOfPendingUsers;
    var persentageOfStartedUserOnly;
    var tempStart;
    var returnString;
    var DynamicNotification ="";
    var TotalNoUsers;
    var today;
    var allData = [[]];

      function LoadBarChart(total,start,pending,complete,todayVal){
           document.getElementById('today').innerHTML = todayVal;
          $.jqplot.config.enablePlugins = true;

          var s1 = [total, start, pending, complete];
            var ticks = ['total', 'started', 'pending','completed' ];
            plot1 = $.jqplot('chart1', [s1], {
                // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
                animate: !$.jqplot.use_excanvas,
                seriesDefaults:{
                    renderer:$.jqplot.BarRenderer,
                    rendererOptions: {barMargin: 0 , varyBarColor : true},
                    pointLabels: { show: true }
                },
                title:{text:"Task Status and Users"},
                grid: {
                    background: 'transparent',      // CSS color spec for background color of grid.
                    drawBorder:false,
                    drawGridlines:false,
                    shadow:false
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks,
                        tickOptions : {
                                          //  showGridline : false
                        }
                    },
                    yaxis: {
                        tickOptions : {
                            //  showGridline : false
                        },
                        //  label:'Status',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    }
                },
                seriesColors: [ "#000", "#ccc", "red","green"],
                highlighter: { show: false }
            });
            $('#chart1').bind('jqplotDataClick',
                        function (ev, seriesIndex, pointIndex, data) {$('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            });
      }


    if (vm.NotificationNumber !=0){
        document.getElementById("number").textContent=vm.NotificationNumber;
    }else{
        document.getElementById("number").textContent="";
    }
    

      var companyTeamName =vm.CompanyTeamName
    if(vm.CompanyPlan == 'family' ){
        var parent = document.getElementById("menuItems");
        var contact = document.getElementById("contact");
        var job = document.getElementById("job");
        var crm = document.getElementById("crm");
        var leave = document.getElementById("leave");
        var time  = document.getElementById("time-sheet");
        var consent = document.getElementById("consent");
         var workLocation = document.getElementById("workLocation")
         parent.removeChild(workLocation);
        parent.removeChild(time);
        parent.removeChild(consent);
        parent.removeChild(leave);
        parent.removeChild(contact);
        parent.removeChild(job);
        parent.removeChild(crm);
    } else if(vm.CompanyPlan == 'campus'){
            var campusParent = document.getElementById("menuItems");
            var contact = document.getElementById("contact");
            var job = document.getElementById("job");
            var crm = document.getElementById("crm");
            var leave = document.getElementById("leave");
            var time  = document.getElementById("time-sheet");
            var consent = document.getElementById("consent")
            var workLocation = document.getElementById("workLocation")
            parent.removeChild(workLocation);
            campusParent.removeChild(time);
            campusParent.removeChild(consent);
            campusParent.removeChild(leave);
            campusParent.removeChild(contact);
            campusParent.removeChild(job);
            campusParent.removeChild(crm);
     }
    document.getElementById("username").textContent=vm.AdminFirstName;
    document.getElementById("imageId").src=vm.ProfilePicture;
    if (vm.ProfilePicture ==""){
        document.getElementById("imageId").src="/static/images/default.png"
    }
    if(vm.CompanyPlan == "family"){
        $('#planChange').attr('data-target','#family');
    } else if (vm.CompanyPlan == "campus") {
        $('#planChange').attr('data-target','#campus');
    }else if (vm.CompanyPlan == "business") {
        $('#planChange').attr('data-target','#business');
    }else if (vm.CompanyPlan == "businessPlus") {
        $('#planChange').attr('data-target','#business-plus');
    }
    if(vm.CompletedTask ==0 &&vm.PendingTask ==0){
        jQuery("#pie1").radialPieChart("init", {
            'font-size': 13,
            'fill': 25,
            "size": 150,
            'text-color': "transparent",
            'data': [
                {'color': "#363433", 'perc': 100}
            ]
        });
    }else {
        jQuery("#pie1").radialPieChart("init", {
            'font-size': 13,
            'fill': 25,
            "size": 150,
            'text-color': "transparent",
            'data': [
                {'color': "#29a0ff", 'perc': vm.CompletedTask},
                {'color': "#6abdff", 'perc': vm.PendingTask}
            ]
        });
    }
    if(vm.PendingUsers ==0 && vm.AcceptedUsers ==0 && vm.RejectedUsers ==0){
        jQuery("#pie2").radialPieChart("init", {
            'font-size': 13,
            'fill': 25,
            "size": 150,
            'text-color': "transparent",
            'data': [
                {'color': "#363433", 'perc': 100 }
                
            ]
        });
        
    }else {
        jQuery("#pie2").radialPieChart("init", {
            'font-size': 13,
            'fill': 25,
            "size": 150,
            'text-color': "transparent",
            'data': [
                {'color': "#5b93c2", 'perc': vm.PendingUsers },
                {'color': "#06599e", 'perc': vm.AcceptedUsers},
                {'color': "#8fb4d3", 'perc':vm.RejectedUsers}
            ]
        });
    }
      var subArray = [];
    myNotification= function () {
    window.onload = function () {
        CanvasJS.addColorSet("colors",
                             [
            "#857198"
        ]);
        var chart = new CanvasJS.Chart("chartContainer", {
            height: 435,
            backgroundColor: "transparent",
            colorSet: "colors",
            axisY:{
                title: "Status",
                titleFontSize: 14,
                lineThickness: 1,
                gridThickness: 0,
                labelFontSize: 14,
                },
                axisX:{
                    title: "Users",
                    titleFontSize: 14,
                    lineThickness: 1,
                    labelFontSize: 14,
                    },
            data: [{
                type: "column",
                dataPoints: [
                    { y: 22, label: "User 1" },
                    { y: 31, label: "User 2" },
                    { y: 52, label: "User 3" },
                    { y: 60, label: "User 4" },
                ]
            }]
        });
        chart.render();
        $(".canvasjs-chart-credit").hide();
    }
    var subArray = [];
    //notification
    //notification
    var notificationSorted =[[]];
    function sortByCol(arr, colIndex){
    notificationSorted=arr.sort(sortFunction);
    function sortFunction(a, b) {
        a = a[colIndex]
        b = b[colIndex]
        return (a === b) ? 0 : (a < b) ? -1 : 1
    }
}


     myNotification= function () {
         if (vm.NotificationArray !=null){
        console.log("hiiii");
         sortByCol(vm.NotificationArray, 6);
         console.log("jjjjj",notificationSorted);
         var reverseSorted =[[]];
         reverseSorted=notificationSorted.reverse();

        document.getElementById("notificationDiv").innerHTML = "";
        var DynamicTaskListing="";
        if (reverseSorted !=null){
            DynamicTaskListing ="<h5>"+"Notifications"+ "<button class='no-button-style' method='post' onclick='clearNotification()'>"+"clear all"+"</button>"+"</h5>"+"<ul>";
        for(var i=0;i<reverseSorted.length;i++){
            console.log("sp1");
            var timeDifference =moment(new Date(new Date(vm.NotificationArray[i][6]*1000)), "YYYYMMDD").fromNow();
            DynamicTaskListing += "<li>"+"User"+" "+vm.NotificationArray[i][2]+" "+vm.NotificationArray[i][3]+"  "+"delay to reach location"+" "+vm.NotificationArray[i][4]+" "+"for task"+" "+vm.NotificationArray[i][5]+" <span>"+timeDifference+"</span>"+"</li>";
            
            
        }
            $("#notificationDiv").prepend(DynamicTaskListing+"</ul>");
            document.getElementById("number").textContent="";
            $.ajax({
                url:'/'+ companyTeamName + '/notification/update',
                type: 'post',
                success : function(response) {
                    if (response == "true" ) {
                    } else {
                    }
                },
                error: function (request,status, error) {
                    console.log(error);
                }
            }); 
        }else{
            DynamicTaskListing ="<h5>"+" No New Notifications"+"</h5>";
            $("#notificationDiv").prepend(DynamicTaskListing);
            
        }
        
        }
     
     
     
     clearNotification= function () {
          document.getElementById("notificationDiv").innerHTML = "";
          $.ajax({
                url:'/'+ companyTeamName + '/notification/delete',
                type: 'post',
                success : function(response) {
                    if (response == "true" ) {
                    } else {
                    }
                },
                error: function (request,status, error) {
                    console.log(error);
                }
            });
     }


    
   getTaskDetails = function(){
        $("#taskListing").html("");
        var job = $("#jobName option:selected").val() ;
        for(i = 0; i < vm.TaskDetailArray.length; i++) {
            if (vm.TaskDetailArray[i][0]==job) {
                subArray.push(vm.TaskDetailArray[i][1]);
            }
        }
        //select all in drop down
        for(i = 0; i < vm.TaskDetailArray.length; i++) {
            if (job =="All") {
                subArray.push(vm.TaskDetailArray[i][1]);
            }
        }
        var DynamicTaskListing ="";
        for (var i=0; i<subArray.length; i++){
            DynamicTaskListing+='<p onclick="FunctionToChangeBarChart(event)">'+subArray[i]+'</p>';
        }
        $("#taskListing").append(DynamicTaskListing);
        subArray = [];
    }
    var selectAJob = $("#jobName option:selected").val() ;
    console.log("default job",selectAJob);
    for(i = 0; i < vm.TaskDetailArray.length; i++) {
        if (selectAJob =="SelectAJob") {
            subArray = [];
//            subArray.push(vm.TaskDetailArray[i][1]);
        }
    }
    var DynamicTaskListing ="";
    for (var i=0; i<subArray.length; i++){
        DynamicTaskListing+=' <p onclick="FunctionToChangeBarChart(event) " style="    cursor:pointer;">'+subArray[i]+'</p>';
    }
    $("#taskListing").prepend(DynamicTaskListing);
    
    FunctionToChangeBarChart = function(event){
        var TaskName = $(event.target).text();
        console.log($(event.target).text());
        var formData = formData+"&TaskName="+TaskName;
        $.ajax({
            url:'/' + companyTeamName +'/dashboard/barchart',
            type:'post',
            //dataType: 'json',
            data: formData,
            //call back or get response here
            success : function(data){
                var jsonData = JSON.parse(data)
                console.log("data",jsonData);
                allData = jsonData
                console.log("allData",allData)
                if(jsonData[0] == "true"){
                    totalNoUsers = jsonData[5];
                    today = new Date();
                    console.log("today   $$$$$$$$$$$$$",today);
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10) {
                        dd = '0'+dd
                    } 

                    if(mm<10) {
                        mm = '0'+mm
                    }
                    var CurrentMonth = mm;
                    var currentDay = dd;
                    var currentYear = yyyy;
                    var localToday = (mm + '/' + dd + '/' + yyyy);

                    console.log("todayDate",localToday);
                    //for filtaring details of task started User
                    var startTaskArray = jsonData[1];
                    var startTaskCount = 0;
                    //var tempArray = [];
                    if (startTaskArray !=null){
                        for (i = 0;i<startTaskArray.length;i++){
                            console.log("inner loop of ",startTaskArray[i][2]);
                             /*var returnValues = checkStartedUser(startTaskArray[i][3]);
                            if(returnValues =="true"){
                                startTaskCount =startTaskCount+1;
                            }*/

                           // tempArray.push()
                            var startTaskDate = startTaskArray[i][1];
                            var startTaskDateFromDb = parseInt(startTaskDate)
                            var d = new Date(startTaskDateFromDb * 1000);
                            var dd = d.getDate();
                            var mm = d.getMonth() + 1; //January is 0!
                            var yyyy = d.getFullYear();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){

                               startTaskCount = startTaskCount+1;
                            }
                            console.log("startTaskCount 111",startTaskCount)
                        }
                    }

                    //for filtering of Completed task

                    var completedTask = jsonData[2];
                    var completedTaskCount = 0;
                    if (completedTask !=null){
                        for (i = 0;i<completedTask.length;i++){
                            var completedTaskDate = completedTask[i][1];
                            var completedTaskDateFromDb = parseInt(completedTaskDate)
                            var d = new Date(completedTaskDateFromDb * 1000);
                            var dd = d.getDate();
                            var mm = d.getMonth() + 1; //January is 0!
                            var yyyy = d.getFullYear();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){
                               completedTaskCount = completedTaskCount+1;
                            }
                            console.log("completedTaskCount",completedTaskCount)
                        }
                    }
                    
                    //for filtaring details of task accepted User
                    var startTaskArray = jsonData[1];
                    var startTaskCount = 0;
                    if (startTaskArray.length !=null){
                        for (i = 0;i<startTaskArray.length;i++){
                            console.log("inner loop of ",startTaskArray[i][3]);
                            var startTaskDate = startTaskArray[i][1];
                            var startTaskDateFromDb = parseInt(startTaskDate)
                            var d = new Date(startTaskDateFromDb * 1000);
                            var dd = d.getDate();
                            var mm = d.getMonth() + 1; //January is 0!
                            var yyyy = d.getFullYear();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){
                               startTaskCount = startTaskCount+1;
                            }
                            
                            
                        }
                    }
                    
                    //for filtering of Completed task
                    
                    var completedTask = jsonData[2];
                    var completedTaskCount = 0;
                    if (completedTask.length !=null){
                        for (i = 0;i<completedTask.length;i++){
                            console.log("inner loop of ",completedTask[i][3]);
                            var completedTaskDate = completedTask[i][1];
                            var completedTaskDateFromDb = parseInt(completedTaskDate)
                            var d = new Date(completedTaskDateFromDb * 1000);
                            var dd = d.getDate();
                            var mm = d.getMonth() + 1; //January is 0!
                            var yyyy = d.getFullYear();
                            if (dd < 10) {
                                dd = '0' + dd;
                            }
                            if (mm < 10) {
                                mm = '0' + mm;
                            }
                            if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){
                               completedTaskCount = completedTaskCount+1;
                            }
                        }
                    }
                    //for filtering of pending Task
                    var pendingTask = jsonData[4];
                    var pendingTaskCount = 0;
                    if (pendingTask.length !=null){
                        pendingTaskCount = pendingTask.length;
                    }
                    
                    //for fitering of rejected Users
                    var rejectedUsers = jsonData[5];
                    var rejectedTaskCount = 0;
                    if(rejectedUsers.length !=null){
                        rejectedTaskCount = rejectedUsers.length;
                    }
                    
                    persentageOfAcceptedUser = (acceptedCount/TotalNoUsers)*100;
                    persentageOfRejectedUsers = (rejectedTaskCount/TotalNoUsers)*100;
                    PersentageOfStartedUser = (startTaskCount/TotalNoUsers)*100;
                    PersentageOfCompletedUsers = (completedTaskCount/TotalNoUsers)*100;
                    persentageOfPendingUsers = (pendingTaskCount/TotalNoUsers)*100;
                    console.log("persentageOfAcceptedUser",persentageOfAcceptedUser);
                    console.log("persentageOfRejectedUsers",persentageOfRejectedUsers);
                    console.log("PersentageOfStartedUser",PersentageOfStartedUser);
                    console.log("persentageOfPendingUsers",persentageOfPendingUsers);
                    console.log("PersentageOfCompletedUsers",PersentageOfCompletedUsers);
                }
                else{
                    console.log("Server Problem");
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){

                   startTaskCount = startTaskCount+1;
                }
                console.log("startTaskCount 111",startTaskCount)
           }
        }

        var completedTask = allData[2];
        var completedTaskCount = 0;
        if (completedTask !=null){
            for (i = 0;i<completedTask.length;i++){
                var completedTaskDate = completedTask[i][1];
                var completedTaskDateFromDb = parseInt(completedTaskDate)
                var d = new Date(completedTaskDateFromDb * 1000);
                var dd = d.getDate();
                var mm = d.getMonth() + 1; //January is 0!
                var yyyy = d.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (mm == CurrentMonth && currentDay == dd && currentYear == yyyy ){
                   completedTaskCount = completedTaskCount+1;
                }
                console.log("completedTaskCount",completedTaskCount)
            }
        }
        var pendingTask = allData[3];
        var pendingTaskCount = 0;
        if (pendingTask !=null){
            pendingTaskCount = pendingTask.length;
        }
        if(startTaskCount>completedTaskCount){
            tempStart = startTaskCount - completedTaskCount;
        } else{
            tempStart = completedTaskCount -startTaskCount;
        }
        LoadBarChart(totalUsers,tempStart,pendingTaskCount,completedTaskCount,localToday);
         var previousDay = document.getElementById('previousDay');
        previousDay.style.visibility = 'visible';
        var previousDay = document.getElementById('nextDay');
        previousDay.style.visibility = 'hidden';
    }

    
    
});