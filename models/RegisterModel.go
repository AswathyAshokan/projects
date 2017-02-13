/*Author: Sarath
Date:01/02/2017*/
package models

import (
	"golang.org/x/net/context"
	"log"
	//"encoding/json"
	"reflect"
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

func (m *CompanyAdmins)AddUser(ctx context.Context) bool {

	dB, err := GetFirebaseClient(ctx, "")
	if err != nil {
		log.Println("No Db Connection!")
	}
	//err = dB.Child("CompanyAdmins").Child("aswathy@gmailcom").Set(m)
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



