package controllers
import (
	"time"
	"app/passporte/models"
	"app/passporte/helpers"
	"app/passporte/viewmodels"
	"reflect"
	"log"
	"strings"
)
type ConsentReceiptController struct {
	BaseController
}
func (c *ConsentReceiptController) AddConsentReceipt() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	consentView :=viewmodels.ConsentReceipt{}
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	consentData := models.ConsentReceipts{}
	storedSession := ReadSession(w, r, companyTeamName)
	if r.Method == "POST" {
		members := models.ConsentMembers{}
		consentData.Info.ReceiptName = c.GetString("recieptName")
		consentData.Info.CompanyName = storedSession.CompanyName
		tempUserId := c.GetStrings("selectedUserIds")
		tempMembers := c.GetStrings("selectedUserNames")
		instructions := c.GetString("instructionsForUser")
		instructionSlice := strings.Split(instructions, ",")
		consentData.Settings.DateOfCreation = (time.Now().UnixNano() / 1000000)
		consentData.Settings.Status = helpers.StatusActive
		tempMembersMap := make(map[string]models.ConsentMembers)
		for i := 0; i < len(tempUserId); i++ {
			members.UserResponse = helpers.UserResponsePending
			members.FullName = tempMembers[i]
			tempMembersMap[tempUserId[i]] = members
		}
		consentData.Instructions.Users = tempMembersMap
		dbStatus := consentData.AddConsentToDb(c.AppEngineCtx,instructionSlice,companyTeamName,tempUserId)
		switch dbStatus {
		case true:
			w.Write([]byte("true"))
		case false:
			w.Write([]byte("false"))
		}
	} else {
		groupUser := models.Users{}
		var keySlice []string
		var allUserNames [] string
		allUserDetails, dbStatus := groupUser.TakeGroupMemberName(c.AppEngineCtx, companyTeamName)
		switch dbStatus {
		case true:
			dataValue := reflect.ValueOf(allUserDetails)

			for _, groupKey := range dataValue.MapKeys() {
				keySlice = append(keySlice, groupKey.String())
			}
			for _, k := range keySlice {
				if allUserDetails[k].Status != helpers.UserStatusDeleted {
					allUserNames = append(allUserNames, allUserDetails[k].FullName)
					consentView.GroupMembers = allUserNames
					consentView.GroupKey = keySlice
				}
			}
			consentView.CompanyTeamName = storedSession.CompanyTeamName
			consentView.CompanyPlan   =  storedSession.CompanyPlan
			consentView.AdminLastName =storedSession.AdminLastName
			consentView.AdminFirstName =storedSession.AdminFirstName
			consentView.ProfilePicture =storedSession.ProfilePicture
		case false:
			log.Println(helpers.ServerConnectionError)
		}
		c.Data["vm"] = consentView
		c.Layout = "layout/layout.html"
		c.TplName ="template/add-consentreceipt.html"
	}
}


func (c* ConsentReceiptController)LoadConsentReceipt(){
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	dbStatus,allConsent:= models.GetAllConsentReceiptDetails(c.AppEngineCtx)
	consentViewModel :=viewmodels.LoadConsent{}
	switch dbStatus {
	case true:
		var keySlice []string
		var tempKeySlice []string
		dataValue := reflect.ValueOf(allConsent)
		for _, key := range dataValue.MapKeys() {
			keySlice = append(keySlice, key.String())
		}
		for _, k :=range keySlice{
			consentById :=models.GetSelectedUsersName(c.AppEngineCtx,k)
			consentDataValues :=reflect.ValueOf(consentById)
			for _, consentKey := range consentDataValues.MapKeys() {
				tempKeySlice = append(tempKeySlice, consentKey.String())
			}
			for _, eachKey :=range tempKeySlice{
				log.Println("key",eachKey)
				var tempValueSlice []string

				if consentById[eachKey].Settings.Status!= helpers.UserStatusDeleted {
					tempValueSlice = append(tempValueSlice, "")
					tempValueSlice = append(tempValueSlice, consentById[eachKey].Info.ReceiptName)
					tempValueSlice = append(tempValueSlice,eachKey)
					consentViewModel.Values = append(consentViewModel.Values, tempValueSlice)
					tempValueSlice = tempValueSlice[:0]

					getInstructions := models.GetAllInstructionsById(c.AppEngineCtx,k,eachKey)

					for _, instructionKey := range reflect.ValueOf(getInstructions).MapKeys() {
						var consentStructVM viewmodels.ConsentStruct
						var instructionKeySlice []string
						instructionKeyString := instructionKey.String()
						consentStructVM.InstructionKey = eachKey
						instructionKeySlice = append(instructionKeySlice, instructionKeyString)
						consentStructVM.Description = getInstructions[instructionKeyString].Description
						users := getInstructions[instructionKeyString].Users
						for _, userKey := range reflect.ValueOf(users).MapKeys() {
							userKeyString := userKey.String()
							if users[userKeyString].UserResponse == helpers.UserResponseAccepted {
								consentStructVM.AcceptedUsers = append(consentStructVM.AcceptedUsers, users[userKeyString].FullName)
							} else if users[userKeyString].UserResponse == helpers.UserResponseRejected {
								consentStructVM.RejectedUsers = append(consentStructVM.RejectedUsers, users[userKeyString].FullName)
							} else { // Pending
								consentStructVM.PendingUsers = append(consentStructVM.PendingUsers, users[userKeyString].FullName)
							}
						}
						consentViewModel.InnerContent = append(consentViewModel.InnerContent, consentStructVM)
					}
				}

			}
		}
		consentViewModel.Keys = keySlice
		consentViewModel.CompanyTeamName = storedSession.CompanyTeamName
		c.Data["vm"] = consentViewModel
		c.Layout = "layout/layout.html"
		c.TplName = "template/consentreceipt-details.html"
	case false:
		log.Println(helpers.ServerConnectionError)
	}
}

/*func (c *ConsentReceiptController) EditConsentReceipt() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	consentData := models.ConsentReceipts{}
	consentId := c.Ctx.Input.Param(":consentId")
	consentView :=viewmodels.EditConsentReceipt{}
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	if r.Method == "POST" {
		var keySlice []string
		members := models.ConsentMembers{}
		consentData.Info.ReceiptName = c.GetString("recieptName")
		consentData.Info.CompanyTeamName = companyTeamName
		tempGroupId := c.GetStrings("selectedUserIds")
		tempGroupMembers := c.GetStrings("selectedUserNames")
		instructions := c.GetString("instructionsForUser")
		instructionSlice := strings.Split(instructions, ",")
		consentData.Settings.DateOfCreation = (time.Now().UnixNano() / 1000000)
		consentData.Settings.Status = helpers.StatusActive
		tempMembersMap := make(map[string]models.ConsentMembers)
		instructionStatus := models.IsInstructionEdited(c.AppEngineCtx,instructionSlice,consentId)
		switch instructionStatus {
		case true:
			filterData := models.GetMemberStatus(c.AppEngineCtx,consentId)
			dataValue := reflect.ValueOf(members)

			for _, key := range dataValue.MapKeys() {
				keySlice = append(keySlice, key.String())
			}
			for _,k := range keySlice {
				for i := 0; i < len(tempGroupId); i++ {
					if tempGroupMembers[i] == filterData[k].MemberName {
						log.Println("cp1")
						members.MemberName = tempGroupMembers[i]
						log.Println("status :",filterData[k].Status)
						members.Status = filterData[k].Status
						tempMembersMap[tempGroupId[i]] = members
					} else {
						log.Println("cp2")
						members.MemberName = tempGroupMembers[i]
						members.Status = helpers.UserResponsePending
						tempMembersMap[tempGroupId[i]] = members
					}
					consentData.Members = tempMembersMap
				}

			}

		case false:
			for i := 0; i < len(tempGroupId); i++ {
				members.MemberName = tempGroupMembers[i]
				members.Status = helpers.UserResponsePending
				tempMembersMap[tempGroupId[i]] = members
			}
			consentData.Members = tempMembersMap
		}
		dbStatus := consentData.UpdateConsentDetails(c.AppEngineCtx,consentId,instructionSlice,tempGroupId,tempGroupMembers)
		switch dbStatus {
		case true:
			w.Write([]byte("true"))
		case false:
			w.Write([]byte("false"))
		}
	}else {
		groupUser := models.Users{}
		var keySlice []string
		var allUserNames [] string
		var instructionSlice []string
		allUserDetails, dbStatus := groupUser.TakeGroupMemberName(c.AppEngineCtx, companyTeamName)
		switch dbStatus {
		case true:
			dataValue := reflect.ValueOf(allUserDetails)
			for _, groupKey := range dataValue.MapKeys() {
				keySlice = append(keySlice, groupKey.String())
			}
			for _, k := range keySlice {
				if allUserDetails[k].Status != helpers.UserStatusDeleted {
					allUserNames = append(allUserNames, allUserDetails[k].FullName)
					consentView.GroupMembers = allUserNames
					consentView.GroupKey = keySlice
				}
			}
			consentDetails :=models.GetSelectedUsersName(c.AppEngineCtx,consentId)
			consentDataValues := reflect.ValueOf(consentDetails.Members)
			for _,UsersKey := range consentDataValues.MapKeys(){
				consentView.UserNameToEdit = append(consentView.UserNameToEdit,UsersKey.String())
			}
			instructionArrayDataValue := reflect.ValueOf(consentDetails.Instructions)
			for _,instructionKey := range instructionArrayDataValue.MapKeys(){
				instructionSlice = append(instructionSlice,instructionKey.String())
			}
			for _, eachInstructionKey := range instructionSlice {
				consentView.InstructionArrayToEdit = append(consentView.InstructionArrayToEdit,consentDetails.Instructions[eachInstructionKey].Description)
			}
			consentView.ReceiptName = consentDetails.Info.ReceiptName
			consentView.ConsentId  = consentId
			consentView.CompanyTeamName = storedSession.CompanyTeamName
			consentView.CompanyPlan   =  storedSession.CompanyPlan
			consentView.AdminLastName =storedSession.AdminLastName
			consentView.AdminFirstName =storedSession.AdminFirstName
			consentView.ProfilePicture =storedSession.ProfilePicture
			consentView.PageType=helpers.SelectPageForEdit
		case false:
			log.Println(helpers.ServerConnectionError)
		}
	}

	c.Data["vm"] = consentView
	c.Layout = "layout/layout.html"
	c.TplName = "template/add-consentreceipt.html"
}*/

func (c *ConsentReceiptController) DeleteConsentReceipt() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	ReadSession(w, r, companyTeamName)
	consentId :=c.Ctx.Input.Param(":consentId")
	dbStatus :=models.DeleteConsentReceiptById(c.AppEngineCtx, consentId,companyTeamName)
	switch dbStatus {
	case true:
		w.Write([]byte("true"))
	case false:
		w.Write([]byte("false"))
	}
}
