package controllers

import (
	"app/passporte/models"
	"log"
	"net/http"
)

type ByPassController struct {
	BaseController
}

/*Func for session bypass*/
//created for bypassing directly
func (c *ByPassController)ByPass() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	login := models.Login{}
	login.Email = "tech@gmail.com"
	login.Password = []byte("123456789")
	log.Println(login)
	loginStatus, adminDetails, companyDetails, adminId := login.CheckLogin(c.AppEngineCtx)
	switch loginStatus{
	case true:
		sessionValues := SessionValues{}
		sessionValues.AdminId = adminId
		sessionValues.AdminFirstName = adminDetails.Info.FirstName
		sessionValues.AdminLastName = adminDetails.Info.LastName
		sessionValues.AdminEmail = adminDetails.Info.Email
		sessionValues.CompanyId = adminDetails.Company.CompanyId
		sessionValues.CompanyName = companyDetails.Info.CompanyName
		sessionValues.CompanyTeamName = companyDetails.Info.CompanyTeamName
		sessionValues.CompanyPlan = companyDetails.Plan
		SetSession(w, sessionValues)
		initialLink :="-KxfQE6Yxg2N2-95g2ML/consent"
		http.Redirect(w, r, initialLink, 302)
	case false:
		log.Println("Bypass Failed")
	}
}