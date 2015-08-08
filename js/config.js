noochForLandlords

    .run(function($templateCache,$http){
          $http.get('includes/templates.html', {cache:$templateCache});
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        
        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];



        $urlRouterProvider.otherwise("/home");

    $stateProvider

        //------------------------------
        // HOME
        //------------------------------
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/fullcalendar/dist/fullcalendar.min.css',
                            ]
                        },
                        {
                            name: 'vendors',
                            insertBefore: '#app-level-js',
                            files: [
                                'vendors/sparklines/jquery.sparkline.min.js',
                                'vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                'vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                            ]
                        }
                    ])
                }
            }
        })


        //------------------------------
        // HISTORY
        //------------------------------
        .state('history', {
            url: '/history',
            templateUrl: 'views/history.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.css',
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/sparklines/jquery.sparkline.min.js',
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.js'
                            ]
                        }
                    ])
                }
            }
        })


        //------------------------------
        // Properties
        //------------------------------
        .state('properties', {
            url: '/properties',
            templateUrl: 'views/properties.html'
        })
        .state('add-property', {
            url: '/add-property',
            templateUrl: 'views/property-add.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css',
                                'vendors/chosen_v1.4.2/chosen.min.css',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.css',
                                'vendors/bower_components/bootstrap-fileinput/css/fileinput.min.css',
                                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/input-mask/input-mask.min.js',
                                'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.js',
                                'vendors/bower_components/bootstrap-fileinput/js/fileinput.min.js',
                            ]
                        }
                    ])
                }
            }
        })
        .state('property-details', {
            url: '/property-details',
            templateUrl: 'views/property-details.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
                                'vendors/chosen_v1.4.2/chosen.min.css',
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.css',
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                'vendors/bower_components/bootstrap-fileinput/css/fileinput.min.css',
                                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/input-mask/input-mask.min.js',
                                'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.js',
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                'vendors/bower_components/bootstrap-fileinput/js/fileinput.min.js',
                            ]
                        }
                    ])
                }
            }
        })

        //------------------------------
        // TENANT REQUESTS
        //------------------------------
        .state('tenant-requests', {
            url: '/tenant-requests',
            templateUrl: 'views/tenant-requests.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.css',
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.js'
                            ]
                        }
                    ])
                }
            }
        })


//------------------------------
        // Profile
        //------------------------------
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.css',
                                'vendors/bower_components/bootstrap-fileinput/css/fileinput.min.css',
                                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css'
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.js',
                                'vendors/bower_components/bootstrap-fileinput/js/fileinput.min.js'
                            ]
                        }
                    ]);
                }
            }
        })
        .state('profile.profile-about', {
            url: '/profile-about',
            templateUrl: 'views/profile-about.html',
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'css',
                            insertBefore: '#app-level',
                            files: [
                                'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css',
                                'vendors/chosen_v1.4.2/chosen.min.css',
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.css'
                            ]
                        },
                        {
                            name: 'vendors',
                            files: [
                                'vendors/input-mask/input-mask.min.js',
                                'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                'vendors/bower_components/moment/min/moment.min.js',
                                'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                'vendors/bower_components/jquery.steps/build/jquery.steps.js'
                            ]
                        }
                    ]);
                }
            }
        })
        .state('profile.profile-notifications', {
            url: '/profile-notifications',
            templateUrl: 'views/profile-notifications.html'
        })
        .state('profile.profile-bankaccounts', {
            url: '/profile-bankaccounts',
            templateUrl: 'views/profile-bankaccounts.html'
        })
        .state('profile.profile-tenants', {
            url: '/profile-tenants',
            templateUrl: 'views/profile-tenants.html'
        })


        //------------------------------
        // FAQ
        //------------------------------
        .state('faq', {
            url: '/faq',
            templateUrl: 'views/faq.html'
        });

});
