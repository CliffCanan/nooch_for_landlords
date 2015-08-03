noochForLandlords

    .run(function($templateCache,$http){
          $http.get('includes/templates.html', {cache:$templateCache});
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];


        $urlRouterProvider.otherwise("/home");

        $stateProvider
        
            //------------------------------
            // HOME
            //------------------------------
        
            .state ('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
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
        
            .state ('history', {
                url: '/history',
                templateUrl: 'views/history.html',
				resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
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
                                    'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid-override.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // Properties
            //------------------------------
        
            .state ('properties', {
                url: '/properties',
                templateUrl: 'views/properties.html'
            })

			.state ('add-property', {
                url: '/add-property',
                templateUrl: 'views/property-add.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css',
                                    'vendors/chosen_v1.4.2/chosen.min.css',
                                    'vendors/bower_components/jquery.steps/build/jquery.steps.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/input-mask/input-mask.min.js',
                                    'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                    'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                    'vendors/fileinput/fileinput.min.js',
                                    'vendors/bower_components/jquery.steps/build/jquery.steps.js',
                                    'vendors/parsleyjs/dist/parsley.min.js',
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
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
                                    'vendors/chosen_v1.4.2/chosen.min.css',
                                    'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid.min.css',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/input-mask/input-mask.min.js',
                                    'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                    'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                    'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid-override.min.js',
                                    'vendors/fileinput/fileinput.min.js',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
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
                    loadPlugin: function ($ocLazyLoad) {
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
                                    'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid-override.min.js'
                                ]
                            }
                        ])
                    }
                }
            })


            //------------------------------
            // WIDGETS
            //------------------------------
        
            .state ('widgets', {
                url: '/widgets',
                templateUrl: 'views/common.html'
            })

            .state ('widgets.widgets', {
                url: '/widgets',
                templateUrl: 'views/widgets.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelementplayer.css',
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/mediaelement/build/mediaelement-and-player.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('widgets.widget-templates', {
                url: '/widget-templates',
                templateUrl: 'views/widget-templates.html'
            })


            //------------------------------
            // TABLES
            //------------------------------
        
            .state ('tables', {
                url: '/tables',
                templateUrl: 'views/common.html'
            })

            .state ('tables.tables', {
                url: '/tables',
                templateUrl: 'views/tables.html'
            })

            .state ('tables.data-tables', {
                url: '/data-tables',
                templateUrl: 'views/data-tables.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
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
                                    'vendors/bower_components/jquery.bootgrid/dist/jquery.bootgrid-override.min.js'
                                ]
                            }
                        ])
                    }
                }
            })

        
            //------------------------------
            // FORMS
            //------------------------------
            .state ('form', {
                url: '/form',
                templateUrl: 'views/common.html'
            })

            .state ('form.form-components', {
                url: '/form-components',
                templateUrl: 'views/form-components.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/bootstrap-select/dist/css/bootstrap-select.css',
                                    'vendors/chosen_v1.4.2/chosen.min.css',
                                    'vendors/bower_components/nouislider/distribute/jquery.nouislider.min.css',
                                    'vendors/farbtastic/farbtastic.css',
                                    'vendors/bower_components/summernote/dist/summernote.css',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/input-mask/input-mask.min.js',
                                    'vendors/bower_components/bootstrap-select/dist/js/bootstrap-select.js',
                                    'vendors/chosen_v1.4.2/chosen.jquery.min.js',
                                    'vendors/bower_components/nouislider/distribute/jquery.nouislider.all.min.js',
                                    'vendors/bower_components/moment/min/moment.min.js',
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                    'vendors/farbtastic/farbtastic.min.js',
                                    'vendors/bower_components/summernote/dist/summernote.min.js',
                                    'vendors/fileinput/fileinput.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
        
            .state ('form.form-examples', {
                url: '/form-examples',
                templateUrl: 'views/form-examples.html'
            })
   
            .state ('form.form-validations', {
                url: '/form-validations',
                templateUrl: 'views/form-validations.html'
            })
        


            //------------------------------
            // Profile
            //------------------------------

            .state ('profile', {
                url: '/profile',
                templateUrl: 'views/profile.html',
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                name: 'css',
                                insertBefore: '#app-level',
                                files: [
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                                    'vendors/bower_components/jquery.steps/build/jquery.steps.css'
                                ]
                            },
                            {
                                name: 'vendors',
                                files: [
                                    'vendors/bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                                    'vendors/fileinput/fileinput.min.js',
                                    'vendors/bower_components/jquery.steps/build/jquery.steps.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('profile.profile-about', {
                url: '/profile-about',
                templateUrl: 'views/profile-about.html',
				resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
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
                                    'vendors/fileinput/fileinput.min.js',
                                    'vendors/bower_components/jquery.steps/build/jquery.steps.js'
                                ]
                            }
                        ])
                    }
                }
            })

            .state ('profile.profile-notifications', {
                url: '/profile-notifications',
                templateUrl: 'views/profile-notifications.html',
            })

            .state ('profile.profile-bankaccounts', {
                url: '/profile-bankaccounts',
                templateUrl: 'views/profile-bankaccounts.html',
            })

            .state ('profile.profile-tenants', {
                url: '/profile-tenants',
                templateUrl: 'views/profile-tenants.html'
            })


            //------------------------------
            // FAQ
            //------------------------------

            .state('faq', {
                url: '/faq',
                templateUrl: 'views/faq.html'
            })

    });
