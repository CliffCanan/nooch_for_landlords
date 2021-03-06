//var PATH = 'https://nooch.info/landlords/db/api/';
var PATH = 'https://www.noochme.com/landlords/db/api/';
var URLs = {
    LoginWithGoogle: PATH + 'Users/LoginWithGoogle',
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
    SaveMemoFormula: PATH + 'RentTrans/SaveMemoFormula',
    RequestRentToExistingTenant: PATH + 'RentTrans/RequestRentToExistingTenant',
    ChargeTenant: PATH + 'RentTrans/chargeTenant',

    // Unit APIs
    AddNewUnitInProperty: PATH + 'Properties/AddNewUnitInProperty',
    EditUnitInProperty: PATH + 'Properties/EditPropertyUnit',
    DeletePropertyUnit: PATH + 'Properties/DeletePropertyUnit',
    InviteTenant: PATH + 'Properties/InviteTenant',
    UploadLease: PATH + 'Properties/UploadPropertyUnitLeasePDF',

    // Account Stats
    GetAccountCompletionStats: PATH + 'Users/GetAccountCompletetionStatsOfGivenLandlord',
    ResendVerificationEmailAndSMS: PATH + 'Users/ResendVerificationEmailAndSMS',
    SendEmailsToTenants: PATH + 'Users/SendEmailsToTenants',

    // History APIs
    GetTransHistory: PATH + 'RentTrans/GetLandlordsPaymentHistory',
    SendPaymentReminder: PATH + 'RentTrans/SendPaymentReminder',
   // SendPaymentReminder: PATH + 'RentTrans/SendRentRemindersToTenants',
    CancelTransaction: PATH + 'RentTrans/CancelTrans'
};