/*Created By Farsana*/
package models


import (
	"golang.org/x/net/context"
	"log"
	"app/passporte/helpers"
	"reflect"
)

type Customers struct {
	Info     CustomerData
	Settings CustomerSettings

}

type CustomerData struct {
	CustomerName		string
	ContactPerson		string
	Address			string
	Phone			string
	Email			string
	State			string
	ZipCode			string
	CompanyTeamName		string

}

type CustomerSettings struct {
	Status           string
	DateOfCreation   int64
}



// Add new customers to database
func(m *Customers) AddCustomersToDb(ctx context.Context) (bool){
	db,err :=GetFirebaseClient(ctx,"")
	if err != nil {
		log.Println(err)
	}
	_,err = db.Child("Customers").Push(m)
	if err != nil {
		log.Println(err)
		return false
	}
	return  true
}

// Fetch all the details of customer from database
func GetAllCustomerDetails(ctx context.Context,companyTeamName string) (map[string]Customers,bool){
	//user := User{}
	db,err :=GetFirebaseClient(ctx,"")
	allCustomerDetails := map[string]Customers{}
	err = db.Child("Customers").OrderBy("Info/CompanyTeamName").EqualTo(companyTeamName).Value(&allCustomerDetails)
	if err != nil {
		log.Fatal(err)
		return allCustomerDetails,false
	}
	return allCustomerDetails,true
}

// delete customer from database using customer id
func(m *Customers) DeleteCustomerById(ctx context.Context,customerKey string) bool{
	customerSettingsUpdation := CustomerSettings{}
	customerDeletion := CustomerSettings{}
	db,err :=GetFirebaseClient(ctx,"")
	err = db.Child("/Customers/"+ customerKey+"/Settings").Value(&customerSettingsUpdation)
	if err != nil {
		log.Fatal(err)
		return  false
	}
	customerDeletion.Status = helpers.StatusInActive
	customerDeletion.DateOfCreation = customerSettingsUpdation.DateOfCreation
	err = db.Child("/Customers/"+customerKey+"/Settings").Update(&customerDeletion)
	if err != nil {
		log.Fatal(err)
		return  false
	}
	return  true
}

//get all the values of a customer using customer id for editing purpose
func(m *Customers) EditCustomer(ctx context.Context,customerId string) (Customers,bool){

	value := Customers{}
	db,err :=GetFirebaseClient(ctx,"")
	err = db.Child("/Customers/"+customerId).Value(&value)
	if err != nil {
		log.Fatal(err)
		return value , false
	}
	return value,true
}

//update the customer profile
func(m *Customers) UpdateCustomerDetailsById(ctx context.Context,customerId string) (bool) {
	db,err :=GetFirebaseClient(ctx,"")
	customerSettingsDetails := CustomerSettings{}
	err = db.Child("/Customers/"+ customerId+"/Settings").Value(&customerSettingsDetails)
	if err != nil {
		log.Fatal(err)
		return  false
	}
	m.Settings.Status = customerSettingsDetails.Status
	m.Settings.DateOfCreation = customerSettingsDetails.DateOfCreation
	err = db.Child("/Customers/"+ customerId).Update(&m)
	if err != nil {
		log.Fatal(err)
		return  false
	}
	return true
}

//check customer name is already exist
func IsCustomerNameUsed(ctx context.Context,customerName string)(bool) {
	customerDetails := map[string]Customers{}
	db, err := GetFirebaseClient(ctx, "")
	if err != nil {
		log.Println("No Db Connection!")
	}
	err = db.Child("Customers").OrderBy("Info/CustomerName").EqualTo(customerName).Value(&customerDetails)
	if err != nil {
		log.Fatal(err)
	}
	if len(customerDetails)==0{
		return true
	} else {
		dataValue := reflect.ValueOf(customerDetails)
		for _, key := range dataValue.MapKeys() {
			if customerDetails[key.String()].Settings.Status == helpers.StatusActive {
				return false
			}
		}

	}
	return true


}




