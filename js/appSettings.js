var PATH = 'http://noochme.com/landlords/db/api/';
//var PATH = 'http://localhost:42865/db/api/';

var URLs = {
    LoginWithFB: PATH + 'Users/LoginWithFB',
    Login: PATH + 'Users/Login',
    Register: PATH + 'Users/RegisterLandlord',
    PasswordRest: PATH + "Users/ResetPassword",
    UpdatePw: PATH + "Users/ChangeUserPassword",

    // Profile APIs
    GetProfileData: PATH + 'Users/GetUserInfo',
    EditProfileData: PATH + 'Users/EditUserInfo',
    submitIdVerWizard: PATH + 'Users/submitLandlordIdVerWiz',
    UploadLandlordProfileImage: PATH + 'Users/UploadLandlordProfileImage',

    // Bank APIs
    GetBanks: PATH + 'Users/GetBankAccountDetails',
    DeleteBank: PATH + 'Users/DeleteSynapseBankAccount',

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
    EditUnitInProperty: PATH + 'Properties/EditPropertyUnit',
    DeletePropertyUnit: PATH + 'Properties/DeletePropertyUnit',
    InviteTenant: PATH + 'Properties/InviteTenant',

    // Account Stats
    GetAccountCompletionStats: PATH + 'Users/GetAccountCompletetionStatsOfGivenLandlord',
    ResendVerificationEmailAndSMS: PATH + 'Users/ResendVerificationEmailAndSMS',
    SendEmailsToTenants: PATH + 'Users/SendEmailsToTenants'
};