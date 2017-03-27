package controllers

import (
	"reflect"
	"app/passporte/helpers"
	"app/passporte/models"
	"app/passporte/viewmodels"
	"log"
	"strconv"
)

type CustomerManagementController struct {
	BaseController
}

func (c *CustomerManagementController) CustomerManagement() {
	r := c.Ctx.Request
	w := c.Ctx.ResponseWriter

	storedSession := ReadSessionForSuperAdmin(w,r)
	log.Println("read session:",storedSession)
	customerManagementViewModel := viewmodels.CustomerManagement{}
	dbStatus,allCompanyData:= models.GetAllRegisteredCompanyDetails(c.AppEngineCtx)
	switch dbStatus {
	case true:
		log.Println("cp12")
		dataValue := reflect.ValueOf(allCompanyData)
		var keySlice []string
		for _, key := range dataValue.MapKeys() {
			keySlice = append(keySlice, key.String())
		}

		var adminKeyFromCompany []string
		for _, k := range keySlice {
			var tempValueSlice []string
			if allCompanyData[k].Settings.Status == helpers.StatusActive{
				tempValueSlice = append(tempValueSlice, allCompanyData[k].Info.CompanyName)
				tempValueSlice = append(tempValueSlice, allCompanyData[k].Info.Address)
				dataValue := reflect.ValueOf(allCompanyData[k].Admins)

				for _, key := range dataValue.MapKeys() {
					adminKeyFromCompany = append(adminKeyFromCompany, key.String())
				}
				adminStatus,adminDetails := models.GetAdminDetailsById(c.AppEngineCtx, adminKeyFromCompany)
				switch adminStatus {
				case true:
					log.Println("cp13")
					tempValueSlice = append(tempValueSlice,adminDetails.Info.FirstName)
					tempValueSlice = append(tempValueSlice,adminDetails.Info.Email)
					tempValueSlice = append(tempValueSlice,adminDetails.Info.PhoneNo)
				case false:
					log.Println("false")
				}
				tempValueSlice = append(tempValueSlice, strconv.FormatInt(allCompanyData[k].Settings.DateOfCreation,10))
				tempValueSlice = append(tempValueSlice,allCompanyData[k].Plan)
				customerManagementViewModel.Values = append(customerManagementViewModel.Values,tempValueSlice)
				tempValueSlice = tempValueSlice[:0]

			}
			customerManagementViewModel.Keys = keySlice
			c.Data["vm"] = customerManagementViewModel
			c.Layout = "layout/layout-superadmin.html"
			c.TplName = "template/customer-management.html"
			}

	case false:
		log.Println(helpers.ServerConnectionError)
	}
}


/*To delete selected record from database*/

func (c *CustomerManagementController)LoadDeleteCustomerManagement() {
	w := c.Ctx.ResponseWriter
	customerManagementId :=c.Ctx.Input.Param(":customermanagementid")
	dbStatus:= models.DeleteCustomerManagementData(c.AppEngineCtx,customerManagementId)
	switch dbStatus {
	case true:
		w.Write([]byte("true"))
	case false :
		w.Write([]byte("false"))
	}


}





