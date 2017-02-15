/*Author: Sarath
Date:01/02/2017*/
package models

import (
	"golang.org/x/net/context"
	"log"
	//"encoding/json"
	"reflect"
	"golang.org/x/crypto/bcrypt"
)

type Info struct {
	FirstName	string
	LastName	string
	PhoneNo		string
	Email		string
	Password	[]byte
	CompanyName	string
	Address		string
	State		string
	ZipCode		string
}

type Settings struct {
	Status		string
	DateCreated  	int64
}
type CompanyAdmins struct {
	Info  Info
	Settings Settings
}

//Register new Company Admin
func (m *CompanyAdmins)AddUser(ctx context.Context) bool {

	dB, err := GetFirebaseClient(ctx, "")
	if err != nil {
		log.Println("No Db Connection!")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword(m.Info.Password, bcrypt.DefaultCost)
	if err != nil {
		log.Fatalln(err)
	}
	m.Info.Password = hashedPassword
	adminData, err := dB.Child("CompanyAdmins").Push(m)
	if err != nil {
		log.Println("Company Registration failed!")
		log.Println(err)
		return false
	} else {
		log.Println("Type:",reflect.TypeOf(adminData))
		return true
	}
}

func CheckEmailIsUsed(ctx context.Context, emailId string) bool{
	companyAdmins := CompanyAdmins{}
	dB, err := GetFirebaseClient(ctx, "")
	if err != nil {
		log.Println("No Db Connection!")
	}
	err = dB.Child("CompanyAdmins").OrderBy("Info/Email").EqualTo(emailId).Value(&companyAdmins)
	if err != nil {
		return true
	}
	return false
}
