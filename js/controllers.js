noochForLandlords
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

    .controller('materialadminCtrl', function($timeout, $state, growlService){
        //Welcome Message
        growlService.growl('Welcome back Josh!', 'inverse')
        
        
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
    })


    // =========================================================================
    // Header
    // =========================================================================
    .controller('headerCtrl', function($timeout, messageService){

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


    // =========================================================================
    // Todo List Widget
    // =========================================================================

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


    // =========================================================================
    // Recent Items Widget (Came with default Template)
    // =========================================================================

    .controller('recentitemCtrl', function(recentitemService){
        
        //Get Recent Items Widget Data
        this.id = recentitemService.id;
        this.name = recentitemService.name;
        this.parseInt = recentitemService.price;
        
        this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
    })


    // =========================================================================
    // Properties Widget
    // =========================================================================
    
    .controller('propertiesCtrl', function (propertiesService, propDetailsService)
    {
        this.propCount = 7;
        this.propResult = propertiesService.getProperties(this.id, this.img, this.propName, this.address, this.units, this.tenants);

        // For setting the 'Selected Prop' when going to a Property's Details page
        this.selectedPropId = "";
        this.setSelectedId = function ($event) {
            this.selectedPropId = $event.target.id;

            propDetailsService.set(this.selectedPropId);
            window.location.href = '#/property-details';
        }

        // Just for toggling views for demo purposes...
        this.firstTimeView = 0;
        this.propsAddedAlreadyView = 1;
    })

    // PROPERTY DETAILS CONTROLLER
    .controller('propDetailsCtrl', function (propertiesService, propDetailsService) {
        this.propResult = propertiesService.getProperties(this.id, this.img, this.propName, this.address, this.units, this.tenants);

        this.getSelectedProp = propDetailsService.get();
        this.getSelectedProp2 = propDetailsService.get2();
    })


    // Delete Property Popup
    .directive('deleteProp', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    //console.log("DELETE PROPERTY DIRECTIVE");
                    //console.log(element);
                    //console.log(attrs);
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
    .controller('addPropertyCtrl', function ($scope, $compile) {

        $("#example-vertical").steps({
            headerTag: "h3",
            bodyTag: "section",
            stepsOrientation: "vertical",
            transitionEffect: 'slideLeft',
            transitionEffectSpeed: 400,
            enableCancelButton: true,

            /* Events */
            onStepChanging: function (event, currentIndex, newIndex) 
            {
                if (newIndex == 0)
                {
                    $('.wizard.vertical > .content').animate({ height: "22em" }, 500)
                }

                // IF going to Step 2
                if (newIndex == 1)
                {
                    if ($('#propertyName').val().length > 4)
                    {
                        updateValidationUi(1, null, true);

                        $('.wizard.vertical > .content').animate({ height: "27em" }, 700)
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
                        if ($('#city').val().length > 4)
                        {
                            updateValidationUi(3, 2, true);

                            // Now check ZIP field
                            if ($('#zipCode').val().length == 5)
                            {
                                updateValidationUi(3, 3, true);
                                $('.wizard.vertical > .content').animate({ height: "27em" }, 700)
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
                
            },
            onCanceled: function (event)
            {
                cancelAddProp();
            }
        });


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
                        setTimeout(function () {
                            var $multiUnitClick = $('#multiUnit').attr('data-ng-click', 'selectMultiUnit()');
                            $compile($multiUnitClick)($scope);
                        }, 200);
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

        $scope.selectMultiUnit = function () {
            console.log("ARE WE HERE?");
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
            },800)
        }

        this.unitInputsShowing = 0;
        this.addUnit = function () {
            this.unitInputsShowing += 1;

            var templateUnit = "<div class=\"row\"><div class=\"col-xs-6 m-b-15\"><div class=\"fg-float p-r-10\"><div class=\"fg-line\"><input type=\"text\" class=\"form-control fg-input\" maxlength=\"5\"></div><label class=\"fg-label\">Unit #</label></div></div><div class=\"col-xs-6 m-b-10\"><div class=\"fg-float\"><div class=\"fg-line dollar\"><input type=\"text\" id=\"unit" + this.unitInputsShowing + "\" class=\"form-control fg-input\" maxlength=\"7\"></div><label class=\"fg-label\">Rent Amount</label></div></div></div>";
            var newUnit = "#unit" + this.unitInputsShowing;

            $('#addedUnits').append(templateUnit);

            //$(".templateUnitInput").clone().appendTo("#addedUnits");
            //$(".templateUnitInput:last-child").removeClass("templateUnitInput").removeClass("hidden");
        }
    })

    //=================================================
    // Profile
    //=================================================

    .controller('profileCtrl', function($scope, growlService){
        
        //Get Profile Information from profileService Service
        
        // Get User Info
        this.accountStatus = "Identity Verified";
        this.type = "Landlord";
        this.subtype = "Basic";
        this.firstName = "Josh";
        this.lastName = "Hamilton";
        this.fullName = this.firstName + " " + this.lastName;
        this.birthDay = "23/06/1982";
        this.mobileNumber = "(215) 711-6789";
        this.isPhoneVerified = 1;
        this.emailAddress = "josh.h@nooch.com";
        this.isEmailVerified = 1;
        this.fb = "NoochMoney";
        this.twitter = "@NoochMoney";
        this.insta = "NoochMoney";
        this.address1 = "1098 ABC Towers";
        this.addressCity = "Philadelphia, PA";
        this.addressCountry = "United States";
        this.ssnLast4 = "7654";
        this.userPic = "josh";

        // Home Layout
        this.home = {
            "bnkPrmt": 0,
            "idPrmt": 1,
            "propPrmt": 0,
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

        // Get Company Info
        this.company = {
            "name": "ABC Rental LLC",
            "ein": "10-2273413",
        }

        // Account Info
        this.bankCount = 2;
        this.propertyCount = 5;
        this.unitCount = 18;
        this.tenantRequests = 3;

        //When user Edits one of the sections
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

    })

    //=================================================
    // Profile - BANK ACCOUNTS
    //=================================================

    .controller('banksCtrl', function (getBanksService) {
        this.isBankAttached = true;
        this.bankCount = 2;

        this.bankList = getBanksService.getBank(this.id, this.name, this.nickname, this.logo, this.last, this.status, this.dateAdded, this.notes, this.primary, this.deleted);

        this.addBank = function ()
        {
            if (this.bankCount > 0) {
                var plural = "";
                var num = "one";
                if (this.bankCount > 1) {
                    num = "two"
                    if (this.bankCount > 2) {
                        num = "three"
                    }
                    plural = "s";
                }

                swal({
                    title: "Add A New Bank?",
                    text: "You already have " + num + " bank account" + plural + " attached.  Would you like to add another?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Add New Bank",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: true,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/MyAccounts/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                        $('#bankAdd').modal({
                            keyboard: false
                        })
                    }
                    else {}
                });
            }
            else 
            {
                $('#bankAdd iframe').attr("src", "http://54.201.43.89/noochweb/MyAccounts/Add-Bank.aspx?MemberId=B3A6CF&ll=yes");
                $('#bankAdd').modal({
                    keyboard: false
                })
            }
        }
    })

    // Delete Property Popup
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

    .controller('loginCtrl', function(){
        //Status
        this.login = 1;
        this.register = 0;
        this.forgot = 0;

        this.loginAttmpt = function() {
            window.location.href = 'index.html#/profile/profile-bankaccounts';
        }
    })


    //=================================================
    // CALENDAR  (Came w/ default template)
    //=================================================

    .controller('calendarCtrl', function(){

        //Create and add Action button with dropdown in Calendar header. 
        this.month = 'month';

        this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
                            '<li class="dropdown">' +
                                '<a href="" data-toggle="dropdown"><i class="md md-more-vert"></i></a>' +
                                '<ul class="dropdown-menu dropdown-menu-right">' +
                                    '<li class="active">' +
                                        '<a data-calendar-view="month" href="">Month View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="basicWeek" href="">Week View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="basicDay" href="">Day View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</li>';

        //Calendar Event Data
        this.calendarData = {
            eventName: ''
        };
    
        //Tags
        this.tags = [
            'bgm-teal',
            'bgm-red',
            'bgm-pink',
            'bgm-blue',
            'bgm-lime',
            'bgm-green',
            'bgm-cyan',
            'bgm-orange',
            'bgm-purple',
            'bgm-gray',
            'bgm-black',
        ]
        
        this.onTagClick = function(tag, $index) {
            this.activeState = $index;
            this.activeTagColor = tag;
        } 
            
        //Open new event modal on selecting a day
        this.onSelect = function(argStart, argEnd) {
            $('#addNew-event').modal('show');   
            this.calendarData.getStart = argStart;
            this.calendarData.getEnd = argEnd;
        }
        
        //Add new event
        this.addEvent = function() {
            var tagColor = $('.event-tag > span.selected').data('tag');

            if (this.calendarData.eventName.length > 0) {

                //Render Event
                $('#calendar').fullCalendar('renderEvent',{
                    title: this.calendarData.eventName,
                    start: this.calendarData.getStart,
                    end:  this.calendarData.getEnd,
                    allDay: true,
                    className: this.activeTagColor

                },true ); //Stick the event

                this.activeState = -1;
                this.calendarData.eventName = '';
                $('#addNew-event').modal('hide');
            }
        }        
    })