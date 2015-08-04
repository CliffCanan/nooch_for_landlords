noochForLandlords
    
    //-----------------------------------------------------
    // TOOLTIP AND POPOVER
    //-----------------------------------------------------

    .directive('toggle', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var x = attrs.toggle;
                
                //Tooltip
                if(x === 'tooltip') {
                    element.tooltip();
                } 
                
                //Popover
                if(x === 'popover') {
                    element.popover();
                } 
            }
        }
    })

    
    
    //-----------------------------------------------------
    // COLLAPSE
    //-----------------------------------------------------
    .directive('collapse', function(){
        return {
            restrict: 'C',
            link: function(scope, element, attrs) {
                element.on('show.bs.collapse', function (e) {
                    $(this).closest('.panel').find('.panel-heading').addClass('active');
                });

                element.on('hide.bs.collapse', function (e) {
                    $(this).closest('.panel').find('.panel-heading').removeClass('active');
                });

                //Add active class for pre opened items
                $('.collapse.in').each(function(){
                    $(this).closest('.panel').find('.panel-heading').addClass('active');
                });
            }
        }
    })



    //-----------------------------------------------------
    // ANIMATED DROPDOWN MENU
    //-----------------------------------------------------

    .directive('dropdown', function(){
    
        return {
            restrict: 'C',
            link: function(scope, element, attrs) {
                element.on('shown.bs.dropdown', function (e) {
                    if($(this).data('animation')) {
                        $animArray = [];
                        $animation = attrs.animation;
                        $animArray = $animation.split(',');
                        $animationIn = 'animated '+$animArray[0];
                        $animationOut = 'animated '+ $animArray[1];
                        $animationDuration = '';

                        if(!$animArray[2]) {
                            $animationDuration = 500; //if duration is not defined, default is set to 500ms
                        }

                        else {
                            $animationDuration = $animArray[2];
                        }

                        $(this).find('.dropdown-menu').removeClass($animationOut)
                        $(this).find('.dropdown-menu').addClass($animationIn);
                    }
                });

                element.on('hide.bs.dropdown', function (e) {
                    if($(this).data('animation')) {
                        e.preventDefault();
                        $this = $(this);
                        $dropdownMenu = $this.find('.dropdown-menu');

                        $dropdownMenu.addClass($animationOut);
                        setTimeout(function(){
                            $this.removeClass('open')

                        }, $animationDuration);
                        
                    }
                });
            }
        }
    })
