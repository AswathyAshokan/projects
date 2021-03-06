package viewmodels

type InviteUserViewModel struct {
	FirstName      		string
	LastName      		string
	EmailId        		string
	UserType      		string
	Status         		string
	UserResponse      	string
	DateOfCreation 		int64
	InviteUserKey  		[]string
	PageType        	string
	InviteId        	string
	Values           	[][]string
	Keys             	[]string
	CompanyTeamName		string
	CompanyPlan		string
	AdminFirstName		string
	AdminLastName		string
	ProfilePicture		string
	NotificationArray	[][]string
	NotificationNumber       int
}

type EditInviteUserViewModel struct {
	FirstName      		string
	LastName      		string
	EmailId        		string
	UserType      		string
	Status         		string
	PageType        	string
	InviteId        	string
	CompanyTeamName		string
	CompanyPlan		string
	AdminFirstName		string
	AdminLastName		string
	ProfilePicture		string
	UserResponse      	string
	NotificationArray	[][]string
	NotificationNumber       int

}
type AddInviteUserViewModel struct {
	CompanyTeamName		string
	CompanyPlan		string
	AllowInvitations	bool
	AdminFirstName		string
	AdminLastName		string
	ProfilePicture		string
	NotificationArray	[][]string
	NotificationNumber       int
}
