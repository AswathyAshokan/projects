/*Created By Farsana*/
package controllers

import (
	"app/passporte/models"
	"time"
	"reflect"
	"app/passporte/viewmodels"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	//"time"
	//"reflect"
	//"app/passporte/helper"

	"net/http"
)

type InviteUserController struct {
	BaseController
}

func (c *InviteUserController) AddInvitation() {
	user := models.InviteUser{}
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	if r.Method == "POST" {

		user.FirstName = c.GetString("firstname")
		user.LastName = c.GetString("lastname")
		user.EmailId = c.GetString("emailid")
		user.UserType = c.GetString("usertype")
		user.DateOfCreation =(time.Now().UnixNano() / 1000000)
		user.Status = "inactive"
		dbStatus := user.AddInviteToDb(c.AppEngineCtx)
		switch dbStatus {
		case true:
			w.Write([]byte("true"))
		case false:
			w.Write([]byte("false"))


		}
	} else {
		c.Layout = "layout/layout.html"
		c.TplName = "template/add-invite-user.html"
	}
}

func (c *InviteUserController) InvitationDetails() {

	r := c.Ctx.Request
	Context := appengine.NewContext(r)

	user := models.InviteUser{}
	inviteUserInfo := user.DisplayUser(c.AppEngineCtx)
	inviteUserdataValue := reflect.ValueOf(inviteUserInfo)
	var inviteUserValueSlice []models.InviteUser    // to store tha data value of slice
	inviteUserViewModel := viewmodels.InviteUserViewModel{}
	var inviteUserKeySlice []string     //to store the keys of slice
	for _, inviteUserKey := range inviteUserdataValue.MapKeys() {
		inviteUserKeySlice = append(inviteUserKeySlice, inviteUserKey.String())//to get keys
		inviteUserValueSlice = append(inviteUserValueSlice, inviteUserInfo[inviteUserKey.String()])//to get values
		inviteUserViewModel.Users = append(inviteUserViewModel.Users, inviteUserInfo[inviteUserKey.String()])


	}
	inviteUserViewModel.InviteUserKey = inviteUserKeySlice
	log.Infof(Context, "key of", inviteUserViewModel)
	c.Data["vm"] = inviteUserViewModel
	c.Layout = "layout/layout.html"
	c.TplName = "template/invite-user-details.html"
}

//delete each users




func (c *InviteUserController) DeleteInvitation() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	InviteUserKey :=c.Ctx.Input.Param(":inviteuserkey")
	exam := appengine.NewContext(r)
	user := models.InviteUser{}
	result :=user.DeleteUser(c.AppEngineCtx, InviteUserKey)
	switch result {
	case true:
		http.Redirect(w, r, "/invitate", 301)
	case false:
		log.Infof(exam,"failed")

	}
	//log.Infof(exam, "vvvvv: %v", user)


}

//edit profile of each users

func (c *InviteUserController) EditInvitation() {
	user := models.InviteUser{}
	r := c.Ctx.Request
	key:=c.Ctx.Input.Param(":Key")
	exam := appengine.NewContext(r)
	result,DbStatus :=user.EditUser(c.AppEngineCtx,key)
	switch DbStatus {
	case true:
		viewmodel := viewmodels.InviteUserViewModel{}
		viewmodel.FirstName = result.FirstName
		viewmodel.LastName = result.LastName
		viewmodel.EmailId = result.EmailId
		viewmodel.UserType = result.UserType
		c.Data["vm"] = viewmodel
		c.Layout = "layout/layout.html"
		c.TplName = "template/add-user.html"
	case false:
		log.Infof(exam,"failed")

	}
	log.Infof(exam,"jhfjsgjgj: %+v",result)
}

//view the user

func (c *InviteUserController) ViewInvitation() {
	r := c.Ctx.Request
	//var Key int
	key:=c.Ctx.Input.Param(":Key")
	exam := appengine.NewContext(r)
	log.Infof(exam, "iddddddddd: %v", key)

}


