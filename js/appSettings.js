
//for local machine

//var PATH = 'http://localhost:42865/db/api/'; 

//for dev server
var PATH = 'http://54.201.43.89/landlords/db/api/';

var URLs = {
    Login: PATH + 'Users/Login',
    Register: PATH + 'Users/RegisterLandlord',
    PasswordRest: PATH + "Users/ResetPassword",

    // Profile APIs
    GetProfileData: PATH + 'Users/GetUserInfo',
    EditProfileData: PATH + 'Users/EditUserInfo',
    UploadLandlordProfileImage: PATH + 'Users/UploadLandlordProfileImage',

    // Property APIs
    AddProperty: PATH + 'Properties/AddNewProperty',
    SetPropertyStatus: PATH + 'Properties/SetPropertyStatus',
    GetProperties: PATH + 'Properties/LoadProperties',
    RemoveProperty: PATH + 'Properties/DeleteProperty',
    GetPropertyDetails: PATH + 'Properties/GetPropertyDetailsPageData',
    EditProperty: PATH + 'Properties/EditProperty',
    UploadPropertyImage: PATH + 'Properties/UploadPropertyImage',

    // Unit APIs
    AddNewUnitInProperty: PATH + 'Properties/AddNewUnitInProperty',
    DeletePropertyUnit: PATH + 'Properties/DeletePropertyUnit',

    // Accout Stats
    GetAccountCompletionStats: PATH + 'Users/GetAccountCompletetionStatsOfGivenLandlord',
    ResendVerificationEmailAndSMS: PATH + 'Users/ResendVerificationEmailAndSMS',
    SendEmailsToTenants: PATH + 'Users/SendEmailsToTenants'
};
