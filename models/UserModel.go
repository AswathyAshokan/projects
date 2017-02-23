/*Created by Arjun Ajith on 21/02/2017*/

package models

type Users struct {
	Expiry			[]Expiry
	Info			UserInfo
	NextOfKin		NextOfKin
	Settings		UserSettings
	SocialNetworks		UserSocialNetworks
}

type Expiry struct {
	Alert			string
	DateOfExpiry		string
	Description		string
	DocumentLocation	string
	Mode			string
	Notify			string
	Type			string
}

type UserInfo struct {
	Address			string
	DateOfBirth		int64
	Email			string
	FullName		string
	Phone			int64
	UserName		string
}

type NextOfKin struct {
	KinEmail		string
	KinName			string
	KinPhone		int64
	Relation		string
}

type UserSettings struct {
	DateOfCreation		int64
	Status			string
}

type UserSocialNetworks struct {
	FacebookId		string
	SkypeId			string
}