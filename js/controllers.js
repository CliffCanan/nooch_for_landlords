noochForLandlords
    // ===============================================================
    //      Base controller for common functions
    // ===============================================================

    .controller('noochAdminCtrl', function ($rootScope, $window, $location, $timeout, $state, growlService, authenticationService) {

        if (!authenticationService.IsValidUser())
        {
            console.log("adminCtrl -> User no longer valid!");

            growlService.growl('Please login to continue!', 'inverse');
            //alert("User's auth token has expired... about to redirect to login page");
            window.location.href = 'login.html';
        }

        // Detect Mobile Browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
            angular.element('html').addClass('ismobile');
        }

        // By default Sidebars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false
        }

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');

        // For Mainmenu Active Class
        this.$state = $state;

        //Close sidebar on click
        this.sidebarStat = function (event) {
            if (!angular.element(event.target).parent().hasClass('active'))
            {
                this.sidebarToggle.left = false;
            }
        }

        // Google Analytics Code
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', { page: $location.url() });
        });
    })


    // ===============================================================
    //      HEADER
    // ===============================================================
    .controller('headerCtrl', function ($rootScope, $timeout, messageService, authenticationService) {
        if (!authenticationService.IsValidUser())
        {
            console.log("headCtrl -> User no longer valid!");
            window.location.href = 'login.html';
        }

        if (typeof $rootScope.userDetailsRoot == 'undefined')
        {
            //console.log($userDetailsRoot.imgUrl);
            $rootScope.userDetailsRoot = {};
        }

        this.closeSearch = function () {
            angular.element('#header').removeClass('search-toggled');
        }

        // Get Notifications for header
        /*this.img = messageService.img;
        this.user = messageService.user;
        this.user = messageService.text;

        this.messageResult = messageService.getMessage(this.img, this.user, this.text);

        // Clear Notification  (part of default template)
        this.clearNotification = function ($event) {
            $event.preventDefault();

            var x = angular.element($event.target).closest('.listview');
            var y = x.find('.lv-item');
            var z = y.size();

            angular.element($event.target).parent().fadeOut();

            x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
            x.find('.grid-loading').fadeIn(1500);
            var w = 0;

            y.each(function () {
                var z = $(this);
                $timeout(function () {
                    z.addClass('animated fadeOutRightBig').delay(1000).queue(function () {
                        z.remove();
                    });
                }, w += 150);
            })

            $timeout(function () {
                angular.element('#notifications').addClass('empty');
            }, (z * 150) + 200);
        }*/

        // Logout
        this.logout = function () {
            swal({
                title: "Are you sure?",
                text: "You are about to log out of Nooch.",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Yes - Logout",
                cancelButtonText: "No - Stay Logged In",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm)
                {
                    //localStorage.clear();
                    localStorage.setItem('userLoginPass', "");
                    window.location.href = 'login.html';
                }
            });
        }

        // Fullscreen View (part of default template)
        this.fullScreen = function () {
            //Launch
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen)
                {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen)
                {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen)
                {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen)
                {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if (document.exitFullscreen)
                {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }
            }

            if (exitFullscreen())
            {
                launchIntoFullscreen(document.documentElement);
            }
            else
            {
                launchIntoFullscreen(document.documentElement);
            }
        }
    })


    // ===============================================================
    //      HOME
    // ===============================================================
    .controller('homeCtrl', function ($rootScope, $scope, getProfileService, authenticationService) {

        setTimeout(function () {
            //console.log("***  INSIDE HOME -> SET TIMEOUT  ***");
            //console.log($rootScope.hasSeenNewUserTour);
            //console.log($rootScope.isIdVerified);

            // Check if New User Tour should be displayed
            if ($rootScope.hasSeenNewUserTour != true && $rootScope.isIdVerified != true)
            {
                console.log('HOME -> starting tour!');

                // Instance the tour
                $scope.tour = new Tour({
                    name: 'newLandlordUserTour',
                    //storage: false, // Setting this to 'false' makes it run every time
                    backdrop: true,
                    orphan: true, //Allow to show the step regardless whether its element is not set, is not present in the page or is hidden. The step is fixed positioned in the middle of the page.
                    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='prev'><span class='md md-keyboard-arrow-left'></span></button>&nbsp;&nbsp;<button class='btn btn-default m-l-5' data-role='next'><span class='md md-keyboard-arrow-right'></span></button><button class='btn btn-default' data-role='end'>Got it!</button></div></div>",
                    onStart: function (tour) {
                        // The tour won't display correctly if a parent element uses any Animate.css classes... so just removing them on init
                        $('#acntChklst').removeClass('animated fadeInRightSm');
                    },
                    steps: [
                        {
                            element: ".tour-step#tour-step-one",
                            title: "Welcome To Nooch For Landlords!",
                            content: "This is your dashboard. You can see the key details of your account here.",
                            animation: true,
                            backdropPadding: 10,
                            placement: "bottom"
                        },
                        {
                            element: "#sidebar",
                            title: "Find What You Need",
                            content: "Use this menu to navigate to the info you need.",
                            placement: "right",
                            backdropPadding: 6,
                            onShow: function (tour) {
                                $('#sidebar').css('z-index', '1105'); // this fixes an issue where the Tour backdrop would cover up the sidebar
                            },
                            onHide: function (tour) {
                                $('#sidebar').css('z-index', '5'); // return to regular z-index
                            }
                            //backdrop: false
                        },
                        {
                            element: "#acntChecklistCard",
                            title: "How To Get Started",
                            content: "Check out this list to see how to complete your account and start getting paid.  This checklist will show your progress as you complete each step.",
                            placement: "left",
                            backdropPadding: 6
                        },
                        {
                            element: ".tour-step.tour-step-3",
                            title: "Safey First",
                            content: "To get started, please complete your profile to verify your identity. It takes less than 60 seconds and helps keep Nooch the safe and secure way to collect rent online.",
                            animation: true,
                            placement: "left",
                            backdropPadding: 5
                        }
                    ]
                });

                // Initialize the tour
                $scope.tour.init();

                // Start the tour
                $scope.tour.start();


                $rootScope.hasSeenNewUserTour = true;
            }
        }, 1200);

        $scope.goTo = function (destination) {

            if (typeof $scope.tour !== 'undefined')
            {
                console.log('Home Controller -> TOUR WAS NOT OVER YET!');
                $scope.tour.end();
            }

            if (destination == '1')
            {
                $rootScope.shouldDisplayOverviewAlert = true;
                window.location.href = '#/profile/profile-about';
            }
            else if (destination == '2')
            {
                window.location.href = '#/profile/profile-bankaccounts';
            }
            else if (destination == '3')
            {
                window.location.href = '#/add-property';
            }
            else if (destination == 'props')
            {
                window.location.href = '#/properties';
            }
            else if (destination == 'hist')
            {
                window.location.href = '#/history';
            }
        }
    })


    // ===============================================================
    //      PROPERTIES
    // ===============================================================

    .controller('propertiesCtrl', function ($rootScope, $scope, authenticationService, propertiesService, propDetailsService, $timeout) {
        var userdetails = authenticationService.GetUserDetails();

        $scope.propResult = new Array();

        $scope.userAccountDetails = {};

        // For setting the 'Selected Prop' when going to a Property's Details page
        $scope.selectedPropId = "";
        $scope.setSelectedId = function ($event) {
            $scope.selectedPropId = $event.target.id;

            propDetailsService.set($scope.selectedPropId);
            window.location.href = '#/property-details';
        }


        getProperties = function () {
            //console.log('propertiesCtrl -> get properties called user details -> [MemberID: ' + userdetails.memberId + '], [LandlordID: ' + userdetails.landlordId + '], [Token: ' + userdetails.accessToken + ']');

            propertiesService.GetProperties(userdetails.landlordId, userdetails.accessToken, function (data) {
                if (data.AuthTokenValidation.IsTokenOk == true)
                {
                    if (data.IsSuccess == true)
                    {

                        $rootScope.propCount = data.AllProperties.length;

                        var index;

                        for (index = 0; index < data.AllProperties.length; ++index)
                        {
                            //console.log(data.AllProperties[index]);

                            var propItem = {
                                id: data.AllProperties[index].PropertyId,
                                name: data.AllProperties[index].PropName,
                                img: data.AllProperties[index].PropertyImage,
                                address: data.AllProperties[index].AddressLineOne,
                                units: data.AllProperties[index].UnitsCount,
                                tenants: data.AllProperties[index].TenantsCount
                            };

                            $scope.propResult.push(propItem);
                        }

                        $scope.userAccountDetails.AllUnitsCount = data.AllUnitsCount;
                        $scope.userAccountDetails.AllPropertysCount = data.AllPropertysCount;
                        $scope.userAccountDetails.AllTenantsCount = data.AllTenantsCount;
                        $scope.userAccountDetails.IsAccountAdded = data.IsAccountAdded;
                        $scope.userAccountDetails.IsEmailVerified = data.IsEmailVerified;
                        $scope.userAccountDetails.IsPhoneVerified = data.IsPhoneVerified;
                        $scope.userAccountDetails.IsAnyRentReceived = data.IsAnyRentReceived;
                        //console.log('items [0]' + $scope.propResult[0]);
                    }
                    else if (data.ErrorMessage == "No properties found for given Landlord.")
                    {
                        $rootScope.propCount = 0;
                    }
                }
                else // Auth Token was not valid on server
                {
                    //authenticationService.ClearUserData();
                    window.location.href = 'login.html';
                }
            });
        };

        $timeout(function () { getProperties(); }, 400);
    })


    // PROPERTY DETAILS CONTROLLER
    .controller('propDetailsCtrl', function ($compile, authenticationService, $scope, $rootScope, propertiesService, propDetailsService, getProfileService, growlService, $state) {

        $scope.tenantsListForThisPorperty = new Array();

        //console.log('list count in tenants before setting data in.' + $scope.tenantsListForThisPorperty.length);

        // unblock when ajax activity stops 
        $(document).ajaxStop($.unblockUI);
        $(document).ready(function () {
            setTimeout(function () {
                $('#tenantMsg').selectpicker();
                $('#tenantMsg').selectpicker('refresh');
            }, 2000);
        });

        var userDetails = authenticationService.GetUserDetails();


        function getPropertyDetails() {
            //console.log('propDetailsCtrl -> GetPropertiesDetails called -> [MemberID: ' + userDetails.memberId +
            //            '], [LandlordID: ' + userDetails.landlordId +
            //            '], [Token: ' + userDetails.accessToken + ']');

            var propId = propDetailsService.get();

            if (propId != null && propId.length > 0)
            {
                propDetailsService.getPropFromDb(propId, userDetails.landlordId, userDetails.accessToken, function (data) {
                    if (data.AuthTokenValidation.IsTokenOk == true)
                    {

                        console.log(data);

                        if (data.IsSuccess == true)
                        {
                            var propStatus = 0;

                            if (data.PropertyDetails.PropStatus == "Published")
                            {
                                propStatus = 1;
                            }
                            else
                            {
                                propStatus = 0;
                            }
                            $scope.selectedProperty = {
                                "published": propStatus,
                                "name": data.PropertyDetails.PropName,
                                "address1": data.PropertyDetails.AddressLineOne,
                                "address2": "",
                                "city": data.PropertyDetails.City,
                                "state": data.PropertyDetails.State,
                                "zip": data.PropertyDetails.Zip,
                                "contactNumber": data.PropertyDetails.ContactNumber.replace(/\D/g, ''),
                                "imgUrl": data.PropertyDetails.PropertyImage,
                                "units": data.PropertyDetails.UnitsCount,
                                "tenants": data.PropertyDetails.TenantsCount,
                                "propertyStatus": data.PropertyDetails.PropStatus,
                                "pastDue": data.AllTenantsWithPassedDueDateCount,
                                "defaultBankName": data.BankAccountDetails.BankName,
                                "defaultBankNickname": data.BankAccountDetails.BankAccountNick,
                                "bankImage": data.BankAccountDetails.BankIcon,
                                "propertyId": data.PropertyDetails.PropertyId
                            }

                            // If Bank nickname value was empty, try the Account Number string as backup
                            if ($scope.selectedProperty.defaultBankNickname == null)
                            {
                                if (data.BankAccountDetails.BankAccountNumString != null)
                                {
                                    $scope.selectedProperty.defaultBankNickname = data.BankAccountDetails.BankAccountNumString;
                                }
                            }

                            $scope.allUnitsList = data.PropertyDetails.AllUnits;
                            console.log($scope.allUnitsList);
                            //$scope.allTenantsList = data.TenantsListForThisProperty;

                            // Malkit (1 Aug 2016) :// Creating Tenants list locally here, no need to fetch from db. // Server side code is not efficient enough, will modify server side code in next release.
                            $scope.allTenantsList = [];

                            for (var x = 0; x < $scope.allUnitsList.length; x++)
                            {
                                console.log($scope.allUnitsList[x]);
                                var TenantObject = {
                                    TenantEmail: $scope.allUnitsList[x].TenantEmail,
                                    UnitNumber: $scope.allUnitsList[x].UnitNumber,
                                    TenantId: $scope.allUnitsList[x].MemberId,
                                    ImageUrl: $scope.allUnitsList[x].ImageUrl,
                                    Name: $scope.allUnitsList[x].TenantName
                                };

                                $scope.allTenantsList.push(TenantObject);
                            }


                            console.log($scope.allTenantsList);
                            if ($scope.allTenantsList.length > 0)
                            {

                                $scope.allTenantsList.splice(0, 0, { "Name": "Select A Tenant", "TenantEmail": "Select A Tenant" });

                                console.log("TENANTS LIST...");
                                console.log($scope.allTenantsList);

                                //$scope.tenantSelected = $scope.allTenantsList[0];
                            }

                            $('.selectpicker').selectpicker('refresh');

                            //console.log("UNITS LIST...");
                            //console.log($scope.allUnitsList);

                            $scope.propUnitsTable = $('#propUnits').on('init.dt', function () {
                                //console.log('Table initialisation complete');
                                setTimeout(function () {
                                    $('#propUnits').removeClass('animated fadeIn');
                                }, 1700);
                            }).DataTable({
                                data: $scope.allUnitsList,
                                columns: [
									{ data: 'MemberId' },
									{ data: 'UnitId' },
									{ data: 'UnitNumber' },
									{ data: 'UnitRent' },
									{ data: 'TenantName' },
									{ data: 'TenantEmail' },
									{ data: 'ImageUrl' },
									{ data: 'LastRentPaidOn' },
									{ data: 'IsRentPaidForThisMonth' },
									{ data: 'IsEmailVerified' },
									{ data: 'Status' },
									{ data: 'IsPhoneVerified' },
									{ data: 'IsBankAccountAdded' },
									{
									    data: null,
									    defaultContent: '<a href="" class=\'btn btn-link m-r-10 editUnitBtn\'>edit</a>' +
														'<a href="" class=\'btn btn-icon btn-default m-r-10 uploadLeaseBtn\'><span class=\'md md-cloud\'></span></a> ' +
                                                        '<a href="" class=\'btn btn-icon btn-default m-r-10 msgUnitBtn\'><span class=\'md md-chat\'></span></a> ' +
														'<a href="" class=\'btn btn-icon btn-default deleteUnitBtn\'><span class=\'md md-clear\'></span></a>'
									}
                                ],
                                "columnDefs": [
									{
									    "targets": [0, 1, 6, 7, 8, -5, -2, -3, -4], // identifies which columns will be affected, + numbers count from left (0 index), - numbers from the right
									    "visible": false,
									    "searchable": false
									},
                                    {
                                        "targets": 2,
                                        "data": "UnitNumber",
                                        className: "text-center unit-num",
                                        "render": function (data, type, full, meta) {
                                            var htmlToReturn = data;

                                            if (data.length > 12)
                                            {
                                                htmlToReturn = '<span style="font-size:12.5px;letter-spacing:-.4px;white-space:nowrap;">' + data.substr(0, 11) + '...</span>'
                                            }
                                            else if (data.length > 11)
                                            {
                                                htmlToReturn = '<span style="font-size:13px;letter-spacing:-.4px;white-space:nowrap;">' + data.substr(0, 10) + '...</span>'
                                            }
                                            else if (data.length > 10)
                                            {
                                                htmlToReturn = '<span style="font-size:13.5px;letter-spacing:-.4px;white-space:nowrap;">' + data.substr(0, 9) + '...</span>'
                                            }
                                            return htmlToReturn;
                                        }
                                    },
                                    {
                                        "targets": 3,
                                        "data": "UnitRent",
                                        className: "text-center unit-rent",
                                        "render": function (data, type, full, meta) {
                                            var dueDate = full.DueDate;
                                            var htmlToDisplay;
                                            //console.log(dueDate);

                                            var amountArray = data.split(".");
                                            var dollarVal = amountArray[0];
                                            var centsVal = typeof amountArray[1] == "undefined" ? "00" : amountArray[1];

                                            if (dueDate != null && dueDate.length > 2)
                                            {
                                                htmlToDisplay = "<div class='wholeAmount'>$&nbsp;" + dollarVal + ".<span class='cents'>" + centsVal + "</span></div>" +
                                                                "<div><small>Due: <span class='f-400'>" + dueDate + "</span></small></div>";
                                            }
                                            else
                                            {
                                                htmlToDisplay = "<div class='wholeAmount'>$&nbsp;" + dollarVal + ".<span class='cents'>" + centsVal + "</span></div>";
                                            }
                                            return htmlToDisplay;
                                        }
                                    },
                                    {
                                        "targets": 4,
                                        "data": "TenantName",
                                        className: "unitTenant text-center",
                                        "render": function (data, type, full, meta) {
                                            //console.log(full);

                                            var name = full.TenantName;
                                            var htmlToDisplay;

                                            if (name != null &&
                                                name.length > 1)
                                            {
                                                htmlToDisplay = '<div class="imgContainer"><span style="background-image: url(' + full.ImageUrl + ');"></span></div>' +
                                                                '<div class="capitalize text-left">' + name + '</div>';
                                            }
                                            else if (full.TenantEmail != null &&
                                                     full.TenantEmail.length > 1)
                                            {
                                                var classToAdd = "";
                                                var status = full.Status;
                                                if (full.Status == "Pending Invite")
                                                {
                                                    status = "Invited";
                                                    classToAdd = 'text-warning';
                                                }

                                                htmlToDisplay = '<span class="show"><a class="msgUnitBtn">' + full.TenantEmail + '</a></span>' +
                                                                '<span class="show f-12 status ' + classToAdd + '">' + status + '</span>';
                                            }
                                            else
                                            {
                                                htmlToDisplay = '<span class="show text-center"><a class="addTenantBtn btn btn-default"><i class="md md-person-add m-r-10"></i>Add Tenant</a></span>';
                                            }
                                            return htmlToDisplay;
                                        }
                                    },
									{
									    "targets": [5, -1],
									    className: "text-center"
									},
									{
									    "targets": [-1],
									    "render": function (data, type, full, meta) {

									        //console.log(data)
									        //console.log(full)

									        var leaseDocString = '<a href="" class=\'btn btn-icon btn-default m-r-10 uploadLeaseBtn\'><span class=\'md md-cloud-upload\'></span></a>';

									        if (typeof full.LeaseDocPath != 'undefined' && full.LeaseDocPath.length > 10)
									        {
									            leaseDocString = '<a href="" class=\'btn btn-icon btn-default m-r-10 viewLeaseBtn\'><span class=\'md md-visibility\'></span></a>';
									        }

									        var requestBtnString = "";
									        if (full.IsBankAccountAdded && full.IsEmailVerified)
									        {
									            requestBtnString = '<a href="" class=\'btn btn-icon btn-default m-r-10 sendRequestBtn\'><span class=\'md md-attach-money\'></span></a>';
									        }

									        var htmlString = '<span style=\'display: inline-block; height: 100%; vertical-align: top;\'><a href="" class=\'btn btn-link m-r-10 editUnitBtn\'>edit</a></span>' +
                                                             '<div style=\'display: inline-block\'><div>' +
                                                                 requestBtnString +
														         leaseDocString +
                                                                 '<a href="" class=\'btn btn-icon btn-default m-r-10 msgUnitBtn\'><span class=\'md md-chat\'></span></a>' +
                                                                 '<a href="" class=\'btn btn-icon btn-default deleteUnitBtn\'><span class=\'md md-clear\'></span></a>' +
                                                                 //'<a href="" class=\'btn btn-icon btn-default msgUnitBtn\'><span class=\'md md-forum\'></span></a>' +
                                                             //'</div><div class=\'m-t-10\'>' +
                                                                 //'<a href="" class=\'btn btn-icon btn-default m-r-10 msgUnitBtn\'><span class=\'md md-star-half\'></span></a>' +
                                                                 //'<a href="" class=\'btn btn-icon btn-default m-r-10 msgUnitBtn\'><span class=\'md md-person-add\'></span></a>' +

                                                             '</div></div>';

									        return htmlString;
									    }
									},
                                ],
                                "language": {
                                    "info": "Showing units <strong>_START_</strong> - <strong>_END_</strong> of <strong>_TOTAL_</strong> total units in " + $scope.selectedProperty.name,
                                    "infoEmpty": "No Units Added Yet!",
                                    "emptyTable": "No units have been added yet!"
                                },
                                "order": [2, 'asc'],
                                "pageLength": 25
                            });


                            // Add Tooltips to Action Buttons
                            $('#propUnits tbody .btn.editUnitBtn').tooltip({
                                title: "Edit This Unit",
                                trigger: "hover"
                            });
                            $('#propUnits tbody .btn.uploadLeaseBtn').tooltip({
                                title: "Upload Lease",
                                trigger: "hover"
                            });
                            $('#propUnits tbody .btn.viewLeaseBtn').tooltip({
                                title: "View Lease",
                                trigger: "hover"
                            });
                            $('#propUnits tbody .btn.msgUnitBtn').tooltip({
                                title: "Send A Message",
                                trigger: "hover"
                            });
                            $('#propUnits tbody .btn.deleteUnitBtn').tooltip({
                                title: "Delete This Unit",
                                trigger: "hover"
                            });
                            $('#propUnits tbody .btn.sendRequestBtn').tooltip({
                                title: "Send Payment Request",
                                trigger: "hover"
                            });


                            // SEND REQUEST BTN CLICKED
                            $('#propUnits tbody .sendRequestBtn').click(function () {
                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();
                                console.log(data);

                                $scope.editingUnitId = data['UnitId'];

                                if ((data['IsOccupied'] != null && data['IsOccupied'] == true) &&
                                    (data['IsBankAccountAdded'] != null && data['IsBankAccountAdded'] == true))
                                {
                                    // Prepare data to be submitted to DB
                                    var userdetails = authenticationService.GetUserDetails();

                                    var transInfo = {};
                                    transInfo.Amount = data['UnitRent'];
                                    transInfo.Memo = "April Rent - " + $scope.selectedProperty.name;
                                    transInfo.TenantMemberId = data['MemberId'];

                                    var propId = data['PropertyId']
                                    var unitId = data['UnitId'];
                                    var tenantName = data['TenantName'];

                                    swal({
                                        title: "Send Rent Payment Request?",
                                        text: "Would you like to send a payment request for <strong>$" + transInfo.Amount + "</strong> to <strong>" + tenantName + "</strong>?",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3FABE1",
                                        confirmButtonText: "Yes - Send",
                                        customClass: "largeText",
                                        html: true
                                    }, function (isConfirm) {
                                        if (isConfirm)
                                        {
                                            //console.log(JSON.stringify(transInfo));

                                            propDetailsService.sendRequestToExistingTenant(transInfo, userdetails.landlordId, userDetails.memberId, propId, unitId, userdetails.accessToken, function (data) {
                                                if (data.success == true || data.msg.indexOf("Request made successfully") > -1)
                                                {
                                                    swal({
                                                        title: "Payment Request Sent",
                                                        text: tenantName + " will be notified about your payment request. &nbsp;We will update you when the payment is completed by the tenant.",
                                                        type: "success",
                                                        showCancelButton: false,
                                                        confirmButtonColor: "#3FABE1",
                                                        confirmButtonText: "Got It!",
                                                        customClass: "largeText",
                                                        html: true
                                                    });
                                                }
                                                else
                                                {
                                                    swal({
                                                        title: "Oh No",
                                                        text: "Looks like we had some trouble making that payment request.  Please try again later or contact <a href='mailto:support@nooch.money' target='_blank'>Nooch Support</a> for further assistance.",
                                                        type: "error",
                                                        showCancelButton: false,
                                                        confirmButtonColor: "#3FABE1",
                                                        confirmButtonText: "Ok",
                                                        customClass: "largeText",
                                                        html: true,
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                            // SEND MESSAGE BTN CLICKED
                            $('#propUnits tbody .msgUnitBtn').click(function () {
                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();
                                console.log(data);

                                $scope.editingUnitId = data['UnitId'];

                                if (data['IsOccupied'] != null && data['IsOccupied'] == true)
                                {
                                    if (data['TenantName'] != null && data['TenantName'].length > 2)
                                    {
                                        $('#sndMsgForm #tenantMsgGrp > div').html('<p class="form-control-static capitalize" id="tenantStatic" data-memid="' +
                                                                                  data['MemberId'] + '">' + data['TenantName'] + '</p>');
                                    }
                                    else if (data['TenantEmail'] != null && data['TenantEmail'].length > 2)
                                    {
                                        $('#sndMsgForm #tenantMsgGrp > div').html('<p class="form-control-static" id="tenantStatic" data-memid="' +
                                                                                  data['MemberId'] + '">' + data['TenantEmail'] + '</p>');
                                    }


                                    // Reset each field
                                    $('#sndMsgForm #tenantMsgGrp').removeClass('has-error').removeClass('has-success');
                                    $('#sndMsgForm #msgGrp').removeClass('has-error').removeClass('has-success');
                                    $('#sndMsgForm #msg').val('');

                                    if ($('#tenantMsgGrp .help-block').length)
                                    {
                                        $('#tenantMsgGrp .help-block').slideUp();
                                    }
                                    if ($('#msgGrp .help-block').length)
                                    {
                                        $('#msgGrp .help-block').slideUp();
                                    }

                                    $('#sndMsgForm .well div').text('Enter a message below to send to ' + data['TenantName']);

                                    $scope.IsMessageForall = false;
                                    $('#sendMsgModal').modal();
                                }
                                else
                                {
                                    swal({
                                        title: "Unoccupied Unit",
                                        text: "That unit has no tenant yet!  Would you like to invite a tenant to pay rent for this unit?",
                                        type: "warning",
                                        confirmButtonColor: "#3fabe1",
                                        confirmButtonText: "Yes",
                                        showCancelButton: true,
                                        cancelButtonText: "Not Now",
                                        closeOnConfirm: false,
                                        customClass: "largeText"
                                    }, function (isConfirm) {

                                        if (isConfirm)
                                        {
                                            if ($rootScope.isBankAvailable !== true)
                                            {
                                                swal({
                                                    title: "No Bank Account Linked Yet",
                                                    text: "Before you can accept payments from your tenants, you must attach a bank account." +
                                                          "<span class='show m-t-10'>It takes less than 2 minutes and if you use a major bank, you can login to your online banking account to verify immediately - <strong>no routing/account number needed</strong>.</span>" +
                                                          "<span class='show m-t-10'>Do you want to add a bank now?</span>",
                                                    type: "warning",
                                                    confirmButtonText: "Add Bank Now",
                                                    showCancelButton: true,
                                                    cancelButtonText: "Not Now",
                                                    customClass: "smallText",
                                                    html: true
                                                }, function (isConfirm) {
                                                    if (isConfirm)
                                                    {
                                                        window.location.href = '#/profile/profile-bankaccounts';
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                swal({
                                                    title: "Unoccupied Unit",
                                                    text: "Enter your tenant's email address and we will invite them to pay their rent for this unit.",
                                                    type: "input",
                                                    inputPlaceholder: "example@email.com",
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3fabe1",
                                                    confirmButtonText: "Send",
                                                    cancelButtonText: "Cancel",
                                                    closeOnConfirm: false
                                                }, function (input) {
                                                    if (typeof input == "string")
                                                    {
                                                        if (input.length < 5 || $scope.ValidateEmail(input) == false)
                                                        {
                                                            swal.showInputError("Please enter an email address!")
                                                            return false;
                                                        }

                                                        // Show Loading Block
                                                        $.blockUI({
                                                            message: '<span><i class="md md-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Inviting ' + input + '...</span>',
                                                            css: {
                                                                border: 'none',
                                                                padding: '10px 10px 20px',
                                                                backgroundColor: '#000',
                                                                '-webkit-border-radius': '14px',
                                                                '-moz-border-radius': '14px',
                                                                'border-radius': '14px',
                                                                opacity: '.75',
                                                                color: '#fff'
                                                            }
                                                        });

                                                        // CALL SERVICE FOR SENDING AN INVITE TO THE TENANT
                                                        propDetailsService.inviteNewTenant($scope.selectedProperty.propertyId, data['UnitId'], input.trim(), "", "", data['UnitRent'], userDetails.landlordId, userDetails.accessToken, function (response) {
                                                            console.log("PropDetails Cntrlr -> InviteNewTenant Response...");
                                                            console.log(response);

                                                            $.unblockUI({
                                                                onUnblock: function () {
                                                                    if (response.success == true)
                                                                    {
                                                                        // On Success
                                                                        swal({
                                                                            title: "Invite Sent",
                                                                            text: "Your request has been sent. &nbsp;We will notify you when this person accepts and signs up.",
                                                                            type: "success",
                                                                            confirmButtonColor: "#3fabe1",
                                                                            confirmButtonText: "Great",
                                                                            customClass: "largeText",
                                                                            html: true
                                                                        }, function () {
                                                                            $state.reload();
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        swal({
                                                                            title: "Uh oh...",
                                                                            text: data.msg,
                                                                            type: "error",
                                                                            confirmButtonText: "Ok"
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });

                            // EDIT UNIT BTN CLICKED
                            $('#propUnits tbody .editUnitBtn').click(function () {

                                $scope.addingNewUnit = false;

                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();
                                console.log(data);

                                $scope.editingUnitId = data['UnitId'];

                                $('#addUnitModal .modal-title').html('Edit This Unit in: <strong>' + $scope.selectedProperty.name + '</strong>');
                                $('#addUnitModal #unitNum').val(data['UnitNumber']);
                                $('#addUnitModal #unitNumGrp').removeClass('has-error').removeClass('has-success');
                                $('#addUnitModal #monthlyRentGrp').removeClass('has-error').removeClass('has-success');
                                $('#addUnitModal #monthlyRent').val(data['UnitRent']);

                                // Set RentStartDate field
                                var shouldUseCurrentDate = data['RentStartDate'] != null && data['RentStartDate'].length > 2
                                                           ? false
                                                           : true;
                                var dateToUse = shouldUseCurrentDate == false
                                                ? data['RentStartDate']
                                                : data['DateAdded'];

                                // Set LeaseLength field
                                var leaseLength = data['LeaseLength'] != null
                                                  ? data['LeaseLength']
                                                  : "";

                                //if (leaseLength == "6 Months")
                                //{
                                $('#rentDurationInMonths').value = "6";
                                //}

                                $('#addUnitDatePicker').datetimepicker({
                                    format: 'MM/DD/YYYY',
                                    allowInputToggle: true,
                                    useCurrent: shouldUseCurrentDate,
                                    //defaultDate: moment(dateToUse).add(1, 'd'),
                                    icons: {
                                        previous: 'fa fa-fw fa-chevron-circle-left',
                                        next: 'fa fa-fw fa-chevron-circle-right',
                                        clear: 'fa fa-fw fa-trash-o'
                                    },
                                    minDate: new Date(),
                                    viewMode: 'months',
                                    //debug: true
                                });
                                if (shouldUseCurrentDate)
                                {
                                    $('#addUnitDatePicker').val(moment().add(1, 'M').startOf('month').format('MMM D, YYYY'));
                                }
                                else
                                {
                                    $('#addUnitDatePicker').val(moment(dateToUse).format('MMM D, YYYY'));
                                }

                                if (data['IsOccupied'] == true &&
                                    data['TenantName'] != null && data['TenantName'].length > 2)
                                {
                                    $('#addUnitForm #tenantGrp > div').html('<p class="form-control-static" id="tenantStatic" data-memid="' + data['MemberId'] + '">' +
                                                                            '<span class="capitalize">' + data['TenantName'] + '</span>' +
                                                                            '<a class="text-danger m-l-15" ng-click="clearTenantInModal()"><i class="md md-highlight-remove m-r-5"></i>remove</a></p>');
                                    $compile($('#addUnitForm #tenantGrp > div a'))($scope);
                                }
                                else if (data['IsOccupied'] == true &&
                                         data['TenantEmail'] != null && data['TenantEmail'].length > 2)
                                {
                                    $('#addUnitForm #tenantGrp > div').html('<p class="form-control-static" id="tenantStatic" data-memid="' + data['MemberId'] + '">' +
                                                                            data['TenantEmail'] +
                                                                            '<a class="text-danger small m-l-15" data-ng-click="clearTenantInModal()"><i class="md md-highlight-remove m-r-5"></i>remove</a></p>');
                                    $compile($('#addUnitForm #tenantGrp > div a'))($scope);
                                }
                                else
                                {
                                    $scope.clearTenantInModal();
                                }

                                $('#addUnitModal select').val('');

                                if ($('#unitNumGrp .help-block').length)
                                {
                                    $('#unitNumGrp .help-block').slideUp();
                                }
                                if ($('#monthlyRentGrp .help-block').length)
                                {
                                    $('#monthlyRentGrp .help-block').slideUp();
                                }

                                $('#addUnitModal').modal();

                                $('#addUnitModal #monthlyRent').mask("#,##0.00", { reverse: true });
                            });

                            // ADD TENANT BTN CLICKED
                            $('#propUnits tbody .addTenantBtn').click(function () {
                                var btn = $(this);

                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();
                                console.log(data);
                                //console.log(data['UnitId']);

                                if ($rootScope.isBankAvailable !== true)
                                {
                                    swal({
                                        title: "No Bank Account Linked Yet",
                                        text: "Before you can accept payments from your tenants, you must attach a bank account." +
                                              "<span class='show m-t-10'>It takes less than 2 minutes and if you use a major bank, you can login to your online banking account to verify immediately - <strong>no routing/account number needed</strong>.</span>" +
                                              "<span class='show m-t-10'>Do you want to add a bank now?</span>",
                                        type: "warning",
                                        confirmButtonText: "Add Bank Now",
                                        showCancelButton: true,
                                        cancelButtonText: "Not Now",
                                        customClass: "smallText",
                                        html: true
                                    }, function (isConfirm) {
                                        if (isConfirm)
                                        {
                                            window.location.href = '#/profile/profile-bankaccounts';
                                        }
                                    });
                                }
                                else
                                {
                                    swal({
                                        title: "Unoccupied Unit",
                                        text: "Enter your tenant's email address and we will invite them to pay their rent for this unit.",
                                        type: "input",
                                        inputPlaceholder: "example@email.com",
                                        showCancelButton: true,
                                        cancelButtonText: "Cancel",
                                        confirmButtonColor: "#3fabe1",
                                        confirmButtonText: "Send",
                                        closeOnConfirm: false,
                                        closeOnCancel: true,
                                        customClass: "largeText"
                                    }, function (input) {
                                        if (typeof input == "string")
                                        {
                                            if (input.length < 5 || $scope.ValidateEmail(input) == false)
                                            {
                                                swal.showInputError("Please enter an email address!")
                                                return false;
                                            }
                                            console.log(input.trim());
                                            // Show Loading Block
                                            $.blockUI({
                                                message: '<span><i class="md md-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Inviting ' + input + '...</span>',
                                                css: {
                                                    border: 'none',
                                                    padding: '10px 10px 20px',
                                                    backgroundColor: '#000',
                                                    '-webkit-border-radius': '14px',
                                                    '-moz-border-radius': '14px',
                                                    'border-radius': '14px',
                                                    opacity: '.75',
                                                    color: '#fff'
                                                }
                                            });

                                            // CALL SERVICE FOR SENDING AN INVITE TO THE TENANT
                                            propDetailsService.inviteNewTenant($scope.selectedProperty.propertyId, data['UnitId'], input.trim(), "", "", data['UnitRent'], userDetails.landlordId, userDetails.accessToken, function (response) {
                                                console.log("PropDetails Cntrlr -> InviteNewTenant Response: " + response)

                                                $.unblockUI({
                                                    onUnblock: function () {
                                                        if (response.success == true)
                                                        {
                                                            console.log("Cntrlr -> InviteNewTenant response from server successful - redrawing table...");
                                                            $scope.propUnitsTable.draw();
                                                            // On Success
                                                            swal({
                                                                title: "Invite Sent",
                                                                text: "Your request has been sent.  We will notify you when this person accepts and signs up.",
                                                                type: "success",
                                                                confirmButtonColor: "#3fabe1",
                                                                confirmButtonText: "Great",
                                                                customClass: "largeText",
                                                            }, function () {
                                                                $state.reload();
                                                            });
                                                        }
                                                        else
                                                        {
                                                            swal({
                                                                title: "Uh oh...",
                                                                text: data.msg,
                                                                type: "error",
                                                                confirmButtonText: "Ok"
                                                            });
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            });


                            // VIEW LEASE BTN CLICKED
                            $('#propUnits tbody .viewLeaseBtn').click(function () {
                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();

                                if (typeof data.LeaseDocPath != "undefined" &&
                                    data.LeaseDocPath != null &&
                                    data.LeaseDocPath.length > 10)
                                {
                                    $('#viewLease object').attr('data', data.LeaseDocPath + '#view=fitH');
                                    $('#viewLease object a').attr('href', data.LeaseDocPath);

                                    $('#viewLease').modal();
                                }
                            })

                            // UPLOAD LEASE BTN CLICKED
                            $('#propUnits tbody .uploadLeaseBtn').click(function () {
                                $('#uploadLease').modal();

                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();

                                // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
                                $("#leaseFileInput").fileinput({
                                    alallowedFileExtensionslowedFileTypes: ['jpg', 'png', 'txt', 'pdf', 'doc'],
                                    initialPreviewShowDelete: false,
                                    layoutTemplates: {
                                        icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                                    },
                                    maxFileCount: 1,
                                    maxFileSize: 400,
                                    msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                                    showCaption: false,
                                    showUpload: true,
                                    showPreview: true,
                                    resizeImage: true,
                                    uploadUrl: URLs.UploadLease,
                                    uploadExtraData: {
                                        UnitId: data['UnitId']
                                    },
                                });

                                // Save Lease Doc
                                $scope.saveLeaseDoc = function () {
                                    $('#leaseFileInput').fileinput('upload');
                                };

                                $('#leaseFileInput').on('fileuploaded', function (event, data, previewId, index) {
                                    var response = data.response;

                                    console.log('Save Unit Lease Document response is ' + JSON.stringify(response));

                                    $('#uploadLease').modal('hide');

                                    if (data.response.IsSuccess == true)
                                    {
                                        swal({
                                            title: "Document Uploaded Successfully",
                                            text: "You can view this lease by clicking the &nbsp;<a href='' class='btn btn-icon btn-default m-r-10'><span style='position:relative;top:8px;' class='md md-visibility'></span></a> button.",
                                            type: "success",
                                            confirmButtonColor: "#3fabe1",
                                            confirmButtonText: "Great",
                                            customClass: "largeText",
                                            html: true
                                        }, function () {
                                            $state.reload();
                                        });
                                    }
                                    else
                                    {
                                        swal({
                                            title: "Oops",
                                            text: data.response.ErrorMessage,
                                            type: "error"
                                        });
                                    }
                                });
                            });

                            // DELETE UNIT BTN CLICKED
                            $('#propUnits tbody .deleteUnitBtn').click(function () {
                                var btn = $(this);

                                var data = $scope.propUnitsTable.row($(this).parents('tr')).data();
                                console.log(data);
                                console.log(data['UnitId']);

                                swal({
                                    title: "Remove unit <span class='text-primary'>" + data['UnitNumber'] + "</span> from <span class='text-primary' style='display:inline-block'>" + $scope.selectedProperty.name + "</span>?",
                                    text: "Note: this cannot be un-done!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3fabe1",
                                    confirmButtonText: "Remove",
                                    cancelButtonText: "Cancel",
                                    html: true
                                }, function (isConfirm) {
                                    if (isConfirm)
                                    {
                                        // Show Loading Block
                                        $.blockUI({
                                            message: '<span><i class="md md-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Deleting that unit...</span>',
                                            css: {
                                                border: 'none',
                                                padding: '10px 10px 20px',
                                                backgroundColor: '#000',
                                                '-webkit-border-radius': '14px',
                                                '-moz-border-radius': '14px',
                                                'border-radius': '14px',
                                                opacity: '.75',
                                                color: '#fff'
                                            }
                                        });

                                        var wasThisUnitOccupied = data['IsOccupied'] == true ? true : false;

                                        // Call service here to remove unit from DB
                                        propDetailsService.deleteUnit(data['UnitId'], userDetails.landlordId, userDetails.accessToken, function (data) {
                                            $.unblockUI({
                                                onUnblock: function () {

                                                    if (data.IsSuccess == true)
                                                    {

                                                        $scope.propUnitsTable.row(btn.parents('tr')).remove().draw();
                                                        $scope.selectedProperty.units -= 1;
                                                        if (wasThisUnitOccupied)
                                                        {
                                                            $scope.selectedProperty.tenants -= 1;
                                                        }

                                                        swal({
                                                            title: "Unit Removed",
                                                            text: "Unit successfully removed from " + $scope.selectedProperty.name + ".",
                                                            type: "success",
                                                            confirmButtonText: "Ok",
                                                            customClass: "largeText"
                                                        }, function () {
                                                            // CLIFF (10/3/15): not sure the $state.reload() is actually necessary.  We can remove the unit's row
                                                            //					from the table, and decrement the # of units value, which will both immediately update the UI.
                                                            //					But good to know about this $state.reload() function... didn't know about it!
                                                            //$state.reload();
                                                        });
                                                    }
                                                    else
                                                    {
                                                        swal({
                                                            title: "Uh oh...",
                                                            text: data.ErrorMessage,
                                                            type: "warning",
                                                            confirmButtonText: "Ok"
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                        else
                        {
                            console.log('PropDetails Ctrlr -> Error while getting property details!');
                        }
                    }
                    else // Auth Token was not valid on server
                    {
                        //authenticationService.ClearUserData();
                        window.location.href = 'login.html';
                    }
                });
            }
            else
            {
                window.location.href = '#/properties';
            }
        };
        getPropertyDetails();

        $scope.addTblRow = function (withTenant, memid, unitid, unitnum, rent, tenname, tenemail, imgurl, lastpaid, isrentpaid, isemailver, status, isphonever, isbnkver) {
            console.log("addTblRow REACHED");

            // Increment the scope's number of Units so the User Interface updates immediately (otherwise would need to reload page to see the new unit accounted for)
            var numOfUnits = parseInt($scope.selectedProperty.units);
            if (numOfUnits != null)
            {
                numOfUnits += 1;
                $scope.selectedProperty.units = numOfUnits.toString();
            }

            if (withTenant == true)
            {
                var numOfTenants = parseInt($scope.selectedProperty.tenants);
                if (numOfTenants != null)
                {
                    numOfTenants += 1;
                    $scope.selectedProperty.tenants = numOfTenants.toString();
                }
            }

            $scope.propUnitsTable.row.add({
                "MemberId": memid,
                "UnitId": unitid,
                "UnitNumber": unitnum,
                "UnitRent": rent,
                "TenantName": tenname,
                "TenantEmail": tenemail,
                "ImageUrl": imgurl,
                "LastRentPaidOn": lastpaid,
                "IsRentPaidForThisMonth": isrentpaid,
                "IsEmailVerified": isemailver,
                "Status": status,
                "IsPhoneVerified": isphonever,
                "IsBankAccountAdded": isbnkver
            }).draw();
        }

        $scope.editPropInfo = 0;

        $scope.beginEditingProp = function () {
            $scope.editPropInfo = 1;
        }

        $scope.resetEditForm = function () {
            $scope.editPropInfo = 0;
        }

        // Edit Property Details (Address, phone, etc.)
        $scope.updatePropInfo = function () {
            if ($scope.editPropInfo == 1)
            {

                // Preparing data to be sent for updating property
                $scope.inputData = {};
                $scope.inputData.propertyName = $scope.selectedProperty.name;
                $scope.inputData.propertyAddress = $scope.selectedProperty.address1;
                $scope.inputData.propertyCity = $scope.selectedProperty.city;
                $scope.inputData.propertyZip = $scope.selectedProperty.zip;
                $scope.inputData.contactNum = $scope.selectedProperty.contactNumber.replace("[^0-9.]", "");
                $scope.inputData.state = $scope.selectedProperty.state;
                $scope.inputData.propId = $scope.selectedProperty.propertyId;

                propertiesService.EditProperty($scope.inputData, userDetails.landlordId, userDetails.accessToken, function (data) {
                    if (data.IsSuccess == true)
                    {
                        $scope.editPropInfo = 0;
                        growlService.growl('Property details updated successfully!', 'success');
                    }
                    else
                    {
                        $scope.editPropInfo = 0;
                        growlService.growl(data.ErrorMessage, 'error');
                    }
                });
            }
        }

        // Edit Property Picture
        $scope.editPropPic = function () {
            $('#editPropPic').modal();

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#propPicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='" + $scope.selectedProperty.imgUrl + "' class='file-preview-image' alt='Property Picture' id='propPicPreview'>"
                ],
                initialPreviewShowDelete: false,
                layoutTemplates: {
                    icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                },
                maxFileCount: 1,
                maxFileSize: 250,
                msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                showCaption: false,
                showUpload: false,
                showPreview: true,
                resizeImage: true,
                maxImageWidth: 400,
                maxImageHeight: 400,
                resizePreference: 'width',
                uploadExtraData: {
                    PropertyId: $scope.selectedProperty.propertyId
                },
                uploadUrl: URLs.UploadPropertyImage
            });

            $('#propPicFileInput').on('fileuploaded', function (event, data, previewId, index) {
                var response = data.response;

                console.log('Save prop pic response is ' + JSON.stringify(response));

                if (data.response.IsSuccess == true)
                {
                    $('#editPropPic').modal('hide');
                    $scope.selectedProperty.imgUrl = data.response.ErrorMessage;

                    $('#propPicPreview').attr('src', data.response.ErrorMessage);
                    $('#propImage').css('background-image', data.response.ErrorMessage);
                }
                else
                {
                    $('#editPropPic').modal('hide');
                    swal({
                        title: "Oh No",
                        text: data.response.ErrorMessage,
                        type: "error"
                    });
                }
            });
        }

        // Save Property Picture
        $scope.savePropertyPic = function () {
            $('#propPicFileInput').fileinput('upload');
        };


        // Edit Published State (Whether the property should be publicly listed or not)
        $scope.dropdownPublishedState = function () {

            var alertTitleTxt, alertBodyTxt, actionBtnTxt, cancelBtnTxt;
            var isAlreadyPublished = false;
            var shouldCloseOnConfirm = false;

            if ($scope.selectedProperty.published == 1)
            {
                isAlreadyPublished = true;
                shouldCloseOnConfirm = true;
                alertTitleTxt = "Hide This Property?";
                alertBodyTxt = "You can hide this property if it is inactive or you no longer want this property to be included in search results when a tenant searches for their apartment on Nooch.";
                actionBtnTxt = "No, Keep It Published";
                cancelBtnTxt = "Yes, Hide It";
            }
            else
            {
                alertTitleTxt = "Publish This Property";
                alertBodyTxt = "You can publish this property which will make this property be included in search results when a tenant searches for their apartment on Nooch.";
                actionBtnTxt = "Yes, Publish Now";
                cancelBtnTxt = "No, Keep Hidden";
            }
            swal({
                title: alertTitleTxt,
                text: alertBodyTxt,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3fabe1",
                confirmButtonText: actionBtnTxt,
                cancelButtonText: cancelBtnTxt,
                closeOnConfirm: shouldCloseOnConfirm,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm)
                {
                    if (!isAlreadyPublished)
                    {
                        propertiesService.SetPropertyStatus(propDetailsService.get(), true, userdetails.landlordId, userdetails.accessToken, function (data2) {

                            if (data2.IsSuccess == true)
                            {
                                setIsPublished(1);
                                swal({
                                    title: "You Got It!",
                                    text: "This property has been published.",
                                    type: "success"
                                });
                            }
                            else
                            {
                                swal({
                                    title: "Ooops Error!",
                                    text: data2.ErrorMessage,
                                    type: "error"
                                });
                            }
                        });
                    }
                }
                else
                {
                    if (isAlreadyPublished)
                    {
                        propertiesService.SetPropertyStatus(propDetailsService.get(), false, userdetails.landlordId, userdetails.accessToken, function (data2) {

                            if (data2.IsSuccess == true)
                            {
                                setIsPublished(0);
                                swal({
                                    title: "No Problem",
                                    text: "Your property has been hidden. Before tenants can pay rent for this property, you must publish it.",
                                    type: "success"
                                });
                            }
                            else
                            {
                                swal({
                                    title: "Ooops Error!",
                                    text: data2.ErrorMessage,
                                    type: "error"
                                });
                            }
                        });
                    }
                    else
                    {
                        swal({
                            title: "No Problem",
                            text: "Your property will remain hidden. Before tenants can pay rent for this property, you must publish it.",
                            type: "warning"
                        });
                    }
                }
            });
        }

        function setIsPublished(newStatus) {
            $scope.selectedProperty.published = newStatus;
        }


        // Charge Tenant Button
        $scope.chargeTenant = function (e) {

            if ($rootScope.isBankAvailable !== true)
            {
                swal({
                    title: "No Bank Account Linked Yet",
                    text: "Before you can accept a payment, you must attach a bank account.",
                    type: "warning",
                    confirmButtonText: "Add Bank Now",
                    showCancelButton: true,
                    cancelButtonText: "OK",
                    customClass: "largeText"
                }, function (isConfirm) {
                    if (isConfirm)
                    {
                        window.location.href = '#/profile/profile-bankaccounts';
                    }
                });
            }
            else
            {
                //console.log(e.target.id);

                $('#chargeTenantModal').modal();

                // Reset Charge Tenant Form
                $('#chargeTenantForm input').val('');
                $('#chargeTenantForm #tenantGrp').removeClass('has-error').removeClass('has-success');
                $('#chargeTenantForm #amountGrp').removeClass('has-error').removeClass('has-success');

                if ($('#tenantGrp .help-block').length)
                {
                    $('#tenantGrp .help-block').slideUp();
                }
                if ($('#amountGrp .help-block').length)
                {
                    $('#amountGrp .help-block').slideUp();
                }

                // Set Memo
                memoType = e.target.id;
                memoToUse = "";
                if (memoType === "secDeposit")
                {
                    memoToUse = "Security Deposit";
                }
                else if (memoType === "rent")
                {
                    memoToUse = "Rent Payment for " + moment(new Date()).format('MMM YYYY');
                }
                else if (memoType === "damage")
                {
                    memoToUse = "Damage Fee";
                }

                $('#chargeTenantForm #memo').val(memoToUse);
                $('#chargeTenantForm #amount').mask("#,##0.00", { reverse: true });


                $('#chargeTenantForm #tenantGrp .selectpicker').selectpicker({
                    title: "Select a tenant",
                });

                $('#tenant').selectpicker('refresh');
            }
        }

        $scope.chargeTenant_Submit = function () {
            // Check Name field for length
            if (typeof $scope.tenantSelected != 'undefined')
            {
                updateValidationUi("tenant", true);

                // Check Amount field
                if ($('#chargeTenantForm #amount').val().length > 4 &&
                    $('#chargeTenantForm #amount').val() > 10)
                {
                    updateValidationUi("amount", true);


                    // Prepare data to be submitted to DB
                    var userdetails = authenticationService.GetUserDetails();

                    var transInfo = {};
                    transInfo.Memo = $('#chargeTenantForm #memo').val();
                    transInfo.Amount = $('#chargeTenantForm #amount').val();
                    transInfo.TenantId = $scope.tenantSelected;
                    transInfo.IsRecurring = $('#recur').is(":checked");;

                    propertiesService.ChargeTenant(transInfo, userdetails.landlordId, userdetails.accessToken, userDetails.memberId, function (data) {

                        if (data.IsSuccess == true)
                        {

                            $('#chargeTenantModal').modal('hide');

                            swal({
                                title: "Payment Request Sent",
                                text: "Your tenant will be notified about your payment request. &nbsp;We will update you when they complete the payment.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Got It!",
                                customClass: "largeText",
                                html: true
                            });
                        }
                        else
                        {
                            swal({
                                title: "Uh Oh",
                                text: "Looks like we had some trouble making that payment request.  Please try again later or contact <a href='mailto:support@nooch.money' target='_blank'>Nooch Support</a> for further assistance.",
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Ok",
                                customClass: "largeText",
                                html: true,
                            }, function () {
                                $('#chargeTenantModal').modal('hide');
                            });
                        }
                    });
                }
                else
                {
                    updateValidationUi("amount", false);
                }
            }
            else
            {
                updateValidationUi("tenant", false);
            }
        }


        // Add Unit Button
        $scope.addUnit = function () {

            // Set the modal Title Text (b/c the same modal is used for Edit Unit and Add Unit)
            $scope.addingNewUnit = true;
            $scope.editingUnitId = "";

            $('#addUnitModal .modal-title').html('Add a New Unit in: <strong>' + $scope.selectedProperty.name + '</strong>');

            // Reset the form
            $scope.clearTenantInModal();
            $('#addUnitModal input').val('');
            $('#addUnitModal select').val('');
            $('#addUnitModal #unitNumGrp').removeClass('has-error').removeClass('has-success');
            $('#addUnitModal #nicknameGrp').removeClass('has-error').removeClass('has-success');
            $('#addUnitModal #monthlyRentGrp').removeClass('has-error').removeClass('has-success');

            if ($('#unitNumGrp .help-block').length)
            {
                $('#unitNumGrp .help-block').slideUp();
            }
            if ($('#monthlyRentGrp .help-block').length)
            {
                $('#monthlyRentGrp .help-block').slideUp();
            }


            $('#addUnitModal').modal();

            $('#addUnitDatePicker').datetimepicker({
                format: 'MM/DD/YYYY',
                allowInputToggle: true,
                useCurrent: true,
                //defaultDate: moment("1980 01 01", "YYYY MM DD"),
                icons: {
                    previous: 'fa fa-fw fa-chevron-circle-left',
                    next: 'fa fa-fw fa-chevron-circle-right',
                    clear: 'fa fa-fw fa-trash-o'
                },
                minDate: new Date(),
                viewMode: 'months',
                //debug: true
            });

            $('#addUnitModal #monthlyRent').mask("#,##0.00", { reverse: true });

            setTimeout(function () {
                $('#addUnitModal #unitNum').focus();
            }, 600);
        }

        $scope.addUnit_submit = function () {
            // Check Unit Number field for length
            if ($('#addUnitModal #unitNum').val().length > 0 ||
                $('#addUnitModal #nickname').val().length > 0)
            {
                var trimmedUnitNum = $('#addUnitModal #unitNum').val().trim();
                $('#addUnitModal #unitNum').val(trimmedUnitNum);

                var trimmedNickName = $('#addUnitModal #nickname').val().trim();
                $('#addUnitModal #nickname').val(trimmedNickName)

                updateValidationUi("unitNum", true);
                updateValidationUi("nickname", true);

                // Now check Monthly Rent Amount field
                if ($('#addUnitModal #monthlyRent').val().length > 2)
                {
                    if (document.getElementById("unitTenantEm") &&
                        $('#unitTenantEm').val().trim().length > 1)
                    {
                        // User has entered a tenant's email address... so need to make sure this landlord has linked a bank already.
                        if ($rootScope.isBankAvailable != true)
                        {
                            swal({
                                title: "No Bank Account Linked Yet",
                                text: "Before you can send a payment request or accept any rent payments, you must attach a bank account. " +
                                      "&nbsp;Otherwise we won't know where to send your money!" +
                                      "<span class='show m-t-10'>Do you want to take care of this now and link a bank?</span>",
                                type: "warning",
                                confirmButtonText: "Add Bank Now",
                                showCancelButton: true,
                                cancelButtonText: "Cancel",
                                customClass: "largeText",
                                html: true
                            }, function (isConfirm) {
                                if (isConfirm)
                                {
                                    $('#addUnitModal').modal('hide');
                                    setTimeout(function () {
                                        window.location.href = '#/profile/profile-bankaccounts';
                                    }, 300);
                                }
                                else
                                {
                                    $('#unitTenantEm').val("");
                                }
                            });
                        }
                        else if ($('#addUnitModal #monthlyRent').val() < 100)
                        {
                            swal({
                                title: "Set Rent to $" + $('#addUnitModal #monthlyRent').val() + "?",
                                text: "You are about to set the rent for this unit to <strong>$" + $('#addUnitModal #monthlyRent').val() + "</strong>. &nbsp;Is that correct?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                cancelButtonText: "No - Edit Amount",
                                closeOnCancel: true,
                                customClass: "largeText",
                                html: true
                            }, function (isConfirm) {
                                if (!isConfirm)
                                {
                                    setTimeout(function () {
                                        $('#addUnitModal #monthlyRent').focus();
                                        return;
                                    }, 300);
                                }
                                else
                                {
                                    $scope.addUnit_submitToService();
                                }
                            });
                        }
                        else
                        {
                            $scope.addUnit_submitToService();
                        }
                    }
                    else
                    {
                        // No tenant email provided
                        $scope.addUnit_submitToService();
                    }
                }
                else
                {
                    updateValidationUi("monthlyRent", false);
                }
            }
            else
            {
                updateValidationUi("unitNum", false);
            }
        }

        $scope.addUnit_submitToService = function () {
            updateValidationUi("monthlyRent", true);

            $('#addUnitModal').modal('hide');

            // Prepare data to be submitted to DB
            var propId = propDetailsService.get();
            var userdetails = authenticationService.GetUserDetails();
            var unitData = {};
            unitData.UnitNum = $('#addUnitModal #unitNum').val();
            unitData.UnitNickName = $('#addUnitModal #nickname').val();
            unitData.Rent = $('#monthlyRent').val();
            unitData.DueDate = ($('#unitRentDueDate option:selected').text().length > 1) ? $('#unitRentDueDate option:selected').text() : "First of Month";
            unitData.RentStartDate = $('#addUnitDatePicker').val();
            unitData.LeaseLength = $('#addUnitModal #rentDurationInMonths option:selected').text();

            console.log(document.getElementById("tenantStatic"));
            console.log(document.getElementById("unitTenantEm"));

            unitData.TenantId = "";
            unitData.TenantEmail = "";

            if (document.getElementById("tenantStatic") && $('#tenantGrp #tenantStatic').attr('data-memid') != null)
            {
                unitData.TenantId = $('#tenantGrp #tenantStatic').attr('data-memid');
                unitData.IsTenantAdded = "true";
            }
            else if (document.getElementById("unitTenantEm") && $('#unitTenantEm').val().trim().length > 1)
            {
                unitData.TenantEmail = $('#unitTenantEm').val().trim();
                unitData.IsTenantAdded = "true";
            }
            else
            {
                unitData.IsTenantAdded = "false";
            }
            //console.log(JSON.stringify(unitData));

            // NOW CHECK WHETHER WE SHOULD CREATE A A *NEW* UNIT OR JUST EDIT IF THIS IS AN EXISTING UNIT
            if ($scope.addingNewUnit === true)
            {
                // Add a New Unit
                unitData.isNewUnit = true;
                unitData.UnitId = "";
                console.log(JSON.stringify(unitData));

                propertiesService.AddNewUnit(propId, unitData, userdetails.landlordId, userdetails.accessToken, function (data) {
                    console.log("Add New Unit service response...");
                    console.log(data);

                    if (data.IsSuccess == true)
                    {
                        // Update table to add row for the newly created unit immediately (instead of waiting for page refresh)

                        $scope.addTblRow(unitData.IsTenantAdded, userdetails.landlordId, data.PropertyIdGenerated, unitData.UnitNum, unitData.Rent, "", unitData.TenantEmail, "", "", false, false, "Invited", false, false);

                        swal({
                            title: "Unit Added",
                            text: "This unit has been added successfully.",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "#3FABE1",
                            confirmButtonText: "Terrific",
                            cancelButtonText: "Add Another One",
                            closeOnCancel: true,
                            customClass: "largeText"
                        }, function (isConfirm) {
                            if (!isConfirm)
                            {
                                $scope.addUnit();
                            }
                            else
                            {
                                setTimeout(function () {
                                    $state.reload();
                                }, 500);
                            }
                        });
                    }
                    else
                    {
                        swal({
                            title: "Uh Oh",
                            text: data.ErrorMessage,
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#3FABE1",
                            confirmButtonText: "Ok"
                        });
                    }
                });
            }
            else
            {
                // Editing An Existing Unit
                unitData.isNewUnit = false;
                unitData.UnitId = $scope.editingUnitId;
                console.log(JSON.stringify(unitData));

                propertiesService.EditUnitInProperty(propId, unitData, userdetails.landlordId, userdetails.accessToken, function (data) {
                    console.log("PropDetails Ctrlr -> Edit Unit service response...");
                    console.log(data);

                    if (data.IsSuccess == true)
                    {
                        // Update table to add row for the newly created unit immediately (instead of waiting for page refresh)
                        // $scope.addTblRow(unitData.IsTenantAdded, userdetails.landlordId, data.PropertyIdGenerated, unitData.UnitNum, unitData.Rent, "", "", "", "", false, false, "Published", false, false);

                        swal({
                            title: "Unit Updated",
                            text: "That unit has been updated successfully.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#3FABE1",
                            confirmButtonText: "OK",
                        }, function () {
                            // Now get the Property's details from the server again to update the data table
                            // (Actually might not need to do this... because of the $scope.addTbleRow()... think that updates if the unit already exists somehow...
                            // (UPDATE) actually, maybe not.  Haven't figured out the best plan for this yet.)
                            //console.log("Attempting to destroy the Data Table");
                            //$scope.propUnitsTable.destroy();
                            //getPropertyDetails();
                            $state.reload();
                        });
                    }
                    else
                    {
                        swal({
                            title: "Uh Oh",
                            text: "We had some trouble updating that unit.  Please try again, or contact <a href='mailto:support@nooch.com' target='_blank'>Nooch Support</a>!",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#3FABE1",
                            confirmButtonText: "Ok",
                            html: true
                        });
                    }
                });
            }
        }

        $scope.clearTenantInModal = function () {
            $('#addUnitForm #tenantGrp > div').html('<div class="fg-line"><input type="text" id="unitTenantEm" class="form-control placeholder-sm" placeholder="Enter Tenant\'s Email" maxlength="50"></div>');
            $compile($('#addUnitForm #tenantGrp #unitTenantEm'))($scope);
        }

        // Send Message Modal
        $scope.sendMsg = function (howMany) {
            // Reset each field
            $('#sndMsgForm #tenantMsgGrp').removeClass('has-error').removeClass('has-success');
            $('#sndMsgForm #msgGrp').removeClass('has-error').removeClass('has-success');
            $('#sndMsgForm #msg').val('');

            if ($('#tenantMsgGrp .help-block').length)
            {
                $('#tenantMsgGrp .help-block').slideUp();
            }
            if ($('#msgGrp .help-block').length)
            {
                $('#msgGrp .help-block').slideUp();
            }

            if (howMany == "all")
            {
                $('#sndMsgForm .well div').text('Enter a message below.  This will be emailed to ALL tenants for this property.');
                $('#sndMsgForm #tenantMsgGrp').addClass('hidden');
                $scope.IsMessageForall = true;
            }
            else if (howMany == "1")
            {
                $('#tenantMsg.selectpicker').selectpicker({
                    title: "Select a tenant",
                });

                $('#tenantMsg').selectpicker('refresh');

                $('#sndMsgForm .well div').text('Enter your message and select a tenant to send it to.');
                $('#sndMsgForm #tenantMsgGrp').removeClass('hidden');
                $scope.IsMessageForall = false;
            }

            $('#sendMsgModal').modal();
        }

        $scope.sendMsg_submit = function () {
            if ((!$('#sndMsgForm #tenantMsgGrp').hasClass('hidden') && $('#sndMsgForm #tenantMsg').val() != '0') ||
                  $('#sndMsgForm #tenantMsgGrp').hasClass('hidden'))
            {
                // Check Message field for length
                if ($('#sndMsgForm textarea').val().length > 1)
                {
                    var trimmedMsg = $('#sndMsgForm textarea').val().trim();
                    $('#sndMsgForm textarea').val(trimmedMsg);

                    updateValidationUi("msg", true);

                    // sending message to service here
                    var emailObj = {};
                    emailObj.MessageToBeSent = $('#sndMsgForm textarea').val();
                    emailObj.PropertyId = $scope.selectedProperty.propertyId;

                    if ($scope.IsMessageForall == true)
                    {
                        // for all
                        emailObj.IsForAllOrOne = "All";
                        emailObj.TenantIdToBeMessaged = "";
                    }
                    else
                    {
                        // for single person
                        emailObj.IsForAllOrOne = "One";
                        //console.log($('#tenantStatic').attr('data-memid'));

                        if ($scope.tenantSelectedForMsg != undefined)
                        {

                            emailObj.TenantIdToBeMessaged = $scope.tenantSelectedForMsg;
                        }
                        else
                        {

                            emailObj.TenantIdToBeMessaged = $('#tenantStatic').attr('data-memid');
                        }

                        // emailObj.TenantIdToBeMessaged = $('#tenantStatic').attr('data-memid');  // ID of tenant to be send from here..hard coded for now
                    }

                    var userdetails = authenticationService.GetUserDetails();
                    getProfileService.SendEmailsToTenants(userdetails.landlordId, userdetails.accessToken, emailObj, function (data) {
                        console.log(data);

                        if (data.IsSuccess)
                        {
                            $('#sendMsgModal').modal('hide');

                            // Finally, submit the data and display success alert
                            swal({
                                title: "Message Sent",
                                text: "Your message was sent successfully.",
                                type: "success",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Great",
                                closeOnConfirm: true
                            });
                        }
                        else
                        {
                            swal({
                                title: "Oh No!",
                                text: data.ErrorMessage,
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            });
                        }
                    });
                }
                else
                {
                    updateValidationUi("msg", false);
                }
            }
            else if (!$('#sndMsgForm #tenantMsgGrp').hasClass('hidden'))
            {
                updateValidationUi("tenantMsg", false);
            }
        }


        // Edit ACH Memo for all transactions for this property
        $scope.editAchMemo = function () {
            // Reset each field
            $('#achMemoGrp').removeClass('has-error').removeClass('has-success');

            if ($('#achMemoGrp .help-block').length)
            {
                $('#achMemoGrp .help-block').slideUp();
            }

            $('#editAchModal').modal();
        }

        $scope.editAchMemo_submit = function () {
            if ($('#editAchModal input[name=achMemoStyle]:checked').length)
            {
                var radioChoice = $('#editAchModal input[name=achMemoStyle]:checked').val();

                console.log("Radio choice: [" + radioChoice + "]");

                if (typeof radioChoice != "undefined" &&
                    (radioChoice === "1" || radioChoice === "2" || radioChoice === "3"))
                {
                    updateValidationUi('achMemo', true);

                    // Show Loading Block
                    $.blockUI({
                        message: '<span><i class="md md-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Saving selection...</span>',
                        css: {
                            border: 'none',
                            padding: '10px 5px 20px',
                            backgroundColor: '#000',
                            '-webkit-border-radius': '14px',
                            '-moz-border-radius': '14px',
                            'border-radius': '14px',
                            opacity: '.8',
                            color: '#fff'
                        }
                    });

                    $('#editAchModal').modal('hide');

                    var userDetailsLocal = authenticationService.GetUserDetails();

                    propDetailsService.saveMemoFormula(radioChoice, userDetailsLocal.landlordId, userDetailsLocal.memberId, userDetailsLocal.accessToken, function (response) {
                        console.log(response);

                        $.unblockUI({
                            onUnblock: function () {
                                if (response.success == true)
                                {
                                    swal({
                                        title: "Roger That",
                                        text: "Your ACH Memo settings have been udpated successfully.",
                                        type: "success",
                                        showCancelButton: false,
                                        confirmButtonColor: "#3FABE1",
                                        confirmButtonText: "Great",
                                        closeOnConfirm: true,
                                        customClass: "largeText"
                                    });
                                }
                                else
                                {
                                    swal({
                                        title: "Oh No!",
                                        text: response.msg,
                                        type: "error",
                                        showCancelButton: false,
                                        confirmButtonColor: "#3FABE1",
                                        confirmButtonText: "Ok",
                                        closeOnConfirm: true
                                    });
                                }
                            }
                        });
                    });
                }
            }
            else
            {
                updateValidationUi('achMemo', false);
            }
        }

        // Utility Function To Update Form Input's UI for Success/Error (Works for all forms on the Property Details page...like 4 of them)
        updateValidationUi = function (field, success) {
            //console.log("Field: " + field + "; success: " + success);

            if (success == true)
            {
                $('#' + field + 'Grp').removeClass('has-error').addClass('has-success');
                if ($('#' + field + 'Grp .help-block').length)
                {
                    $('#' + field + 'Grp .help-block').slideUp();
                }
            }
            else
            {
                $('#' + field + 'Grp').removeClass('has-success').addClass('has-error');

                var helpBlockTxt = "";
                if (field == "tenant")
                {
                    helpBlockTxt = "Please select one of your current tenants.";
                }
                else if (field == "amount")
                {
                    helpBlockTxt = "Please enter an amount!"
                }
                else if (field == "tenantMsg")
                {
                    helpBlockTxt = "Please select a tenant!"
                }
                else if (field == "msg")
                {
                    helpBlockTxt = "Please enter a message!"
                }
                else if (field == "achMemo")
                {
                    helpBlockTxt = "Please select one of the options above."
                }

                if (!$('#' + field + 'Grp .help-block').length)
                {
                    $('#' + field + 'Grp').append('<small class="help-block col-sm-offset-3 col-sm-9" style="display:none">' + helpBlockTxt + '</small>');
                    $('#' + field + 'Grp .help-block').slideDown();
                }
                else
                { $('#' + field + 'Grp .help-block').show() }

                // Now focus on the element that failed validation
                setTimeout(function () {
                    $('#' + field + 'Grp input').focus();
                }, 200)
            }
        }

        $scope.ValidateEmail = function (str) {
            console.log; ("Property Details Ctrlr -> Validate Email reached");

            if (str != null)
            {
                var at = "@"
                var dot = "."
                var lat = str.indexOf("@")
                var lstr = str.length
                var ldot = str.indexOf(".")

                if (lat == -1 || lat == 0 || lat == lstr)
                {
                    return false
                }

                if (ldot == -1 || ldot == 0 || ldot == lstr)
                {
                    return false
                }

                if (str.indexOf(at, (lat + 1)) != -1)
                {
                    return false
                }

                if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot)
                {
                    return false
                }

                if (str.indexOf(dot, (lat + 2)) == -1)
                {
                    return false
                }

                if (str.indexOf(" ") != -1)
                {
                    return false
                }

                return true
            }
            return false
        };

        $('#addUnitModal').on('hidden.bs.modal', function (e) {
            // Destroy (Reset) Date Time Picker
            $('#addUnitDatePicker').data("DateTimePicker").destroy();
        })
    })


    // FOR PROPERTY DETAILS TABLE (Not Used!)
    .directive('propDetailsTable', function ($compile) {
        return {
            restrict: 'EA',
            scope: {
                editunit: "&"
            },
            compile: function (scope, element, attr) {
                return function (scope, element, attr) {
                    element.bootgrid({
                        css: {
                            icon: 'md-tableHdr',
                            iconColumns: 'md-view-module',
                            iconDown: 'md-expand-more',
                            iconRefresh: 'md-refresh',
                            iconUp: 'md-expand-less'
                        },
                        formatters: {
                            "unit": function (column, row) {
                                return "<span class=\"f-600 f-22 c-darkblue unitInTable\">" + row.unit + "</span>";
                            },
                            "tenant": function (column, row) {
                                var emailStatus = "c-gray";
                                var phoneStatus = "c-gray";
                                var idStatus = "c-gray";
                                var bankStatus = "c-gray";

                                if (row.isEmailVer == "1") { emailStatus = "c-blue"; }
                                if (row.isPhoneVer == "1") { phoneStatus = "c-blue"; }
                                if (row.isIdVerified == "1") { idStatus = "c-blue"; }
                                if (row.isBankAttached == "1") { bankStatus = "c-blue"; }

                                return "<div class=\"media\"><div class=\"pull-left\">" +
                                       "<img class=\"tableUserPic m-r-5\" src=\"img/contacts/" + row.id + ".jpg\"></div>" +
                                       "<div class=\"media-body\"><div class=\"lv-title f-15 f-500\">" + row.tenant + "</div>" +
                                       "<small class=\"lv-small f-12\">" + row.email + "</small>" +
                                       "<div class=\"icons\"><i class=\"md md-verified-user " + idStatus + "\"></i><i class=\"md md-email " + emailStatus + "\"></i><i class=\"md md-phone-iphone " + phoneStatus + "\"></i><i class=\"md md-account-balance " + bankStatus + "\"></i></div></div></div>";
                            },
                            "status": function (column, row) {
                                var lastDateText = "<br/><span class=\"lastPaymentDate\">(Last: " + row.lastPaymentDate + ")</span>";

                                if (row.status == "Paid" || row.status == "paid" || row.status == "completed")
                                {
                                    return "<span class=\"label label-success\">" + row.status + "</span>" + lastDateText;
                                }
                                else if (row.status.toLowerCase == "pending")
                                {
                                    return "<span class=\"label label-warning\">" + row.status + "</span>" + lastDateText;
                                }
                                else if (row.status.toLowerCase() == "past due")
                                {
                                    return "<span class=\"label label-danger\">" + row.status + "</span>" + lastDateText;
                                }
                                else
                                {
                                    return "<span class=\"label label-warning\">" + row.status + "</span>" + lastDateText;
                                }
                            },
                            "amount": function (column, row) {
                                return "<div class=\"f-500 f-15 text-center\">$ " + row.amount + "</div>";
                            },
                            "actions": function (column, row) {
                                return "<button type=\'button\' class=\'btn btn-icon btn-default command-edit m-r-10 editUnitBtn\' data-row-id=\'" + row.id + "-1\' data-ng-click=\'addUnit()\'><span class=\'md md-edit\'></span></button> " +
                                       "<button type=\'button\' class=\'btn btn-icon btn-default command-edit m-r-10\' data-row-id=\'" + row.id + "-2\'><span class=\'md md-today\'></span></button> " +
                                       "<button type=\'button\' class=\'btn btn-icon btn-default command-edit m-r-10\' data-row-id=\'" + row.id + "-3\' data-ng-click=\'editUnit($event)\'><span class=\'md md-more-vert\'></span></button> ";
                            },
                        },
                        columnSelection: false,
                        caseSensitive: false,
                        searchSettings: { characters: 3 },
                        labels: {
                            noResults: "No units or tenants match that search, unfortunately."
                        },
                        statusMappings: {

                        }
                    });
                }

                //element.find('.editUnitBtn').append($compile(scope.actionLinks)(scope));
                //$compile(element.find('.editUnitBtn'))(scope);
            }
        }
    })


    // Delete Property Popup
    .directive('deleteProp', function (propertiesService, authenticationService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    var propertyId = attrs.propid;
                    var userdetails = authenticationService.GetUserDetails();

                    console.log('Delete Property Directive -> Landlord ID: ' + userdetails.landlordId);

                    swal({
                        title: "Are you sure?",
                        text: "This will delete this property from your account.  Your tenants will no longer be able to pay you rent for this property.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it",
                        cancelButtonText: "No, keep it",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            propertiesService.RemoveProperty(propertyId, userdetails.landlordId, userdetails.accessToken, function (data2) {
                                if (data2.IsSuccess == true)
                                {

                                    swal("Deleted!", "That property has been deleted.", "success");
                                    $('.propCard#property' + propertyId).fadeOut();
                                }
                                else
                                {
                                    swal({
                                        title: "Oh No!",
                                        text: data2.ErrorMessage,
                                        type: "error"
                                    }, function (isConfirm) {
                                        window.location.href = '#/properties';
                                    });
                                }
                            });
                        }
                        else
                        {
                            swal("Cancelled", "No worries, this property is safe :)");
                        }
                    });
                });
            }
        }
    })


    // ADD PROPERTY Page
    .controller('addPropertyCtrl', function ($scope, $compile, $state, authenticationService, propertiesService) {
        $scope.inputData = {};
        $scope.inputData.propertyName = '';
        $scope.inputData.propertyImage = '';
        $scope.inputData.IsPropertyImageSelected = false;

        $scope.inputData.IsSingleUnitProperty = false;
        $scope.inputData.IsMultiUnitProperty = false;

        $scope.inputData.propertyAddress = '';
        $scope.inputData.propertyCity = '';
        $scope.inputData.propertyZip = '';

        $scope.inputData.SingleUnitRent = '';
        $scope.inputData.allUnits = [];

        var userdetails = authenticationService.GetUserDetails();

        $("#addPropWiz").steps({
            headerTag: "h3",
            bodyTag: "section",
            stepsOrientation: "vertical",
            transitionEffect: 'slideLeft',
            transitionEffectSpeed: 400,
            enableCancelButton: true,

            /* Events */
            onInit: function (event, curretIndex) {
                $compile($('.wizard.vertical > .content'))($scope);

                setTimeout(function () {
                    $('#propertyName').focus();
                }, 900);

                $scope.unitInputsShowing = 0;
            },
            onStepChanging: function (event, currentIndex, newIndex) {

                if (newIndex == 0)
                {
                    $('.wizard.vertical > .content').animate({ height: "22em" }, 500)
                }

                // IF going to Step 2
                if (newIndex == 1)
                {
                    if ($('#propertyName').val().length > 3)
                    {
                        console.log($scope.inputData.propertyName);

                        updateValidationUi(1, null, true);

                        addPropPicFileInput
                        // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
                        $("#addPropPicFileInput").fileinput({
                            allowedFileTypes: ['image'],
                            previewSettings: {
                                image: { width: "auto", height: "150px" }
                            },
                            layoutTemplates: {
                                icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                            },
                            initialPreview: [
                                "<img src='img/property-pics/default.png' class='file-preview-image'>",
                            ],
                            initialPreviewShowDelete: false,
                            maxFileCount: 1,
                            maxFileSize: 400,
                            msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                            showCaption: false,
                            showUpload: false,
                            showPreview: true,
                            resizeImage: true,
                            maxImageWidth: 600,
                            maxImageHeight: 600,
                            resizePreference: 'width'
                        });


                        // event will be fired after file is selected
                        $('#addPropPicFileInput').on('fileloaded', function (event, file, previewId, index, reader) {
                            //alert();
                            $scope.inputData.IsPropertyImageSelected = true;
                            var readerN = new FileReader();
                            //readerN.readAsText(file);

                            console.log(file);
                            readerN.readAsDataURL(file);
                            readerN.onload = function (e) {
                                // browser completed reading file - display it

                                var splittable = e.target.result.split(',');
                                var string1 = splittable[0];
                                var string2 = splittable[1];
                                //console.log(string2);
                                $scope.inputData.propertyImage = string2;
                                console.log(string2);
                            };
                        });

                        $('.wizard.vertical > .content').animate({ height: "32em" }, 750)
                        return true;
                    }
                    else
                    {
                        updateValidationUi(1, null, false);
                        return false;
                    }
                }

                // IF going to Step 3
                if (newIndex == 2)
                {
                    $('.wizard.vertical > .content').animate({ height: "23em" }, 700)
                    setTimeout(function () {
                        $('#address1').focus();
                    }, 700);
                    return true;
                }

                // IF going to Step 4
                if (newIndex == 3)
                {
                    // Check Address Field
                    if ($('#address1').val().length > 4)
                    {
                        updateValidationUi(3, 1, true);

                        // Now check City field
                        if ($('#city').val().length > 3)
                        {
                            updateValidationUi(3, 2, true);

                            // Now check ZIP field
                            if ($('#zipCode').val().length == 5)
                            {
                                updateValidationUi(3, 3, true);

                                setWizardContentHeight();

                                return true;
                            }
                            else
                            {
                                updateValidationUi(3, 3, false);
                                return false;
                            }
                        }
                        else
                        {
                            updateValidationUi(3, 2, false);
                            return false;
                        }
                    }
                    else
                    {
                        updateValidationUi(3, 1, false);
                        return false;
                    }
                }

                // Allways allow previous action even if the current form is not valid!
                if (currentIndex > newIndex)
                {
                    return true;
                }
            },
            onStepChanged: function (event, currentIndex, priorIndex) {
                if (currentIndex == 3) // Final Step
                {
                    setTimeout(function () {
                        var $singleUnitClick = $('#singleUnit').attr('data-ng-click', 'selectSingleUnit()');
                        $compile($singleUnitClick)($scope);

                        var $multiUnitClick = $('#multiUnit').attr('data-ng-click', 'selectMultiUnit()');
                        $compile($multiUnitClick)($scope);

                    }, 200);
                }
            },
            onCanceled: function (event) {
                cancelAddProp();
            },
            onFinished: function (event, currentIndex) {
                saveProperty();
            }
        });

        $('#addPropWiz input').keydown(function (e) {
            var code = e.keyCode || e.which;
            if (code == 9) // Tab key
            {
                $(this).parents('.col-xs-12').next('.col-xs-12').find('input').focus();
                return false;
            }
        });


        saveProperty = function () {
            // Send data to server
            if ($scope.inputData.IsMultiUnitProperty == true)
            {
                // iterating through all units

                $scope.inputData.IsSingleUnitProperty = false;

                $('#addedUnits > div').each(function (da, ht) {
                    var unitObject = {};

                    var temp = 0;
                    $(ht).find('input[type=text]').each(function (ini, dtt) {
                        //console.log(dtt);
                        temp = temp + 1;
                        if (temp == 1)
                        {
                            // CLIFF (10/25/15): EVENTUALLY SHOULD ADD A CHECK HERE TO SEE IF THE PERSON ENTERE ALL NUMBERS OR INCLDED
                            // A FEW CHARACTERS, MEANING THEY PROBABLY ENTERED A "NICKNAME" NOT A "UNIT #"
                            unitObject.UnitNum = $(this).val();
                        }
                        if (temp == 2)
                        {
                            // CLIFF (10/25/15): Should also add a check here to make sure the amount isn't too low (user might not realize 
                            //                   the cents are included, so they might enter "20.00" when they meant "2000.00")
                            unitObject.Rent = $(this).val();
                        }
                    });
                    unitObject.IsAddedWithProperty = true;
                    $scope.inputData.allUnits.push(unitObject);
                });
            }
            else
            {
                $scope.inputData.IsSingleUnitProperty = true;
                $scope.inputData.IsMultiUnitProperty = false;
                $scope.inputData.SingleUnitRent = $('#singleUnitRentInput').val();

                //console.log('single unit val ' + $scope.inputData.SingleUnitRent);
            }

            propertiesService.SaveProperty($scope.inputData, userdetails.landlordId, userdetails.memberId, userdetails.accessToken, function (data) {
                if (data.IsSuccess == false)
                {
                    swal({
                        title: "Ooops Error!",
                        text: data.ErrorMessage,
                        type: "warning"
                    }, function (isConfirm) {
                        window.location.href = '#/properties';
                    });
                }
                if (data.IsSuccess == true)
                {
                    swal({
                        title: "Awesome - Property Added",
                        text: "You have successfully created a new property:<span class='show f-600 m-t-5'>" + $scope.inputData.propertyName + "</span>" +
                              "<span class='show m-t-10'>You can view all your properties by clicking \"Properties\" in the navigation menu on the left side of the screen.</span>",//Would you like to \"publish\" this property so your tenants can pay their rent? (You can do this later, too.)",
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Ok",
                        cancelButtonText: "Add Another",
                        html: true,
                    }, function (isConfirm) {
                        propertiesService.SetPropertyStatus(data.PropertyIdGenerated, true, userdetails.landlordId, userdetails.accessToken, function (data2) {

                            // CLIFF (10/25/15): Commenting these alerts out b/c the "publish" function may be confusing to landlords, so to simplify the "new user" process, let's skip these for now.
                            /*if (data2.IsSuccess == false) {
                                swal({
                                    title: "Oh No!",
                                    text: data2.ErrorMessage,
                                    type: "error"
                                });
                            }
                            if (data2.IsSuccess == true) {
                                swal({
                                    title: "You Got It!",
                                    text: "Your property has been published.",
                                    type: "success"
                                });
                            }*/
                        });

                        if (isConfirm)
                        {
                            window.location.href = '#/properties';
                        }
                        else
                        {
                            $state.reload();
                        }
                    });
                }
            });
        }

        updateValidationUi = function (step, substep, success) {
            //console.log("Step: " + step + "; substep: " + substep + "; success: " + success);

            if (step == 1)
            {
                if (success == true)
                {
                    $('#propNameGrp').removeClass('has-error').addClass('has-success');
                    $('#propNameGrp .form-control-feedback').fadeIn();
                    $('#step1Feedback .alert-danger').slideUp('fast');
                }
                else
                {
                    $('.form-group#propNameGrp').removeClass('has-success').addClass('has-error');
                    $('#step1Feedback .alert-danger').slideDown('fast');

                    setTimeout(function () {
                        $('#propertyName').focus();
                    }, 200);
                }
            }

            else if (step == 3)
            {
                if (substep == 1)
                {
                    if (success != true)
                    {
                        $('#addressGrp').removeClass('has-success').addClass('has-error');
                        $('#step3Feedback span').html('Please enter the <strong>street address</strong> for this property!');
                        $('#step3Feedback .alert-danger').slideDown('fast');
                        setTimeout(function () {
                            $('#address1').focus();
                        }, 200);
                    }
                }
                else if (substep == 2)
                {
                    if (success != true)
                    {
                        $('#addressGrp').removeClass('has-success').addClass('has-error');
                        $('#step3Feedback span').html('Please enter the <strong>city</strong> for this property!');
                        $('#step3Feedback .alert-danger').slideDown('fast');
                        setTimeout(function () {
                            $('#city').focus();
                        }, 200);
                    }
                }
                else if (substep == 3)
                {
                    if (success == true)
                    {
                        $('#addressGrp').removeClass('has-error').addClass('has-success');
                        $('#step3Feedback .alert-danger').slideUp('fast');
                    }
                    else
                    {
                        $('#addressGrp').removeClass('has-success').addClass('has-error');
                        $('#step3Feedback .alert-danger').slideDown('fast');
                        $('#step3Feedback span').html('Please enter the <strong>ZIP code</strong> for this property!');
                        setTimeout(function () {
                            $('#zipCode').focus();
                        }, 200);
                    }
                }
            }
        }

        this.cancelGoBack = function () {
            cancelAddProp();
        }
        cancelAddProp = function () {
            swal({
                title: "Cancel Adding A Property",
                text: "Are you sure you want to cancel?  This property will not be added.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes - Cancel",
                cancelButtonText: "No, go back",
                closeOnConfirm: true,
                closeOnCancel: true,
                customClass: "largeText"
            }, function (isConfirm) {
                if (isConfirm)
                {
                    $('#addNewProperty').addClass('animated').addClass('bounceOut');

                    // Send user back to main Properties page after exist animation completes
                    setTimeout(function () {
                        window.location.href = '#/properties';
                    }, 900);
                }
                else
                { }
            });
        }

        $scope.selectSingleUnit = function () {

            $scope.inputData.IsSingleUnitProperty = true;
            $scope.inputData.IsMultiUnitProperty = false;

            $('#multiUnit').addClass('bounceOut'); // bounceOut CSS takes 750ms

            $('#or').fadeOut(750);

            setTimeout(function () {
                $('#multiUnit').addClass('hidden');

                $('#singleUnit').css({
                    "width": "52%",
                    "margin-left": "24%"
                });

                $('#singleUnit-rentAmountBlock').removeClass('hidden');
                $('#singleUnit-rentAmountBlock').addClass('fadeIn');

                $('#singleUnit-rentAmountBlock input').mask("#,##0.00", { reverse: true });

                setTimeout(function () {
                    $('#singleUnit-rentAmountBlock input').focus();
                }, 1000);

            }, 750);
        }

        $scope.selectMultiUnit = function () {

            $scope.inputData.IsSingleUnitProperty = false;

            $scope.inputData.IsMultiUnitProperty = true;
            //$('#singleUnit').addClass('fadeOutLeft');
            $('#singleUnit').css(
                "margin-left", "-250px"
            ).css("opacity", "0");
            $('#or').css(
                "margin-left", "-150px"
            );
            $('#multiUnit').css(
                "width", "27%"
            );
            setTimeout(function () {
                $('#addUnitContainer').removeClass('hidden');
                $('#addUnitContainer').fadeIn();
            }, 800);
        }

        this.addUnit = function () {
            $scope.unitInputsShowing += 1;

            setWizardContentHeight();

            var templateUnit = "<div class=\"row m-b-15\"><div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-15\"><div class=\"fg-line\"><input type=\"text\" id=\"addUnit_Num" + $scope.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"15\"></div><label class=\"fg-label\">Unit # (or Nickname)</label></div></div>" +
                                                         "<div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-0\"><div class=\"fg-line dollar\"><input type=\"text\" id=\"addUnit_Amnt" + $scope.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"7\"></div><label class=\"fg-label\">Rent Amount</label></div></div></div>";
            var newUnit = "#unit" + $scope.unitInputsShowing;

            $('#addedUnits').append(templateUnit);

            $compile($('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing))($scope);
            $('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing).mask("#,##0.00", { reverse: true });
        }

        function setWizardContentHeight() {
            if ($scope.unitInputsShowing > 1)
            {
                if ($scope.unitInputsShowing > 12)
                {
                    $('.wizard.vertical > .content').animate({ height: "75em" }, 600);
                }
                else if ($scope.unitInputsShowing > 10)
                {
                    $('.wizard.vertical > .content').animate({ height: "65em" }, 600);
                }
                else if ($scope.unitInputsShowing > 8)
                {
                    $('.wizard.vertical > .content').animate({ height: "60em" }, 600);
                }
                else if ($scope.unitInputsShowing > 4)
                {
                    $('.wizard.vertical > .content').animate({ height: "46em" }, 600);
                }
                else if ($scope.unitInputsShowing > 2)
                {
                    $('.wizard.vertical > .content').animate({ height: "32em" }, 600);
                }
                else
                {
                    $('.wizard.vertical > .content').animate({ height: "28em" }, 600);
                }
            }
            else
            {
                $('.wizard.vertical > .content').animate({ height: "25em" }, 700);
            }
        }
    })



    //=================================================
    // Profile
    //=================================================

    .controller('profileCtrl', function ($rootScope, $scope, $compile, growlService, getProfileService, propertiesService, authenticationService, $state) {
        //console.log("PROFILE CTRL Fired");

        $scope.userInfo = {};

        // Get User's Info from DB
        if (authenticationService.IsValidUser() == true)
        {
            var userdetails = authenticationService.GetUserDetails();

            $scope.userInfoInSession = userdetails;

            getProfileService.GetData(userdetails.landlordId, userdetails.accessToken, function (response) {
                console.log('Profile Controller -> User profile data -> ' + JSON.stringify(response));

                // Check AuthTokenValidation
                if (response.AuthTokenValidation.IsTokenOk == true)
                {
                    // Update MemberID
                    authenticationService.SetUserDetails(response.UserEmail, response.MemberId, "", response.AuthTokenValidation.AccessToken);

                    // binding user information
                    $scope.userInfo.isIdVerified = response.isIdVerified;

                    $scope.userInfo.type = response.AccountType;
                    $scope.userInfo.subtype = response.SubType;

                    $scope.userInfo.firstName = response.FirstName;
                    $scope.userInfo.lastName = response.LastName;
                    $scope.userInfo.fullName = $scope.userInfo.firstName + " " + $scope.userInfo.lastName;

                    // Update $RootScope user details for setting global vars
                    $rootScope.userDetailsRoot.fName = response.FirstName;
                    $rootScope.userDetailsRoot.lName = response.LastName;
                    $rootScope.isIdVerified = response.isIdVerified;
                    $rootScope.IsPhoneVerified = response.IsPhoneVerified;
                    $rootScope.IsEmailVerified = response.IsEmailVerified;
                    $rootScope.emailAddress = response.UserEmail;
                    $rootScope.ContactNumber = response.MobileNumber;
                    $rootScope.unitsCount = response.UnitsCount;

                    $scope.userInfo.birthDay = response.DOB;

                    $scope.userInfo.mobileNumber = response.MobileNumber;
                    $scope.userInfo.isPhoneVerified = response.IsPhoneVerified;

                    $scope.userInfo.emailAddress = response.UserEmail;
                    $scope.userInfo.isEmailVerified = response.IsEmailVerified;

                    if (response.FbUrl.indexOf('.com/') > -1)
                    {
                        var strippedFbId = response.FbUrl.substr(response.FbUrl.indexOf('.com/') + 5);
                        $scope.userInfo.fb = strippedFbId;
                    }
                    else
                    {
                        $scope.userInfo.fb = response.FbUrl;
                    }

                    $scope.userInfo.twitter = response.TwitterHandle;
                    $scope.userInfo.insta = response.InstaUrl;

                    $scope.userInfo.address1 = response.AddressLine1;
                    $scope.userInfo.addressCity = response.City;
                    $scope.userInfo.addressCountry = response.Country;
                    $scope.userInfo.zip = response.Zip;

                    if (response.UserImageUrl == null)
                        $scope.userInfo.userImage = "https://www.noochme.com/noochservice/UploadedPhotos/Photos/gv_no_photo.png"
                    else
                        $scope.userInfo.userImage = response.UserImageUrl;

                    $rootScope.userDetailsRoot.imgUrl = $scope.userInfo.userImage;
                    $scope.userInfo.tenantsCount = response.TenantsCount;
                    $rootScope.propCount = response.PropertiesCount;
                    $scope.userInfo.propertiesCount = response.PropertiesCount;
                    $scope.userInfo.unitsCount = response.UnitsCount;

                    // Set Company Info
                    $scope.company = {
                        name: response.CompanyName,
                        ein: response.CompanyEID
                    }
                }
                else if (response.ErrorMessage == "Auth token failure") // Auth Token was not valid on server
                {
                    //authenticationService.ClearUserData();
                    window.location.href = 'login.html';
                }
            });
        }
        else
        {
            /* if (localStorage.getItem('userLoginName') != null &&
                 localStorage.getItem('userLoginName').length > 0 &&
                 localStorage.getItem('userLoginPass') != null &&
                 localStorage.getItem('userLoginPass').length > 0)
             {
                 $scope.LoginData = {
                     username : localStorage.getItem('userLoginName'),
                     pw : localStorage.getItem('userLoginPass')
                 }
 
                 // Get IP Address from 'upusr' var, which is defined in Login.html
                        var ip = (typeof ipusr != 'undefined')
                                 ? ipusr
                                 : "";
                 //console.log("IP: [" + ip + "]");

                 authenticationService.Login($scope.LoginData.username, $scope.LoginData.pw, ip, function (response) {
 
                     console.log(response);
 
                     if (response.IsSuccess == true) {
                         console.log("Profile Controller -> Re-login Successful!");
 
                         authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.LandlordId, response.AccessToken);
 
                         //$scope.reloadRoute = function () {
                         location.reload();
                         //};
                         //window.location.href = 'index.html#/home';
                     }
                     else {
                         console.log('Sign In Error: ' + response.ErrorMessage);
                         window.location.href = 'login.html';
                     }
                 })
             }
             else
             {*/
            window.location.href = 'login.html';
            //alert('Auth token failure 2');
            //}
        }

        // When user Edits one of the "Profile - About" sections
        this.editPersonalInfo = 0;
        this.editBusinessInfo = 0;
        this.editContactInfo = 0;
        this.editSocialInfo = 0;

        this.beginEditingPersonal = function () {
            this.editPersonalInfo = 1;
            this.editBusinessInfo = 0;
            this.editContactInfo = 0;
            this.editSocialInfo = 0;
            setTimeout(function () {
                $('input#fullName').focus();
            }, 500)
        }
        this.beginEditingCompany = function () {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 1;
            this.editContactInfo = 0;
            this.editSocialInfo = 0;
            setTimeout(function () {
                $('input#compName').focus();
            }, 500)
        }
        this.beginEditingContact = function () {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 0;
            this.editContactInfo = 1;
            this.editSocialInfo = 0;
        }
        this.beginEditingSocial = function () {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 0;
            this.editContactInfo = 0;
            this.editSocialInfo = 1;
        }
        this.cancel = function () {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 0;
            this.editContactInfo = 0;
            this.editSocialInfo = 0;
        }
        this.submit = function (item, message) {

            var deviceInfo = {
                LandlorId: $scope.userInfoInSession.landlordId,
                AccessToken: $scope.userInfoInSession.accessToken,
                MemberId: $scope.userInfoInSession.memberId
            };

            var userInfo = {};

            if (item === 'personalInfo')
            {
                userInfo.fullName = $scope.userInfo.fullName;
                userInfo.birthDay = $scope.userInfo.birthDay;
                userInfo.InfoType = 'Personal';

                this.editPersonalInfo = 0;
            }
            else if (item === 'businessInfo')
            {
                userInfo.companyName = $scope.company.name;
                userInfo.compein = $scope.company.ein;
                userInfo.InfoType = 'Company';

                this.editBusinessInfo = 0;
            }
            else if (item === 'contactInfo')
            {

                userInfo.email = $scope.userInfo.emailAddress;
                userInfo.mobileNum = $scope.userInfo.mobileNumber;
                userInfo.InfoType = 'Contact';
                userInfo.addressLine1 = $scope.userInfo.address1;
                userInfo.twitterHandle = $scope.userInfo.twitter;

                this.editContactInfo = 0;
            }
            else if (item === 'socialInfo')
            {
                userInfo.fb = $scope.userInfo.fb;
                userInfo.twitterHandle = $scope.userInfo.twitter;
                userInfo.InfoType = 'Social';
                userInfo.insta = $scope.userInfo.insta;

                this.editSocialInfo = 0;
            }

            getProfileService.UpdateInfo(userInfo, deviceInfo, function (response) {
                if (response.IsSuccess == true)
                    growlService.growl(userInfo.InfoType + ' info updated successfully!', 'success');
                else
                    growlService.growl(response.ErrorMessage, 'danger');
            });
        }

        $scope.editProfilePic = function () {
            $('#addPic').modal();

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#profilePicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='" + $scope.userInfo.userImage + "' class='file-preview-image' alt='Profile Picture' id='userPreviewPic'>"
                ],
                initialPreviewShowDelete: false,
                layoutTemplates: {
                    icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                },
                maxFileCount: 1,
                maxFileSize: 400,
                msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                showCaption: false,
                showUpload: false,
                uploadUrl: URLs.UploadLandlordProfileImage,
                uploadExtraData: {
                    LandlorId: $scope.userInfoInSession.landlordId,
                    AccessToken: $scope.userInfoInSession.accessToken
                },
                showPreview: true,
                resizeImage: true,
                maxImageWidth: 600,
                maxImageHeight: 600,
                resizePreference: 'width'
            });


            $('#profilePicFileInput').on('fileuploaded', function (event, data, previewId, index) {
                var response = data.response;
                console.log(data);
                console.log(response);

                if (data.response.IsSuccess == true)
                {
                    $('#addPic').modal('hide');
                    $scope.userInfo.userImage = data.response.ErrorMessage;
                    $rootScope.userDetailsRoot.imgUrl = data.response.ErrorMessage + '#' + new Date().getTime();
                    $('#userPreviewPic').css('background-image', 'url("' + data.response.ErrorMessage + '")');

                    //$('#userProfilePic').attr('src', '');
                    setTimeout(function () {
                        $('#userPreviewPic').css('background-image', 'url("' + data.response.ErrorMessage + '#' + new Date().getTime() + '")');
                        $state.reload();
                    }, 400);
                }
                else
                {
                    $('#addPic').modal('hide');

                    swal({
                        title: "Oh No...",
                        text: data.response.ErrorMessage,
                        type: "error"
                    });
                }
            });
        }

        $scope.saveProfilePic = function () {
            $('#profilePicFileInput').fileinput('upload'); // This should automatically call the URL specified in 'uploadUrl' parameter above
        }

        //console.log("$rootScope.isIdVerified... (2702):");
        //console.log($rootScope.isIdVerified);


        $scope.runWizard = function () { runIdWizard(); }

        function runIdWizard() {
            $('#idVer').modal({
                'backdrop': 'static',
            });

            // Setup the ID Verification Wizard
            // Wizard Plugin Reference: https://github.com/rstaib/jquery-steps/wiki/Settings
            $("#idVerWiz").steps({
                headerTag: "h3",
                bodyTag: "section",
                stepsOrientation: "horizontal",
                transitionEffect: 'slideLeft',
                transitionEffectSpeed: 400,

                /* Labels */
                labels: {
                    finish: "Submit"
                },

                /* Events */
                onInit: function (event, currentIndex) {
                    $('html').css('overflow-y', 'scroll');

                    $('#idVerWiz > .content').animate({ height: "24em" }, 300)

                    setTimeout(function () {

                        $('input#idVer-name').focus();

                        var dobPicker = $('#idVer-dob');
                        $compile(dobPicker)($scope);

                        $('#idVer-dob').datetimepicker({
                            format: 'MM/DD/YYYY',
                            useCurrent: false,
                            defaultDate: moment("1980 01 01", "YYYY MM DD"),
                            icons: {
                                previous: 'fa fa-fw fa-chevron-circle-left',
                                next: 'fa fa-fw fa-chevron-circle-right',
                                clear: 'fa fa-fw fa-trash-o'
                            },
                            maxDate: moment("1996 12 31", "MYYYY MM DD"),
                            viewMode: 'years',
                            //debug: true
                        });

                        var calendarIcon = $('#idVerForm1 .md-event');

                        calendarIcon.click(function () {
                            setTimeout(function () {
                                $('#dobGrp .dtp-container.dropdown').addClass('fg-toggled open');
                                $('#idVer-dob').data("DateTimePicker").show();
                            }, 150);
                        });

                        $('#idVer-ssn').mask("000 - 00 - 0000");
                        $('#idVer-ein').mask("00 - 0000000");
                        $('#idVer-zip').mask("00000");
                        $('#idVer-phone').mask("(000) 000-0000");

                        // Need to initialize the Popover b/c it's in a modal here
                        $('[data-toggle="popover"]').popover();
                    }, 750)
                },
                onStepChanging: function (event, currentIndex, newIndex) {

                    if (newIndex == 0) $('#idVerWiz > .content').animate({ height: "24.5em" }, 500)

                    // IF going to Step 2
                    if (newIndex == 1)
                    {
                        // Check Name field for length
                        if ($('#idVer-name').val().trim().length > 4)
                        {
                            var trimmedName = $('#idVer-name').val().trim();
                            $('#idVer-name').val(trimmedName);

                            // Check Name Field for a " "
                            if ($scope.userInfo.subtype == "Business" || $('#idVer-name').val().indexOf(' ') > 1)
                            {
                                updateValidationUi("name", true);

                                // Check Email field
                                $('#idVer-email').val($('#idVer-email').val().trim());

                                if ($scope.ValidateEmail($('#idVer-email').val()) == true)
                                {
                                    updateValidationUi("email", true);

                                    // Finally, check the phone number's length
                                    if ($('#idVer-phone').val().trim().replace(/[^0-9]/g, '').length == 10)
                                    {
                                        updateValidationUi("phone", true);

                                        // Great, we can finally go to the next step of the wizard :-D
                                        $('#idVerWiz > .content').animate({ height: "19em" }, 600)
                                        return true;
                                    }
                                    else updateValidationUi("phone", false);
                                }
                                else updateValidationUi("email", false);
                            }
                            else updateValidationUi("name", false);
                        }
                        else updateValidationUi("name", false);

                        return false;
                    }

                    // IF going to Step 3
                    if (newIndex == 2)
                    {
                        // Check Address field
                        var trimmedAddress = $('#idVer-address').val().trim();
                        $('#idVer-address').val(trimmedAddress);

                        if ($('#idVer-address').val().trim().length > 4 &&
                            $('#idVer-address').val().indexOf(' ') > -1)
                        {
                            updateValidationUi("address", true);

                            // Check ZIP code field
                            var trimmedZip = $('#idVer-zip').val().trim().replace(/[^0-9]/g, '');
                            $('#idVer-zip').val(trimmedZip);

                            if ($('#idVer-zip').val().length == 5)
                            {
                                updateValidationUi("zip", true);

                                // Check ZIP code field
                                if ($('#idVer-phone').val().length == 14)
                                {
                                    updateValidationUi("phone", true);

                                    // Great, go to the next step of the wizard :-]
                                    // Great, go to the next step of the wizard :-]

                                    $('#idVerWiz > .content').animate({ height: "20em" }, 500)
                                    return true;
                                }
                                else
                                    updateValidationUi("phone", false);
                            }
                            else
                                updateValidationUi("zip", false);
                        }
                        else
                            updateValidationUi("address", false);
                    }

                    // IF going to Step 4
                    if (newIndex == 3)
                    {
                        if ($scope.userInfo.subtype != "Business")
                            return $scope.checkStepThree();
                    }

                    // Allways allow previous action even if the current form is not valid!
                    if (currentIndex > newIndex) return true;
                },
                onStepChanged: function (event, currentIndex, priorIndex) {
                    if (currentIndex == 1)
                    {
                        $('#idVerWiz').css('overflow', 'visible');
                        $('#idVer-address').focus();
                    }
                    else if (currentIndex == 2)
                        $('#idVer-email').focus();
                },
                onCanceled: function (event) {
                    $scope.cancelIdVer();
                },
                onFinishing: function (event, currentIndex) {
                    if ($scope.userInfo.subtype == "Business")
                        return $scope.checkStepThree();

                    // Finish the Wizard...
                    return true;
                },
                onFinished: function (event, currentIndex) {

                    // SUBMIT DATA TO NOOCH SERVER
                    var legalName = $('#idVer-name').val();
                    $scope.userInfo.birthDay = $('#idVer-dob').val();
                    $scope.userInfo.ssnLast4 = $('#idVer-ssn').val();
                    $scope.userInfo.address1 = $('#idVer-address').val();
                    $scope.userInfo.zip = $('#idVer-zip').val();
                    $scope.userInfo.mobileNumber = $('#idVer-phone').val();

                    var fullName = legalName;
                    var birthDay = $scope.userInfo.birthDay;
                    var ssnLast4 = $scope.userInfo.ssnLast4;
                    var address = $scope.userInfo.address1;
                    var zip = $scope.userInfo.zip;
                    var phone = $scope.userInfo.mobileNumber;

                    var DeviceInfo = {
                        LandlorId: $scope.userInfoInSession.landlordId,
                        AccessToken: $scope.userInfoInSession.accessToken
                    };

                    getProfileService.submitIdVerWizard(DeviceInfo, fullName, birthDay, ssnLast4, address, zip, phone, function (response) {
                        console.log("submitIdVerWizard Response...");
                        console.log(response);

                        // HIDE THE MODAL CONTAINING THE WIZARD
                        $('html').css('overflow-y', 'hidden');
                        $('#idVer').modal('hide')

                        if (response.success == true)
                        {
                            growlService.growl('Profile info updated successfully!', 'success');

                            $scope.userInfo.isIdVerified = 1;
                            $rootScope.isIdVerified = 1;
                            $rootScope.ContactNumber = phone;

                            // THEN DISPLAY SUCCESS ALERT
                            swal({
                                title: "Awesome - ID Verification Submitted",
                                text: "Thanks for submitting your ID information. That helps us keep Nooch safe for everyone." +
                                      "<span class='show m-t-10'>Now you can link a bank account and start collecting rent payments!</span>",
                                type: "success",
                                showCancelButton: true,
                                cancelButtonText: "Add Bank Later",
                                confirmButtonColor: "#3fabe1",
                                confirmButtonText: "Add Bank Now",
                                html: true
                            }, function (isConfirm) {
                                if (isConfirm)
                                    window.location.href = '#/profile/profile-bankaccounts';
                            });
                        }
                        else
                        {
                            growlService.growl(response.ErrorMessage, 'danger');

                            // THEN DISPLAY FAILURE ALERT
                            swal({
                                title: "Oh No!",
                                text: "Looks like we had trouble verifying your information. Please try again or contact <a href='mailto:support@nooch.com' target='_blank'>Nooch Support</a> for further help!",
                                type: "error",
                                showCancelButton: false,
                                confirmButtonColor: "#3fabe1",
                                confirmButtonText: "Ok",
                                html: true
                            });
                        }
                    });

                }
            });


            updateValidationUi = function (field, success) {
                //console.log("Field: " + field + "; success: " + success);

                if (field == "reset all")
                {
                    $('#idVerWiz .form-group').removeClass('has-error');
                    $('#idVerWiz .help-block').slideUp();
                }

                if (success == true)
                {
                    $('#' + field + 'Grp .form-group').removeClass('has-error').addClass('has-success');
                    $('#' + field + 'Grp .help-block').slideUp();
                }

                else
                {
                    $('#' + field + 'Grp .form-group').removeClass('has-success').addClass('has-error');

                    var helpBlockTxt = "";
                    if (field == "name")
                        helpBlockTxt = "Please enter your full legal name.";
                    else if (field == "dob")
                        helpBlockTxt = "Please enter your date of birth. We promise nobody ever sees this!"
                    else if (field == "ssn")
                        helpBlockTxt = "Please enter your SSN. This is used solely to verify your identity."
                    else if (field == "address")
                    {
                        $('#idVerWiz > .content').animate({ height: "23em" }, 300)
                        helpBlockTxt = "Please enter the physical street address of where you currently live."
                    }
                    else if (field == "zip")
                    {
                        $('#idVerWiz > .content').animate({ height: "23em" }, 300)
                        helpBlockTxt = "Please enter the zip code for the street address above."
                    }
                    else if (field == "phone")
                    {
                        $('#idVerWiz > .content').animate({ height: "23em" }, 300)
                        helpBlockTxt = "Please enter your full, valid phone number!"
                    }

                    if (!$('#' + field + 'Grp .help-block').length)
                    {
                        $('#' + field + 'Grp .form-group').append('<small class="help-block" style="display:none">' + helpBlockTxt + '</small>');
                        $('#' + field + 'Grp .help-block').slideDown();
                    }
                    else
                    { $('#' + field + 'Grp .help-block').show() }

                    console.log()
                    // Now focus on the element that failed validation
                    setTimeout(function () {
                        $('#' + field + 'Grp input').focus();
                    }, 200)
                }

            }
        }


        $scope.checkStepThree = function () {
            // Check DOB field
            if ($('#idVer-dob').val().length == 10)
            {
                updateValidationUi("dob", true);

                if ($scope.userInfo.subtype != "Business")
                {
                    // Check SSN field
                    var ssnVal = $('#idVer-ssn').val().trim();
                    ssnVal = ssnVal.replace(/ /g, "").replace(/-/g, "");

                    if (ssnVal.length == 9)
                    {
                        updateValidationUi("ssn", true);

                        // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
                        $("#IdWizPic_FileInput").fileinput({
                            allowedFileTypes: ['image'],
                            initialPreview: [
                                "<img src='" + $scope.userInfo.userImage + "' class='file-preview-image' alt='Profile Picture' id='IdWizUserPicPreview'>"
                            ],
                            initialPreviewShowDelete: false,
                            layoutTemplates: {
                                icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                            },
                            maxFileCount: 1,
                            maxFileSize: 350,
                            msgSizeTooLarge: "File '{name}' ({size} KB) is too big a file! Please try a picture under {maxSize} KB!",
                            showCaption: false,
                            showUpload: false,
                            uploadUrl: URLs.UploadLandlordProfileImage,
                            uploadExtraData: {
                                LandlorId: $scope.userInfoInSession.landlordId,
                                AccessToken: $scope.userInfoInSession.accessToken
                            },
                            showPreview: true,
                            resizeImage: true,
                            maxImageWidth: 500,
                            maxImageHeight: 500,
                            resizePreference: 'width'
                        });

                        // Great, we can finally go to the next step of the wizard :-]
                        $('#idVerWiz > .content').animate({ height: "31em" }, 700)
                        return true;
                    }
                    else
                        updateValidationUi("ssn", false);
                }
                else if ($scope.userInfo.subtype == "Business")
                {
                    // Check SSN field
                    var einVal = $('#idVer-ein').val().trim();
                    einVal = einVal.replace(/ /g, "").replace(/-/g, "");

                    if (einVal.length == 9)
                    {
                        updateValidationUi("ein", true);
                        return true;
                    }
                    else updateValidationUi("ein", false);
                }
            }
            else updateValidationUi("dob", false);

            return false;
        }


        $scope.cancelIdVer = function () {
            swal({
                title: "Cancel ID Verification",
                text: "Are you sure you want to cancel?  You must complete this step before you can begin collecting payments.  It will take less than 60 seconds, and we never share your data with anyone.  Period.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes - Cancel",
                cancelButtonText: "No, go back",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm)
                {
                    setTimeout(function () {
                        $('html').css('overflow-y', 'hidden');
                        $('#idVer').modal('hide');
                        setTimeout(function () {
                            $('#idVerWiz').steps('destroy');
                            updateValidationUi('reset all', null);
                        }, 250);
                    }, 250);
                }
            });
        }

        $scope.dismissIdVerAlert = function ($event) {
            $event.stopPropagation();
            $('.idVerAlert').slideUp();
            //		    $('.idVerAlert').alert('close');
        }

        $scope.ValidateEmail = function (str) {
            if (str != null)
            {
                var at = "@"
                var dot = "."
                var lat = str.indexOf("@")
                var lstr = str.length
                var ldot = str.indexOf(".")

                if (lat == -1 || lat == 0 || lat == lstr) return false
                if (ldot == -1 || ldot == 0 || ldot == lstr) return false
                if (str.indexOf(at, (lat + 1)) != -1) return false
                if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) return false
                if (str.indexOf(dot, (lat + 2)) == -1) return false
                if (str.indexOf(" ") != -1) return false

                return true
            }
            return false
        };
    })


    .controller('profileAboutCtrl', function ($rootScope, $compile, getProfileService, authenticationService, $scope) {

        if ($rootScope.shouldShowPhoneTour)
        {
            setTimeout(function () {
                var tourPhone = new Tour({
                    name: 'editPhoneTour',
                    storage: false,
                    backdrop: true,
                    orphan: true, //Allow to show the step regardless whether its element is not set, is not present in the page or is hidden. The step is fixed positioned in the middle of the page.
                    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default' data-role='end'>Got it!</button></div></div>",
                    steps: [
                        {
                            element: "#contactInfoGrp",
                            title: "Add Your Contact Info",
                            content: "To complete your account and begin collecting rent, click \"<span class='text-primary'>edit</span>\" to add or edit your phone number here.",
                            animation: true,
                            backdropPadding: 10,
                            placement: "right"
                        }
                    ],
                    onStart: function (tour) {
                        // The tour won't display correctly if a parent element uses any Animate.css classes... so just removing them on init
                        $('#profAbout').removeClass('animated fadeInRightSm');
                    },
                    onEnd: function (tour) {
                        $rootScope.shouldShowPhoneTour = false;
                    },
                });

                // Initialize the tour
                tourPhone.init();

                // Start the tour
                tourPhone.start();
            }, 500);
        }

        if ($rootScope.isIdVerified === false)
        {
            if ($rootScope.shouldDisplayOverviewAlert === true)
            {
                $rootScope.shouldDisplayOverviewAlert = false;

                swal({
                    title: "Secure, Private Payments",
                    text: "<p>Nooch is a quick, secure way to collect rent payments without giving out your personal or bank details. Here are 3 quick steps to getting started:</p>" +
                          "<ul class='fa-ul'><li><i class='fa-li fa fa-check'></i>Verify your identity</li>" +
                          "<li><i class='fa-li fa fa-check'></i>Attach your bank account</li>" +
                          "<li><i class='fa-li fa fa-check'></i>Add one or more properties and invite your tenants to pay rent</li></ul>",
                    imageUrl: "img/secure.svg",
                    imageSize: "194x80",
                    showCancelButton: true,
                    cancelButtonText: "Verify Later",
                    confirmButtonColor: "#3fabe1",
                    confirmButtonText: "Verify ID Now",
                    customClass: "securityAlert",
                    allowEscapeKey: false,
                    html: true
                }, function (isConfirm) {
                    if (isConfirm)
                        $scope.runWizard();
                });
            }
            else if ($rootScope.shouldLaunchWizOnLoad === true)
            {
                console.log("$rootScope.shouldLaunchWizOnLoad  IS TRUE");
                $rootScope.shouldLaunchWizOnLoad = false;
            }
        }

        $scope.phEmWarning = function (input) {
            console.log(input);
            var title;
            var bodyTxt;
            var imgUrl;
            var sendWhat;

            if (input == "e")
            {
                sendWhat = "Email";
                title = "Verify Your Email";
                bodyTxt = "As part of our efforts to keep Nooch the safest way to get paid, we ask all users to confirm their email address." +
                      "<span class='show m-t-15'>Click <strong>\"Send\"</strong> to re-send the verification link.  Just click the big blue button in that email to confirm.</span>";
            }
            else if (input == "p")
            {
                sendWhat = "SMS";
                title = "Verify Your Phone";
                bodyTxt = "To help keep Nooch the safest way to get paid, we ask all users to confirm a valid phone number." +
                      "<span class='show m-t-15'>We do this by sending you a text message (SMS) - just reply \"Go\" (case doesn't matter) to confirm.</span>" +
                      "<span class='show m-t-15'>Click <strong>\"Send\"</strong> to re-send the verification SMS.</span>";
            }

            swal({
                title: title,
                text: bodyTxt,
                imageUrl: "img/secure.svg",
                imageSize: "194x80",
                showCancelButton: true,
                cancelButtonText: "Verify Later",
                confirmButtonColor: "#3fabe1",
                confirmButtonText: "Send Now",
                html: true
            }, function (isConfirm) {
                if (isConfirm)
                {
                    $scope.ResendVerificationEmailOrSMS(sendWhat);
                }
            });
        }

        $scope.ResendVerificationEmailOrSMS = function (sendWhat) {
            console.log("Profile Controller -> ResendVerificationEmailOrSMS fired");

            if (sendWhat == "SMS")
            {
                if ($rootScope.ContactNumber == "" ||
                    $rootScope.ContactNumber.length < 10)
                {
                    swal({
                        title: "No Phone Added Yet",
                        text: "Looks like you still need to add your phone number before we can verify it!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Later",
                        confirmButtonText: "Add Now",
                        confirmButtonColor: "#3FABE1"
                    }, function (isConfirm) {
                        if (isConfirm)
                            $scope.goTo("profile");
                    });
                    return;
                }
            }

            var userdetails = authenticationService.GetUserDetails();

            getProfileService.ResendVerificationEmailOrSMS(userdetails.landlordId, "Landlord", sendWhat, function (response) {
                console.log(response);

                if (response.IsSuccess && response.IsSuccess == true)
                {
                    console.log("Inside success");
                    if (sendWhat == "Email")
                    {
                        swal({
                            title: "Email Verification Resent",
                            text: "We just re-sent a verification link to <strong>" + $rootScope.emailAddress + "</strong>, please check your email and click the link to verify your email address.",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                    if (sendWhat == "SMS")
                    {
                        swal({
                            title: "SMS Verification Sent!",
                            text: "We just sent a text message to <strong>" + $rootScope.ContactNumber + "</strong>, please check your phone and reply \"Go\" to the text (case doesn't matter).",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                }
                else
                {
                    var msgtxt = "";
                    if (response.ErrorMessage.indexOf('Already Activated') > -1)
                    {
                        msgtxt = "Looks like your account is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    else if (response.ErrorMessage.indexOf('Already Verified') > -1)
                    {
                        msgtxt = "Looks like your phone number is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    swal({
                        title: "Oh no!",
                        text: msgtxt,
                        type: "warning"
                    });
                }
            });
        };
    })


    // ID Verification Alert
    .directive('verifyIdAlert', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<div class="alert alert-danger alert-dismissible animated flipInX" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><i class="md md-warning m-r-10"></i>Please <a href="index.html#/profile/profile-about" class="alert-link">verify your identity</a> to start accepting payments today!</div>',
        }
    })


    //=================================================
    // Profile - BANK ACCOUNTS
    //=================================================

    .controller('banksCtrl', function ($rootScope, $scope, $state, authenticationService, getBanksService, getProfileService) {
        this.isBankAttached = true;

        // Get User's Info from DB
        if (authenticationService.IsValidUser() == true)
        {

            var userdetails = authenticationService.GetUserDetails();

            $scope.userInfoInSession = userdetails;

            getBanksService.getBanks(userdetails.landlordId, userdetails.accessToken, function (response) {
                console.log('Banks Controller -> Get Banks Response data -> ' + JSON.stringify(response));

                if (response.success == true)
                {
                    if (response.msg == 'Worked like a charm')
                    {
                        $scope.bankCount = 1;
                        $scope.bankName = response.BankName;
                        $scope.bankImg = response.BankImageURL;
                        $scope.bankStatus = response.AccountStatus;
                        $scope.bankAllowed = response.allowed;
                        $scope.bankCreatedOn = response.dateCreated;
                        $scope.bankNickname = response.BankNickname;
                        $scope.accntNum = response.AccountName;
                    }
                    else// if (response.msg == 'No banks found!')
                    {
                        $scope.bankCount = 0;
                    }
                }
                else
                {
                    $scope.bankCount = 0;
                    console.log("Get Banks FAILURE (Controller)");
                }
            });
        }
        else
        {
            window.location.href = 'login.html';
        }


        // CLIFF (9/18/15): ADDING THIS BLOCK TO GET THE USER'S "FINGERPRINT" - NEED SERVICE TO 
        //					SEND TO NOOCH DATABASE THIS IS USED FOR SYNAPSE V3
        new Fingerprint2().get(function (result) {
            console.log(result);
        });

        //this.bankList = getBanksService.getBank(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);

        $scope.addBank = function () {

            if ($rootScope.isIdVerified === false)
            {
                swal({
                    title: "Help Us Keep Nooch Safe",
                    text: "Before you link your bank account, please take 1 minute to verify your identity by completing your profile.<span style='display:block;margin-top:14px;'>This helps us make sure Nooch is safe for everyone.  We will only ask for this info once and will never share it publicly without your explicit permission.  All data is stored with encryption on secure servers.</span>",
                    type: "warning",
                    customClass: "smallText",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Verify Now",
                    cancelButtonText: "Later",
                    closeOnCancel: true,
                    html: true
                }, function (isConfirm) {
                    if (isConfirm)
                    {
                        $scope.runWizard();
                    }
                });
            }
            else if ($rootScope.IsEmailVerified != true)
            {
                swal({
                    title: "Help Us Keep Nooch Safe",
                    text: "Before you link a bank account, please verify your email address by clicking the verification link we emailed to <strong>" + $rootScope.emailAddress + "</strong>.</span>",
                    type: "warning",
                    customClass: 'largeText',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    cancelButtonText: "Resend Email",
                    closeOnCancel: true,
                    html: true
                }, function (isConfirm) {
                    if (!isConfirm)
                    {
                        $scope.ResendVerificationEmailOrSMS('Email');
                    }
                });
            }
            else
            {
                if ($scope.bankCount > 0)
                {
                    var plural = "";
                    if ($scope.bankCount > 1)
                    {
                        plural = "s";
                    }

                    swal({
                        title: "Add A New Bank?",
                        text: "You already have " + $scope.bankCount + " bank account" + plural + " attached. &nbsp;Would you like to add another?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Add New Bank",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        html: true,
                        customClass: "largeText"
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            $scope.displayAddBankIframe();
                        }
                    });
                }
                else // No bank attached yet
                {
                    $scope.displayAddBankIframe();
                }
            }
        }


        $scope.displayAddBankIframe = function () {

            $('#bankAdd iframe').attr("src", "https://www.noochme.com/noochweb/Nooch/AddBank?MemberId=" + $scope.userInfoInSession.memberId + "&ll=yes");

            $('#bankAdd').modal({
                keyboard: false
            })

            // To handle success sent from Add Bank iFrame
            $('body').bind('addBankComplete', function () {
                var result = $('#bankAdd iframe').get(0).contentWindow.sendToIdVerQuestions;

                // Hide the Loading Block
                // $('.modal-content').unblock();

                console.log("Callback from Add Bank page - \"sendToIdVerQuestions\" was: [" + result + "]");

                // Check if extra ID Verification questions must be answered
                if (result == true)
                {
                    console.log("NEED TO CREATE NEW IFRAME POINTING TO ID VERIFICATION PAGE");

                    // NEED TO CREATE NEW IFRAME POINTING TO ID VERIFICATION PAGE
                    $('#bankAdd iframe').attr("src", "http://www.noochme.com/noochweb/trans/idverification.aspx?memid=" + $scope.userInfoInSession.memberId + "&from=llapp");
                }
                else
                {
                    console.log("BANK ADDED SUCCESSFULLY, NO EXTRA ID VER NEEDED!");

                    // Hide the add-bank modal
                    $('#bankAdd').modal('hide');

                    swal({
                        title: "Bank Linked Successfully",
                        text: "That was easy. &nbsp;Next stop: add your properties to invite your tenants to pay rent on Nooch.",
                        type: "success",
                        showCancelButton: true,
                        cancelButtonText: "Done",
                        confirmButtonText: "Add Properties",
                        customClass: "largeText",
                        html: true
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            window.location.href = '#/properties';
                        }
                        else
                        {
                            $state.reload();
                        }
                    });
                }
            });

            // To handle success sent from ID Verification iFrame
            $('body').bind('ExraIdVerComplete', function () {
                var result = $('#bankAdd iframe').get(0).contentWindow.isCompleted;

                // Hide the Loading Block
                // $('.modal-content').unblock();

                console.log("Callback from ID Verification page - \"isCompleted\" was: [" + result + "]");

                // Hide the add-bank modal
                $('#bankAdd').modal('hide');

                // Check if extra ID Verification questions were submitted successfully
                if (result == true)
                {
                    swal({
                        title: "Bank Linked Successfully",
                        text: "That was easy. &nbsp;Next stop: add your properties to invite your tenants to pay rent on Nooch.",
                        type: "success",
                        showCancelButton: true,
                        cancelButtonText: "Done",
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Add Properties",
                        customClass: "largeText",
                        html: true
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            window.location.href = '#/properties';
                        }
                        else
                        {
                            $state.reload();
                        }
                    });
                }
                else
                {
                    console.log("Problem from ID Verification Page!");

                    swal({
                        title: "Oh No!",
                        text: "Looks like we had some trouble linking that bank account. &nbsp;Please try again or contact <a href='mailto:support@nooch.com' target='_blank'>support@nooch.com</a>" +
                              " for further help.<span class='show m-t-10'>Very sorry for the inconvenience - we hate too it when things don't work right the first time but we'll do everything possible to resolve any issues ASAP!</span>",
                        type: "error",
                        html: true,
                    })
                }
            });
        }


        this.makePrimary = function (e) {
            var bankName = $(e.target).data('bankname');
            swal({
                title: "Make " + bankName + " your primary Bank Account?",
                text: "This will change your default bank account. Any new properties or units you create will be assigned to your new default bank.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm)
                {
                    swal("You Got It", bankName + " is now your primary bank account.", "success");
                }
            });
        }


        $scope.deleteBank = function () {
            swal({
                title: "Are you sure?",
                text: "You are about to delete this bank account from your account.  You will have to re-link it in order to receive payments.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it",
                cancelButtonText: "No, keep it",
                closeOnConfirm: false,
                closeOnCancel: true,
                customClass: "largeText"
            }, function (isConfirm) {
                if (isConfirm)
                {
                    getBanksService.deleteBank(userdetails.landlordId, userdetails.memberId, userdetails.accessToken, function (response) {
                        console.log('Banks Controller -> Get Banks Response data -> ' + JSON.stringify(response));

                        if (response.success == true)
                        {
                            if (response.msg == "ok")
                            {
                                $scope.bankCount -= 1;
                                $scope.bankName = "";
                                $scope.bankNickname = "";
                                $scope.accntNum = "";
                                $scope.bankImg = "";
                                $scope.bankStatus = "";
                                $scope.bankAllowed = "";
                                $scope.bankCreatedOn = "";

                                swal("Deleted!", "That bank has been deleted.", "success");
                            }
                            console.log("Get Banks SUCCESS (Controller)");
                        }
                        else
                        {
                            console.log("Get Banks FAILURE (Controller)");

                            swal("Oh No!", "We ran into some trouble trying to delete that bank.  Please try again!", "error");
                        }
                    });

                    $('.media#bank').fadeOut();
                }
            });
        }


        $scope.ResendVerificationEmailOrSMS = function (sendWhat) {
            console.log("Banks Controller -> ResendVerificationEmailOrSMS fired");

            var userDetails = authenticationService.GetUserDetails();

            if (sendWhat == "SMS")
            {
                if ($rootScope.ContactNumber == "" ||
                    $rootScope.ContactNumber.length < 10)
                {
                    swal({
                        title: "No Phone Added Yet",
                        text: "Looks like you still need to add your phone number before we can verify it!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Later",
                        confirmButtonText: "Add Now",
                        confirmButtonColor: "#3FABE1"
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            $rootScope.shouldDisplayOverviewAlert = false;
                            $rootScope.shouldShowPhoneTour = true;
                            window.location.href = '#/profile/profile-about';
                        }
                    });
                    return;
                }
            }

            getProfileService.ResendVerificationEmailOrSMS(userDetails.landlordId, "Landlord", sendWhat, function (response) {
                console.log(response);

                if (response.IsSuccess && response.IsSuccess == true)
                {
                    if (sendWhat == "Email")
                    {
                        swal({
                            title: "Email Verification Resent",
                            text: "We just re-sent a verification link to <strong>" + $rootScope.emailAddress + "</strong>, please check your email and click the link to verify your email address.",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                    if (sendWhat == "SMS")
                    {
                        swal({
                            title: "SMS Verification Sent!",
                            text: "We just sent a text message to <strong>" + $rootScope.ContactNumber + "</strong>, please check your phone and reply \"Go\" to the text (case doesn't matter).",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                }
                else
                {
                    var msgtxt = "";
                    if (response.ErrorMessage.indexOf('Already Activated') > -1)
                    {
                        msgtxt = "Looks like your account is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    else if (response.ErrorMessage.indexOf('Already Verified') > -1)
                    {
                        msgtxt = "Looks like your phone number is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    swal({
                        title: "Oh no!",
                        text: msgtxt,
                        type: "warning"
                    });
                }
            });
        }

    })


    //=================================================
    // Profile - PASSWORD
    //=================================================

    .controller('pwCtrl', function ($rootScope, $scope, authenticationService) {
        $scope.pwData = {
            current: '',
            newPw: '',
            confirmPw: ''
        };

        $scope.forgotPwEmail = $rootScope.emailAddress;

        $scope.updatePwSubmit = function () {
            console.log($('#currentPw').val());
            // Check Username (email) field for length
            if ($('#currentPw').val() && $('#currentPw').val().length > 6)
            {
                updateValidationUi("currentPw", true);

                if ($('#newPw').val() && $('#newPw').val().length > 6)
                {
                    updateValidationUi("newPw", true);

                    if ($('#confirmPw').val() && $('#confirmPw').val().length > 6)
                    {
                        if ($('#newPw').val() == $('#confirmPw').val())
                        {
                            updateValidationUi("confirmPw", true);

                            // ADD THE LOADING BOX
                            $('#changePw > div').block({
                                message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Updating password...</span>',
                                css: {
                                    border: 'none',
                                    padding: '22px 10px 23px',
                                    backgroundColor: '#000',
                                    '-webkit-border-radius': '14px',
                                    '-moz-border-radius': '14px',
                                    'border-radius': '14px',
                                    opacity: '.75',
                                    width: '76%',
                                    left: '12%',
                                    top: '-410px',
                                    color: '#fff'
                                }
                            });

                            if (authenticationService.IsValidUser() == true)
                            {
                                var userdetails = authenticationService.GetUserDetails();

                                authenticationService.updatePw(userdetails.landlordId, userdetails.accessToken, $scope.pwData.current, $scope.pwData.newPw, $scope.pwData.confirmPw, function (response) {

                                    console.log(response);

                                    $('#changePw div').unblock();

                                    if (response.success === true)
                                    {
                                        //authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.LandlordId, response.AccessToken);
                                        swal({
                                            title: "Password Updated",
                                            text: "Your password has been successfully updated.",
                                            type: "success",
                                            customClass: "largeText"
                                        });

                                        $('#currentPwGrp').removeClass('has-success');
                                        $('#newPwGrp').removeClass('has-success');
                                        $('#confirmPwGrp').removeClass('has-success');
                                        $('#currentPw').val('');
                                        $('#newPw').val('');
                                        $('#confirmPw').val('');
                                    }
                                    else
                                    {
                                        var msg = "Looks like either your email or password was incorrect.  Please try again.";
                                        if (response.msg != null && response.msg.indexOf("Current password was incorrect") > -1)
                                        {
                                            msg = "Looks like your current password was not correct. Please try again or if you don't remember your password, click \"Forgot Password\".";
                                        }
                                        swal({
                                            title: "Oh No!",
                                            text: msg,
                                            type: "error",
                                            customClass: "largeText"
                                        });
                                    }
                                });
                            }
                        }
                        else
                        {
                            updateValidationUi("confirmPw2", false);
                        }
                    }
                    else
                    {
                        updateValidationUi("confirmPw", false);
                    }
                }
                else
                {
                    updateValidationUi("newPw", false);
                }
            }
            else
            {
                updateValidationUi("currentPw", false);
            }
        }

        $scope.forgotPwSubmit = function () {
            var email = $scope.forgotPwEmail;

            if ($scope.ValidateEmail(email))
            {
                updateValidationUi("emforgot", true);

                // ADD THE LOADING BOX
                $('#forgotPw > div').block({
                    message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Submitting Reset PW Request...</span>',
                    css: {
                        border: 'none',
                        padding: '22px 10px 23px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '14px',
                        '-moz-border-radius': '14px',
                        'border-radius': '14px',
                        opacity: '.75',
                        width: '76%',
                        left: '12%',
                        top: '-10px',
                        color: '#fff'
                    }
                });


                // Now call service to send Reset PW email
                authenticationService.PasswordRest(email, function (response) {

                    $('#forgotPw > div').unblock();

                    if (response.IsSuccess == true)
                    {
                        swal({
                            title: "Reset Link Sent",
                            text: "We just sent a reset password link to <strong>" + email + "</strong>.  Please click the link in that email to create a new password.",
                            type: "success",
                            html: true
                        });
                    }
                    else
                    { // This will just be for a general server error where the server doesn't return any 'success' parameter at all
                        console.log(response);
                        swal({
                            title: "Oh No!",
                            text: "Looks like we ran into a little trouble processing your request. Please try again or contact <a href='mailto:support@nooch.com' target='_blank'>Nooch Support</a> for more help.",
                            type: "error",
                            html: true
                        });
                    }
                });
            }
            else
            {
                updateValidationUi("emforgot", false);
            }
        }

        $scope.ValidateEmail = function (str) {
            console.log; ("Profile Page -> Forgot PW -> VALIDATE EMAIL REACHED")
            if (str != null)
            {
                var at = "@"
                var dot = "."
                var lat = str.indexOf("@")
                var lstr = str.length
                var ldot = str.indexOf(".")

                if (lat == -1 || lat == 0 || lat == lstr)
                {
                    return false
                }

                if (ldot == -1 || ldot == 0 || ldot == lstr)
                {
                    return false
                }

                if (str.indexOf(at, (lat + 1)) != -1)
                {
                    return false
                }

                if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot)
                {
                    return false
                }

                if (str.indexOf(dot, (lat + 2)) == -1)
                {
                    return false
                }

                if (str.indexOf(" ") != -1)
                {
                    return false
                }

                return true
            }
            return false
        };

        // Utility Function To Update Form Input's UI for Success/Error
        updateValidationUi = function (field, success) {
            console.log("Profile -> PW -> UpdateValidationUI - Field: " + field + "; success: " + success);

            if (success == true)
            {
                if (field == "confirmPw2")
                {
                    field = "confirmPw";
                }
                $('#' + field + 'Grp').removeClass('has-error').addClass('has-success');

                if (field != 'pw' && $('#' + field + 'Grp .help-block').length)
                {
                    $('#' + field + 'Grp .help-block').slideUp();
                }
            }
            else
            {
                var helpBlockTxt = "";

                if (field == "currentPw")
                {
                    helpBlockTxt = "Please enter your current password!"
                }
                else if (field == "newPw")
                {
                    helpBlockTxt = "Please enter a strong new password."
                }
                else if (field == "confirmPw")
                {
                    helpBlockTxt = "Please confirm your new password."
                }
                else if (field == "confirmPw2")
                {
                    helpBlockTxt = "New password does not match confirm password."
                    field = "confirmPw";
                }

                $('#' + field + 'Grp').removeClass('has-success').addClass('has-error');

                if (!$('#' + field + 'Grp .help-block').length)
                {
                    $('#' + field + 'Grp').append('<small class="help-block pull-right f-14" style="display:none">' + helpBlockTxt + '</small>');
                    $('#' + field + 'Grp .help-block').slideDown();
                }
                else
                { $('#' + field + 'Grp .help-block').show() }

                // Now focus on the element that failed validation
                setTimeout(function () {
                    $('#' + field + 'Grp input').focus();
                }, 200)
            }
        }
    })


    //=================================================
    // HISTORY
    //=================================================

    .controller('historyCtrl', function ($rootScope, $scope, historyService, propDetailsService, authenticationService) {
        console.log("HISTORY LOADED!");

        var userDetails = authenticationService.GetUserDetails();

        historyService.GetHistory(userDetails.landlordId, userDetails.memberId, userDetails.accessToken, function (data) {
            if (data.AuthTokenValidation.IsTokenOk == true)
            {
                if (data.IsSuccess == true)
                {
                    $scope.allTransList = data.Transactions;

                    if ($scope.allTransList.length > 0)
                    {
                        console.log("allTransList LIST...");
                        console.log($scope.allTransList);
                    }

                    $scope.historyTable = $('#transHistory').on('init.dt', function () {
                        setTimeout(function () {
                            $('#transHistory').removeClass('animated fadeIn');
                        }, 1700);
                    }).DataTable({
                        data: $scope.allTransList,
                        columns: [
                            { data: 'TransactionId' },
                            { data: 'TenantId' },
                            { data: 'PropertyId' },
                            { data: 'PropertyAddress' },
                            { data: 'TenantStatus' },
                            { data: 'UnitId' },
                            { data: 'UnitName' },
                            { data: 'TenantEmail' },
                            { data: 'Memo' },
                            { data: 'DueDate' },

                            { data: 'TransactionDate' },
                            { data: 'TenantName' },
                            { data: 'PropertyName' },
                            { data: 'UnitNum' },
                            { data: 'TransactionStatus' },
                            { data: 'Amount' },
                            {
                                data: null,
                                defaultContent: '<a href="" class=\'btn btn-icon btn-default m-r-10 sendReminderBtn\'><span class=\'md md-edit\'></span></a>' +
                                                '<a href="" class=\'btn btn-icon btn-default cancelTransBtn\'><span class=\'md md-clear\'></span></a>'
                            }
                        ],
                        "columnDefs": [
                            {
                                "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // identifies which columns will be affected, + numbers count from left (0 index), - numbers from the right
                                "visible": false,
                                "searchable": false
                            },
                            {
                                "targets": 10,
                                "data": "TransactionDate",
                                "render": function (data, type, full, meta) {
                                    var htmlToDisplay;
                                    var transDateFormatted = moment(full.TransactionDate).format('MMM D, YYYY')
                                    var dueDate = full.DueDate

                                    if (full.TenantStatus == "Accepted")
                                        if (dueDate != null && dueDate.length > 2)
                                            return '<div style="line-height:1.2;">Paid: ' + transDateFormatted + '</div>' +
                                                   '<span class="f-13 f-300">Due: ' + dueDate + '</span>';
                                        else if (dueDate != null && dueDate.length > 2)
                                            return '<span class="f-14">Due: <span class="f-300">' + dueDate + '</span></span>';
                                        else if (full.TransactionDate != null)
                                            return '<span class="f-14">Sent: <span class="f-300">' + transDateFormatted + '</span></span>';
                                }
                            },
                            {
                                "targets": 11,
                                "data": "TenantName",
                                "render": function (data, type, full, meta) {

                                    var name = data;
                                    var htmlToDisplay = name;

                                    var classToAdd = "";
                                    if (full.TenantStatus == "Invited")
                                        classToAdd = 'text-warning';
                                    else if (full.TenantStatus == "Accepted")
                                        classToAdd = 'text-success';

                                    htmlToDisplay = "<div class='media'><div class='pull-left'><img class='tableUserPic' src='img/contacts/" + data +
                                                    ".jpg'></div><div class='media-body'><div class='lv-title'>" + data + "</div><small class='lv-small'>" + data + "</small></div></div>";


                                    if (name != null && name.length > 1)
                                    {
                                        htmlToDisplay = '<div class="imgContainer"><span style="background-image: url(' + full.ImageUrl + ');"></span></div>' +
                                                        '<div class="capitalize">' + name +
                                                        '<span class="show text-center status f-13 ' + classToAdd + '">' + full.TenantStatus + '</span>' +
                                                        '</div>';
                                    }
                                    else if (full.TenantEmail != null && full.TenantEmail.length > 1)
                                        htmlToDisplay = '<span class="show text-center"><a class="msgUnitBtn">' + full.TenantEmail + '</a></span>' +
                                                        '<span class="show text-center status f-13 ' + classToAdd + '">' + full.TenantStatus + '</span>';
                                    else
                                        htmlToDisplay = '<span class="show text-center"><a class="addTenantBtn btn btn-default"><i class="md md-add m-r-5"></i>Add Tenant</a></span>';

                                    return htmlToDisplay;
                                }
                            },
                            {
                                "targets": 12,
                                "data": "PropertyName",
                                className: "capitalize text-center",
                                "render": function (data, type, full, meta) {
                                    var propAddress = full.PropertyAddress;
                                    var htmlToDisplay;

                                    if (propAddress != null && propAddress.length > 2)
                                    {
                                        htmlToDisplay = '<div style="line-height:1.2;"><a class="goToProperty" id="' + full.PropertyId + '">' + data + '</a></div>' +
                                                        '<span class="f-13 f-300">' + propAddress + '</span>';
                                    }
                                    else
                                    {
                                        htmlToDisplay = data;
                                    }

                                    return htmlToDisplay;
                                }
                            },
                            {
                                "targets": 13,
                                "data": "UnitNum",
                                "render": function (data, type, full, meta) {

                                    if (data != null && data.length > 0)
                                    {
                                        return data;
                                    }
                                    else if (full.UnitName != null && full.UnitName.length > 2)
                                    {
                                        return full.UnitName;
                                    }

                                    return "";
                                }
                            },
                            {
                                "targets": 14,
                                "data": "TransactionStatus",
                                "render": function (data, type, full, meta) {
                                    var htmlToReturn = data;

                                    if (data == "Paid" || data == "paid" || data == "completed")
                                    {
                                        htmlToReturn = "<span class=\"label label-success\">" + data + "</span>";
                                    }
                                    else if (data == "Pending" || data == "pending")
                                    {
                                        htmlToReturn = "<span class=\"label label-warning\">" + data + "</span>";
                                    }
                                    else if (data == "Rejected" || data == "rejected" || data == "Cancelled" || data == "Canceled")
                                    {
                                        htmlToReturn = "<span class=\"label label-danger\">" + data + "</span>";
                                    }
                                    else
                                    {
                                        htmlToReturn = "<span class=\"label label-warning\">" + data + "</span>";
                                    }
                                    return htmlToReturn;
                                }
                            },
                            {
                                "targets": 15,
                                "data": "Amount",
                                "render": function (data, type, full, meta) {
                                    var amountArray = data.split(".");

                                    return "$&nbsp;" + amountArray[0] + ".<span class='cents'>" + amountArray[1] + "</span>";
                                }
                            },
                            {
                                "targets": [9, 11, 13, 14],
                                className: "text-center"
                            },
                            {
                                "targets": [-1],
                                className: "text-right"
                            },
                            {
                                "targets": [-1],
                                "render": function (data, type, full, meta) {
                                    if (full.TransactionStatus == "Pending")
                                    {
                                        return htmlString = '<a href="" class=\'btn btn-icon btn-default m-r-10 sendReminderBtn\'><span class=\'md md-edit\'></span></a>' +
                                                            '<a href="" class=\'btn btn-icon btn-default cancelTransBtn\'><span class=\'md md-clear\'></span></a>';
                                    }

                                    return "";
                                }
                            },
                        ],
                        "language": {
                            "info": "Showing units <strong>_START_</strong> - <strong>_END_</strong> of <strong>_TOTAL_</strong> total payments",
                            "infoEmpty": "No Payments Made Yet!",
                            "emptyTable": "No payments made yet!"
                        },
                        "order": [[10, 'desc'], [12, 'asc'], [13, 'desc']],
                        "pageLength": 25
                    });

                    // Add Tooltips to Action Buttons
                    $('.btn.cancelTransBtn').tooltip({
                        title: "Cancel This Payment",
                        trigger: "hover"
                    });
                    $('.btn.sendReminderBtn').tooltip({
                        title: "Send Reminder",
                        trigger: "hover"
                    });


                    // SEND REMINDER BTN CLICKED
                    $('#transHistory tbody .sendReminderBtn').click(function () {

                        // Cliff (12/5/15): JUSTSHOW THE "COMING SOON" ALERT UNTIL THIS IS FULLY READY FOR LIVE USE
                        swal({
                            title: "Coming Soon!",
                            text: "You will soon be able to send payment reminders to your tenants via email or text message. &nbsp;We're working hard to get this ready for you ASAP!",
                            type: "warning",
                            customClass: "largeText",
                            html: true,
                        })

                        return;


                        var data = $scope.historyTable.row($(this).parents('tr')).data();
                        console.log(data);

                        $scope.editingUnitId = data['UnitId'];

                        var tenantName = "";

                        if (data['TenantName'] != null && data['TenantName'].length > 2)
                        {
                            tenantName = data['TenantName'];
                        }
                        else if (data['TenantEmail'])
                        {
                            tenantName = data['TenantEmail'];
                        }

                        console.log(tenantName);

                        swal({
                            title: "Send Reminder To Tenant",
                            text: "Would you like to send a reminder email to " + " for this payment?",
                            type: "warning",
                            confirmButtonColor: "#3fabe1",
                            confirmButtonText: "Yes",
                            showCancelButton: true,
                            cancelButtonText: "Cancel",
                            closeOnConfirm: false,
                            customClass: "largeText"
                        }, function (isConfirm) {

                            if (isConfirm)
                            {
                                // Show Loading Block
                                $.blockUI({
                                    message: '<span><i class="md md-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Sending Reminder to: ' + tenantName + '...</span>',
                                    css: {
                                        border: 'none',
                                        padding: '10px 5px 20px',
                                        backgroundColor: '#000',
                                        '-webkit-border-radius': '14px',
                                        '-moz-border-radius': '14px',
                                        'border-radius': '14px',
                                        opacity: '.8',
                                        color: '#fff'
                                    }
                                });

                                // CALL SERVICE FOR SENDING A REMINDER TO THE TENANT
                                historyService.sendPaymentReminder(data['TransactionId'], data['TenantId'], userDetails.landlordId, userDetails.accessToken, userDetails.memberId, function (response) {
                                    console.log("History Cntrlr -> SendPaymentReminder Response...");
                                    console.log(response);

                                    $.unblockUI({
                                        onUnblock: function () {
                                            if (response.success == true)
                                            {
                                                // On Success
                                                swal({
                                                    title: "Reminder Sent",
                                                    text: "Your payment remidner has been sent. &nbsp;We will notify you when this person accepts and pays.",
                                                    type: "success",
                                                    confirmButtonColor: "#3fabe1",
                                                    confirmButtonText: "Ok",
                                                    customClass: "largeText",
                                                    html: true
                                                }, function () {
                                                    //$state.reload();
                                                });
                                            }
                                            else
                                            {
                                                swal({
                                                    title: "Uh oh...",
                                                    text: data.msg,
                                                    type: "error",
                                                    confirmButtonText: "Ok"
                                                });
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    });


                    // CANCEL PAYMENT BTN CLICKED
                    $('#transHistory tbody .cancelTransBtn').click(function () {
                        var data = $scope.historyTable.row($(this).parents('tr')).data();
                        console.log(data);

                        $scope.TransactionId = data['TransactionId'];


                        // ADD THE LOADING BOX
                        $.blockUI({
                            message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Cancelling payment...</span>',
                            css: {
                                border: 'none',
                                padding: '22px 10px 23px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '14px',
                                '-moz-border-radius': '14px',
                                'border-radius': '14px',
                                opacity: '.75',
                                width: '76%',
                                left: '12%',
                                top: '-410px',
                                color: '#fff'
                            }
                        });

                        historyService.cancelTransaction($scope.TransactionId, userDetails.landlordId, userDetails.memberId, userDetails.accessToken, function (response) {
                            console.log(response);

                            $.unblockUI({
                                onUnblock: function () {
                                    if (response.success === true)
                                    {
                                        //authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.LandlordId, response.AccessToken);
                                        swal({
                                            title: "Payment Cancelled",
                                            text: "Payment has been cancelled successfully.",
                                            type: "success",
                                            customClass: "largeText"
                                        });
                                    }
                                    else
                                    {
                                        swal({
                                            title: "Oh No!",
                                            text: "Error",
                                            type: "error",
                                            customClass: "largeText"
                                        });
                                    }
                                }
                            });
                        });

                        return;
                    });


                    // For setting the 'Selected Prop' and going to a Property's Details page
                    $('#transHistory tbody .goToProperty').click(function () {
                        propDetailsService.set(this.id);
                        window.location.href = '#/property-details';
                    });
                }
                else
                {
                    console.log('History Ctrlr -> Error while getting transaction history!');
                }
            }
            else // Auth Token was not valid on server
            {
                //authenticationService.ClearUserData();
                window.location.href = 'login.html';
            }
        });


        $scope.refreshPage = function () {
            location.reload(true);
        }
    })

    // FOR HISTORY TABLE
    .directive('bootgridHistoryTable', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    formatters: {
                        "commands": function (column, row) {
                            return "<button type=\"button\" class=\"btn btn-icon btn-default command-edit m-r-10\" data-row-id=\"" + row.id + "\"><span class=\"md md-edit\"></span></button> ";
                        },
                        "status": function (column, row) {
                            if (row.status == "Paid" || row.status == "paid" || row.status == "completed")
                            {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Pending" || row.status == "pending")
                            {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected")
                            {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else
                            {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                        },
                        "user": function (column, row) {
                            return "<div class=\"media\"><div class=\"pull-left\"><img class=\"tableUserPic\" src=\"img/contacts/" + row.id + ".jpg\"></div><div class=\"media-body\"><div class=\"lv-title\">" + row.tenant + "</div><small class=\"lv-small\">" + row.email + "</small></div></div>";
                        }
                    },
                    columnSelection: false,
                    caseSensitive: false,
                    searchSettings: { characters: 3 },
                    labels: {
                        noResults: "No Payments to show yet!"
                    }
                });
            }
        }
    })



    //=================================================
    // Account Checklist Widget
    //=================================================

    .controller('accntChecklistCtrl', function ($rootScope, $scope, getProfileService, authenticationService) {

        $scope.checklistItems = {
            isBankAdded: 0,
            addProp: 0,
            addTenant: 0,
            acceptPayment: 0,
            percentComplete: 0
        }

        if (authenticationService.IsValidUser() == true)
        {
            var userdetails = authenticationService.GetUserDetails();

            getProfileService.GetAccountCompletionStats(userdetails.landlordId, userdetails.accessToken, function (response) {
                //console.log(response);

                if (response.AllPropertysCount > 0)
                {
                    $scope.checklistItems.addProp = 1;
                    $rootScope.hasAddedProperty = true;
                } else
                {
                    $scope.checklistItems.addProp = 0;
                    $rootScope.hasAddedProperty = false;
                }

                if (response.AllTenantsCount > 0)
                {
                    $scope.checklistItems.addTenant = 1;
                    $rootScope.hasAddedTenant = true;
                } else
                {
                    $scope.checklistItems.addTenant = 0;
                    $rootScope.hasAddedTenant = false;
                }

                $rootScope.isBankAvailable = response.IsAccountAdded;
                $scope.checklistItems.isBankAdded = response.IsAccountAdded;
                $scope.checklistItems.acceptPayment = response.IsAnyRentReceived;

                $scope.checklistItems.percentComplete = Number((($rootScope.IsEmailVerified + $rootScope.IsPhoneVerified + $rootScope.isIdVerified +
                             $scope.checklistItems.isBankAdded + $scope.checklistItems.addProp + $scope.checklistItems.addTenant + $scope.checklistItems.acceptPayment)
                             / 7) * 100).toFixed(0);

                setTimeout(function () {
                    $('#acntChecklistCard .main-pie').easyPieChart({
                        size: 130,
                        barColor: "#3fabe1",
                        trackColor: "#f2f2f2",
                        scaleColor: "#dfe0e0",
                        lineCap: "round",
                        animate: 2300,
                    });

                    var numAnim = new CountUp("countUp", 0, Number($scope.checklistItems.percentComplete), 0, 2.5);
                    numAnim.start();
                }, 200);
            });
        }
        else
        {
            window.location.href = 'login.html';
        }

        $scope.ResendVerificationEmailOrSMS = function (sendWhat) {
            console.log("Accnt Checklist Controller -> ResendVerificationEmailOrSMS fired");

            if (sendWhat == "SMS")
            {
                if ($rootScope.ContactNumber == "" ||
                    $rootScope.ContactNumber.length < 10)
                {
                    swal({
                        title: "No Phone Added Yet",
                        text: "Looks like you still need to add your phone number before we can verify it!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: "Later",
                        confirmButtonText: "Add Now",
                        confirmButtonColor: "#3FABE1"
                    }, function (isConfirm) {
                        if (isConfirm)
                        {
                            $scope.goTo("profile");
                        }
                    });
                    return;
                }
            }

            var userdetails = authenticationService.GetUserDetails();

            getProfileService.ResendVerificationEmailOrSMS(userdetails.landlordId, "Landlord", sendWhat, function (response) {
                console.log(response);

                if (response.IsSuccess && response.IsSuccess == true)
                {
                    console.log("Inside success");
                    if (sendWhat == "Email")
                    {
                        swal({
                            title: "Email Verification Resent",
                            text: "We just re-sent a verification link to <strong>" + $rootScope.emailAddress + "</strong>, please check your email and click the link to verify your email address.",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                    if (sendWhat == "SMS")
                    {
                        swal({
                            title: "SMS Verification Sent!",
                            text: "We just sent a text message to <strong>" + $rootScope.ContactNumber + "</strong>, please check your phone and reply \"Go\" to the text (case doesn't matter).",
                            type: "success",
                            customClass: "largeText",
                            html: true
                        });
                    }
                }
                else
                {
                    var msgtxt = "";
                    if (response.ErrorMessage.indexOf('Already Activated') > -1)
                    {
                        msgtxt = "Looks like your account is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    else if (response.ErrorMessage.indexOf('Already Verified') > -1)
                    {
                        msgtxt = "Looks like your phone number is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    swal({
                        title: "Oh no!",
                        text: msgtxt,
                        type: "warning"
                    });
                }
            });
        };

        $scope.goTo = function (destination) {
            if (destination == "profile")
            {
                $rootScope.shouldDisplayOverviewAlert = false;
                $rootScope.shouldShowPhoneTour = true;
                window.location.href = '#/profile/profile-about';
            }
        }
    })

    // Account Checklist Pie Chart (EASY PIE CHART)
    .directive('acntchklstChart', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {

            }
        }
    })


    //=================================================
    // LOGIN
    //=================================================

    .controller('loginCtrl', function ($scope, $rootScope, authenticationService) {

        $scope.FBLoginData = {
            eMail: '',
            firstName: '',
            lastName: '',
            gender: '',
            fbUserId: '',
            fbPhotoUrl: ''
        };

        $scope.GoogleLoginData = {
            eMail: '',
            Name: '',
            GoogleUserId: '',
            GooglePhotoUrl: ''
        };

        $scope.LoginData = {
            password: '',
            username: '',
            forgotPassword: ''
        };

        $scope.SignupData = {
            firstName: '',
            lastName: '',
            email: '',
            pass: ''
        };

        $(document).ready(function () {

            // This function checks a field on focusout (when the user moves to the next field) and updates Validation UI accordingly
            $(document).on("focusout", "form#reg input", function () {
                var field = this.id;

                if ($(this).val() && $(this).val().length > 2)
                {
                    if (field == "em")
                    {
                        if ($scope.ValidateEmail($('form#reg #em').val()))
                            updateValidationUi("em", true);
                    } else
                        updateValidationUi(field, true);
                }
            })

            $scope.isBusiness = $('#biz').is(':checked');

            $('#biz').on('change', function () {
                $scope.isBusiness = $('#biz').is(':checked');
            });

            if (getParameterByName("from") == "lp1" &&
                getParameterByName("em") != "")
            {
                $('#username').val(''); // Username in Login block

                $scope.SignupData.email = getParameterByName("em");

                setTimeout(function () {
                    $('#l-register').removeClass('hidden');
                    $('#em').val($scope.SignupData.email);
                    $('#emGrp .fg-line').addClass('fg-toggled');
                }, 300);

                swal({
                    title: 'Great Success',
                    text: '<p>Thanks for your interest in Nooch For Landlords!</p>' +
                          '<p>You can get started right now by completing your new Nooch account. &nbsp;Just enter your name, pick a password, and you\'re good to go!</p>',
                    type: 'success',
                    confirmButtonText: 'Great!',
                    customClass: 'largeText',
                    html: true
                }, function (isConfirm) {
                    $('#fname').focus();
                });
            }
            else if (localStorage.getItem('userLoginName') != null &&
                     localStorage.getItem('userLoginName').length > 0)  // checking if anything exists in local storage
            {
                $scope.LoginData.username = localStorage.getItem('userLoginName');

                $('#username').val('');

                setTimeout(function () {
                    $('#l-login').removeClass('hidden');
                    $('#username').val($scope.LoginData.username);
                    $('#usernameGrp .fg-line').addClass('fg-toggled');
                    $('#rememberMeCheck').prop("checked", true);

                    setTimeout(function () {
                        $('#pw').focus();
                    }, 400);
                }, 300);
            }
            else if (//getParameterByName("from") == "activation" &&
                     getParameterByName("em") != null && getParameterByName("em") != "")
            {
                $scope.LoginData.username = getParameterByName("em");

                $('#username').val('');

                setTimeout(function () {
                    $('#l-login').removeClass('hidden');
                    $('#username').val($scope.LoginData.username);
                    $('#usernameGrp .fg-line').addClass('fg-toggled');
                    $('#rememberMeCheck').prop("checked", true);

                    setTimeout(function () {
                        $('#pw').focus();
                    }, 400);
                }, 300);
            }
            else
            {
                setTimeout(function () {
                    $('#l-login').removeClass('hidden');
                }, 400);
            }
        });

        $scope.showBlock = function (destination) {
            if (destination == "signup")
            {
                $('#l-login').addClass('hidden');
                $('#l-register').removeClass('hidden');
                $('#l-forget-password').addClass('hidden');
            }
            else if (destination == "forgotpw")
            {
                $('#l-login').addClass('hidden');
                $('#l-register').addClass('hidden');
                $('#l-forget-password').removeClass('hidden');
            }
            else if (destination == "login")
            {
                $('#l-login').removeClass('hidden');
                $('#l-register').addClass('hidden');
                $('#l-forget-password').addClass('hidden');
            }
        }

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $scope.fngrprnt = "";
        new Fingerprint2().get(function (result) {
            $scope.fngrprnt = result;
        });

        $scope.ValidateEmail = function (str) {
            if (str != null)
            {
                var at = "@"
                var dot = "."
                var lat = str.indexOf("@")
                var lstr = str.length
                var ldot = str.indexOf(".")

                if (lat == -1 || lat == 0 || lat == lstr) return false
                if (ldot == -1 || ldot == 0 || ldot == lstr) return false
                if (str.indexOf(at, (lat + 1)) != -1) return false
                if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) return false
                if (str.indexOf(dot, (lat + 2)) == -1) return false
                if (str.indexOf(" ") != -1) return false

                return true
            }
            return false
        };


        this.loginWithFBAttmpt = function () {

            // setting stuff from local storage
            $scope.FBLoginData.eMail = localStorage.getItem('fbUserEmail');
            $scope.FBLoginData.firstName = localStorage.getItem('fbUserFirstName');
            $scope.FBLoginData.lastName = localStorage.getItem('#fbUserLastName');
            $scope.FBLoginData.gender = localStorage.getItem('fbUserGender');
            $scope.FBLoginData.fbUserId = localStorage.getItem('fbUserId');

            $scope.FBLoginData.fbPhotoUrl = localStorage.getItem('fbUserPhotoUrl');


            // Check Username (email) field for length
            if ($scope.FBLoginData.eMail.length > 0)
            {


                if ($scope.FBLoginData.firstName.length > 0)
                {

                    if ($scope.FBLoginData.lastName.length > 0)
                    {

                        if ($scope.FBLoginData.fbUserId.length > 0)
                        {

                            // ADD THE LOADING BOX
                            $('form#login').block({
                                message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Attempting login...</span>',
                                css: {
                                    border: 'none',
                                    padding: '26px 10px 23px',
                                    backgroundColor: '#000',
                                    '-webkit-border-radius': '14px',
                                    '-moz-border-radius': '14px',
                                    'border-radius': '14px',
                                    opacity: '.75',
                                    width: '86%',
                                    left: '7%',
                                    top: '25px',
                                    color: '#fff'
                                }
                            });

                            var country_code = "";
                            // Get IP Address from 'upusr' var, which is defined in Login.html
                            var ip = (typeof ipusr != 'undefined')
                                     ? ipusr
                                     : "";
                            //console.log("IP: [" + ip + "]");

                            authenticationService.FBLogin($scope.FBLoginData.eMail, $scope.FBLoginData.firstName, $scope.FBLoginData.lastName, $scope.FBLoginData.gender,
                                $scope.FBLoginData.fbPhotoUrl, ip, 'fingerprint', $scope.FBLoginData.fbUserId, function (response) {
                                    authenticationService.ClearUserData();
                                    $('form#login').unblock();

                                    console.log(response);

                                    if (response.IsSuccess == true)
                                    {
                                        fbreloadCheckPass = true;
                                        authenticationService.SetUserDetails($scope.FBLoginData.eMail, response.MemberId, response.LandlordId, response.AccessToken);
                                        window.location.href = 'index.html#/home';
                                    }
                                    else
                                    {
                                        swal({
                                            title: "Oh No!",
                                            text: response.ErrorMessage,
                                            customClass: 'largeText',
                                            type: "error"
                                        }, function () {
                                            setTimeout(function () {

                                            }, 200);
                                        });

                                        console.log('Sign In Error: ' + response.ErrorMessage);
                                    }
                                });
                        }
                        else
                        {
                            swal({
                                title: "Oh No!",
                                text: "Looks like permission related problem with your facebook id.  Please try re login with Facebook.",
                                customClass: 'largeText',
                                type: "error"
                            });
                        }
                    }
                    else
                    {
                        swal({
                            title: "Oh No!",
                            text: "Looks like permission related problem with your last name from Facebook.  Please try re login with Facebook.",
                            customClass: 'largeText',
                            type: "error"
                        });
                    }
                }
                else
                {
                    swal({
                        title: "Oh No!",
                        text: "Looks like permission related problem with your first name from Facebook.  Please try re login with Facebook.",
                        customClass: 'largeText',
                        type: "error"
                    });
                }
            }
            else
            {
                swal({
                    title: "Oh No!",
                    text: "Looks like permission related problem with your email from Facebook.  Please try re login with Facebook.",
                    customClass: 'largeText',
                    type: "error"
                });
            }
        }


        this.loginWithGoogleAttmpt = function () {

            $scope.GoogleLoginData.eMail = $('#googleUserEmail').val();
            $scope.GoogleLoginData.Name = $('#googleUserName').val();
            $scope.GoogleLoginData.GooglePhotoUrl = $('#googleImageUrl').val();
            $scope.GoogleLoginData.GoogleUserId = $('#googleUserId').val();

            // Check Username (email) field for length
            if ($scope.GoogleLoginData.eMail.length > 0)
            {

                if ($scope.GoogleLoginData.Name.length > 0)
                {

                    if ($scope.GoogleLoginData.GoogleUserId.length > 0)
                    {

                        // ADD THE LOADING BOX
                        $('form#login').block({
                            message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Attempting login...</span>',
                            css: {
                                border: 'none',
                                padding: '26px 10px 23px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '14px',
                                '-moz-border-radius': '14px',
                                'border-radius': '14px',
                                opacity: '.75',
                                width: '86%',
                                left: '7%',
                                top: '25px',
                                color: '#fff'
                            }
                        });


                        var country_code = "";
                        // Get IP Address from 'upusr' var, which is defined in Login.html
                        var ip = (typeof ipusr != 'undefined')
                                 ? ipusr
                                 : "";
                        //console.log("IP: [" + ip + "]");

                        authenticationService.GoogleLogin($scope.GoogleLoginData.eMail, $scope.GoogleLoginData.Name, $scope.GoogleLoginData.GooglePhotoUrl, ip, 'fingerprint',
                                $scope.GoogleLoginData.GoogleUserId, function (response) {
                                    authenticationService.ClearUserData();
                                    $('form#login').unblock();

                                    console.log(response);

                                    if (response.IsSuccess == true)
                                    {

                                        authenticationService.SetUserDetails($scope.GoogleLoginData.eMail, response.MemberId, response.LandlordId, response.AccessToken);
                                        window.location.href = 'index.html#/home';
                                    }
                                    else
                                    {
                                        swal({
                                            title: "Oh No!",
                                            text: response.ErrorMessage,
                                            customClass: 'largeText',
                                            type: "error"
                                        }, function () {
                                            setTimeout(function () {

                                            }, 200);
                                        });

                                        console.log('Sign In Error: ' + response.ErrorMessage);
                                    }
                                });
                    }
                    else
                    {
                        swal({
                            title: "Oh No!",
                            text: "Looks like permissions-related problem with your Google account. Please try again!",
                            customClass: 'largeText',
                            type: "error"
                        });
                    }
                }
                else
                {
                    swal({
                        title: "Oh No!",
                        text: "Looks like a permissions-related problem with your name from Google. Please try again!",
                        customClass: 'largeText',
                        type: "error"
                    });
                }
            }
            else
            {
                swal({
                    title: "Oh No!",
                    text: "Looks like a permissions-related problem with your email from Google. Please try again!",
                    customClass: 'largeText',
                    type: "error"
                });
            }
        }


        this.loginAttmpt = function () {

            // Check Username (email) field for length
            if ($('form#login #username').val())
            {
                var trimmedUserName = $('form#login #username').val().trim();
                $('form#login #username').val(trimmedUserName);

                // Check Name Field for a "@"
                if ($scope.ValidateEmail($('form#login #username').val()))
                {

                    updateValidationUi("username", true);

                    // Check Password field
                    if ($('form#login #pw').val().length > 4)
                    {
                        updateValidationUi("pw", true);

                        // ADD THE LOADING BOX
                        $('form#login').block({
                            message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Attempting login...</span>',
                            css: {
                                border: 'none',
                                padding: '26px 10px 23px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '14px',
                                '-moz-border-radius': '14px',
                                'border-radius': '14px',
                                opacity: '.75',
                                width: '86%',
                                left: '7%',
                                top: '25px',
                                color: '#fff'
                            }
                        });

                        // Get IP Address from 'upusr' var, which is defined in Login.html
                        var ip = (typeof ipusr != 'undefined')
                                 ? ipusr
                                 : "";
                        //console.log("IP: [" + ip + "]");

                        authenticationService.ClearUserData();

                        authenticationService.Login($scope.LoginData.username, $scope.LoginData.password, ip, function (response) {

                            $('form#login').unblock();

                            console.log(response);

                            if (response.IsSuccess == true)
                            {
                                if ($('#rememberMeCheck').prop("checked") == true)
                                {
                                    localStorage.setItem('userLoginName', $scope.LoginData.username);
                                    localStorage.setItem('userLoginPass', $scope.LoginData.password);
                                }

                                authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.LandlordId, response.AccessToken);
                                window.location.href = 'index.html#/home';
                            }
                            else
                            {
                                $('#pw').val('');
                                $('#pwGrp').removeClass('has-success');

                                // SIGN IN FAILURE
                                if (response.ErrorMessage.indexOf("suspended") > -1)
                                {
                                    swal({
                                        title: "Oh No!",
                                        text: "Looks like either your account has been <strong>suspended</strong>." +
                                              "<span class='show m-t-10'>If you believe this is an error or for more information, please contact " +
                                              "<a href='mailto:landlord-support@nooch.com' target='_blank'>Nooch Support</a>.</span>",
                                        customClass: 'largeText',
                                        type: "error",
                                        html: true
                                    });
                                }
                                else
                                {
                                    swal({
                                        title: "Oh No!",
                                        text: "Looks like either your email or password was incorrect. &nbsp;Please try again.",
                                        customClass: 'largeText',
                                        type: "error",
                                        html: true
                                    }, function () {
                                        setTimeout(function () {
                                            $('#pw').focus();
                                        }, 200);
                                    });

                                    $('#pwGrp').addClass('has-error');
                                }
                                console.log('Sign In Error: ' + response.ErrorMessage);
                            }
                        });
                    }
                    else
                    {
                        updateValidationUi("pw", false);
                    }
                }
                else
                {
                    updateValidationUi("username", false);
                }
            }
            else
            {
                updateValidationUi("username", false);
            }
        }


        this.forgotPwAttmpt = function () {
            var email = $scope.LoginData.forgotPassword;

            if ($scope.ValidateEmail(email))
            {
                updateValidationUi("emforgot", true);

                // ADD THE LOADING BOX
                $('form#forgotpw').block({
                    message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Submitting Reset PW Request...</span>',
                    css: {
                        border: 'none',
                        padding: '26px 10px 23px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '14px',
                        '-moz-border-radius': '14px',
                        'border-radius': '14px',
                        opacity: '.75',
                        width: '86%',
                        left: '7%',
                        top: '25px',
                        color: '#fff'
                    }
                });


                // Now call service to send Reset PW email
                authenticationService.PasswordRest(email, function (response) {

                    $('form#forgotpw').unblock();

                    if (response.IsSuccess == true ||
                        response.IsSuccess == false) // Cliff (9/10/15): added this line so that we always display the success alert. B/c we don't want to give feedback to potential hackers about whether a given email is signed up as a user...
                    {
                        $scope.LoginData.forgotPassword = '';

                        swal({
                            title: "Reset Link Sent",
                            text: "If that email address is associated with a Nooch account, you will receive an email with a link to reset your password.",
                            type: "success"
                        });
                    }
                    else
                    { // This will just be for a general server error where the server doesn't return any 'success' parameter at all
                        swal({
                            title: "Oh No!",
                            text: "Looks like we ran into a little trouble processing your request. Please try again or contact support@nooch.com for more help.",
                            type: "error"
                        });
                    }
                });
            }
            else
            {
                updateValidationUi("emforgot", false);
            }
        }


        this.registerAttmpt = function () {
            //if ($scope.SignupData.email &&
            //    $scope.SignupData.email != 'undefined' &&
            //    $scope.SignupData.email.length != 0)
            //{ }

            var regForm = $('form#reg');
            var fName = $scope.SignupData.firstName;
            var lName = $scope.SignupData.lastName;
            var email = $scope.SignupData.email;
            var pw = $scope.SignupData.pass;
            var isBiz = $scope.isBusiness;

            // Check Name fields for length
            if (fName && fName.length > 1)
            {
                updateValidationUi("fname", true);

                var trimmedFName = capitalize(fName.trim());
                $('form#reg #fname').val(trimmedFName);

                if (lName && lName.length > 1)
                {
                    updateValidationUi("lname", true);

                    var trimmedLName = lName.trim();
                    $('form#reg #lname').val(trimmedLName);

                    // Validate Email Field
                    if ($scope.ValidateEmail(email))
                    {
                        updateValidationUi("em", true);

                        // Check Password field
                        if (pw.length > 4)
                        {
                            updateValidationUi("pwreg", true);

                            // Finally, check if the Terms of Service box is checked
                            if ($('#tosboxGrp input').prop('checked'))
                            {
                                updateValidationUi("tosbox", true);

                                // ADD THE LOADING BOX
                                regForm.block({
                                    message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Creating Account...</span>',
                                    css: {
                                        border: 'none',
                                        padding: '26px 10px 23px',
                                        backgroundColor: '#000',
                                        '-webkit-border-radius': '14px',
                                        '-moz-border-radius': '14px',
                                        'border-radius': '14px',
                                        opacity: '.75',
                                        width: '86%',
                                        left: '7%',
                                        top: '25px',
                                        color: '#fff'
                                    }
                                });

                                var country_code = "";
                                // Get IP Address from 'upusr' var, which is defined in Login.html
                                var ip = (typeof ipusr != 'undefined')
                                         ? ipusr
                                         : "";
                                //console.log("IP: [" + ip + "]");

                                // Now call service to register a new Landlord user
                                authenticationService.RegisterLandlord($scope.SignupData.firstName, $scope.SignupData.lastName, $scope.SignupData.email, $scope.SignupData.pass, $scope.fngrprnt, ip, country_code, isBiz, function (response) {
                                    console.log(response);
                                    regForm.unblock();

                                    // Cliff (9/10/15): Users should be automatically logged in after creating an account... send them to the Home page.
                                    if (response.IsSuccess == true)
                                    {
                                        var username = $scope.SignupData.email;
                                        var pw = $scope.SignupData.pass;

                                        $scope.SignupData.firstName = '';
                                        $scope.SignupData.lastName = '';
                                        $scope.SignupData.email = '';
                                        $scope.SignupData.pass = '';

                                        swal({
                                            title: "Great Success",
                                            text: 'Congrats - your new Nooch account has been created successfully! &nbsp;Click below to get started',
                                            type: "success",
                                            customClass: "largeText",
                                            confirmButtonColor: "#3FABE1",
                                            confirmButtonText: "Let's Get Started!",
                                            html: true
                                        }, function (isConfirm) {
                                            // Now log the user in & send to home page.

                                            // Add another loading box while we log the user in
                                            regForm.block({
                                                message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Logging in...</span>',
                                                css: {
                                                    border: 'none',
                                                    padding: '26px 10px 23px',
                                                    backgroundColor: '#000',
                                                    '-webkit-border-radius': '14px',
                                                    '-moz-border-radius': '14px',
                                                    'border-radius': '14px',
                                                    opacity: '.75',
                                                    width: '86%',
                                                    left: '7%',
                                                    top: '25px',
                                                    color: '#fff'
                                                }
                                            });

                                            authenticationService.ClearUserData();

                                            authenticationService.Login(username, pw, ip, function (response) {

                                                //regForm.unblock();

                                                if (response.IsSuccess == true)
                                                {
                                                    $rootScope.hasSeenNewUserTour = false;

                                                    authenticationService.SetUserDetails(username, response.MemberId, response.LandlordId, response.AccessToken);
                                                    window.location.href = 'index.html#/home';
                                                }
                                                else // Should never not be successful... the user would have *just* created their account
                                                {
                                                    console.log('Sign In Error: ' + response.ErrorMessage);

                                                    swal({
                                                        title: "Oh No!",
                                                        text: "Looks like we had trouble logging you in! Please try again.",
                                                        type: "error"
                                                    });
                                                }
                                            });
                                        });
                                    }
                                    else
                                    {
                                        var msg = "Looks like we had trouble creating your account. We hate it when that happens. Please try again or contact support@nooch.com for more help.";
                                        var showCancel = false;

                                        if (response.ErrorMessage.indexOf("already exists") > -1)
                                        {
                                            msg = "Looks like that email address is already registered.  If you forgot your password you can reset it.  Or try using a different email address.";
                                            showCancel = true;
                                        }

                                        swal({
                                            title: "Oh No!",
                                            text: msg,
                                            type: "error",
                                            customClass: "largeText",
                                            showCancelButton: showCancel,
                                            cancelButtonText: "Forgot My Password!",
                                            confirmButtonText: "Ok",
                                        }, function (isConfirm) {
                                            if (isConfirm)
                                                updateValidationUi("em", false);
                                            else
                                                $scope.showBlock("forgotpw");
                                        });
                                    }
                                });
                            }
                            else
                                updateValidationUi("tosbox", false);
                        }
                        else
                            updateValidationUi("pwreg", false);
                    }
                    else
                        updateValidationUi("em", false);
                }
                else
                    updateValidationUi("lname", false);
            }
            else
                updateValidationUi("fname", false);
        }

        $scope.tosClicked = function () {
            if ($('#tosboxGrp input').prop('checked'))
            {
                console.log("TOS BOX CHECKED");
                $('#createAccnt').addClass('pulse');
            }
            else
            {
                console.log("Should remove the animated class");
                $('#createAccnt').removeClass('pulse');
            }
        }

        // Utility Function To Update Form Input's UI for Success/Error (Works for all forms on the Property Details page...like 4 of them)
        updateValidationUi = function (field, success) {
            console.log("Field: " + field + "; success: " + success);

            if (success == true)
            {
                if (field != "tosbox")
                {
                    $('#' + field + 'Grp').removeClass('has-error').addClass('has-success');
                    if (field != 'pw' && $('#' + field + 'Grp .help-block').length)
                    {
                        $('#' + field + 'Grp .help-block').slideUp();
                    }
                }
            }
            else
            {
                $('#' + field + 'Grp').removeClass('has-success').addClass('has-error');

                var helpBlockTxt = "";

                if (field == "username" || field == "em" || field == "emforgot")
                    helpBlockTxt = "Please enter your full email address.";
                else if (field == "pw")
                    helpBlockTxt = "Please enter your password!"
                else if (field == "fname")
                    helpBlockTxt = "Please enter your first name."
                else if (field == "lname")
                    helpBlockTxt = "Please enter your last name."
                else if (field == "pwreg")
                    helpBlockTxt = "Please create a strong password."
                else if (field == "tosbox")
                {
                    helpBlockTxt = "Please read and agree to Nooch's TOS to create your account."
                    $('#createAccnt').attr("style", "margin-top:30px !important");
                }

                if (!$('#' + field + 'Grp .help-block').length)
                {
                    $('#' + field + 'Grp').append('<small class="help-block pull-left" style="display:none">' + helpBlockTxt + '</small>');
                    $('#' + field + 'Grp .help-block').slideDown();
                }
                else
                    $('#' + field + 'Grp .help-block').show()

                // Now focus on the element that failed validation
                setTimeout(function () {
                    $('#' + field + 'Grp input').focus();
                }, 200)
            }
        }

        capitalize = function (string) {
            string = string.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
            });
            return string;
        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    })


    //=================================================
    // TENANT REQUESTS
    //=================================================

    // FOR TENANT REQUESTS TABLE
    .directive('tenantRequests', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bootgrid({
                    css: {
                        icon: 'md icon',
                        iconColumns: 'md-view-module',
                        iconDown: 'md-expand-more',
                        iconRefresh: 'md-refresh',
                        iconUp: 'md-expand-less'
                    },
                    formatters: {
                        "actions": function (column, row) {
                            if (row.status == "Pending" || row.status == "pending")
                            {
                                return "<button data-target=\"#test123\" data-toggle=\"modal\" type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\" title=\"Approve\"><span class=\"md md-check c-green\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-close c-red\"></span></button>";
                            }
                            else if (row.status == "Approved" || row.status == "approved")
                            {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-verified-user c-blue\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-mail\"></span></button>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected")
                            {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-undo c-orange\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-report c-red\"></span></button>";
                            }
                        },
                        "dateColumn": function (column, row) {
                            return "<span>" + row.dateSubmitted + "</span>";
                        },
                        "status": function (column, row) {
                            if (row.status == "Pending" || row.status == "pending")
                            {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Approved" || row.status == "approved")
                            {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected")
                            {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else
                            {
                                return "<span class=\"label label-default\">" + row.status + "</span>";
                            }
                        },
                        "user": function (column, row) {
                            return "<div class=\"media\"><div class=\" pull-left\"><img class=\"tableUserPic\" src=\"img/profile-pics/" + row.id + ".jpg\"></div><div class=\"media-body\"><div class=\"lv-title\">" + row.user + "</div><small class=\"lv-small\">" + row.email + "</small></div></div>";
                        },
                    },
                    columnSelection: false,
                    caseSensitive: false,
                    headerAlign: "center",
                    searchSettings: { characters: 2 },
                    labels: {
                        infos: "Showing {{ctx.start}} to {{ctx.end}} of {{ctx.total}} Tenant Requests",
                        noResults: "No users found for that name"
                    }
                });
            }
        }
    })

    // CLIFF (9/3/15): Added this function for capitalizing any string.  Used by adding "| calitalize".  Ex:  {{ userInfo.firstName | capitalize }}
    .filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    })

    // CLIFF (9/14/15):  Added this function to format phone numbers.  Used by adding "| formatphone".  Ex:  {{ userInfo.contactNumber | capitalize }}
    .filter('formatphone', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                var number = input.toString().trim().replace('[^0-9]', '');

                if (number.length == 10)
                {
                    var first3 = number.slice(0, 3);
                    var second3 = number.slice(3, 6);
                    var last4 = number.slice(6);

                    number = "(" + first3 + ") " + second3 + "-" + last4;
                }
                return number;
            }) : '';
        }
    })




/**********************************
/**   UNUSED BLOCKS THAT  MAY BE  **
/**   IMPLEMENTED IN THE FUTURE  **
/**********************************/

// ===============================================================
// Todo List Widget (Came with default Template)
// ===============================================================

/*.controller('todoCtrl', function (todoService) {

    //Get Todo List Widget Data
    this.todo = todoService.todo;

    this.tdResult = todoService.getTodo(this.todo);

    //Add new Item (closed by default)
    this.addTodoStat = 0;

    //Dismiss
    this.clearTodo = function (event) {
        this.addTodoStat = 0;
        this.todo = '';
    }
})*/


// ===============================================================
// Recent Items Widget (Came with default Template)
// ===============================================================

/*.controller('recentitemCtrl', function (recentitemService) {

    //Get Recent Items Widget Data
    this.id = recentitemService.id;
    this.name = recentitemService.name;
    this.parseInt = recentitemService.price;

    this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
})*/