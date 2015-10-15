noochForLandlords

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function ($resource) {
        this.getMessage = function (img, user, text) {
            var gmList = $resource("data/messages-notifications.json");

            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])


    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function ($resource) {
        this.getTodo = function (todo) {
            var todoList = $resource("data/todo.json");

            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================

    .service('recentitemService', ['$resource', function ($resource) {
        this.getRecentitem = function (id, name, price) {
            var recentitemList = $resource("data/recent-items.json");

            return recentitemList.get({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Properties Widget Data
    // =========================================================================

    .service('propertiesService', ['$http', '$resource', 'authenticationService', function ($http, $resource, authenticationService) {

        var Operations = {};

        Operations.SaveProperty = function (propertyData, memberId, accessToken, callback) {

            var data = {};
            data.PropertyName = propertyData.propertyName;
            data.Address = propertyData.propertyAddress;
            data.City = propertyData.propertyCity;
            data.Zip = propertyData.propertyZip;

            data.IsPropertyImageAdded = propertyData.IsPropertyImageSelected;
            data.PropertyImage = propertyData.propertyImage;
            data.IsMultipleUnitsAdded = propertyData.IsMultipleUnitsAdded;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };


            if (propertyData.IsMultiUnitProperty == true) {
                data.Unit = propertyData.allUnits;
                data.IsMultipleUnitsAdded = true;
            }
            else {

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
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };

        Operations.AddNewUnit = function (propertyId, unitData, memberId, accessToken, callback) {

            var data = {};


            data.PropertyId = propertyId;
            data.Unit = unitData;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };



            $http.post(URLs.AddNewUnitInProperty, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };


        Operations.EditProperty = function (propertyData, memberId, accessToken, callback) {

            var data = {};
            data.PropertyName = propertyData.propertyName;
            data.Address = propertyData.propertyAddress;
            data.City = propertyData.propertyCity;
            data.Zip = propertyData.propertyZip;
            data.State = propertyData.state;
            data.ContactNumber = propertyData.contactNum;
            data.PropertyId = propertyData.propId;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.EditProperty, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };


        Operations.SetPropertyStatus = function (propertyId, propertyStatus, memberId, accessToken, callback) {

            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = propertyStatus;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };


            $http.post(URLs.SetPropertyStatus, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        //console.log('came in success');
                    }
                    callback(response);
                });
        };


        Operations.GetProperties = function (memberId, accessToken, callback) {
            //console.log('get properties called user details -> ' + memberId + ' ' + accessToken);

            var data = {};

            data.LandlorId = memberId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetProperties, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                    }
                    callback(response);
                });
        };

        // to remove property
        Operations.RemoveProperty = function (propertyId, memberId, accessToken, callback) {

            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.RemoveProperty, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        //console.log('came in success');
                    }
                    callback(response);
                });
        };

        return Operations;
    }])

    .service('propDetailsService', ['$http', 'authenticationService', '$resource', function ($http, authenticationService, $resource) {
        // FOR GOING TO THE INDIDVIDUAL PROPERTY'S DETAILS PAGE
        var selectedProp = {};
        var selectedPropDetails = {};

        function set(propId) {
            selectedProp.propId = propId;
            console.log('selected prop id -> ' + selectedProp.propId);
        }

        function get() {
            return selectedProp.propId;
        }

        function getPropertyDetailsFromDB(propertyId, memberId, accessToken, callback) {
            var data = {};

            data.PropertyId = propertyId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.GetPropertyDetails, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        //console.log('came in success');
                    }
                    callback(response);
                });
        }


        function deleteUnitFromProperty(unitId, memberId, accessToken, callback) {
            var data = {};

            data.PropertyId = unitId;
            data.PropertyStatusToSet = false;

            data.User = {
                LandlorId: memberId,
                AccessToken: accessToken
            };

            $http.post(URLs.DeletePropertyUnit, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        //console.log('came in success');
                    }
                    callback(response);
                });
        }

        function get2() {
            var User = $resource('data/properties.json/:id', { id: '@id' });
            console.log(User.get({ id: 4 }));
            /*var user = User.get({ userId: 123 }, function () {
                user.abc = true;
                user.$save();
            });*/
        }

        return {
            set: set,
            get: get,
            get2: get2,
            getPropFromDb: getPropertyDetailsFromDB,
            deleteUnit: deleteUnitFromProperty
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
    .service('nicescrollService', function () {
        var ns = {};
        ns.niceScroll = function (selector, color, cursorWidth) {
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

    .service('growlService', function () {
        var gs = {};
        gs.growl = function (message, type) {
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

    .service('authenticationService', function ($http) {

        var Operations = {};

        Operations.Login = function (username, password, ip, callback) {

            var data = {};
            data.UserName = username;
            data.Password = password;
            data.Ip = ip;

            console.log(data);

            $http.post(URLs.Login, data)
                .success(function (response) {
                    callback(response);
                });
        };


        Operations.RegisterLandlord = function (firstName, lastName, username, password, fingerprint, ip, country, callback) {

            var data2 = {};
            data2.FirstName = firstName;
            data2.LastName = lastName;
            data2.eMail = username;
            data2.Password = password;
            data2.fingerprint = fingerprint;
            data2.ip = ip;
            data2.country = country;

            $http.post(URLs.Register, data2)
                .success(function (response) {
                    callback(response);
                });
        };


        Operations.getMemberId = function (username, callback) {
            $http.get('https://www.noochme.com/NoochService/NoochService.svc/GetMemberIdByUserName?userName=' + username)
                .success(function (response) {
                    console.log(response);
                    callback(response);
                });
        }


        Operations.PasswordRest = function (eMail, callback) {

            var data2 = {};
            data2.eMail = eMail;

            $http.post(URLs.PasswordRest, data2)
                .success(function (response) {
                    callback(response);
                });
        };


        Operations.SetUserDetails = function (username, memberId, accessToken) {
            localStorage.setItem('username', username);
            localStorage.setItem('memberId', memberId);
            localStorage.setItem('accessToken', accessToken);
        };


        Operations.ClearUserData = function () {
            localStorage.clear();
        };


        Operations.GetUserDetails = function () {
            var User = {};
            User.username = localStorage.getItem('username');
            User.memberId = localStorage.getItem('memberId');
            User.accessToken = localStorage.getItem('accessToken');

            return User;
        };


        Operations.IsValidUser = function () {
            var User = {};
            User.username = localStorage.getItem('username');
            User.memberId = localStorage.getItem('memberId');
            User.accessToken = localStorage.getItem('accessToken');

            if (User.username == null || User.memberId == null || User.accessToken == null) {
                return false;
            }
            if (User.username.length > 0 && User.memberId.length > 0 && User.accessToken.length > 0)
                return true;
            else
                return false;
        };


        Operations.ManageToken = function (tokenResponse) {
            if (tokenResponse.IsTokenUpdated == true) {
                localStorage.setItem('accessToken', tokenResponse.AccessToken);
            }
        };

        return Operations;
    })



    // =========================================================================
    // Profile data read service
    // =========================================================================

    .service('getProfileService', function ($http, authenticationService) {

        var Operations = {};


        Operations.GetAccountCompletionStats = function (landlordId, accessToken, callback) {

            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetAccountCompletionStats, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };


        Operations.ResendVerificationEmailOrSMS = function (userId, userType, requestFor, callback) {

            var data = {};
            data.UserId = userId;
            data.UserType = userType;
            data.RequestFor = requestFor;

            $http.post(URLs.ResendVerificationEmailAndSMS, data)
                .success(function (response) {
                    callback(response);
                });
        };


        Operations.SendEmailsToTenants = function (userId, accessTok, emailObj, callback) {

            var dataDevice = {};
            dataDevice.LandlorId = userId;
            dataDevice.AccessToken = accessTok;

            var data = {};
            data.DeviceInfo = dataDevice;
            data.EmailInfo = emailObj;


            $http.post(URLs.SendEmailsToTenants, data)
                .success(function (response) {
                    callback(response);
                });
        };


        Operations.GetData = function (landlordId, accessToken, callback) {

            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetProfileData, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };

        // to update profile info of user
        Operations.UpdateInfo = function (userInfo, deviceInfo, callback) {

            var data = {};

            var userInfoObj = {};
            var deviceInfoObj = {
                LandlorId: deviceInfo.LandlorId,
                AccessToken: deviceInfo.AccessToken
            };

            var ssnToSend = "";
            if (typeof userInfo.ssnLast4 !== 'undefined') { // Only sending the SSN from the ID ver wizard, not the regular profile anymore (10/13/15)
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

            $http.post(URLs.EditProfileData, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess == true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                        // console.log('came in success');
                    }
                    callback(response);
                });
        };


        // Submitting ID Verification Wizard Responses
        Operations.submitIdVerWizard = function (deviceInfo, fullName, birthDay, ssnLast4, address, zip, callback) {

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
            };

            data.DeviceInfo = deviceInfoObj;

            $http.post(URLs.submitIdVerWizard, data)
                .success(function (response) {
                    console.log('Services.js -> submitIdVerWizard response SUCCESS');

                    callback(response);
                });
        };

        return Operations;
    })


    // =========================================================================
    // Bank Accounts Data
    // =========================================================================
    .service('getBanksService', function ($http, authenticationService) {

        var Operations = {};

        Operations.getBanks = function (landlordId, accessToken, callback) {

            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;

            $http.post(URLs.GetBanks, data)
                .success(function (response) {
                    console.log("Services -> GetBanks -> SUCCESS!");
                    callback(response);
                });
        };
    })