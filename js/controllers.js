noochForLandlords
    // ===============================================================
    // Base controller for common functions
    // ===============================================================

    .controller('noochAdminCtrl', function ($rootScope, $timeout, $state, growlService, authenticationService) {
        if (!authenticationService.IsValidUser()) {
            growlService.growl('Please login to continue!', 'inverse');
            window.location.href = 'login.html';
        }

        // Detact Mobile Browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            angular.element('html').addClass('ismobile');
        }

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false
        }

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');

        // For Mainmenu Active Class
        this.$state = $state;

        //Close sidebar on click
        this.sidebarStat = function (event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;
            }
        }

        // Data that needs to be globally accessible (Use sparingly)
        $rootScope.isIdVerified = false;

    })


    // ===============================================================
    // Header
    // ===============================================================
    .controller('headerCtrl', function ($timeout, messageService, authenticationService) {

        if (!authenticationService.IsValidUser()) {
            window.location.href = 'login.html'; //; CLIFF: COMMENTING OUT FOR TESTING LOCALLY B/ AUTHENTICATION SERVICE WON'T WORK
        }

        this.closeSearch = function () {
            angular.element('#header').removeClass('search-toggled');
        }

        // Get Notifications for header
        this.img = messageService.img;
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
        }

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
                if (isConfirm) {
                    localStorage.clear();
                    window.location.href = 'login.html';
                }
            });
        }

        // Fullscreen View (part of default template)
        this.fullScreen = function () {
            //Launch
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            if (exitFullscreen()) {
                launchIntoFullscreen(document.documentElement);
            }
            else {
                launchIntoFullscreen(document.documentElement);
            }
        }

    })


    // ===============================================================
    // Todo List Widget (Came with default Template)
    // ===============================================================

    .controller('todoCtrl', function (todoService) {

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
    })


    // ===============================================================
    // Recent Items Widget (Came with default Template)
    // ===============================================================

    .controller('recentitemCtrl', function (recentitemService) {

        //Get Recent Items Widget Data
        this.id = recentitemService.id;
        this.name = recentitemService.name;
        this.parseInt = recentitemService.price;

        this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
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
            //console.log('get properties called user details -> ' + userdetails.memberId + ' ' + userdetails.accessToken);

            propertiesService.GetProperties(userdetails.memberId, userdetails.accessToken, function (data) {
                if (data.IsSuccess == true) {
                    // data binding goes in here

                    $rootScope.propCount = data.AllProperties.length;

                    var index;

                    for (index = 0; index < data.AllProperties.length; ++index) {
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

                    $scope.userAccountDetails.IsIDVerified = false;
                    $rootScope.isIdVerified = $scope.userAccountDetails.isIDVerified; // Also updating the RootScope
                    $scope.userAccountDetails.IsAnyRentReceived = false;
                    //console.log('items [0]' + $scope.propResult[0]);
                }
            });
        };

        $timeout(function () { getProperties(); }, 1000);
    })


    // PROPERTY DETAILS CONTROLLER
    .controller('propDetailsCtrl', function ($compile, authenticationService, $scope, propertiesService, propDetailsService, getTenantsService, getProfileService, growlService) {

        $scope.selectedProperty = {

        };

        $scope.tenantsListForThisPorperty = new Array();

        //console.log('list count in tenats before setting data in.' + $scope.tenantsListForThisPorperty.length);

        var userdetails = authenticationService.GetUserDetails();

        getPropertyDetails();

        function getPropertyDetails() {
            //console.log('get properties called user details -> ' + userdetails.memberId + ' ' + userdetails.accessToken);

            var propId = propDetailsService.get();

            if (propId != null && propId.length > 0) {

                propDetailsService.getPropFromDb(propId, userdetails.memberId, userdetails.accessToken, function (data) {
                    if (data.IsSuccess == true) {
                        // data binding goes in here

                        var propStatus = 0;

                        if (data.PropertyDetails.PropStatus == "Published") {
                            propStatus = 1;
                        }
                        else {
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
                            "pastDue": 0,
                            "defaultBankName": data.BankAccountDetails.BankName,
                            "defaultBankNickname": data.BankAccountDetails.BankAccountNick + " - " + data.BankAccountDetails.BankAccountNumString,
                            "bankImage": data.BankAccountDetails.BankIcon,
                            "propertyId": data.PropertyDetails.PropertyId
                        }

                        $scope.tenantsListForThisPorperty = data.TenantsListForThisProperty; // CLIFF (9/24/15): THIS SHOULD BE 'UNITSLIST' NOT TENANTS LIST

                        $('.selectpicker').selectpicker('refresh');
                        console.log($scope.tenantsListForThisPorperty);

                        var propUnitsTable = $('#propUnits').DataTable({
                            data: $scope.tenantsListForThisPorperty,
                            columns: [
                                { data: 'TenantId' },

                                { data: 'UnitId' },
                                { data: 'UnitNumber' },
                                { data: 'UnitRent' },

                                { data: 'Name' },
                                { data: 'TenantEmail' },
                                { data: 'ImageUrl' },
                                { data: 'LastRentPaidOn' },

                                { data: 'IsRentPaidForThisMonth' },
                                { data: 'IsEmailVerified' },
                                { data: 'IsDocumentsVerified' },

                                { data: 'IsPhoneVerified' },
                                { data: 'IsBankAccountAdded' },
                                {
                                    data: null,
                                    defaultContent: '<a href="" class=\'btn btn-icon btn-default command-edit m-r-10 editUnitBtn\'><span class=\'md md-edit\'></span></a>' +
                                                    '<a href="" class=\'btn btn-icon btn-default command-edit m-r-10\'><span class=\'md md-today\'></span></a> ' +
                                                    '<a href="" class=\'btn btn-icon btn-default command-edit m-r-10\'><span class=\'md md-more-vert\'></span></a>'
                                }
                            ],
                            "columnDefs": [
                                {
                                    "targets": [0, 1, 6, 7, 8, -5, -2, -3, -4], // identifies which columns will be affected, + numbers count from left (0 index), - numbers from the right
                                    "visible": false,
                                    "searchable": false
                                },
                                { className: "capitalize", "targets": [4] },
                                { className: "text-center", "targets": [2, 3] }
                            ],
                            buttons: [
                                'pdf',
                                'excel',
                                'print'
                            ]
                        });
                    }
                    else {
                        console.log('Error while getting  property details.');
                    }
                });
            }
            else {
                //send back to home page 
            }
        };

        $('#propUnits tbody .btn').on('click', 'button', function () {

            console.log("CLICK RECORDED!!");

            var data = propUnitsTable.row($(this).parents('tr')).data();

            alert("Col 1: [" + data[0] + "], Col 2: [" + data[1] + "], Col 3: [" + data[2] + "], Col 4: [" + data[5] + "]");

            $('#addUnitModal .modal-title').html('Edit This Unit in ' + $scope.selectedProperty.name);
            $('#addUnitModal #unitNum').val($scope.selectedProperty.UnitNumber);
            $('#addUnitModal select').val('');
            $('#addUnitModal #unitNumGrp').removeClass('has-error').removeClass('has-success');
            $('#addUnitModal #monthlyRentGrp').removeClass('has-error').removeClass('has-success');

            if ($('#unitNumGrp .help-block').length) {
                $('#unitNumGrp .help-block').slideUp();
            }
            if ($('#monthlyRentGrp .help-block').length) {
                $('#monthlyRentGrp .help-block').slideUp();
            }

            $('#addUnitModal').modal();

            $('#addUnitModal #monthlyRent').mask("#,##0.00", { reverse: true });

            setTimeout(function () {
                $('#addUnitModal #unitNum').focus();
            }, 600)

        });


        $scope.editPropInfo = 0;

        $scope.beginEditingProp = function () {
            $scope.editPropInfo = 1;
        }

        $scope.resetEditForm = function () {
            //console.log('came in resetEditForm');
            $scope.editPropInfo = 0;
        }

        $scope.updatePropInfo = function () {

            if ($scope.editPropInfo == 1) {

                // Preparing data to be sent for updating property
                $scope.inputData = {};
                $scope.inputData.propertyName = $scope.selectedProperty.name;
                $scope.inputData.propertyAddress = $scope.selectedProperty.address1;
                $scope.inputData.propertyCity = $scope.selectedProperty.city;
                $scope.inputData.propertyZip = $scope.selectedProperty.zip;
                $scope.inputData.contactNum = $scope.selectedProperty.contactNumber.replace(/\D/g, '');
                $scope.inputData.state = $scope.selectedProperty.state;
                $scope.inputData.propId = $scope.selectedProperty.propertyId;

                propertiesService.EditProperty($scope.inputData, userdetails.memberId, userdetails.accessToken, function (data) {
                    if (data.IsSuccess == true) {
                        $scope.editPropInfo = 0;
                        growlService.growl('Property details updated successfully!', 'success');
                    }
                    else {
                        $scope.editPropInfo = 0;
                        growlService.growl(data.ErrorMessage, 'error');
                    }
                });
            }
        }

        $scope.editPropPic = function () {
            $('#editPropPic').modal();

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#propPicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='" + $scope.selectedProperty.imgUrl + "' class='file-preview-image' alt='Property Picture'>",
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
                resizePreference: 'width'
            });
        }

        // Get list of Tenants for this Property
        $scope.tenantList = getTenantsService.getTenants(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);


        // Edit Published State (Whether the property should be publicly listed or not)
        $scope.dropdownPublishedState = function () {

            console.log('came in dropdown method');

            var alertTitleTxt, alertBodyTxt, actionBtnTxt, cancelBtnTxt;
            var isAlreadyPublished = false;
            var shouldCloseOnConfirm = false;

            if ($scope.selectedProperty.published == 1) {
                isAlreadyPublished = true;
                shouldCloseOnConfirm = true;
                alertTitleTxt = "Hide This Property?";
                alertBodyTxt = "You can hide this property if it is inactive or you no longer want this property to be included in search results when a tenant searches for their apartment on Nooch.";
                actionBtnTxt = "No, Keep It Published";
                cancelBtnTxt = "Yes, Hide It";
            }
            else {
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
                if (isConfirm) {
                    if (!isAlreadyPublished) {

                        propertiesService.SetPropertyStatus(propDetailsService.get(), true, userdetails.memberId, userdetails.accessToken, function (data2) {

                            if (data2.IsSuccess == false) {

                                swal({
                                    title: "Ooops Error!",
                                    text: data2.ErrorMessage,
                                    type: "warning"
                                });
                            }
                            if (data2.IsSuccess == true) {

                                setIsPublished(1);
                                swal({
                                    title: "You Got It!",
                                    text: "Your property has been published.",
                                    type: "success"
                                });
                            }
                        });
                    }
                }
                else {
                    if (isAlreadyPublished) {

                        propertiesService.SetPropertyStatus(propDetailsService.get(), false, userdetails.memberId, userdetails.accessToken, function (data2) {

                            if (data2.IsSuccess == false) {

                                swal({
                                    title: "Ooops Error!",
                                    text: data2.ErrorMessage,
                                    type: "warning"
                                });
                                //alert(data.ErrorMessage);
                            }
                            if (data2.IsSuccess == true) {

                                setIsPublished(0);
                                swal({
                                    title: "No Problem",
                                    text: "Your property has been hidden. Before tenants can pay rent for this property, you must publish it.",
                                    type: "success"
                                });
                            }
                        });
                    }
                    else {
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
            $('#chargeTenantModal').modal();

            $('#chargeTenantForm input').val('');
            $('#chargeTenantForm #tenantGrp').removeClass('has-error').removeClass('has-success');
            $('#chargeTenantForm #amountGrp').removeClass('has-error').removeClass('has-success');

            if ($('#tenantGrp .help-block').length) {
                $('#tenantGrp .help-block').slideUp();
            }
            if ($('#amountGrp .help-block').length) {
                $('#amountGrp .help-block').slideUp();
            }

            var $setUpSelectTenantDropdown = $('#chargeTenantForm #tenantGrp select option:last-child').attr('data-ng-repeat', 'tenant in pdctrl.tenantList.tenants');
            // $compile($setUpSelectTenantDropdown)($scope);
            $('#chargeTenantForm #amount').mask("#,##0.00", { reverse: true });
        }

        this.chargeTenant_Submit = function () {
            // Check Name field for length
            if ($('#chargeTenantForm #tenant').val()) {
                var trimmedName = $('#chargeTenantForm #tenant').val().trim();
                $('#chargeTenantForm #tenant').val(trimmedName);

                // Check Name Field for a " "
                if ($('#chargeTenantForm #tenant').val().indexOf(' ') > 1) {
                    updateValidationUi("tenant", true);

                    // Check Amount field
                    if ($('#chargeTenantForm #amount').val().length > 4 &&
                        $('#chargeTenantForm #amount').val() > 10) {
                        updateValidationUi("amount", true);

                        $('#chargeTenantModal').modal('hide');

                        // Finally, submit the data and display success alert
                        swal({
                            title: "Payment Request Sent",
                            text: "Your tenant will be notified about your payment request.  We will update you when they complete the payment.",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#3FABE1",
                            confirmButtonText: "Awesome",
                            closeOnConfirm: trimmedName,
                            closeOnCancel: false
                        }, function () {
                        });
                    }
                    else {
                        updateValidationUi("amount", false);
                    }
                }
                else {
                    updateValidationUi("tenant", false);
                }
            }
            else {
                updateValidationUi("tenant", false);
            }
        }


        // Add Unit Button
        $scope.addUnit = function () {
            // Reset the form
            $('#addUnitModal input').val('');
            $('#addUnitModal select').val('');
            $('#addUnitModal #unitNumGrp').removeClass('has-error').removeClass('has-success');
            $('#addUnitModal #monthlyRentGrp').removeClass('has-error').removeClass('has-success');

            if ($('#unitNumGrp .help-block').length) {
                $('#unitNumGrp .help-block').slideUp();
            }
            if ($('#monthlyRentGrp .help-block').length) {
                $('#monthlyRentGrp .help-block').slideUp();
            }

            $('#addUnitModal').modal();

            $('#addUnitModal #monthlyRent').mask("#,##0.00", { reverse: true });

            setTimeout(function () {
                $('#addUnitModal #unitNum').focus();
            }, 600);
        }

        $scope.addUnit_submit = function () {
            // Check Unit Number field for length
            if ($('#addUnitModal #unitNum').val().length > 0) {
                var trimmedName = $('#addUnitModal #unitNum').val().trim();
                $('#addUnitModal #unitNum').val(trimmedName);
                updateValidationUi("unitNum", true);

                // Now check Monthly Rent Amount field
                if ($('#addUnitModal #monthlyRent').val().length > 4)// &&
                    //$('#addUnitModal #monthlyRent').val() > 100)
                {
                    updateValidationUi("monthlyRent", true);

                    $('#addUnitModal').modal('hide');


                    // preparing data to be submitted to db
                    var propId = propDetailsService.get();
                    var userdetails = authenticationService.GetUserDetails();
                    var unitData = {};
                    unitData.UnitNum = $('#addUnitModal #unitNum').val();
                    unitData.UnitNickName = $('#addUnitModal #nickname').val();
                    unitData.Rent = $('#addUnitModal #monthlyRent').val();

                    unitData.DueDate = $('#addUnitModal #unitRentDueDate option:selected').text();

                    if ($('#addUnitModal #unitTenants option:selected').text() == "Select A Tenant" || $('#addUnitModal #unitTenants option:selected').text() == "NO TENANT YET") {
                        unitData.IsTenantAdded = false;
                    } else {
                        unitData.IsTenantAdded = true;
                        unitData.TenantId = $('#addUnitModal #unitTenants option:selected').val();

                    }

                    unitData.RentStartDate = $('#addUnitModal #addUnitDatePicker').val();
                    unitData.AgreementDuration = $('#addUnitModal #rentDurationInMonths option:selected').text();


                    propertiesService.AddNewUnit(propId, unitData, userdetails.memberId, userdetails.accessToken, function (data) {
                        if (data.IsSuccess == true) {
                            swal({
                                title: "Unit Added",
                                text: "This unit has been added successfully.",
                                type: "success",
                                showCancelButton: true,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Terrific",
                                cancelButtonText: "Add Another One",
                                closeOnConfirm: true,
                                closeOnCancel: true,
                            }, function (isConfirm) {
                                if (!isConfirm) {
                                    $scope.addUnit();
                                }
                            });

                        } else {
                            swal({
                                title: "Oops",
                                text: data.ErrorMessage,
                                type: "danger",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Ok",

                                closeOnConfirm: true

                            });
                        }
                    });







                }
                else {
                    updateValidationUi("monthlyRent", false);
                }

            }
            else {
                updateValidationUi("unitNum", false);
            }
        }


        // Send Message Modal
        $scope.sendMsg = function (howMany) {
            // Reset each field
            $('#sndMsgForm #tenantMsgGrp').removeClass('has-error').removeClass('has-success');
            $('#sndMsgForm #msgGrp').removeClass('has-error').removeClass('has-success');
            $('#sndMsgForm #msg').val('');

            if ($('#tenantMsgGrp .help-block').length) {
                $('#tenantMsgGrp .help-block').slideUp();
            }
            if ($('#msgGrp .help-block').length) {
                $('#msgGrp .help-block').slideUp();
            }

            if (howMany == "all") {
                $('#sndMsgForm .well div').text('Enter a message below.  This will be emailed to ALL tenants for this property.');
                $('#sndMsgForm #tenantMsgGrp').addClass('hidden');
                $scope.IsMessageForall = true;
            }
            else if (howMany == "1") {
                $('#sndMsgForm .well div').text('Enter your message and select a tenant to send it to.');
                $('#sndMsgForm #tenantMsgGrp').removeClass('hidden');
                $scope.IsMessageForall = false;
            }

            $('#sendMsgModal').modal();
        }

        $scope.sendMsg_submit = function () {
            if ((!$('#sndMsgForm #tenantMsgGrp').hasClass('hidden') && $('#sndMsgForm #tenantMsg').val() != '0') ||
                  $('#sndMsgForm #tenantMsgGrp').hasClass('hidden')) {
                // Check Message field for length
                if ($('#sndMsgForm textarea').val().length > 1) {
                    var trimmedMsg = $('#sndMsgForm textarea').val().trim();
                    $('#sndMsgForm textarea').val(trimmedMsg);

                    updateValidationUi("msg", true);

                    // sending message to service here
                    var emailObj = {};
                    emailObj.MessageToBeSent = $('#sndMsgForm textarea').val();
                    emailObj.PropertyId = $scope.selectedProperty.propertyId;
                    if ($scope.IsMessageForall == true) {
                        // for all
                        emailObj.IsForAllOrOne = "All";

                        emailObj.TenantIdToBeMessaged = "";



                    } else {
                        // for single person
                        emailObj.IsForAllOrOne = "One";

                        emailObj.TenantIdToBeMessaged = "B3A6CF7B-561F-4105-99E4-406A215CCF61";  // ID of tenant to be send from here..hard coded for now
                    }

                    var userdetails = authenticationService.GetUserDetails();
                    getProfileService.SendEmailsToTenants(userdetails.memberId, userdetails.accessToken, emailObj, function (data) {

                        if (data.IsSuccess) {
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
                        } else {
                            swal({
                                title: "Oops",
                                text: data.ErrorMessage,
                                type: "danger",
                                showCancelButton: false,
                                confirmButtonColor: "#3FABE1",
                                confirmButtonText: "Ok",
                                closeOnConfirm: true
                            });
                        }

                    });





                }
                else {
                    updateValidationUi("msg", false);
                }
            }
            else if (!$('#sndMsgForm #tenantMsgGrp').hasClass('hidden')) {
                updateValidationUi("tenantMsg", false);
            }
        }


        // Edit ACH Memo for all transactions for this property
        $scope.editAchMemo = function () {
            // Reset each field
            $('#achMemoGrp').removeClass('has-error').removeClass('has-success');

            if ($('#achMemoGrp .help-block').length) {
                $('#achMemoGrp .help-block').slideUp();
            }

            $('#editAchModal').modal();
        }

        $scope.editAchMemo_submit = function () {
            if ($('#editAchModal input[name=achMemoStyle]:checked').length) {
                updateValidationUi('achMemo', true);
                $('#editAchModal').modal('hide');

                // Finally, submit the data and display success alert
                swal({
                    title: "Roger That",
                    text: "Your ACH Memo settings have been udpated successfully.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3FABE1",
                    confirmButtonText: "Great",
                    closeOnConfirm: true,
                });
            }
            else {
                updateValidationUi('achMemo', false);
            }
        }

        // Utility Function To Update Form Input's UI for Success/Error (Works for all forms on the Property Details page...like 4 of them)
        updateValidationUi = function (field, success) {
            console.log("Field: " + field + "; success: " + success);

            if (success == true) {
                $('#' + field + 'Grp').removeClass('has-error').addClass('has-success');
                if ($('#' + field + 'Grp .help-block').length) {
                    $('#' + field + 'Grp .help-block').slideUp();
                }
            }

            else {
                $('#' + field + 'Grp').removeClass('has-success').addClass('has-error');

                var helpBlockTxt = "";
                if (field == "tenant") {
                    helpBlockTxt = "Please enter one of your tenant's full name.";
                }
                else if (field == "amount") {
                    helpBlockTxt = "Please enter an amount!"
                }
                else if (field == "tenantMsg") {
                    helpBlockTxt = "Please select a tenant!"
                }
                else if (field == "msg") {
                    helpBlockTxt = "Please enter a message!"
                }
                else if (field == "achMemo") {
                    helpBlockTxt = "Please select one of the options above."
                }

                if (!$('#' + field + 'Grp .help-block').length) {
                    $('#' + field + 'Grp').append('<small class="help-block col-sm-offset-3 col-sm-9" style="display:none">' + helpBlockTxt + '</small>');
                    $('#' + field + 'Grp .help-block').slideDown();
                }
                else { $('#' + field + 'Grp .help-block').show() }

                // Now focus on the element that failed validation
                setTimeout(function () {
                    $('#' + field + 'Grp input').focus();
                }, 200)
            }
        }
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

                                if (row.status == "Paid" || row.status == "paid" || row.status == "completed") {
                                    return "<span class=\"label label-success\">" + row.status + "</span>" + lastDateText;
                                }
                                else if (row.status.toLowerCase == "pending") {
                                    return "<span class=\"label label-warning\">" + row.status + "</span>" + lastDateText;
                                }
                                else if (row.status.toLowerCase() == "past due") {
                                    return "<span class=\"label label-danger\">" + row.status + "</span>" + lastDateText;
                                }
                                else {
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
                    //console.log("DELETE PROPERTY DIRECTIVE");
                    //console.log(element);
                    //console.log(attrs.propid);
                    var propertyId = attrs.propid;
                    var userdetails = authenticationService.GetUserDetails();
                    console.log('member id -> ' + userdetails.memberId);
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
                        if (isConfirm) {

                            propertiesService.RemoveProperty(propertyId, userdetails.memberId, userdetails.accessToken, function (data2) {

                                if (data2.IsSuccess == false) {

                                    swal({
                                        title: "Ooops Error!",
                                        text: data2.ErrorMessage,
                                        type: "warning"
                                    }, function (isConfirm) {
                                        window.location.href = '#/properties';
                                    });
                                    //alert(data.ErrorMessage);
                                }
                                if (data2.IsSuccess == true) {

                                    swal("Deleted!", "That property has been deleted.", "success");
                                    $('.propCard#property' + propertyId).fadeOut();
                                }


                            });
                        }
                        else {
                            swal("Cancelled", "No worries, this property is safe :)");
                        }
                    });
                });
            }
        }
    })


    // ADD PROPERTY Page
    .controller('addPropertyCtrl', function ($scope, $compile, authenticationService, propertiesService) {
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
                if (newIndex == 0) {
                    $('.wizard.vertical > .content').animate({ height: "22em" }, 500)
                }

                // IF going to Step 2
                if (newIndex == 1) {
                    if ($('#propertyName').val().length > 3) {
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
                            maxFileSize: 500,
                            msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                            initialPreviewShowDelete: false,
                            maxFileCount: 1,
                            maxFileSize: 250,
                            msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                            showCaption: false,
                            showUpload: false,
                            showPreview: true,
                            resizeImage: true,
                            maxImageWidth: 400,
                            maxImageHeight: 400,
                            resizePreference: 'width'
                        });


                        // event will be fired after file is selected
                        $('#addPropPicFileInput').on('fileloaded', function (event, file, previewId, index, reader) {
                            $scope.inputData.IsPropertyImageSelected = true;
                            var readerN = new FileReader();
                            //readerN.readAsText(file);
                            readerN.readAsDataURL(file);
                            readerN.onload = function (e) {
                                // browser completed reading file - display it

                                console.log(e.target.result);
                                var splittable = e.target.result.split(',');
                                var string1 = splittable[0];
                                var string2 = splittable[1];
                                //console.log(string2);
                                $scope.inputData.propertyImage = string2;
                            };
                        });


                        //none of these methods are triggering after removing selected file
                        ////event fired after deleting selected file
                        //$('#addPropPicFileInput').on('filedeleted', function (event, key) {
                        //    console.log('file removed ----XXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                        //});

                        //$('#addPropPicFileInput').on('filesuccessremove', function (event, id) {
                        //    if (some_processing_function(id)) {
                        //        console.log('Uploaded thumbnail successfully removed');
                        //    } else {
                        //        return false; // abort the thumbnail removal
                        //    }
                        //});

                        //$('#addPropPicFileInput').on('filereset', function (event) {
                        //    console.log('Uploaded thumbnail successfully removed');
                        //});

                        $('.wizard.vertical > .content').animate({ height: "32em" }, 750)
                        return true;
                    }
                    else {
                        updateValidationUi(1, null, false);
                        return false;
                    }
                }

                // IF going to Step 3
                if (newIndex == 2) {
                    $('.wizard.vertical > .content').animate({ height: "23em" }, 700)
                    setTimeout(function () {
                        $('#address1').focus();
                    }, 700);
                    return true;
                }

                // IF going to Step 4
                if (newIndex == 3) {
                    // Check Address Field
                    if ($('#address1').val().length > 4) {
                        updateValidationUi(3, 1, true);

                        // Now check City field
                        if ($('#city').val().length > 3) {
                            updateValidationUi(3, 2, true);

                            // Now check ZIP field
                            if ($('#zipCode').val().length == 5) {
                                updateValidationUi(3, 3, true);

                                setWizardContentHeight();

                                return true;
                            }
                            else {
                                updateValidationUi(3, 3, false);
                                return false;
                            }
                        }
                        else {
                            updateValidationUi(3, 2, false);
                            return false;
                        }
                    }
                    else {
                        updateValidationUi(3, 1, false);
                        return false;
                    }
                }

                // Allways allow previous action even if the current form is not valid!
                if (currentIndex > newIndex) {
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


        saveProperty = function () {
            // Send data to server
            if ($scope.inputData.IsMultiUnitProperty == true) {
                // iterating through all units

                $scope.inputData.IsSingleUnitProperty = false;
                $scope.inputData.IsMultiUnitProperty = true;

                $('#addedUnits > div').each(function (da, ht) {
                    var unitObject = {};

                    var temp = 0;
                    $(ht).find('input[type=text]').each(function (ini, dtt) {
                        //console.log(dtt);
                        temp = temp + 1;
                        if (temp == 1) {
                            unitObject.UnitNum = $(this).val();
                        }
                        if (temp == 2) {
                            unitObject.Rent = $(this).val();
                        }
                    });
                    unitObject.IsAddedWithProperty = true;
                    $scope.inputData.allUnits.push(unitObject);
                });
            }
            else {
                $scope.inputData.IsSingleUnitProperty = true;
                $scope.inputData.IsMultiUnitProperty = false;
                $scope.inputData.SingleUnitRent = $('#singleUnitRentInput').val();

                //console.log('single unit val ' + $scope.inputData.SingleUnitRent);
            }

            propertiesService.SaveProperty($scope.inputData, userdetails.memberId, userdetails.accessToken, function (data) {
                if (data.IsSuccess == false) {
                    swal({
                        title: "Ooops Error!",
                        text: data.ErrorMessage,
                        type: "warning"
                    }, function (isConfirm) {
                        window.location.href = '#/properties';
                    });
                }
                if (data.IsSuccess == true) {
                    swal({
                        title: "Awesome - Property Added",
                        text: "This property has been created successfully.  Would you like to \"publish\" this property so your tenants can pay their rent? (You can do this later, too.)",
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Yes, Publish Now",
                        cancelButtonText: "No, I'll do it later!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {

                            propertiesService.SetPropertyStatus(data.PropertyIdGenerated, true, userdetails.memberId, userdetails.accessToken, function (data2) {

                                if (data2.IsSuccess == false) {

                                    swal({
                                        title: "Ooops Error!",
                                        text: data2.ErrorMessage,
                                        type: "warning"
                                    }, function (isConfirm) {
                                        window.location.href = '#/properties';
                                    });
                                }
                                if (data2.IsSuccess == true) {

                                    swal({
                                        title: "You Got It!",
                                        text: "Your property has been published.",
                                        type: "success"
                                    }, function (isConfirm) {
                                        window.location.href = '#/properties';
                                    });
                                }

                            });

                        }
                        else {
                            swal({
                                title: "No Problem",
                                text: "Your property has NOT been published. Before tenants can pay rent for this property, you must \"publish\" it, but you can do that later at any time.",
                                type: "warning"
                            }, function (isConfirm) {
                                window.location.href = '#/properties';
                            });
                        }
                    });
                }
            });
        }

        updateValidationUi = function (step, substep, success) {
            console.log("Step: " + step + "; substep: " + substep + "; success: " + success);
            if (step == 1) {
                if (success == true) {
                    $('#propNameGrp').removeClass('has-error').addClass('has-success');
                    $('#propNameGrp .form-control-feedback').fadeIn();
                    $('#step1Feedback .alert-danger').slideUp('fast');
                }
                else {
                    $('.form-group#propNameGrp').removeClass('has-success').addClass('has-error');
                    $('#step1Feedback .alert-danger').slideDown('fast');

                    setTimeout(function () {
                        $('#propertyName').focus();
                    }, 200);
                }
            }

            else if (step == 3) {
                if (substep == 1) {
                    if (success != true) {
                        $('#addressGrp').removeClass('has-success').addClass('has-error');
                        $('#step3Feedback span').html('Please enter the <strong>street address</strong> for this property!');
                        $('#step3Feedback .alert-danger').slideDown('fast');
                        setTimeout(function () {
                            $('#address1').focus();
                        }, 200);
                    }
                }
                else if (substep == 2) {
                    if (success != true) {
                        console.log("#1 we are here!");
                        $('#addressGrp').removeClass('has-success').addClass('has-error');
                        $('#step3Feedback span').html('Please enter the <strong>city</strong> for this property!');
                        $('#step3Feedback .alert-danger').slideDown('fast');
                        setTimeout(function () {
                            $('#city').focus();
                        }, 200);
                    }
                }
                else if (substep == 3) {
                    if (success == true) {
                        $('#addressGrp').removeClass('has-error').addClass('has-success');
                        $('#step3Feedback .alert-danger').slideUp('fast');
                    }
                    else {
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
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $('#addNewProperty').addClass('animated').addClass('bounceOut');

                    // Send user back to main Properties page after exist animation completes
                    setTimeout(function () {
                        window.location.href = '#/properties';
                    }, 975);
                }
                else { }
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

            var templateUnit = "<div class=\"row m-b-15\"><div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-15\"><div class=\"fg-line\"><input type=\"text\" id=\"addUnit_Num" + $scope.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"5\"></div><label class=\"fg-label\">Unit #</label></div></div>" +
                                                         "<div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-0\"><div class=\"fg-line dollar\"><input type=\"text\" id=\"addUnit_Amnt" + $scope.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"7\"></div><label class=\"fg-label\">Rent Amount</label></div></div></div>";
            var newUnit = "#unit" + $scope.unitInputsShowing;

            $('#addedUnits').append(templateUnit);

            $compile($('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing))($scope);
            $('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing).mask("#,##0.00", { reverse: true });
        }

        function setWizardContentHeight() {
            if ($scope.unitInputsShowing > 1) {
                if ($scope.unitInputsShowing > 12) {
                    $('.wizard.vertical > .content').animate({ height: "75em" }, 600);
                }
                else if ($scope.unitInputsShowing > 10) {
                    $('.wizard.vertical > .content').animate({ height: "65em" }, 600);
                }
                else if ($scope.unitInputsShowing > 8) {
                    $('.wizard.vertical > .content').animate({ height: "60em" }, 600);
                }
                else if ($scope.unitInputsShowing > 4) {
                    $('.wizard.vertical > .content').animate({ height: "46em" }, 600);
                }
                else if ($scope.unitInputsShowing > 2) {
                    $('.wizard.vertical > .content').animate({ height: "32em" }, 600);
                }
                else {
                    $('.wizard.vertical > .content').animate({ height: "28em" }, 600);
                }
            }
            else {
                $('.wizard.vertical > .content').animate({ height: "25em" }, 700);
            }
        }
    })



    //=================================================
    // Profile
    //=================================================

    .controller('profileCtrl', function ($rootScope, $scope, $compile, growlService, getProfileService, propertiesService, authenticationService) {

        $scope.userInfo = {};

        // Get User's Info from DB
        if (authenticationService.IsValidUser() == true) {

            var userdetails = authenticationService.GetUserDetails();

            //$scope.propCount = 0;

            $scope.userInfoInSession = userdetails;

            getProfileService.GetData(userdetails.memberId, userdetails.accessToken, function (response) {
                // console.log('came in get user profile method and data -> ' + JSON.stringify(response));

                // binding user information
                $scope.userInfo.accountStatus = "Identity Verified";
                $scope.userInfo.isIdVerified = $rootScope.isIdVerified;

                $scope.userInfo.type = response.AccountType;
                $scope.userInfo.subtype = response.SubType;

                $scope.userInfo.firstName = response.FirstName;
                $scope.userInfo.lastName = response.LastName;
                $scope.userInfo.fullName = $scope.userInfo.firstName + " " + $scope.userInfo.lastName;

                $scope.userInfo.birthDay = response.DOB;
                $scope.userInfo.ssnLast4 = response.SSN;

                $scope.userInfo.mobileNumber = response.MobileNumber;
                $scope.userInfo.isPhoneVerified = response.IsPhoneVerified;

                $scope.userInfo.emailAddress = response.UserEmail;
                $scope.userInfo.isEmailVerified = response.IsEmailVerified;

                if (response.FbUrl.indexOf('.com/') > -1)
                {
                    var strippedFbId = response.FbUrl.substr(response.FbUrl.indexOf('.com/') + 5);
                    $scope.userInfo.fb = strippedFbId;
                }
                else {
                    $scope.userInfo.fb = response.FbUrl;
                }
                $scope.userInfo.twitter = response.TwitterHandle;
                $scope.userInfo.insta = response.InstaUrl;

                $scope.userInfo.address1 = response.AddressLine1;
                $scope.userInfo.addressCity = response.City;
                $scope.userInfo.addressCountry = response.Country;
                $scope.userInfo.zip = response.Zip;

                $scope.userInfo.userImage = response.UserImageUrl;
                $scope.userInfo.tenantsCount = response.TenantsCount;
                $rootScope.propCount = response.PropertiesCount;
                $scope.userInfo.propertiesCount = response.PropertiesCount;
                $scope.userInfo.unitsCount = response.UnitsCount;


                // Get Company Info
                $scope.company = {
                    name: response.CompanyName,
                    ein: response.CompanyEID
                }
            });
        }
        else {
            window.location.href = 'login.html';
        }


        // Home Layout -- JUST FOR TESTING/DEMO PURPOSES
        this.home = {
            "bnkPrmt": 0,
            "idPrmt": 1,
            "propPrmt": 0
        }

        this.goTo = function (destination) {
            if (destination == '1') {
                window.location.href = '#/profile/profile-about';
            }
            else if (destination == '2') {
                window.location.href = '#/profile/profile-bankaccounts';
            }
            else if (destination == '3') {
                window.location.href = '#/add-property';
            }
            else if (destination == 'props') {
                window.location.href = '#/properties';
            }
            else if (destination == 'hist') {
                window.location.href = '#/history';
            }
        }


        // Account Info
        this.bankCount = 2;
        this.propertyCount = 5;
        this.unitCount = 18;
        this.tenantRequests = 3;

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
            if (item === 'personalInfo') {

                var userInfo = {
                    fullName: $scope.userInfo.fullName,
                    ssnLast4: $scope.userInfo.ssnLast4,
                    birthDay: $scope.userInfo.birthDay,
                    InfoType: 'Personal'
                };

                var deviceInfo = {
                    deviceInfo: $scope.userInfoInSession.memberId,
                    AccessToken: $scope.userInfoInSession.accessToken
                };

                getProfileService.UpdateInfo(userInfo, deviceInfo, function (response) {

                    if (response.IsSuccess == true) {
                        growlService.growl('Profile info updated successfully!', 'success');
                    }
                    else {
                        growlService.growl(response.ErrorMessage, 'danger');
                    }

                });

                this.editPersonalInfo = 0;
            }

            if (item === 'businessInfo') {

                var userInfo = {
                    companyName: $scope.company.name,
                    compein: $scope.company.ein,
                    InfoType: 'Company'

                }

                var deviceInfo = {
                    deviceInfo: $scope.userInfoInSession.memberId,
                    AccessToken: $scope.userInfoInSession.accessToken
                };

                getProfileService.UpdateInfo(userInfo, deviceInfo, function (response) {

                    if (response.IsSuccess == true) {
                        growlService.growl('Company info updated successfully!', 'success');
                    }
                    else {
                        growlService.growl(response.ErrorMessage, 'danger');
                    }
                });


                this.editBusinessInfo = 0;
            }

            if (item === 'contactInfo') {

                var userInfo = {
                    email: $scope.userInfo.emailAddress,
                    mobileNum: $scope.userInfo.mobileNumber,
                    InfoType: 'Contact',
                    addressLine1: $scope.userInfo.address1,
                    twitterHandle: $scope.userInfo.twitter
                }

                var deviceInfo = {
                    deviceInfo: $scope.userInfoInSession.memberId,
                    AccessToken: $scope.userInfoInSession.accessToken
                };

                getProfileService.UpdateInfo(userInfo, deviceInfo, function (response) {

                    if (response.IsSuccess == true) {
                        growlService.growl('Contact info updated successfully!', 'success');
                    }
                    else {
                        growlService.growl(response.ErrorMessage, 'danger');
                    }
                });

                this.editContactInfo = 0;
            }

            if (item === 'socialInfo') {

                var userInfo = {
                    fb: $scope.userInfo.fb,
                    twitterHandle: $scope.userInfo.twitter,
                    InfoType: 'Social',
                    insta: $scope.userInfo.insta
                }

                var deviceInfo = {
                    deviceInfo: $scope.userInfoInSession.memberId,
                    AccessToken: $scope.userInfoInSession.accessToken
                };

                getProfileService.UpdateInfo(userInfo, deviceInfo, function (response) {
                    if (response.IsSuccess == true) {
                        growlService.growl('Social netowrk info updated successfully!', 'success');
                    }
                    else {
                        growlService.growl(response.ErrorMessage, 'danger');
                    }
                });

                this.editSocialInfo = 0;
            }
        }

        this.editProfilePic = function () {
            $('#addPic').modal();

            console.log('Edit Profile Pic function reached!');

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#profilePicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='" + $scope.userInfo.userImage + "' class='file-preview-image' alt='Profile Picture'>",
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
                uploadUrl: '',  // NEED TO ADD URL TO SERVICE FOR SAVING PROFILE PIC (SEPARATELY FROM SAVING THE REST OF THE PROFILE INFO)
                uploadExtraData: {
                    deviceInfo: $scope.userInfoInSession.memberId,
                    AccessToken: $scope.userInfoInSession.accessToken
                },
                showPreview: true,
                resizeImage: true,
                maxImageWidth: 400,
                maxImageHeight: 400,
                resizePreference: 'width'
            });
        }

        $scope.saveProfilePic = function () {
            $('#profilePicFileInput').fileinput('upload'); // This should automatically call the URL specified in 'uploadUrl' parameter above
        }

        if ($rootScope.isIdVerified == false) {
            // SINCE THIS CONTROLLER GETS CALLED ON MULTIPLE PAGES, THIS WILL ATTEMPT TO RUN THE WIZARD ON EVERY PAGE, CAUSING ERRORS SINCE IT'S
            // ONLY SUPPOSED TO RUN ON THE PROFILE-ABOUT PAGE.  THE INTENT OF THIS BLOCK WAS TO INITIATE THE MODAL W/ THE WIZARD UPON PAGE LOAD
            // ONLY WHEN ON THE PROFILE-ABOUT PAGE.  BUT I COULDN'T MOVE THE WIZARD CODE TO ANOTHER CONTROLLER BECAUSE I NEED ACCESS TO THE PROFILE
            // INFO VARIABLES ABOVE... BUT THOSE REALLY SHOULD BE SEPARATED INTO A RE-USABLE 'SERVICE' SO THAT ANY CONTROLLER CAN ACCESS THEM...
            // NEED TO WORK ON THAT...
            // runIdWizard();
        }
        this.runWizard = function () { runIdWizard(); }

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
                    $('#idVerWiz > .content').animate({ height: "27em" }, 300)

                    setTimeout(function () {

                        $('input#idVer-name').focus();

                        var dobPicker = $('#idVer-dob');
                        $compile(dobPicker)($scope);

                    }, 750)
                },
                onStepChanging: function (event, currentIndex, newIndex) {
                    if (newIndex == 0) {
                        $('#idVerWiz > .content').animate({ height: "29em" }, 500)
                    }

                    // IF going to Step 2
                    if (currentIndex == 0) {
                        // Check Name field for length
                        if ($('#idVer-name').val().length > 4) {
                            var trimmedName = $('#idVer-name').val().trim();
                            $('#idVer-name').val(trimmedName);
                            // Check Name Field for a " "
                            if ($('#idVer-name').val().indexOf(' ') > 1) {
                                updateValidationUi("name", true);

                                // Check DOB field
                                if ($('#idVer-dob').val().length == 10) {
                                    updateValidationUi("dob", true);

                                    // Check SSN field
                                    if ($('#idVer-ssn').val().length == 4) {
                                        updateValidationUi("ssn", true);

                                        // Great, we can finally go to the next step of the wizard :-]
                                        $('#idVerWiz > .content').animate({ height: "20em" }, 700)
                                        return true;
                                    }
                                    else {
                                        updateValidationUi("ssn", false);
                                    }
                                }
                                else {
                                    updateValidationUi("dob", false);
                                }
                            }
                            else {
                                updateValidationUi("name", false);
                            }
                        }
                        else {
                            updateValidationUi("name", false);
                        }

                        return false;
                    }

                    // IF going to Step 3
                    if (newIndex == 2) {
                        // Check Address field
                        if ($('#idVer-address').val().length > 4) {
                            updateValidationUi("address", true);

                            // Check ZIP code field
                            if ($('#idVer-zip').val().length == 5) {
                                updateValidationUi("zip", true);

                                // Great, go to the next step of the wizard :-]
                                $('#idVerWiz > .content').animate({ height: "26em" }, 700)
                                return true;
                            }
                            else {
                                updateValidationUi("zip", false);
                            }
                        }
                        else {
                            updateValidationUi("address", false);
                        }
                    }

                    // Allways allow previous action even if the current form is not valid!
                    if (currentIndex > newIndex) {
                        return true;
                    }
                },
                onStepChanged: function (event, currentIndex, priorIndex) {
                },
                onCanceled: function (event) {
                    cancelIdVer();
                },
                onFinishing: function (event, currentIndex) {
                    // CHECK TO MAKE SURE ALL FIELDS WERE COMPLETED

                    return true;
                },
                onFinished: function (event, currentIndex) {
                    // HIDE THE MODAL CONTAINING THE WIZARD
                    $('#idVer').modal('hide')

                    // SUBMIT DATA TO NOOCH SERVER

                    $scope.userInfo.isIdVerified = 1;
                    $rootScope.isIdVerified = 1;

                    // THEN DISPLAY SUCCESS/FAILURE ALERT...
                    swal({
                        title: "Awesome - ID Verification Submitted",
                        text: "You have successfully submitted your information.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Terrific",
                        closeOnConfirm: true,
                    });
                }
            });


            updateValidationUi = function (field, success) {
                console.log("Field: " + field + "; success: " + success);

                if (success == true) {
                    $('#' + field + 'Grp .form-group').removeClass('has-error').addClass('has-success');
                    $('#' + field + 'Grp .help-block').slideUp();
                }

                else {
                    $('#' + field + 'Grp .form-group').removeClass('has-success').addClass('has-error');

                    var helpBlockTxt = "";
                    if (field == "name") {
                        helpBlockTxt = "Please enter your full legal name.";
                    }
                    else if (field == "dob") {
                        helpBlockTxt = "Please enter your date of birth. We promise nobody ever sees this!"
                    }
                    else if (field == "ssn") {
                        helpBlockTxt = "Please enter just the LAST 4 digits of your SSN. This is used solely to protect your account."
                    }
                    else if (field == "address") {
                        helpBlockTxt = "Please enter the physical street address of where you currently live."
                    }
                    else if (field == "zip") {
                        helpBlockTxt = "Please enter the zip code for the street address above."
                    }

                    if (!$('#' + field + 'Grp .help-block').length) {
                        $('#' + field + 'Grp .form-group').append('<small class="help-block" style="display:none">' + helpBlockTxt + '</small>');
                        $('#' + field + 'Grp .help-block').slideDown();
                    }
                    else { $('#' + field + 'Grp .help-block').show() }

                    console.log()
                    // Now focus on the element that failed validation
                    setTimeout(function () {
                        $('#' + field + 'Grp input').focus();
                    }, 200)
                }

            }


            cancelIdVer = function () {
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
                    if (isConfirm) {
                    }
                    else { }
                });
            }
        }
    })


    .controller('profileAboutCtrl', function ($rootScope, $compile, getProfileService, authenticationService, $scope) {

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

    .controller('banksCtrl', function ($scope, getBanksService) {
        this.isBankAttached = true;
        $scope.bankCount = 0;

        // CLIFF (9/18/15): ADDING THIS BLOCK TO GET THE USER'S "FINGERPRINT" - NEED SERVICE TO SEND TO NOOCH DATABASE
        //                  THIS IS USED FOR SYNAPSE V3
        new Fingerprint2().get(function (result) {
            console.log(result);
        });

        this.bankList = getBanksService.getBank(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);

        this.addBank = function () {
            if ($scope.bankCount > 0) {
                var plural = "";
                if ($scope.bankCount > 1) {
                    plural = "s";
                }

                swal({
                    title: "Add A New Bank?",
                    text: "You already have " + $scope.bankCount + " bank account" + plural + " attached.  Would you like to add another?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Add New Bank",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/trans/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                        $('#bankAdd').modal({
                            keyboard: false
                        })
                    }
                    else { }
                });
            }
            else {
                $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/trans/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                $('#bankAdd').modal({
                    keyboard: false
                })
            }
        }

        this.makePrimary = function (e) {
            var bankName = $(e.target).data('bankname');
            swal({
                title: "Make " + bankName + " your Primary Bank Account?",
                text: "This will change your default bank account.  Any new properties or units you create will be assigned to your new default bank.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    swal("You Got It", bankName + " is now your primary bank account.", "success");
                }
            });
        }

        // For demo purposes to toggle First Time view on/off
        this.toggleBankView = function () {
            console.log("ToggleBankView fired, $scope.bankCount now is: " + $scope.bankCount);

            if ($scope.bankCount > 0) {
                $scope.bankCount = 0;
            }
            else {
                $scope.bankCount = 1;
            }
        }

    })

    // Delete Bank Account Popup
    .directive('deleteBank', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    console.log("DELETE BANK DIRECTIVE");
                    console.log(attrs.id);
                    var bankId = attrs.id;
                    swal({
                        title: "Are you sure?",
                        text: "You are about to delete this property from your account.  This cannot be undone.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it",
                        cancelButtonText: "No, keep it",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            swal("Deleted!", "That bank has been deleted.", "success");

                            $('.media#bank' + bankId).fadeOut();
                        }
                        else {
                            swal("Cancelled", "No worries, this bank is safe :)");
                        }
                    });
                });
            }
        }
    })



    //=================================================
    // HISTORY
    //=================================================

    .controller('historyCtrl', function ($rootScope, $scope) {

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
                            if (row.status == "Paid" || row.status == "paid" || row.status == "completed") {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Pending" || row.status == "pending") {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else {
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
                        noResults: "where are my results"
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
            confirmEmail: 1,
            connectBank: 0,
            confirmPhone: 1,
            verifyId: 0,
            addProp: 0,
            addTenant: 0,
            acceptPayment: 0,
            percentComplete: 0
        }


        if (authenticationService.IsValidUser() == true) {
            var userdetails = authenticationService.GetUserDetails();

            getProfileService.GetAccountCompletionStats(userdetails.memberId, userdetails.accessToken, function (response) {

                if (response.AllPropertysCount > 0) {
                    $scope.checklistItems.addProp = 1;
                } else {
                    $scope.checklistItems.addProp = 0;
                }

                if (response.AllTenantsCount > 0) {
                    $scope.checklistItems.addTenant = 1;
                } else {
                    $scope.checklistItems.addTenant = 0;
                }

                $scope.checklistItems.connectBank = response.IsAccountAdded;
                $scope.checklistItems.confirmEmail = response.IsEmailVerified;
                $scope.checklistItems.confirmPhone = response.IsPhoneVerified;
                $scope.checklistItems.verifyId = response.IsIDVerified;
                $rootScope.isIdVerified = $scope.checklistItems.verifyId; // Also updating the RootScope
                $scope.checklistItems.acceptPayment = response.IsAnyRentReceived;


                $scope.checklistItems.percentComplete = ((($scope.checklistItems.confirmEmail + $scope.checklistItems.confirmPhone + $scope.checklistItems.verifyId +
                             $scope.checklistItems.connectBank + $scope.checklistItems.addProp + $scope.checklistItems.addTenant + $scope.checklistItems.acceptPayment)
                             / 7) * 100).toFixed(0);

                console.log('percent profile ' + $scope.checklistItems.percentComplete);
            });
        }
        else {
            window.location.href = 'login.html';
        }


        $scope.ResendVerificationEmailOrSMS = function (sendWhat) {
            var userdetails = authenticationService.GetUserDetails();
            getProfileService.ResendVerificationEmailOrSMS(userdetails.memberId, "Landlord", sendWhat, function (response) {
                if (response.isSuccess && response.isSuccess == true) {
                    if (sendWhat == "Email") {
                        swal({
                            title: "Hurray!",
                            text: "We just sent a verification link, please check your email and click the link to verify your email address.",
                            type: "success"
                        });
                    }
                    if (sendWhat == "SMS") {
                        swal({
                            title: "Hurray!",
                            text: "We just sent you a text message, please check your phone and reply \"Go\" to the text (case doesn't matter).",
                            type: "success"
                        });
                    }
                }
                else {
                    var msgtxt = "";
                    if (response.ErrorMessage.indexOf('Already Activated') > -1) {
                        msgtxt = "Looks like your account is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    else if (response.ErrorMessage.indexOf('Already Verified') > -1) {
                        msgtxt = "Looks like your phone number is already verified! If you continue to see messages saying your email is not verified, please contact Nooch support so we can straighten things out!";
                    }
                    swal({
                        title: "Oh no!",
                        text: response.ErrorMessage,
                        type: "warning"
                    });
                }
            });
        };

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

    .controller('loginCtrl', function ($scope, authenticationService) {
        //Status

        this.login = 1,
        this.register = 0;
        this.forgot = 0;

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $scope.LoginData = {
            password: '',
            username: '',
            forgotPassword: ''
        };

        $scope.SignupData = {
            firstName: '',
            lastName: '',
            eMail: '',
            pass: ''
        };


        $scope.ValidateEmail = function (str) {

            var at = "@"
            var dot = "."
            var lat = str.indexOf(at)
            var lstr = str.length
            var ldot = str.indexOf(dot)

            if (lat == -1 || lat == 0 || lat == lstr) {
                return false
            }

            if (ldot == -1 || ldot == 0 || ldot == lstr) {
                return false
            }

            if (str.indexOf(at, (lat + 1)) != -1) {
                return false
            }

            if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) {
                return false
            }

            if (str.indexOf(dot, (lat + 2)) == -1) {
                return false
            }

            if (str.indexOf(" ") != -1) {
                return false
            }

            return true
        };


        this.loginAttmpt = function () {

            // window.location.href = 'index.html#/profile/profile-about'; // FOR TESTING LOCALLY B/C AUTHENTICATION SERVICE WON'T WORK

            // Check Username (email) field for length
            if ($('form#login #username').val()) {
                var trimmedUserName = $('form#login #username').val().trim();
                $('form#login #username').val(trimmedUserName);

                // Check Name Field for a "@"
                if ($scope.ValidateEmail($('form#login #username').val())) {

                    updateValidationUi("username", true);

                    // Check Password field
                    if ($('form#login #pw').val().length > 4) {
                        updateValidationUi("pw", true);

                        // ADD THE LOADING BOX
                        $('form#login').block({
                            message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Attempting login...</span>',
                            css: {
                                border: 'none',
                                padding: '26px 10px 23px',
                                backgroundColor: '#000',
                                '-webkit-border-radius': '12px',
                                '-moz-border-radius': '12px',
                                'border-radius': '12px',
                                opacity: '.8',
                                width: '86%',
                                left: '7%',
                                top: '25px',
                                color: '#fff'
                            }
                        });

                        authenticationService.ClearUserData();

                        authenticationService.Login($scope.LoginData.username, $scope.LoginData.password, function (response) {

                            $('form#login').unblock();

                            if (response.IsSuccess == true) {
                                authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.AccessToken);
                                window.location.href = 'index.html#/profile/profile-about';
                            }
                            else {
                                swal({
                                    title: "Oh No!",
                                    text: "Looks like either your email or password was incorrect.  Please try again.",
                                    type: "error"
                                });
                                console.log('Sign In Error: ' + response.ErrorMessage);
                            }
                        });
                    }
                    else {
                        updateValidationUi("pw", false);
                    }
                }
                else {
                    updateValidationUi("username", false);
                }
            }
            else {
                updateValidationUi("username", false);
            }

        }


        this.forgotPwAttmpt = function () {
            var email = $scope.LoginData.forgotPassword;

            if ($scope.ValidateEmail(email)) {
                updateValidationUi("emforgot", true);

                // ADD THE LOADING BOX
                $('form#forgotpw').block({
                    message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Submitting Reset PW Request...</span>',
                    css: {
                        border: 'none',
                        padding: '26px 10px 23px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '12px',
                        '-moz-border-radius': '12px',
                        'border-radius': '12px',
                        opacity: '.8',
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
                    else { // This will just be for a general server error where the server doesn't return any 'success' parameter at all
                        swal({
                            title: "Oh No!",
                            text: "Looks like we ran into a little trouble processing your request. Please try again or contact support@nooch.com for more help.",
                            type: "error"
                        });
                    }
                });
            }
            else {
                updateValidationUi("emforgot", false);
            }
        }


        this.registerAttmpt = function () {

            var regForm = $('form#reg');
            var fName = $('form#reg #fname');
            var lName = $('form#reg #lname');
            var email = $('form#reg #em');
            var pw = $('form#reg #pwreg');

            // Check Name fields for length
            if (fName.val() && fName.val().length > 1) {
                updateValidationUi("fname", true);

                var trimmedFName = capitalize(fName.val().trim());
                $('form#reg #fname').val(trimmedFName);

                if (lName.val() && lName.val().length > 1) {
                    updateValidationUi("lname", true);

                    var trimmedLName = lName.val().trim();
                    $('form#reg #lname').val(trimmedLName);

                    // Validate Email Field
                    if ($scope.ValidateEmail(email)) {
                        updateValidationUi("em", true);

                        // Check Password field
                        if (pw.val().length > 4) {
                            updateValidationUi("pwreg", true);

                            // Finally, check if the Terms of Service box is checked
                            if ($('#tosboxGrp input').prop('checked')) {
                                updateValidationUi("tosbox", true);

                                // ADD THE LOADING BOX
                                regForm.block({
                                    message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Creating Account...</span>',
                                    css: {
                                        border: 'none',
                                        padding: '26px 10px 23px',
                                        backgroundColor: '#000',
                                        '-webkit-border-radius': '12px',
                                        '-moz-border-radius': '12px',
                                        'border-radius': '12px',
                                        opacity: '.8',
                                        width: '86%',
                                        left: '7%',
                                        top: '25px',
                                        color: '#fff'
                                    }
                                });

                                // Now call service to register a new Landlord user
                                authenticationService.RegisterLandlord($scope.SignupData.firstName, $scope.SignupData.lastName, $scope.SignupData.eMail, $scope.SignupData.pass, function (response) {

                                    regForm.unblock();

                                    // Cliff (9/10/15): Users should be automatically logged in after creating an account... send them to the Home page.
                                    if (response.IsSuccess == true) {
                                        var username = $scope.SignupData.eMail;
                                        var pw = $scope.SignupData.pass;

                                        $scope.SignupData.firstName = '';
                                        $scope.SignupData.lastName = '';
                                        $scope.SignupData.eMail = '';
                                        $scope.SignupData.pass = '';

                                        swal({
                                            title: "Great Success",
                                            text: 'Congrats - you have successfully registered your brand new Nooch account. Click below to dive in and start Nooching!',
                                            type: "success",
                                            confirmButtonColor: "#3FABE1",
                                            confirmButtonText: "Let's Go"
                                        }, function (isConfirm) {
                                            // Now log the user in & send to home page.

                                            // Add another loading box while we log the user in
                                            regForm.block({
                                                message: '<span><i class="fa fa-refresh fa-spin fa-loading"></i></span><br/><span class="loadingMsg">Logging in...</span>',
                                                css: {
                                                    border: 'none',
                                                    padding: '26px 10px 23px',
                                                    backgroundColor: '#000',
                                                    '-webkit-border-radius': '12px',
                                                    '-moz-border-radius': '12px',
                                                    'border-radius': '12px',
                                                    opacity: '.8',
                                                    width: '86%',
                                                    left: '7%',
                                                    top: '25px',
                                                    color: '#fff'
                                                }
                                            });

                                            authenticationService.ClearUserData();

                                            authenticationService.Login(username, pw, function (response) {

                                                regForm.unblock();

                                                if (response.IsSuccess == true) {
                                                    authenticationService.SetUserDetails(username, response.MemberId, response.AccessToken);
                                                    window.location.href = 'index.html#/home';
                                                }
                                                else // Should never not be successful... the user would have *just* created their account
                                                {
                                                    console.log('Sign In Error: ' + response.ErrorMessage);

                                                    swal({
                                                        title: "Oh No!",
                                                        text: "Looks like we had some trouble logging you in.  Very sorry about this!  Please try again.",
                                                        type: "error"
                                                    });
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        swal({
                                            title: "Oh No!",
                                            text: "Looks like we had some trouble creating your account.  We hate it whent this happens.  Please try again or contact support@nooch.com for more help.",
                                            type: "error"
                                        });
                                    }
                                });
                            }
                            else {
                                updateValidationUi("tosbox", false);
                            }
                        }
                        else {
                            updateValidationUi("pwreg", false);
                        }
                    }
                    else {
                        updateValidationUi("em", false);
                    }
                }
                else {
                    updateValidationUi("lname", false);
                }
            }
            else {
                updateValidationUi("fname", false);
            }
        }

        // This function checks a field on focusout (when the user moves to the next field) and updates Validation UI accordingly
        $(document).ready(function () {
            $(document).on("focusout", "form#reg input", function () {
                var field = this.id;

                if ($(this).val() && $(this).val().length > 2) {
                    if (field == "em") {
                        if ($scope.ValidateEmail(email)) {
                            updateValidationUi("em", true);
                        }
                    }
                    else {
                        updateValidationUi(field, true);
                    }
                }
            })
        })


        // Utility Function To Update Form Input's UI for Success/Error (Works for all forms on the Property Details page...like 4 of them)
        updateValidationUi = function (field, success) {
            console.log("Field: " + field + "; success: " + success);

            if (success == true) {
                $('#' + field + 'Grp').removeClass('has-error').addClass('has-success');
                if ($('#' + field + 'Grp .help-block').length) {
                    $('#' + field + 'Grp .help-block').slideUp();
                }
            }
            else {
                $('#' + field + 'Grp').removeClass('has-success').addClass('has-error');

                var helpBlockTxt = "";

                if (field == "username" || field == "em" || field == "emforgot") {
                    helpBlockTxt = "Please enter your full email address.";
                }
                else if (field == "pw") {
                    helpBlockTxt = "Please enter your password!"
                }
                else if (field == "fname") {
                    helpBlockTxt = "Please enter your first name."
                }
                else if (field == "lname") {
                    helpBlockTxt = "Please enter your last name."
                }
                else if (field == "pwreg") {
                    helpBlockTxt = "Please create a strong password."
                }
                else if (field == "tosbox") {
                    helpBlockTxt = "Please read and agree to Nooch's Terms of Service to create your account."
                }

                if (!$('#' + field + 'Grp .help-block').length) {
                    $('#' + field + 'Grp').append('<small class="help-block pull-left" style="display:none">' + helpBlockTxt + '</small>');
                    $('#' + field + 'Grp .help-block').slideDown();
                }
                else { $('#' + field + 'Grp .help-block').show() }

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
                            if (row.status == "Pending" || row.status == "pending") {
                                return "<button data-target=\"#test123\" data-toggle=\"modal\" type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\" title=\"Approve\"><span class=\"md md-check c-green\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-close c-red\"></span></button>";
                            }
                            else if (row.status == "Approved" || row.status == "approved") {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-verified-user c-blue\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-mail\"></span></button>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<button type=\"button\" class=\"btn btn-icon btn-default m-r-15\" data-row-id=\"" + row.id + "\"><span class=\"md md-undo c-orange\"></span></button> " +
                                       "<button type=\"button\" class=\"btn btn-icon btn-default\" data-row-id=\"" + row.id + "\"><span class=\"md md-report c-red\"></span></button>";
                            }
                        },
                        "dateColumn": function (column, row) {
                            return "<span>" + row.dateSubmitted + "</span>";
                        },
                        "status": function (column, row) {
                            if (row.status == "Pending" || row.status == "pending") {
                                return "<span class=\"label label-warning\">" + row.status + "</span>";
                            }
                            else if (row.status == "Approved" || row.status == "approved") {
                                return "<span class=\"label label-success\">" + row.status + "</span>";
                            }
                            else if (row.status == "Rejected" || row.status == "rejected") {
                                return "<span class=\"label label-danger\">" + row.status + "</span>";
                            }
                            else {
                                return "<span class=\"label label-default\">" + row.status + "</span>";
                            }
                        },
                        "user": function (column, row) {
                            return "<div class=\"media\"><div class=\"pull-left\"><img class=\"tableUserPic\" src=\"img/profile-pics/" + row.id + ".jpg\"></div><div class=\"media-body\"><div class=\"lv-title\">" + row.user + "</div><small class=\"lv-small\">" + row.email + "</small></div></div>";
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

                if (number.length == 10) {
                    var first3 = number.slice(0, 3);
                    var second3 = number.slice(3, 6);
                    var last4 = number.slice(6);

                    number = "(" + first3 + ") " + second3 + "-" + last4;
                }
                return number;
            }) : '';
        }
    })
