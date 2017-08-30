package controllers


import (
	"log"
	"app/passporte/models"
	"reflect"
	"app/passporte/viewmodels"
	"app/passporte/helpers"
	"time"
)
type SharedDocumentController struct {
	BaseController
}

func (c *SharedDocumentController) LoadSharedDocuments() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	var expiryKeySlice []string
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	userId := c.Ctx.Input.Param(":inviteuserid")
	storedSession := ReadSession(w, r, companyTeamName)
	log.Println("session :", storedSession)
	documentsViewModels := viewmodels.SharedDocument{}
	info, dbStatus := models.GetAllInvitationDetail(c.AppEngineCtx, userId)

	if info.UserResponse == helpers.StatusAccepted {
		switch dbStatus {
		case true:
			tempEmailId := info.Email
			UserDetails:= models.GetAllUserDetail(c.AppEngineCtx, tempEmailId)
			log.Println("UserDetails",UserDetails)
			/*switch expiryStatus {
			case true:*/
				var keySlice []string
				dataValue := reflect.ValueOf(UserDetails)
				for _, key := range dataValue.MapKeys() {
					keySlice = append(keySlice, key.String())
				}
				for _, specifiedUserId := range keySlice {
					expiry, status,Name := models.GetExpireDetailsOfUser(c.AppEngineCtx, specifiedUserId)
					log.Println("expiry", expiry)
					switch status {
					case true:
						dataValue := reflect.ValueOf(expiry)

						for _, key := range dataValue.MapKeys() {
							expiryKeySlice = append(expiryKeySlice, key.String())
						}
						for _, k := range expiryKeySlice {
							var tempValueSlice []string
							if expiry[k].Info.Mode == "Public" {
								tempValueSlice = append(tempValueSlice, expiry[k].Info.Description)
								tempValueSlice = append(tempValueSlice, time.Unix(expiry[k].Info.ExpirationDate, 0).Format("01/02/2006"))
								tempValueSlice = append(tempValueSlice,Name)
								tempValueSlice = append(tempValueSlice, expiry[k].Info.DocumentId)

								documentsViewModels.Values = append(documentsViewModels.Values, tempValueSlice)
								tempValueSlice = tempValueSlice[:0]
							}

						}
					case false :
						log.Println(helpers.ServerConnectionError)
					}

				}
			case false:
				log.Println(helpers.ServerConnectionError)
			}
		}
		documentsViewModels.Keys = expiryKeySlice
		documentsViewModels.CompanyTeamName = storedSession.CompanyTeamName
		documentsViewModels.CompanyPlan = storedSession.CompanyPlan
		c.Data["vm"] = documentsViewModels
		c.TplName = "template/shareddocument.html"


}
func (c *SharedDocumentController) LoadSharedDocumentsAllSharedDocuments() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter
	var expiryKeySlice []string
	companyTeamName := c.Ctx.Input.Param(":companyTeamName")
	storedSession := ReadSession(w, r, companyTeamName)
	log.Println("session :", storedSession)
	documentsViewModels := viewmodels.SharedDocument{}
	expiry, dbStatus ,Name:= models.GetAllSharedDocumentsByCompany(c.AppEngineCtx, companyTeamName)
	switch dbStatus {
	case true:
		dataValue := reflect.ValueOf(expiry)

		for _, key := range dataValue.MapKeys() {
			expiryKeySlice = append(expiryKeySlice, key.String())
		}
		for _, k := range expiryKeySlice {
			var tempValueSlice []string
			if expiry[k].Info.Mode == "Public" {
				tempValueSlice = append(tempValueSlice, expiry[k].Info.Description)
				tempValueSlice = append(tempValueSlice, time.Unix(expiry[k].Info.ExpirationDate, 0).Format("01/02/2006"))
				tempValueSlice = append(tempValueSlice, Name)
				tempValueSlice = append(tempValueSlice, expiry[k].Info.DocumentId)

				documentsViewModels.Values = append(documentsViewModels.Values, tempValueSlice)
				tempValueSlice = tempValueSlice[:0]
			}

		}
	case false :
		log.Println(helpers.ServerConnectionError)
	}
	documentsViewModels.Keys = expiryKeySlice
	documentsViewModels.CompanyTeamName = storedSession.CompanyTeamName
	documentsViewModels.CompanyPlan = storedSession.CompanyPlan
	c.Data["vm"] = documentsViewModels
	c.TplName = "template/shareddocument.html"
}






