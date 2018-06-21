// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('football', ['ionic', 'football.controllers', 'ion-datetime-picker', 'football.services', 'ngCordova', 'jett.ionic.filter.bar', 'ionic.rating', 'auth0', 'angular-storage', 'angular-jwt'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleBlackOpaque();
            }

            try {
                var notificationOpenedCallback = function (jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                };



                window.plugins.OneSignal
                    .startInit("3c52e01f-0945-4334-aff0-25ff0b5fb7ad")
                    .handleNotificationOpened(notificationOpenedCallback)
                    .endInit();

                // window.plugins.OneSignal.setSubscription(true);

                window.plugins.OneSignal.getIds(function (ids) {
                    //alert(ids.userId);
                });

            } catch (error) {
                alert((error));
            }

        });

        //  // This hooks all auth events to check everything as soon as the app starts
        //auth.hookEvents();



    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, authProvider, jwtInterceptorProvider, $ionicFilterBarConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
        $ionicFilterBarConfigProvider.theme('royal');

        $ionicConfigProvider.views.swipeBackEnabled(false);

        $stateProvider


            .state('firstpage', {
                url: '/firstpage',
                templateUrl: 'templates/firstpage.html',
                controller: 'FirstPageController'
            })

            .state('app',
                {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/menu.html',
                    controller: 'AppCtrl'
                }
            )
            .state('signin', {
                url: '/loginpage',
                templateUrl: 'templates/loginpage.html',
                controller: 'LoginController'
            })

            .state('registerpage', {
                url: '/register',
                templateUrl: 'templates/loginRegisterPage.html',
                controller: 'LoginController'
            })



            .state('app.feedbacks', {
                url: '/feedbacks',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/feedbacks.html',
                        controller: 'FeedBackController'
                    }
                }
            })


            .state('app.adminpage', {
                url: '/adminpage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminpage.html'

                    }
                }
            })

            .state('app.gamedetails', {
                url: '/gamedetails/:gameid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gamedetails.html',
                        controller: 'GameDetailsController'
                    }
                }
            })

            .state('app.customers', {
                url: '/customers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/customers.html',
                        controller: 'CustomerController'

                    }
                }
            })

            .state('app.customerdetails', {
                url: '/customerdetails',
                params: {
                    Customer: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/customerdetails.html',
                        controller: 'CustomerDetailsController'

                    }
                }
            })

            .state('app.createcustomer', {
                url: '/createcustomer',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/customercreate.html',
                        controller: 'CustomerCreateController'

                    }
                }
            })

            .state('app.adminpagedetails', {
                url: '/adminpagedetails/:stadiumid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminpagedetails.html',
                        controller: 'AdminMiniController'

                    }
                }
            })

            .state('app.addstadium', {
                url: '/addstadium',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminaddstadium.html'

                    }
                }
            })

            .state('app.addministadium', {
                url: '/addministadium/:stadiumid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminaddministadium.html',
                        controller: "AdminAddMiniController"

                    }
                }
            })

            .state('app.adminbookings', {
                url: '/adminbookings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminbookings.html',
                        controller: "AdminScheduleController"
                    }
                }
            })
            .state('app.adminaddbookings', {
                url: '/adminaddbookings',
                params: {
                    Booking: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminaddbookings.html',
                        controller: "AdminAddBooking"
                    }
                }
            })

            .state('app.adminpromotions', {
                url: '/adminpromotions',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminpromotions.html',
                        controller: "AdminPromotions"
                    }
                }
            })
            .state('app.adminaddpromotions', {
                url: '/adminaddpromotions',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminaddpromotions.html',
                        controller: "AdminAddPromotions"
                    }
                }
            })
            .state('app.history', {
                url: '/history',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminhistory.html',
                        controller: "AdminHistory"
                    }
                }
            })
            .state('app.adminbalances', {
                url: '/adminbalances',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/adminbalances.html',
                        controller: 'AdminBalanceController'

                    }
                }
            })
            ;
        // if none of the above states are matched, use this as the fallback

        //$urlRouterProvider.otherwise('/app/addministadium');
        //  $urlRouterProvider.otherwise('/app/adminbalances');

        $urlRouterProvider.otherwise('/firstpage');
        // $urlRouterProvider.otherwise('/app/adminaddbookings');

        // $urlRouterProvider.otherwise('/app/adminpromotions');
        // $urlRouterProvider.otherwise('/app/adminbookings');

        //$urlRouterProvider.otherwise('/app/reservestadium');
        //$urlRouterProvider.otherwise('/app/selfprofile');
        // $urlRouterProvider.otherwise('/app/teammanagement');
        //$urlRouterProvider.otherwise('/app/adminpage');
        //$urlRouterProvider.otherwise('/app/homepage');

        //$urlRouterProvider.otherwise('/app/adminpage');


        //$urlRouterProvider.otherwise('/app/matchmakinghome');


        //// Initialized the Auth0 provider
        //authProvider.init({
        //    domain: AUTH0_DOMAIN,
        //    clientID: JSDasVsiBSeI0GQqdyZmsHq82knWTg27,
        //    loginState: 'login'
        //});



    });
