
/* Author :Aswathy Ashok */

package controllers

import (
	"app/passporte/models"
	"time"
	"app/passporte/viewmodels"
	"reflect"
	"app/passporte/helpers"
	"log"
	"bytes"
	"regexp"

)

type TaskController struct {
	BaseController
}
/*Add task details to DB*/
func (c *TaskController)AddNewTask() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	if r.Method == "POST" {
		task:=models.Task{}
		task.Info.TaskName= c.GetString("taskName")
		task.Job.JobName= c.GetString("jobName")
		task.Job.JobId = c.GetString("jobId")
		task.Customer.CustomerName = c.GetString("customerName")
		task.Customer.CustomerId =c.GetString("jobId")
		task.Info.StartDate = c.GetString("startDate")
		task.Info.EndDate = c.GetString("endDate")
		task.Info.TaskLocation = c.GetString("taskLocation")
		task.Info.TaskDescription = c.GetString("taskDescription")
		task.Info.UserNumber = c.GetString("users")
		task.Info.Log = c.GetString("log")
		UserOrGroupIdArray := c.GetStrings("userOrGroup")
		UserOrGroupNameArray := c.GetStrings("userAndGroupName")
		tempContactName := c.GetStrings("contactName")
		tempContactId := c.GetStrings("contactId")
		task.Info.LoginType=c.GetString("loginType")
		task.Info.FitToWork = c.GetString("fitToWork")
		task.Settings.DateOfCreation =time.Now().UnixNano() / int64(time.Millisecond)
		task.Settings.Status = helpers.StatusPending
		task.Info.CompanyTeamName = storedSession.CompanyTeamName
		userMap := make(map[string]models.TaskUser)
		groupMap := make(map[string]models.TaskGroup)
		groupNameAndDetails := models.TaskGroup{}
		userName :=models.TaskUser{}
		group := models.Group{}
		var keySliceForGroup [] string
		var MemberNameArray [] string
		groupMemberNameMap := make(map[string]models.GroupMemberName)
		members := models.GroupMemberName{}

		for i := 0; i < len(UserOrGroupIdArray); i++ {
			tempName :=UserOrGroupNameArray[i]
			tempId :=UserOrGroupIdArray[i]
			userOrGroupRegExp := regexp.MustCompile(`\((.*?)\)`)
			userOrGroupSelection := userOrGroupRegExp.FindStringSubmatch(tempName)
			if((userOrGroupSelection[1]) == "User") {
				tempName = tempName[:len(tempName)-7]
				userName.FullName = tempName
				userMap[tempId] = userName
			} else {
				tempName = tempName[:len(tempName)-8]
				groupNameAndDetails.GroupName = tempName
				//Getting member name from group
				groupDetails, dbStatus := group.GetGroupDetailsById(c.AppEngineCtx, tempId)
				switch dbStatus {
				case true:

					memberData := reflect.ValueOf(groupDetails.Members)
					for _, key := range memberData.MapKeys() {
						keySliceForGroup = append(keySliceForGroup, key.String())
					}
					for i := 0; i < len(keySliceForGroup); i++ {
						MemberNameArray = append(MemberNameArray,groupDetails.Members[keySliceForGroup[i]].MemberName)
					}
					for i := 0; i < len(keySliceForGroup); i++ {
						members.MemberName = MemberNameArray[i]
						groupMemberNameMap[keySliceForGroup[i]] = members
					}

				case false:
					log.Println(helpers.ServerConnectionError)
				}
				groupNameAndDetails.Members = groupMemberNameMap
				groupMap[tempId] = groupNameAndDetails
			}
		}

		task.UsersAndGroups.User = userMap
		task.UsersAndGroups.Group = groupMap
		contactMap := make(map[string]models.TaskContact)
		taskContactDetail :=models.TaskContact{}
		for i := 0; i < len(tempContactId); i++ {
			taskContactDetail.ContactName = tempContactName[i]
			contactMap[tempContactId[i]] = taskContactDetail
		}
		task.Contact = contactMap

		//Add data to task DB
		dbStatus :=task.AddTaskToDB(c.AppEngineCtx)
		switch dbStatus {
		case true:
			w.Write([]byte("true"))
		case false:
			w.Write([]byte("false"))
		}

	}else {
		viewModel  := viewmodels.AddTaskViewModel{}
		user :=models.Users{}
		var keySlice []string
		var keySliceForGroupAndUser 	[]string
		var keySliceForContact		[]string
		//Getting Jobs
		dbStatus, allJobs := models.GetAllJobs(c.AppEngineCtx)
		switch dbStatus {
		case true:
			dataValue := reflect.ValueOf(allJobs)
			for _, key := range dataValue.MapKeys() {
				keySlice = append(keySlice, key.String())
			}
			for _, k := range dataValue.MapKeys() {
				viewModel.JobNameArray   = append(viewModel.JobNameArray, allJobs[k.String()].Info.JobName)
				viewModel.JobCustomerNameArray = append(viewModel.JobCustomerNameArray, allJobs[k.String()].Customer.CustomerName)
			}
		case false:
			log.Println(helpers.ServerConnectionError)
		}
		//Getting users and groups
		 allUsers,dbStatus := user.GetUsersForDropdown(c.AppEngineCtx)
		switch dbStatus {
		case true:
			dataValue := reflect.ValueOf(allUsers)
			for _, key := range dataValue.MapKeys() {
				keySliceForGroupAndUser = append(keySliceForGroupAndUser, key.String())
				viewModel.GroupNameArray   = append(viewModel.GroupNameArray ,  allUsers[key.String()].Info.FullName+" (User)")
			}
			allGroups, dbStatus := models.GetAllGroupDetails(c.AppEngineCtx)
			switch dbStatus {
			case true:
				dataValue := reflect.ValueOf(allGroups)
				for _, key := range dataValue.MapKeys() {
					keySliceForGroupAndUser = append(keySliceForGroupAndUser, key.String())
					viewModel.GroupNameArray = append(viewModel.GroupNameArray, allGroups[key.String()].Info.GroupName+" (Group)")
				}
				viewModel.UserAndGroupKey=keySliceForGroupAndUser
			case false:
				log.Println(helpers.ServerConnectionError)
			}
		case false:
			log.Println(helpers.ServerConnectionError)
		}
		dbStatus, contacts := models.GetAllContact(c.AppEngineCtx)
		switch dbStatus {
		case true:
			dataValue := reflect.ValueOf(contacts)
			for _, key := range dataValue.MapKeys() {
				keySliceForContact = append(keySliceForContact, key.String())
			}
			for _, k := range dataValue.MapKeys() {
				viewModel.ContactNameArray  = append(viewModel.ContactNameArray , contacts[k.String()].Info.Name)
			}
			viewModel.CompanyTeamName=storedSession.CompanyTeamName
			viewModel.Key = keySlice
			viewModel.ContactKey=keySliceForContact
		case false:
			log.Println(helpers.ServerConnectionError)
		}
		c.Data["vm"] = viewModel
		c.Layout = "layout/layout.html"
		c.TplName = "template/add-task.html"
	}

}

/* display all task details*/
func (c *TaskController)LoadTaskDetail() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	jobId := ""
	jobId = c.Ctx.Input.Param(":jobId")
	task := models.Task{}
	dbStatus, tasks := task.RetrieveTaskFromDB(c.AppEngineCtx)
	viewModel := viewmodels.TaskDetailViewModel{}

	switch dbStatus {
	case true:
		dataValue := reflect.ValueOf(tasks)
		var keySlice []string
		for _, key := range dataValue.MapKeys() {
			keySlice = append(keySlice, key.String())
		}
		for _, k := range keySlice {
			var tempValueSlice []string

			tempJobAndCustomer := ""
			if tasks[k].Job.JobName != "" {
				var buffer bytes.Buffer
				buffer.WriteString(tasks[k].Job.JobName)
				buffer.WriteString(" (")
				buffer.WriteString(tasks[k].Customer.CustomerName)
				buffer.WriteString(")")
				tempJobAndCustomer = buffer.String()
				buffer.Reset()
			}

			tempValueSlice = append(tempValueSlice, tempJobAndCustomer)


			if !helpers.StringInSlice(tasks[k].Customer.CustomerName, viewModel.UniqueCustomerNames) && tasks[k].Customer.CustomerName != "" {
				viewModel.UniqueCustomerNames = append(viewModel.UniqueCustomerNames, tasks[k].Customer.CustomerName)
			}
			if jobId == tasks[k].Job.JobId{
				viewModel.SelectedJob = tasks[k].Job.JobName
				viewModel.SelectedCustomerForJob=tasks[k].Customer.CustomerName
			}
			if !helpers.StringInSlice(tasks[k].Job.JobName, viewModel.UniqueJobNames) && tasks[k].Job.JobName != "" {
				viewModel.UniqueJobNames = append(viewModel.UniqueJobNames, tasks[k].Job.JobName)
			}
			tempValueSlice = append(tempValueSlice, tasks[k].Info.TaskName)
			tempValueSlice = append(tempValueSlice, tasks[k].Info.TaskLocation)
			tempValueSlice = append(tempValueSlice, tasks[k].Info.StartDate)
			tempValueSlice = append(tempValueSlice, tasks[k].Info.EndDate)
			tempValueSlice = append(tempValueSlice,  tasks[k].Info.LoginType)
			tempValueSlice = append(tempValueSlice,  tasks[k].Settings.Status)
			viewModel.Values = append(viewModel.Values, tempValueSlice)
			tempValueSlice = tempValueSlice[:0]
		}
		viewModel.Keys = keySlice
		viewModel.CompanyTeamName = storedSession.CompanyTeamName
		c.Data["vm"] = viewModel
		c.Layout = "layout/layout.html"
		c.TplName = "template/task-details.html"

		case false:
			log.Println(helpers.ServerConnectionError)

	}


}
/*delete task details from DB*/
func (c *TaskController)LoadDeleteTask() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	ReadSession(w, r, companyTeamName)
	taskId :=c.Ctx.Input.Param(":taskId")
	task := models.Task{}
	dbStatus := task.DeleteTaskFromDB(c.AppEngineCtx, taskId)
	switch dbStatus {
	case true:
		w.Write([]byte("true"))
	case false :
		w.Write([]byte("true"))
	}
}

/* Edit task details*/
func (c *TaskController)LoadEditTask() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	if r.Method == "POST" {
		log.Println("inside edit")
		taskId := c.Ctx.Input.Param(":taskId")
		task := models.Task{}
		task.Info.TaskName = c.GetString("taskName")
		task.Job.JobName = c.GetString("jobName")
		task.Job.JobId = c.GetString("jobId")
		task.Customer.CustomerName = c.GetString("customerName")
		task.Customer.CustomerId =c.GetString("jobId")
		task.Info.StartDate = c.GetString("startDate")
		task.Info.EndDate = c.GetString("endDate")
		task.Info.TaskLocation = c.GetString("taskLocation")
		task.Info.TaskDescription = c.GetString("taskDescription")
		task.Info.UserNumber = c.GetString("users")
		task.Info.Log = c.GetString("log")
		UserOrGroupIdArray := c.GetStrings("userOrGroup")
		UserOrGroupNameArray := c.GetStrings("userAndGroupName")
		task.Info.CompanyTeamName = storedSession.CompanyTeamName
		userMap := make(map[string]models.TaskUser)
		groupMap := make(map[string]models.TaskGroup)
		groupNameAndDetails := models.TaskGroup{}
		userName :=models.TaskUser{}
		group := models.Group{}
		var keySliceForGroup [] string
		var MemberNameArray [] string
		groupMemberNameMap := make(map[string]models.GroupMemberName)
		members := models.GroupMemberName{}
		log.Println("cp1")
		for i := 0; i < len(UserOrGroupIdArray); i++ {
			tempName :=UserOrGroupNameArray[i]
			tempId :=UserOrGroupIdArray[i]
			userOrGroupRegExp := regexp.MustCompile(`\((.*?)\)`)
			userOrGroupSelection := userOrGroupRegExp.FindStringSubmatch(tempName)
			if((userOrGroupSelection[1]) == "User") {
				tempName = tempName[:len(tempName)-7]
				userName.FullName = tempName
				userMap[tempId] = userName
			} else {
				log.Println("users and group section")
				tempName = tempName[:len(tempName)-8]
				groupNameAndDetails.GroupName = tempName
				groupDetails, dbStatus := group.GetGroupDetailsById(c.AppEngineCtx, tempId)
				switch dbStatus {
				case true:

					memberData := reflect.ValueOf(groupDetails.Members)
					for _, key := range memberData.MapKeys() {
						keySliceForGroup = append(keySliceForGroup, key.String())
					}
					for i := 0; i < len(keySliceForGroup); i++ {
						MemberNameArray = append(MemberNameArray,groupDetails.Members[keySliceForGroup[i]].MemberName)
					}
					for i := 0; i < len(keySliceForGroup); i++ {
						members.MemberName = MemberNameArray[i]
						groupMemberNameMap[keySliceForGroup[i]] = members
					}

				case false:
					log.Println(helpers.ServerConnectionError)
				}
				groupNameAndDetails.Members = groupMemberNameMap
				groupMap[tempId] = groupNameAndDetails
			}
		}

		task.UsersAndGroups.User = userMap
		task.UsersAndGroups.Group = groupMap
		tempContactName := c.GetStrings("contacts")
		tempContactId := c.GetStrings("contactId")
		contactMap := make(map[string]models.TaskContact)
		taskContactDetail :=models.TaskContact{}
		for i := 0; i < len(tempContactId); i++ {
			taskContactDetail.ContactName = tempContactName[i]
			contactMap[tempContactId[i]] = taskContactDetail
		}
		task.Contact = contactMap
		task.Info.LoginType = c.GetString("loginType")
		task.Info.FitToWork = c.GetString("fitToWork")
		task.Settings.DateOfCreation = time.Now().UnixNano() / int64(time.Millisecond)
		task.Settings.Status = "Completed"
		dbStatus := task.UpdateTaskToDB(c.AppEngineCtx, taskId)
		switch dbStatus {
		case true:
			w.Write([]byte("true"))
		case false:
			w.Write([]byte("false"))
		}

	} else {
		viewModel  := viewmodels.EditTaskViewModel{}
		task := models.Task{}
		user := models.Users{}
		taskId := c.Ctx.Input.Param(":taskId")
		dbStatus, taskDetail := task.GetTaskDetailById(c.AppEngineCtx, taskId)
		switch dbStatus {
		case true:
			dbStatus, allJobs := models.GetAllJobs(c.AppEngineCtx)
			var keySlice 			[]string
			var keySliceForGroupAndUser 	[]string
			var keySliceForContact		[]string
			var keyForContact 		[]string

			switch dbStatus {
			case true:
				dataValue := reflect.ValueOf(allJobs)
				for _, key := range dataValue.MapKeys() {
					keySlice = append(keySlice, key.String())
				}
				for _, k := range dataValue.MapKeys() {
					viewModel.JobNameArray = append(viewModel.JobNameArray, allJobs[k.String()].Info.JobName)
					viewModel.JobCustomerNameArray = append(viewModel.JobCustomerNameArray, allJobs[k.String()].Customer.CustomerName)
				}
			case false:
				log.Println(helpers.ServerConnectionError)
			}
			allUsers,dbStatus := user.GetUsersForDropdown(c.AppEngineCtx)
			switch dbStatus {
			case true:
				dataValue := reflect.ValueOf(allUsers)
				for _, key := range dataValue.MapKeys() {
					keySliceForGroupAndUser = append(keySliceForGroupAndUser, key.String())
				}

				for _, k := range dataValue.MapKeys() {
					viewModel.GroupNameArray = append(viewModel.GroupNameArray, allUsers[k.String()].Info.FullName+"(User)")
				}
				allGroups, dbStatus := models.GetAllGroupDetails(c.AppEngineCtx)
				switch dbStatus {
				case true:
					dataValue := reflect.ValueOf(allGroups)
					for _, key := range dataValue.MapKeys() {
						keySliceForGroupAndUser = append(keySliceForGroupAndUser, key.String())
					}
					for _, k := range dataValue.MapKeys() {
						viewModel.GroupNameArray = append(viewModel.GroupNameArray, allGroups[k.String()].Info.GroupName+"(Group)")
					}
					viewModel.UserAndGroupKey=keySliceForGroupAndUser
				case false:
					log.Println(helpers.ServerConnectionError)
				}
			case false:
				log.Println(helpers.ServerConnectionError)
			}
			dbStatus, contacts := models.GetAllContact(c.AppEngineCtx)
			switch dbStatus {
			case true:
				dataValue := reflect.ValueOf(contacts)
				for _, key := range dataValue.MapKeys() {
					keySliceForContact = append(keySliceForContact, key.String())
				}
				for _, k := range dataValue.MapKeys() {
					viewModel.ContactNameArray = append(viewModel.ContactNameArray, contacts[k.String()].Info.Name)
				}
				viewModel.ContactKey=keySliceForContact
				contactDetails, dbStatus := task.GetContactDetailById(c.AppEngineCtx, taskId)
				switch dbStatus {
				case true:
					dataValue := reflect.ValueOf(contactDetails.Contact)
					for _, key := range dataValue.MapKeys() {
						keyForContact =  append(keyForContact, key.String())
					}
					for _, k := range dataValue.MapKeys() {
						viewModel.ContactNameToEdit = append(viewModel.ContactNameToEdit,contactDetails.Contact[k.String()].ContactName)
					}
					//contactData := reflect.ValueOf(contactDetails.Contact)
					//
					//for _, selectedMemberKey := range contactData.MapKeys() {
					//	viewModel.ContactNameToEdit = append(viewModel.ContactNameToEdit, selectedMemberKey.String())
					//}
					viewModel.Key = keySlice
					viewModel.PageType = helpers.SelectPageForEdit
					viewModel.JobName = taskDetail.Job.JobName
					viewModel.TaskName = taskDetail.Info.TaskName
					viewModel.TaskLocation = taskDetail.Info.TaskLocation
					viewModel.StartDate = taskDetail.Info.StartDate
					viewModel.EndDate = taskDetail.Info.EndDate
					viewModel.TaskDescription = taskDetail.Info.TaskDescription
					viewModel.UserNumber = taskDetail.Info.UserNumber
					viewModel.Log = taskDetail.Info.Log
					//viewModel.UserType = taskDetail.UsersOrGroups
					viewModel.FitToWork = taskDetail.Info.FitToWork
					viewModel.TaskId = taskId
					viewModel.CompanyTeamName=storedSession.CompanyTeamName
					c.Data["vm"] = viewModel
					c.Layout = "layout/layout.html"
					c.TplName = "template/add-task.html"

				case false:
					log.Println(helpers.ServerConnectionError)
				}
			}

		case false:
			log.Println(helpers.ServerConnectionError)
		}
	}
}


