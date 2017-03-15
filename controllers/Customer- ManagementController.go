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
	customerManagementViewModel := viewmodels.CustomerManagement{}
	dbStatus,allCompanyData:= models.GetAllRegisteredCompanyDetails(c.AppEngineCtx)
	switch dbStatus {
	case true:
		log.Println("compant test :",allCompanyData)
		dataValue := reflect.ValueOf(allCompanyData)
		var keySlice []string
		for _, key := range dataValue.MapKeys() {
			keySlice = append(keySlice, key.String())
		}

		var adminKeyFromCompany []string
		for _, k := range keySlice {
			var tempValueSlice []string
			/*if allCompanyData[k].Settings.Status == helpers.StatusActive{*/
				tempValueSlice = append(tempValueSlice, allCompanyData[k].Info.CompanyName)
				tempValueSlice = append(tempValueSlice, allCompanyData[k].Info.Address)
				dataValue := reflect.ValueOf(allCompanyData[k].Admins)

				for _, key := range dataValue.MapKeys() {
					adminKeyFromCompany = append(adminKeyFromCompany, key.String())
				}
				adminStatus,adminDetails := models.GetAdminDetailsById(c.AppEngineCtx, adminKeyFromCompany)
				switch adminStatus {
				case true:
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
			c.TplName = "template/customer-management.html"
			/*}*/

	case false:
		log.Println(helpers.ServerConnectionError)
	}
}


/*To delete selected record from database*/

func (c *CustomerManagementController)LoadDeleteCustomerManagement() {
	/*r := c.Ctx.Request*/
	/*w := c.Ctx.ResponseWriter*/
	customerManagementId :=c.Ctx.Input.Param(":customermanagementid")
	log.Println("iddd:",customerManagementId)
	/*company := models.Company{}*/
	dbStatus,companyDetails,adminDetails := models.DeleteCustomerManagementData(c.AppEngineCtx,customerManagementId)
	switch dbStatus {
	case true:
		log.Println("tttt", adminDetails,companyDetails)
		dataValue := reflect.ValueOf(adminDetails)
		for _, key := range dataValue.MapKeys() {
			adminStatus := adminDetails[key.String()]
			log.Println("haiiiii:",reflect.TypeOf(adminStatus),adminStatus)


		}
		/*companyDetails.Settings.Status = helpers.StatusInActive
		companyStatus := companyDetails.UpdateCompanyStatusToInactive(c.AppEngineCtx,customerManagementId)
		log.Println("tttt", adminDetails)
		switch companyStatus {
		case true:
			log.Println("cp6")
			adminStatus := adminDetails.UpdateAdminStatusToInactive(c.AppEngineCtx,customerManagementId)
			switch adminStatus {
			case true:
				log.Println("cp6")
				w.Write([]byte("true"))
			case false :
				w.Write([]byte("false"))
			}
		case false:
			log.Println(helpers.ServerConnectionError)

		}
*/
	case false :
		log.Println("falseee")
		/*w.Write([]byte("false"))*/
	}


}
