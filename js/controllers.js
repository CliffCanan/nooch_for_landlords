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
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
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
        this.sidebarStat = function(event) {
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

        this.closeSearch = function(){
            angular.element('#header').removeClass('search-toggled');
        }
        
        // Get Notifications for header
        this.img = messageService.img;
        this.user = messageService.user;
        this.user = messageService.text;

        this.messageResult = messageService.getMessage(this.img, this.user, this.text);

        // Clear Notification  (part of default template)
        this.clearNotification = function($event) {
            $event.preventDefault();
            
            var x = angular.element($event.target).closest('.listview');
            var y = x.find('.lv-item');
            var z = y.size();
            
            angular.element($event.target).parent().fadeOut();
            
            x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
            x.find('.grid-loading').fadeIn(1500);
            var w = 0;
            
            y.each(function(){
                var z = $(this);
                $timeout(function(){
                    z.addClass('animated fadeOutRightBig').delay(1000).queue(function(){
                        z.remove();
                    });
                }, w+=150);
            })
            
            $timeout(function(){
                angular.element('#notifications').addClass('empty');
            }, (z*150)+200);
        }

        // Logout
        this.logout = function () {
            swal({
                title: "Are you sure?",
                text: "All your saved localStorage values will be removed",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Yes - Logout",
                cancelButtonText: "No - Stay Logged In",
                closeOnConfirm: false
            }, function (isConfirm) {
                if (isConfirm)
                {
                    localStorage.clear();
                    window.location.href = 'login.html';
                }
            });
        }

        // Fullscreen View (part of default template)
        this.fullScreen = function() {
            //Launch
            function launchIntoFullscreen(element) {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
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

    .controller('todoCtrl', function(todoService){
        
        //Get Todo List Widget Data
        this.todo = todoService.todo;
        
        this.tdResult = todoService.getTodo(this.todo);
        
        //Add new Item (closed by default)
        this.addTodoStat = 0;
        
        //Dismiss
        this.clearTodo = function(event) {            
            this.addTodoStat = 0;
            this.todo = '';
        }
    })


    // ===============================================================
    // Recent Items Widget (Came with default Template)
    // ===============================================================

    .controller('recentitemCtrl', function(recentitemService){
        
        //Get Recent Items Widget Data
        this.id = recentitemService.id;
        this.name = recentitemService.name;
        this.parseInt = recentitemService.price;
        
        this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
    })


    // ===============================================================
    //      PROPERTIES
    // ===============================================================
    
    .controller('propertiesCtrl', function ($scope, authenticationService, propertiesService, propDetailsService, $timeout)
    {
        var userdetails = authenticationService.GetUserDetails();
        

        $scope.propCount = 0;
        $scope.propResult = new Array();
       // this.propResult = propertiesService.getProperties(this.id, this.img, this.propName, this.address, this.units, this.tenants);

        // For setting the 'Selected Prop' when going to a Property's Details page
        $scope.selectedPropId = "";
        $scope.setSelectedId = function ($event) {
            $scope.selectedPropId = $event.target.id;

            propDetailsService.set($scope.selectedPropId);
            window.location.href = '#/property-details';
        }

        // Just for toggling views for demo purposes...
        $scope.firstTimeView = 0;
        $scope.propsAddedAlreadyView = 1;


        getProperties = function() {
            //console.log('get properties called user details -> ' + userdetails.memberId + ' ' + userdetails.accessToken);

            propertiesService.GetProperties(userdetails.memberId, userdetails.accessToken, function(data) {
                if (data.IsSuccess==true) {
                    // data binding goes in here

                    $scope.propCount = data.AllProperties.length;
                    var index;
                    for (index = 0; index < data.AllProperties.length; ++index) {
                        console.log(data.AllProperties[index]);
                        var propItem = {
                            id: data.AllProperties[index].PropertyId,
                            img: data.AllProperties[index].PropertyImage,
                            address: data.AllProperties[index].AddressLineOne,
                            units: data.AllProperties[index].UnitsCount,
                            tenants: data.AllProperties[index].TenantsCount

                    };
                        $scope.propResult.push(propItem);
                    }
                    //console.log('items count ' + $scope.propCount);
                    //console.log('items [0]' + $scope.propResult[0]);


                }
            });


        };

        $timeout(function () { getProperties(); }, 1000);

        

    })

    // PROPERTY DETAILS CONTROLLER
    .controller('propDetailsCtrl', function ($compile, $scope, propertiesService, propDetailsService, getTenantsService, growlService) {
        //this.propResult = propertiesService.getProperties(this.id, this.img, this.propName, this.address, this.units, this.tenants);

        //this.getSelectedProp = propDetailsService.get();
        //this.getSelectedProp2 = propDetailsService.get2();

        $scope.selectedProperty = {
            "published": 1,
            "name": "Haverford Towers",
            "address1": "123 County Line Rd",
            "address2": "",
            "city": "Philadelphia",
            "state": "PA",
            "zip": "19123",
            "contactNumber": "(215) 321-9876",
            "imgUrl": "2.png",
            "units": 9,
            "tenants": 15,
            "pastDue": 3,
            "defaultBankName": "Bank of America",
            "defaultBankNickname": "Business Checking - 9876"
        }

        this.editPropInfo = 0;
        this.updatePropInfo = function()
        {
            this.editPropInfo = 0;
            growlService.growl('Property info updated Successfully!', 'success');
        }

        this.editPropPic = function () {
            $('#editPropPic').modal();

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#propPicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='/img/property-pics/" + $scope.selectedProperty.imgUrl + "' class='file-preview-image' alt='Desert' title='Desert'>",
                ],
                initialCaption: $scope.selectedProperty.imgUrl,
                initialPreviewShowDelete: false,
                layoutTemplates: {
                    icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                },
                maxFileSize: 500,
                msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                showUpload: false,
            });
        }

        // Get list of Tenants for this Property
        $scope.tenantList = getTenantsService.getTenants(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);


        // Edit Published State (Whether the property should be publicly listed or not)
        this.dropdownPublishedState = function ()
        {
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
            }, function (isConfirm)
            {
                if (isConfirm)
                {
                    if (!isAlreadyPublished)
                    {
                        setIsPublished(1);
                        swal({
                            title: "You Got It!",
                            text: "Your property has been published.",
                            type: "success",
                        });
                    }
                }
                else
                {
                    if (isAlreadyPublished)
                    {
                        setIsPublished(0);
                        swal({
                            title: "No Problem",
                            text: "Your property has been hidden. Before tenants can pay rent for this property, you must publish it.",
                            type: "success",
                        });
                    }
                    else
                    {
                        swal({
                            title: "No Problem",
                            text: "Your property will remain hidden. Before tenants can pay rent for this property, you must publish it.",
                            type: "warning",
                        });
                    }
                }
            });
        }

        function setIsPublished(newStatus) {
            $scope.$apply(function () {
                $scope.selectedProperty['published'] = newStatus;
            });
        }

        // Charge Tenant Button
        this.chargeTenant = function (e) {
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

        this.chargeTenant_Submit = function ()
        {
            // Check Name field for length
            if ($('#chargeTenantForm #tenant').val())
            {
                var trimmedName = $('#chargeTenantForm #tenant').val().trim();
                $('#chargeTenantForm #tenant').val(trimmedName);

                // Check Name Field for a " "
                if ($('#chargeTenantForm #tenant').val().indexOf(' ') > 1)
                {
                    updateValidationUi("tenant", true);

                    // Check Amount field
                    if ($('#chargeTenantForm #amount').val().length > 4 &&
                        $('#chargeTenantForm #amount').val() > 10)
                    {
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
            else
            {
                updateValidationUi("tenant", false);
            }
        }


        // Add Unit Button
        $scope.addUnit = function ()
        {
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
            }, 600)
        }

        this.addUnit_submit = function ()
        {
            // Check Unit Number field for length
            if ($('#addUnitModal #unitNum').val().length > 0)
            {
                var trimmedName = $('#addUnitModal #unitNum').val().trim();
                $('#addUnitModal #unitNum').val(trimmedName);
                updateValidationUi("unitNum", true);

                // Now check Monthly Rent Amount field
                if ($('#addUnitModal #monthlyRent').val().length > 4)// &&
                    //$('#addUnitModal #monthlyRent').val() > 100)
                {
                    updateValidationUi("monthlyRent", true);

                    $('#addUnitModal').modal('hide');

                    // Finally, submit the data and display success alert
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
                        if (!isConfirm)
                        {
                            $scope.addUnit();
                        }
                    });
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


        // Send Message Modal
        this.sendMsg = function(howMany)
        {
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

            if (howMany == "all")
            {
                $('#sndMsgForm .well div').text('Enter a message below.  This will be emailed to ALL tenants for this property.');
                $('#sndMsgForm #tenantMsgGrp').addClass('hidden');
            }
            else if (howMany == "1")
            {
                $('#sndMsgForm .well div').text('Enter your message and select a tenant to send it to.');
                $('#sndMsgForm #tenantMsgGrp').removeClass('hidden');
            }

            $('#sendMsgModal').modal();
        }

        this.sendMsg_submit = function ()
        {
            if ((!$('#sndMsgForm #tenantMsgGrp').hasClass('hidden') && $('#sndMsgForm #tenantMsg').val() != '0') ||
                  $('#sndMsgForm #tenantMsgGrp').hasClass('hidden'))
            {
                // Check Message field for length
                if ($('#sndMsgForm textarea').val().length > 1)
                {
                    var trimmedMsg = $('#sndMsgForm textarea').val().trim();
                    $('#sndMsgForm textarea').val(trimmedMsg);
                    updateValidationUi("msg", true);

                    $('#sendMsgModal').modal('hide');

                    // Finally, submit the data and display success alert
                    swal({
                        title: "Message Sent",
                        text: "Your message was sent successfully.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3FABE1",
                        confirmButtonText: "Great",
                        closeOnConfirm: true,
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
        this.editAchMemo = function ()
        {
            // Reset each field
            $('#achMemoGrp').removeClass('has-error').removeClass('has-success');

            if ($('#achMemoGrp .help-block').length) {
                $('#achMemoGrp .help-block').slideUp();
            }

            $('#editAchModal').modal();
        }

        this.editAchMemo_submit = function ()
        {
            if ($('#editAchModal input[name=achMemoStyle]:checked').length)
            {
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
            else
            {
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

    // FOR PROPERTY DETAILS TABLE
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
    .directive('deleteProp', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    //console.log("DELETE PROPERTY DIRECTIVE");
                    //console.log(element);
                    //console.log(attrs.propid);
                    var propertyId = attrs.propid;
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
                            swal("Deleted!", "That property has been deleted.", "success");

                            $('.propCard#property' + propertyId).fadeOut();
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
    .controller('addPropertyCtrl', function ($scope, $compile, authenticationService,propertiesService) {
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
            onInit: function (event, curretIndex)
            {
                $compile($('.wizard.vertical > .content'))($scope);

                setTimeout(function () {
                    $('#propertyName').focus();
                }, 900);

                $scope.unitInputsShowing = 0;
            },
            onStepChanging: function (event, currentIndex, newIndex)
            {
                if (newIndex == 0)
                {
                    $('.wizard.vertical > .content').animate({ height: "22em" }, 500)
                }

                // IF going to Step 2
                if (newIndex == 1)
                {
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
                            showUpload: false
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
                if (currentIndex > newIndex) {
                    return true;
                }
            },
            onStepChanged: function (event, currentIndex, priorIndex)
            {
                if (currentIndex == 3) // Final Step
                {
                    setTimeout(function ()
                    {
                        var $singleUnitClick = $('#singleUnit').attr('data-ng-click', 'selectSingleUnit()');
                        $compile($singleUnitClick)($scope);

                        var $multiUnitClick = $('#multiUnit').attr('data-ng-click', 'selectMultiUnit()');
                        $compile($multiUnitClick)($scope);

                    }, 200);
                }
            },
            onCanceled: function (event)
            {
                cancelAddProp();
            },
            onFinished: function (event, currentIndex) {
                saveProperty();
                
            }
        });


        saveProperty = function() {
            // time to save data to server

            if ($scope.inputData.IsMultiUnitProperty == true) {
                // iterating through all units


                $scope.inputData.IsSingleUnitProperty = false;
                $scope.inputData.IsMultiUnitProperty = true;


                $('#addedUnits > div').each(function(da, ht) {
                    var unitObject = {};
                    
                    var temp = 0;
                    $(ht).find('input[type=text]').each(function(ini, dtt) {
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

            } else {
                $scope.inputData.IsSingleUnitProperty = true;
                $scope.inputData.IsMultiUnitProperty = false;
                $scope.inputData.SingleUnitRent = $('#singleUnitRentInput').val();
                console.log('single unit val ' + $scope.inputData.SingleUnitRent);

                
            }

            propertiesService.SaveProperty($scope.inputData, userdetails.memberId, userdetails.accessToken, function(data) {
              if (data.IsSuccess == false) {
             
                    swal({
                        title: "Ooops Error!",
                        text: data.ErrorMessage,
                        type: "warning"
                    }, function (isConfirm) {
                        window.location.href = '#/properties';
                    });
                    //alert(data.ErrorMessage);
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


                            propertiesService.SetPropertyStatus(data.PropertyIdGenerated, true, userdetails.memberId,userdetails.accessToken, function (data2) {

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

        updateValidationUi = function (step, substep, success)
        {
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

            else if (step == 3)
            {
                if (substep == 1)
                {
                    if (success != true) {
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
                else if (substep == 3)
                {
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

            setTimeout(function() {
                $('#multiUnit').addClass('hidden');

                $('#singleUnit').css({
                    "width": "52%",
                    "margin-left": "24%"
                });

                $('#singleUnit-rentAmountBlock').removeClass('hidden');
                $('#singleUnit-rentAmountBlock').addClass('fadeIn');

                $('#singleUnit-rentAmountBlock input').mask("#,##0.00", { reverse: true });

                setTimeout(function() {
                    $('#singleUnit-rentAmountBlock input').focus();
                }, 1000);

            }, 750);
        }

        $scope.selectMultiUnit = function ()
        {

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
            setTimeout(function() {
                $('#addUnitContainer').removeClass('hidden');
                $('#addUnitContainer').fadeIn();
            }, 800);
        }

        this.addUnit = function () {
            $scope.unitInputsShowing += 1;

            setWizardContentHeight();

            var templateUnit = "<div class=\"row m-b-15\"><div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-15\"><div class=\"fg-line\"><input type=\"text\" id=\"addUnit_Num"+ $scope.unitInputsShowing +"\" class=\"form-control fg-input\" maxlength=\"5\"></div><label class=\"fg-label\">Unit #</label></div></div>" +
                                                         "<div class=\"col-xs-6\"><div class=\"fg-float form-group p-r-20 m-b-10 m-l-0\"><div class=\"fg-line dollar\"><input type=\"text\" id=\"addUnit_Amnt" + $scope.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"7\"></div><label class=\"fg-label\">Rent Amount</label></div></div></div>";
            var newUnit = "#unit" + $scope.unitInputsShowing;

            $('#addedUnits').append(templateUnit);

            $compile($('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing))($scope);
            $('#addedUnits input#addUnit_Amnt' + $scope.unitInputsShowing).mask("#,##0.00", { reverse: true });
        }

        function setWizardContentHeight() {
            if ($scope.unitInputsShowing > 1)
            {
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

    .controller('profileCtrl', function ($rootScope, $scope, $compile, growlService, getProfileService, authenticationService) {
        
        //Get Profile Information from profileService Service (NOT BUILT YET)
        // Get User Info
        //this.accountStatus = "Identity Verified";
        //this.isIdVerified = $rootScope.isIdVerified;
        //this.type = "Landlord";
        //this.subtype = "Basic";
        //this.firstName = "Josh";
        //this.lastName = "Hamilton";
        //this.fullName = this.firstName + " " + this.lastName;
        //this.birthDay = "08/05/1988";
        //this.mobileNumber = "(215) 711-6789";
        //this.isPhoneVerified = 1;
        //this.emailAddress = "josh.h@nooch.com";
        //this.isEmailVerified = 1;
        //this.fb = "NoochMoney";
        //this.twitter = "@NoochMoney";
        //this.insta = "NoochMoney";
        //this.address1 = "1098 ABC Towers";
        //this.addressCity = "Philadelphia, PA";
        //this.addressCountry = "United States";
        //this.zip = "27708";
        //this.ssnLast4 = "7654";
        //this.userPic = "josh";

        $scope.userInfo = {};
        //// Getting user info from db
        if (authenticationService.IsValidUser() == true) {
            var userdetails = authenticationService.GetUserDetails();
            getProfileService.GetData(userdetails.memberId, userdetails.accessToken, function(response) {
                console.log('came in get user profile method and data -> ' + JSON.stringify(response));

                // binding user information
                $scope.userInfo.type = response.AccountType;
              

                $scope.userInfo.subtype = response.SubType;
                $scope.userInfo.firstName = response.FirstName;
               // console.log('user name -> ' + $scope.userInfo.firstName);
                $scope.userInfo.lastName = response.LastName;
                $scope.userInfo.fullName = $scope.userInfo.firstName + " " + $scope.userInfo.lastName;
                $scope.userInfo.birthDay = response.DOB;
                $scope.userInfo.mobileNumber = response.MobileNumber;

                $scope.userInfo.isPhoneVerified = response.IsPhoneVerified;
                $scope.userInfo.emailAddress = response.UserEmail;
                $scope.userInfo.isEmailVerified = response.IsEmailVerified;
                $scope.userInfo.fb = response.FbUrl;
                $scope.userInfo.twitter = response.TwitterHandle;


                $scope.userInfo.insta = response.InstaUrl;
                $scope.userInfo.address1 = response.AddressLine1;
                $scope.userInfo.addressCity = response.City;
                $scope.userInfo.addressCountry = response.Country;
                $scope.userInfo.zip = response.Zip;
                $scope.userInfo.ssnLast4 = response.SSN;
                $scope.userInfo.userPic = "josh";

                // Get Company Info
                $scope.company = {
                    name: response.CompanyName,
                    ein: response.CompanyEID
            }


            });

            


        } else {
            window.location.href = 'login.html';
        }

        //console.log('user account type after -> ' );
        // Get User Info
        this.accountStatus = "Identity Verified";
        this.isIdVerified = $rootScope.isIdVerified;
        
        
       
      
       

        // Home Layout -- JUST FOR TESTING/DEMO PURPOSES
        this.home = {
            "bnkPrmt": 0,
            "idPrmt": 1,
            "propPrmt": 0
        }

        this.goTo = function(destination) {
            if (destination == '1') {
                window.location.href = '#/profile/profile-about';
            }
            else if (destination == '2') {
                window.location.href = '#/profile/profile-bankaccounts';
            }
            else if (destination == '3') {
                window.location.href = '#/add-property';
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
        }
        this.beginEditingCompany = function () {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 1;
            this.editContactInfo = 0;
            this.editSocialInfo = 0;
            $('input#compName').focus();
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
        this.cancel = function ()
        {
            this.editPersonalInfo = 0;
            this.editBusinessInfo = 0;
            this.editContactInfo = 0;
            this.editSocialInfo = 0;
        }
        this.submit = function (item, message)
        {
            if (item === 'personalInfo') {
                this.editPersonalInfo = 0;
            }

            if (item === 'businessInfo') {
                this.editBusinessInfo = 0;
            }

            if (item === 'profileContact') {
                this.editContactInfo = 0;
            }

            if (item === 'socialInfo') {
                this.editSocialInfo = 0;
            }

            growlService.growl(message + ' has updated Successfully!', 'success'); 
        }

        this.editProfilePic = function () {
            $('#editProfilePic').modal();

            // FILE INPUT DOCUMENTATION: http://plugins.krajee.com/file-input#options
            $("#profilePicFileInput").fileinput({
                allowedFileTypes: ['image'],
                initialPreview: [
                    "<img src='/img/profile-pics/" + "josh.png" + "' class='file-preview-image' alt='Desert' title='Desert'>",
                ],
                initialCaption: 'josh.png',
                initialPreviewShowDelete: false,
                layoutTemplates: {
                    icon: '<span class="md md-panorama m-r-10 kv-caption-icon"></span>',
                },
                maxFileSize: 500,
                msgSizeTooLarge: "File '{name}' ({size} KB) exceeds the maximum allowed file size of {maxSize} KB. Please try a slightly smaller picture!",
                showUpload: false,
            });
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

                    },750)
                },
                onStepChanging: function (event, currentIndex, newIndex) {
                    if (newIndex == 0) {
                        $('#idVerWiz > .content').animate({ height: "29em" }, 500)
                    }

                    // IF going to Step 2
                    if (currentIndex == 0) {
                        // Check Name field for length
                        if ($('#idVer-name').val().length > 4)
                        {
                            var trimmedName = $('#idVer-name').val().trim();
                            $('#idVer-name').val(trimmedName);
                            // Check Name Field for a " "
                            if ($('#idVer-name').val().indexOf(' ') > 1)
                            {
                                updateValidationUi("name", true);

                                // Check DOB field
                                if ($('#idVer-dob').val().length == 10)
                                {
                                    updateValidationUi("dob", true);

                                    // Check SSN field
                                    if ($('#idVer-ssn').val().length == 4)
                                    {
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
                onFinishing: function (event, currentIndex) 
                {
                    // CHECK TO MAKE SURE ALL FIELDS WERE COMPLETED

                    return true; 
                },
                onFinished: function (event, currentIndex) 
                {
                    // HIDE THE MODAL CONTAINING THE WIZARD
                    $('#idVer').modal('hide')

                    // SUBMIT DATA TO NOOCH SERVER

                    // THEN DISPLAY SUCCESS/FAILURE ALERT...
                    swal({
                        title: "Awesome - ID Verification Submitted",
                        text: "You have successfully submitted your information.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#3fabe1",
                        confirmButtonText: "Terrific",
                        closeOnConfirm: true,
                    }, function () {
                    });
                }
            });


            updateValidationUi = function (field, success) {
                console.log("Field: " + field + "; success: " + success);

                if (success == true)
                {
                    $('#' + field + 'Grp .form-group').removeClass('has-error').addClass('has-success');
                    $('#' + field + 'Grp .help-block').slideUp();
                }

                else
                {
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
                    },200)
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


    .controller('profileAboutCtrl', function ($rootScope, $compile,getProfileService, authenticationService, $scope) {
        
    //    $scope.userInfo = {};
    //    // Getting user info from db
    //    if (authenticationService.IsValidUser() == true) {
    //        var userdetails = authenticationService.GetUserDetails();
    //        getProfileService.GetData(userdetails.memberId, userdetails.accessToken, function (response) {
    //            console.log('came in get user profile method and data -> ' + JSON.stringify(response));

    //            // binding user information
    //            $scope.userInfo.type = response.AccountType;
    //            $scope.userInfo.subtype = response.SubType;
    //            $scope.userInfo.firstName = response.FirstName;
    //            $scope.userInfo.lastName = response.LastName;
    //            $scope.userInfo.fullName = $scope.userInfo.firstName + " " + $scope.userInfo.lastName;
    //            this.birthDay = response.DOB;
    //            this.mobileNumber = response.MobileNumber;

    //            this.isPhoneVerified = response.IsPhoneVerified;
    //            this.emailAddress = response.UserEmail;
    //            this.isEmailVerified = response.IsEmailVerified;
    //            this.fb = response.FbUrl;
    //            this.twitter = response.TwitterHandle;


    //            this.insta = response.InstaUrl;
    //            this.address1 = response.AddressLine1;
    //            this.addressCity = response.City;
    //            this.addressCountry = response.Country;
    //            this.zip = response.Zip;
    //            this.ssnLast4 = response.SSN;
    //            this.userPic = "josh";


    //        });




    //    } else {
    //        window.location.href = 'login.html';
    //    }

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

        this.bankList = getBanksService.getBank(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);

        this.addBank = function ()
        {
            if ($scope.bankCount > 0)
            {
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
                    if (isConfirm)
                    {
                        $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/trans/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                        $('#bankAdd').modal({
                            keyboard: false
                        })
                    }
                    else {}
                });
            }
            else 
            {
                $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/trans/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                $('#bankAdd').modal({
                    keyboard: false
                })
            }
        }

        this.makePrimary = function(e) 
        {
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

    .controller('accntChecklistCtrl', function ($scope) {

        //Status
        $scope.checklistItems = {
            confirmEmail: 1,
            confirmPhone: 1,
            verifyId: 0,
            connectBank: 0,
            addProp: 0 ,
            addTenant: 0,
            acceptPayment: 0
        }

        this.percentComplete = ((($scope.checklistItems.confirmEmail + $scope.checklistItems.confirmPhone + $scope.checklistItems.verifyId +
                               $scope.checklistItems.connectBank + $scope.checklistItems.addProp + $scope.checklistItems.addTenant + $scope.checklistItems.acceptPayment)
                               / 7) * 100).toFixed(0);
    })

    // Account Checklist Pie Chart (EASY PIE CHART)
    .directive('acntchklstChart', function () {
        return {
            restrict: 'A',
            link: function (scope, element)
            {
                
            }
        }
    })


    //=================================================
    // LOGIN (Came w/ default template)
    //=================================================

    .controller('loginCtrl', function ($scope, authenticationService) {
        //Status
        this.login = 1;
        this.register = 0;
        this.forgot = 0;

        $scope.LoginData = {
            password: '',
            username :''
        };
        
        this.loginAttmpt = function () {

          
            
          //  window.location.href = 'index.html#/profile/profile-about'; // FOR TESTING LOCALLY B/C AUTHENTICATION SERVICE WON'T WORK

            authenticationService.ClearUserData();

            authenticationService.Login($scope.LoginData.username, $scope.LoginData.password, function(response) {
                if (response.IsSuccess == true) {
                    authenticationService.SetUserDetails($scope.LoginData.username, response.MemberId, response.AccessToken);
                    window.location.href = 'index.html#/profile/profile-about';
                } else {
                    alert('Error :' + response.ErrorMessage);
                }
            });


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