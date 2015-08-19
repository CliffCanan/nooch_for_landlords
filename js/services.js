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
        //this.getProperties = function(id, img, propName, address, units, tenants) {
        //    var propertyList = $resource("data/properties.json");

        //    return propertyList.get({
        //        id: id,
        //        img: img,
        //        propName: propName,
        //        address: address,
        //        units: units,
        //        tenants: tenants
        //    });
        //};
        var Operations = {};

        Operations.SaveProperty = function (propertyData,memberId, accessToken, callback) {

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
            AccessToken : accessToken
            };


            if (propertyData.IsMultiUnitProperty == true) {
                data.Unit = propertyData.allUnits;
                data.IsMultipleUnitsAdded = true;
            } else {

                var data1 = {
                    UnitNum: propertyData.propertyName,
                    Rent: propertyData.SingleUnitRent,
                    IsAddedWithProperty : true

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



        Operations.SetPropertyStatus = function (propertyId, propertyStatus,memberId, accessToken, callback) {

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
            console.log('get properties called user details -> ' + memberId + ' ' + accessToken);
            var data = {};

            data.LandlorId = memberId;
            data.AccessToken = accessToken;


            $http.post(URLs.GetProperties, data)
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

    .service('propDetailsService', ['$resource', function ($resource) {
        // FOR GOING TO THE INDIDVIDUAL PROPERTY'S DETAILS PAGE
        var selectedProp = {};

        function set(propId) {
            selectedProp = propId;
            console.log(selectedProp);
        }

        function get() {
            return selectedProp;
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
            get2: get2
        }
    }])


    // =========================================================================
    // Tenants Service (For Property Details Page)
    // =========================================================================

    .service('getTenantsService', ['$resource', function ($resource) {
        this.getTenants = function (id, name, nickname, logo, last4, status, dateAdded, notes) {
            var tenantList = $resource("data/tenantsList.json");

            console.log("SERVICES for TENANTS reached");

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
    }])

    // =========================================================================
    // Bank Accounts Data
    // =========================================================================

    .service('getBanksService', ['$resource', function ($resource) {
        this.getBank = function (id, name, nickname, logo, last4, status, dateAdded, notes) {
            console.log("getBanksService reached");

            var bankList = $resource("data/bankAccountsList.json");

            return bankList.get({
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
    }])


    // =========================================================================
    // Nice Scroll - Custom Scroll bars
    // =========================================================================
    .service('nicescrollService', function () {
        var ns = {};
        ns.niceScroll = function (selector, color, cursorWidth) {
            $(selector).niceScroll({
                cursorcolor: color,
                cursorborder: 0,
                cursorborderradius: 0,
                cursorwidth: cursorWidth,
                bouncescroll: true,
                mousescrollstep: 100,
                autohidemode: false
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
        Operations.Login = function (username, password, callback) {

            var data = {};
            data.UserName = username;
            data.Password = password;
            data.Ip = '202.102.222.111';

            console.log(data);

            $http.post(URLs.Login, data)
                .success(function (response) {
                    callback(response);
                });
        };

        Operations.SetUserDetails = function (username, memberId, accessToken) {
            
            localStorage.setItem('username', username);
            localStorage.setItem('memberId', memberId);
            localStorage.setItem('accessToken', accessToken);

        };

        Operations.ClearUserData= function () {
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
        Operations.GetData = function (landlordId,accessToken, callback) {

            var data = {};
            data.LandlorId = landlordId;
            data.AccessToken = accessToken;
            
            $http.post(URLs.GetProfileData, data)
                .success(function (response) {
                    if (response.IsSuccess && response.IsSuccess==true) {
                        authenticationService.ManageToken(response.AuthTokenValidation);
                       // console.log('came in success');
                    }
                    callback(response);
                });
        };

        
        return Operations;


    })


