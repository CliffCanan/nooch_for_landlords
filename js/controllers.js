noochForLandlords
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

    .controller('materialadminCtrl', function($timeout, $state, growlService){
        //Welcome Message
        growlService.growl('Welcome back Mallinda!', 'inverse')
        
        
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
    
    .controller('propertiesCtrl', function (propertiesService)
    {
        this.propCount = 7;
        this.propResult = propertiesService.getProperty(this.id, this.img, this.propName, this.address, this.units, this.tenants);
    })

    // Delete Property Popup
    .directive('deleteProp', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    console.log("DELETE PROPERTY DIRECTIVE");
                    console.log(element);
                    console.log(attrs);
                    console.log(attrs.propid);
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
        this.emailAddress = "josh.h@nooch.com";
        this.fb = "NoochMoney";
        this.twitter = "@NoochMoney";
        this.insta = "NoochMoney";
        this.address1 = "1098 ABC Towers";
        this.addressCity = "Philadelphia, PA";
        this.addressCountry = "United States";
        this.ssnLast4 = "7654";
        this.userPic = "josh";

        // Get Company Info
        this.company = {
            "name": "ABC Rental LLC",
            "ein": "10-2273413",
        }

        // Account Info
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