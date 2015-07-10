noochForLandlords

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
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

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");
            
            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================
    
    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");
            
            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Properties Widget Data
    // =========================================================================
    
    .service('propertiesService', ['$resource', function ($resource)
    {
        this.getProperties = function (id, img, propName, address, units, tenants)
        {
            var propertyList = $resource("data/properties.json");

            return propertyList.get({
				id: id,
                img: img,
                propName: propName,
                address: address,
                units: units,
                tenants: tenants
            })
        }
    }])

    .service('propDetailsService', ['$resource', function ($resource)
    {
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
            console.log(User.get({id:4}));
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
    // Bank Accounts Data
    // =========================================================================

    .service('getBanksService', ['$resource', function ($resource)
    {
        this.getBank = function (id, name, nickname, logo, last4, status, dateAdded, notes)
        {
            var bankList = $resource("data/bankAccountsList.json");
            //console.log("SERVICES for BANKS reached");

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
    .service('nicescrollService', function() {
        var ns = {};
        ns.niceScroll = function(selector, color, cursorWidth) {
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

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
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
