package models

import (
	"log"
	"golang.org/x/net/context"
	"reflect"
	"time"
)


//Fetch all the details of invite user from database

func GetAllInvitationDetail(ctx context.Context,userId string) (CompanyInvitations,bool) {
	//user := User{}
	companyData := map[string]Company{}
	var keySlice []string
	invitationData := CompanyInvitations{}
	db,err :=GetFirebaseClient(ctx,"")
	/*err = db.Child("/Invitation/"+userId+"/Info").Value(&invitationDetails)
	if err != nil {
		log.Fatal(err)
		return invitationDetails,false
	}*/
	err = db.Child("Company").Value(&companyData)
	if err != nil {
		log.Println("t3")
		return invitationData,false
	}
	dataValue := reflect.ValueOf(companyData)
	for _, key := range dataValue.MapKeys() {
		keySlice = append(keySlice, key.String())
	}
	for _, key := range keySlice {
		err = db.Child("Company/" + key + "/Invitation/" + userId).Value(&invitationData)
		log.Println("haii",invitationData)
		if err != nil {
			log.Println("t4")
			return invitationData,false
		}
	}
	return invitationData,true
}



func GetAllUserDetail(ctx context.Context,tempEmailId string ) (map[string]Users) {
	usersDetails := map[string]Users{}
	db,err :=GetFirebaseClient(ctx,"")
	if err != nil{
		log.Fatal(err)
		return usersDetails
	}
	err = db.Child("Users").OrderBy("Info/Email").EqualTo(tempEmailId).Value(&usersDetails)
	log.Println("gggg",usersDetails)
	if err != nil{
		log.Println(err)

		return usersDetails
	}
	return usersDetails
}


func GetExpireDetailsOfUser(ctx context.Context,specifiedUserId string ) (map[string]Expirations,bool,string) {
	expiryDetails := map[string]Expirations{}
	var fullName string
	db, err := GetFirebaseClient(ctx, "")
	if err != nil {
		log.Fatal(err)
		return expiryDetails, false,fullName
	}
	err = db.Child("Users/"+specifiedUserId+"/Info/FullName").Value(&fullName)
	err = db.Child("/Expirations/"+specifiedUserId).Value(&expiryDetails)
	if err != nil{
		log.Fatal(err)
		return expiryDetails, false,fullName
	}
	return expiryDetails,true,fullName


}
func GetAllSharedDocumentsByCompany(ctx context.Context,companyTeamname string )(Expirations,bool,string,[]string,[][]string){
	//companyData :=map[string]Company{}
	var KeySlice []string
	var AllSharedfile [][]string

	expiryDetails := map[string]Expirations{}
	CompanyDetails := map[string]CompanyData{}
	eachExpiry :=map[string]Expirations{}
	selectedExpiry := Expirations{}
	var fullName string
	db,err :=GetFirebaseClient(ctx,"")
	if err != nil{
		log.Fatal(err)
	}
	err = db.Child("Expirations").Value(&expiryDetails)
	log.Println("expiryDetails",expiryDetails)
	dataValue := reflect.ValueOf(expiryDetails)
	for _, key := range dataValue.MapKeys() {
		log.Println("kety out ",key)
		err = db.Child("Users/"+key.String()+"/Info/FullName").Value(&fullName)
		err = db.Child("/Expirations/"+key.String()).Value(&eachExpiry)

		eachDataValues := reflect.ValueOf(eachExpiry)
		for _, k := range eachDataValues.MapKeys() {
			err = db.Child("/Expirations/"+key.String()+"/"+k.String()+"/Company").Value(&CompanyDetails)
			companyDataValues := reflect.ValueOf(CompanyDetails)
			for _, companykey := range companyDataValues.MapKeys() {
				if companykey.String() == companyTeamname{
					err = db.Child("/Expirations/"+key.String()+"/"+k.String()).Value(&selectedExpiry)

				}
				var tempSlice	[]string
				log.Println("yyyyyyyy",selectedExpiry)
				if selectedExpiry.Info.Mode =="Public" {
					KeySlice = append(KeySlice,k.String())
					tempSlice = append(tempSlice, selectedExpiry.Info.Description)
					tempSlice = append(tempSlice, time.Unix(selectedExpiry.Info.ExpirationDate, 0).Format("01/02/2006"))

					tempSlice = append(tempSlice, fullName)
					tempSlice = append(tempSlice, selectedExpiry.Info.DocumentId)
					AllSharedfile = append(AllSharedfile, tempSlice)
				}





			}
		}
	}

	return selectedExpiry,true,fullName,KeySlice,AllSharedfile


}


