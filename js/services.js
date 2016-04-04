noochForLandlords

    // =========================================================================
    // Properties Widget Data
    // =========================================================================

    .service('propertiesService', ['$http', '$resource', 'authenticationService', function ($http, $resource, authenticationService)
    {
        var Operations = {};

        Operations.SaveProperty = function (propertyData, landlordId, memberId, accessToken, callback)
        {
            var data = {};
            data.PropertyName = propertyData.propertyName;
            data.Address = propertyData.propertyAddress;
            data.City = propertyData.propertyCity;
            data.Zip = propertyData.propertyZip;

            data.IsPropertyImageAdded = propertyData.IsPropertyImageSelected;
            data.PropertyImage = propertyData.propertyImage;
            data.IsMultipleUnitsAdded = propertyData.IsMultipleUnitsAdded;

            data.User = {
                LandlordId: landlordId,
                MemberId: memberId,
                AccessToken: accessToken
            };

            if (propertyData.IsMultiUnitProperty == true)
            {
                data.Unit = propertyData.allUnits;
                data.IsMultipleUnitsAdded = true;
            }
            else
            {
                var data1 = {
                    UnitNum: propertyData.propertyName,
                    Rent: propertyData.SingleUnitRent,
                    IsAddedWithProperty: true
                };

                data.Unit = new Array();

                data.Unit.push(data1);
                data.IsMultipleUnitsAdded = false;
            }

            $http.post(URLs.AddProperty, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.AddNewUnit = function (propertyId, unitData, landlordId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propertyId;
            data.Unit = unitData;

            data.User = {
                LandlordId: landlordId,
                AccessToken: accessToken
            };

            console.log(JSON.stringify(data));

            $http.post(URLs.AddNewUnitInProperty, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.EditUnitInProperty = function (propertyId, unitData, landlordId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propertyId;
            data.Unit = unitData;

            data.User = {
                LandlordId: landlordId,
                AccessToken: accessToken
            };


            $http.post(URLs.EditUnitInProperty, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.EditProperty = function (propertyData, landlordId, accessToken, callback)
        {
            var data = {};
            data.PropertyName = propertyData.propertyName;
            data.Address = propertyData.propertyAddress;
            data.City = propertyData.propertyCity;
            data.Zip = propertyData.propertyZip;
            data.State = propertyData.state;
            data.ContactNumber = propertyData.contactNum;
            data.PropertyId = propertyData.propId;

            data.User = {
                LandlordId: landlordId,
                AccessToken: accessToken
            };

            $http.post(URLs.EditProperty, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.SetPropertyStatus = function (propertyId, propertyStatus, memberId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = propertyStatus;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };


            $http.post(URLs.SetPropertyStatus, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.GetProperties = function (memberId, accessToken, callback)
        {
            //console.log('get properties called user details -> ' + memberId + ' ' + accessToken);

            var data = {};

            data.LandlorId = memberId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetProperties, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };

        // to remove property
        Operations.RemoveProperty = function (propertyId, memberId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.RemoveProperty, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.ChargeTenant = function (transInfo, landlordId, accessToken, memberId, callback)
        {
            var data = {};
            data.TransRequest = transInfo;

            data.User = {
                LandlordId: landlordId,
                AccessToken: accessToken,
                MemberId: memberId
            };

            console.log(JSON.stringify(data));

            $http.post(URLs.ChargeTenant, data)
                .success(function (response)
                {
                    console.log("Services -> Charge Tenant response...");
                    console.log(response);
                    //if (response.IsSuccess && response.IsSuccess == true) {
                    //    authenticationService.ManageToken(response.AuthTokenValidation);
                    //}
                    callback(response);
                });
        };


        return Operations;
    }])



    .service('propDetailsService', ['$http', 'authenticationService', '$resource', function ($http, authenticationService, $resource)
    {
        // FOR GOING TO THE INDIDVIDUAL PROPERTY'S DETAILS PAGE
        var selectedProp = {};
        var selectedPropDetails = {};

        function set(propId)
        {
            selectedProp.propId = propId;
            console.log('selected prop id -> ' + selectedProp.propId);
        }

        function get()
        {
            return selectedProp.propId;
        }

        function getPropertyDetailsFromDB(propertyId, memberId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };
            //console.log(JSON.stringify(data));
            $http.post(URLs.GetPropertyDetails, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        }


        function deleteUnitFromProperty(unitId, memberId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = unitId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.DeletePropertyUnit, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        }


        function inviteNewTenant(propId, unitId, email, fname, lname, rentAmount, landlordId, accessToken, callback)
        {
            var data = {};

            data.propertyId = propId;
            data.unitId = unitId;
            data.rent = rentAmount;

            data.authData = {
                LandlordId: landlordId,
                AccessToken: accessToken
            };

            data.tenant = {
                email: email,
                firstName: fname,
                lastName: lname
            }
            console.log(JSON.stringify(data));
            $http.post(URLs.InviteTenant, data)
                .success(function (response)
                {
                    console.log(response);
                    callback(response);
                });
        }


        function sendRequestToExistingTenant(transInfo, landlordId, memberId, propId, unitId, accessToken, callback)
        {
            var data = {};

            data.PropertyId = propId;
            data.UnitId = unitId;
            data.Amount = transInfo.Amount.replace(",", "");
            data.Memo = transInfo.Memo;
            data.TenetsMemberId = transInfo.TenantMemberId;

            data.User = {
                LandlordId: landlordId,
                AccessToken: accessToken,
                MemberId: memberId
            };

            console.log(JSON.stringify(data));

            $http.post(URLs.RequestRentToExistingTenant, data)
                .success(function (response)
                {
                    console.log(response);
                    callback(response);
                });
        }


        function saveMemoFormula(formulaChoice, landlordId, memberId, accessToken, callback)
        {
            var data = {};

            data.formulaToUse = formulaChoice;

            data.User = {
                LandlordId: landlordId,
                MemberId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.SaveMemoFormula, data)
                .success(function (response)
                {
                    if (response.success && response.success == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };

        return {
            set: set,
            get: get,
            getPropFromDb: getPropertyDetailsFromDB,
            deleteUnit: deleteUnitFromProperty,
            inviteNewTenant: inviteNewTenant,
            saveMemoFormula: saveMemoFormula,
            sendRequestToExistingTenant: sendRequestToExistingTenant
        }
    }])


    // =========================================================================
    // Tenants Service (For Property Details Page)
    // =========================================================================
    // CLIFF (9/25/15): PRETTY SURE THIS ISN'T NEEDED OR USED... I THINK THIS WAS OLD FROM WHEN I WAS EXPERIMENTING WITH THIS EARLY ON...
    /*.service('getTenantsService', ['$resource', function ($resource) {
        this.getTenants = function (id, name, nickname, logo, last4, status, dateAdded, notes) {
            var tenantList = $resource("data/tenantsList.json");

            return tenantList.get({
                id: id,
                name: name,
                nickname: nickname,
                logo: logo,
                last4: last4,
                status: status,
                dateAdded: dateAdded,
                notes: notes
            })
        }
    }])*/


    // =========================================================================
    // Nice Scroll - Custom Scroll bars
    // =========================================================================
    .service('nicescrollService', function ()
    {
        var ns = {};
        ns.niceScroll = function (selector, color, cursorWidth)
        {
            $(selector).niceScroll({
                cursorcolor: '#4fabe1',
                cursorborder: '8px',
                cursorborderradius: '8px',
                cursorwidth: cursorWidth,
                bouncescroll: true,
                mousescrollstep: 40,
                horizrailenabled: false
            });
        }

        return ns;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function ()
    {
        var gs = {};
        gs.growl = function (message, type)
        {
            $.growl({
                message: message
            }, {
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }

        return gs;
    })



    // =========================================================================
    // Authentication service
    // =========================================================================
    .service('authenticationService', function ($http)
    {
        var Operations = {};

        Operations.Login = function (username, password, ip, callback)
        {
            var data = {};
            data.UserName = username;
            data.Password = password;
            data.Ip = ip;

            console.log(data);

            $http.post(URLs.Login, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.FBLogin = function (email, firstName, lastName, gender, photoUrl, ip, fingerprint, fbUserId, callback)
        {
            var data = {};
            data.FirstName = firstName;
            data.LastName = lastName;
            data.eMail = email;
            data.Gender = gender;
            data.PhotoUrl = photoUrl;
            data.FacebookUserId = fbUserId;
            data.UserFingerPrints = fingerprint;
            data.Ip = ip;

            console.log(data);

            $http.post(URLs.LoginWithFB, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.GoogleLogin = function (email, name, photoUrl, ip, fingerprint, googleUserId, callback)
        {
            var data = {};
            data.Name = name;
            data.eMail = email;
            data.Gender = '';
            data.PhotoUrl = photoUrl;
            data.GoogleUserId = googleUserId;
            data.UserFingerPrints = fingerprint;
            data.Ip = ip;

            console.log(data);

            $http.post(URLs.LoginWithGoogle, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.RegisterLandlord = function (firstName, lastName, username, password, fingerprint, ip, country, isBiz, callback)
        {
            var data = {};
            data.FirstName = firstName;
            data.LastName = lastName;
            data.eMail = username;
            data.Password = password;
            data.fingerprint = fingerprint;
            data.ip = ip;
            data.country = country;
            data.isBusiness = isBiz;
            data.shouldSendEmails = true;

            console.log("Register Input: [" + JSON.stringify(data) + "]");

            $http.post(URLs.Register, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.getMemberId = function (username, callback)
        {
            $http.get('https://www.noochme.com/NoochService/NoochService.svc/GetMemberIdByUserName?userName=' + username)
                .success(function (response)
                {
                    console.log(response);
                    callback(response);
                });
        }


        Operations.PasswordRest = function (eMail, callback)
        {
            var data2 = {};
            data2.eMail = eMail;

            $http.post(URLs.PasswordRest, data2)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.updatePw = function (landlordId, accessToken, current, newPw, confirmPw, callback)
        {
            var AuthInfo = {};
            AuthInfo.LandlorId = landlordId;
            AuthInfo.AccessToken = accessToken;

            var data = {};
            data.AuthInfo = AuthInfo;
            data.currentPw = current;
            data.newPw = newPw;
            //console.log("[" + JSON.stringify(data) + "]");

            $http.post(URLs.UpdatePw, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.SetUserDetails = function (username, memberId, landlordId, accessToken)
        {
            if (username != "")
            {
                localStorage.setItem('username', username);
            }
            if (memberId != "")
            {
                localStorage.setItem('memberId', memberId);
            }
            if (landlordId != "")
            {
                localStorage.setItem('landlordId', landlordId);
            }
            if (accessToken != "")
            {
                localStorage.setItem('accessToken', accessToken);
            }
        };


        Operations.ClearUserData = function ()
        {
            localStorage.clear();
        };


        Operations.GetUserDetails = function ()
        {
            var User = {};
            User.username = localStorage.getItem('username');
            User.memberId = localStorage.getItem('memberId');
            User.landlordId = localStorage.getItem('landlordId');
            User.accessToken = localStorage.getItem('accessToken');
            //console.log(User);
            return User;
        };


        Operations.IsValidUser = function ()
        {
            var User = {};
            User.username = localStorage.getItem('username');
            User.landlordId = localStorage.getItem('landlordId');
            User.accessToken = localStorage.getItem('accessToken');

            if (User.username == null || User.landlordId == null || User.accessToken == null)
            {
                return false;
            }
            if (User.username.length > 0 && User.landlordId.length > 0 && User.accessToken.length > 0)
                return true;
            else
                return false;
        };


        Operations.ManageToken = function (tokenResponse)
        {
            if (tokenResponse.IsTokenUpdated == true)
            {
                localStorage.setItem('accessToken', tokenResponse.AccessToken);
                localStorage.setItem('memberId', tokenResponse.MemberId);
            }
        };

        return Operations;
    })



    // =========================================================================
    // Profile data read service
    // =========================================================================
    .service('getProfileService', function ($http, authenticationService)
    {
        var Operations = {};


        Operations.GetAccountCompletionStats = function (landlordId, accessToken, callback)
        {
            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetAccountCompletionStats, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.ResendVerificationEmailOrSMS = function (userId, userType, requestFor, callback)
        {
            var data = {};
            data.UserId = userId;
            data.UserType = userType;
            data.RequestFor = requestFor;
            //console.log("SERVICES -> ResendVerificationEmailOrSMS METHOD -> [" + JSON.stringify(data) + "]")

            $http.post(URLs.ResendVerificationEmailAndSMS, data)
                .success(function (response)
                {
                    console.log(response);
                    callback(response);
                });
        };


        Operations.SendEmailsToTenants = function (userId, accessTok, emailObj, callback)
        {
            var dataDevice = {};
            dataDevice.LandlorId = userId;
            dataDevice.AccessToken = accessTok;

            var data = {};
            data.DeviceInfo = dataDevice;
            data.EmailInfo = emailObj;

            $http.post(URLs.SendEmailsToTenants, data)
                .success(function (response)
                {
                    callback(response);
                });
        };


        Operations.GetData = function (landlordId, accessToken, callback)
        {
            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetProfileData, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };

        // to update profile info of user
        Operations.UpdateInfo = function (userInfo, deviceInfo, callback)
        {
            var data = {};

            var userInfoObj = {};
            var deviceInfoObj = {
                LandlorId: deviceInfo.LandlorId,
                AccessToken: deviceInfo.AccessToken,
                MemberId: deviceInfo.MemberId
            };

            var ssnToSend = "";
            if (typeof userInfo.ssnLast4 !== 'undefined')
            { // Only sending the SSN from the ID ver wizard, not the regular profile anymore (10/13/15)
                ssnToSend = userInfo.ssnLast4;
            }

            var userInfoObj = {
                DOB: userInfo.birthDay,
                SSN: ssnToSend,
                FullName: userInfo.fullName,

                CompanyName: userInfo.companyName,
                CompanyEID: userInfo.compein,

                UserEmail: userInfo.email,
                MobileNumber: userInfo.mobileNum,
                AddressLine1: userInfo.addressLine1,

                TwitterHandle: userInfo.twitterHandle,
                FbUrl: userInfo.fb,
                InstaUrl: userInfo.insta,

                InfoType: userInfo.InfoType
            };

            data.DeviceInfo = deviceInfoObj;
            data.UserInfo = userInfoObj;

            console.log("SERVICES -> SENDING DATA TO EDIT PROFILE METHOD -> [" + JSON.stringify(data) + "]")

            $http.post(URLs.EditProfileData, data)
                .success(function (response)
                {
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    console.log(response);
                    callback(response);
                });
        };


        // Submitting ID Verification Wizard Responses
        Operations.submitIdVerWizard = function (deviceInfo, fullName, birthDay, ssnLast4, address, zip, phone, callback)
        {
            var deviceInfoObj = {
                LandlorId: deviceInfo.LandlorId,
                AccessToken: deviceInfo.AccessToken
            };

            var data = {
                fullName: fullName,
                ssn: ssnLast4,
                dob: birthDay,
                staddress: address,
                zip: zip,
                phone: phone
            };

            data.DeviceInfo = deviceInfoObj;

            $http.post(URLs.submitIdVerWizard, data)
                .success(function (response)
                {
                    console.log('Services.js -> submitIdVerWizard response received');
                    console.log(response);
                    callback(response);
                });
        };

        return Operations;
    })


    // =========================================================================
    // Bank Accounts Data
    // =========================================================================
    .service('getBanksService', function ($http, authenticationService)
    {
        var Operations = {};

        Operations.getBanks = function (landlordId, accessToken, callback)
        {
            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetBanks, data)
                .success(function (response)
                {
                    callback(response);
                });
        };

        Operations.deleteBank = function (landlordId, memberId, accessToken, callback)
        {
            var data = {};
            data.LandlordId = landlordId;
            data.AccessToken = accessToken;
            data.MemberId = memberId;

            //console.log("[" + JSON.stringify(data) + "]");

            $http.post(URLs.DeleteBank, data)
                .success(function (response)
                {
                    console.log("Services -> DeleteBank -> Got a response!");
                    callback(response);
                });
        };

        return Operations;
    })


    // =========================================================================
    // HISTORY
    // =========================================================================
    .service('historyService', function ($http, authenticationService, $resource)
    {
        var Operations = {};

        Operations.GetHistory = function (landlordId, memberId, accessToken, callback)
        {
            console.log("Service -> GetHistory Initiated");

            var data = {};
            data.LandlordId = landlordId;
            data.AccessToken = accessToken;
            data.MemberId = memberId;

            console.log(JSON.stringify(data));

            $http.post(URLs.GetTransHistory, data)
                .success(function (response)
                {
                    console.log(response);
                    if (response.IsSuccess && response.IsSuccess == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        Operations.sendPaymentReminder = function (transactionId, tenantId, landlordId, accessToken, callback)
        {
            console.log("Service -> sendPaymentReminder Fired");

            var data = {};
            data.LandlordId = landlordId;
            data.AccessToken = accessToken;
            data.transId = transactionId;
            data.tenantId = tenantId

            console.log(JSON.stringify(data));

            $http.post(URLs.SendPaymentReminder, data)
                .success(function (response)
                {
                    console.log(response);

                    callback(response);
                });
        }


        Operations.cancelTransaction = function (transactionId, landlordId, memberId, accessToken, callback)
        {
            var data = {};

            data.TransId = transactionId;

            data.User = {
                LandlordId: landlordId,
                MemberId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.CancelTransaction, data)
                .success(function (response)
                {
                    if (response.success && response.success == true)
                    {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };


        return Operations;
    })



    /**********************/
    /**  UNUSED SERVICES **/
    /**********************/
    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function ($resource)
    {
        this.getTodo = function (todo)
        {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function ($resource)
    {
        this.getRecentitem = function (id, name, price)
        {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function ($resource)
    {
        this.getMessage = function (img, user, text)
        {
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])