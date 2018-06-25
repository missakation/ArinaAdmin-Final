
angular.module('football.controllers')
    .controller('AdminController', function ($scope, $ionicLoading, AdminStore, $ionicPopup) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });
        try {
            if (!$scope.nointernet) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyStadiums(function (leagues) {
                    $ionicLoading.hide();
                    $scope.mystadiums = leagues;
                    console.log(leagues);
                    //}

                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })
            }
        }
        catch (error) {
            console.log(error.message);
        }
    })

    .controller('AdminAddController', function ($scope, $ionicLoading, AdminStore, $ionicPopup) {

        $scope.addstadium = function (stadium) {

            try {

                AdminStore.AddStadium(stadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpage");
                    }, function (error) {
                        console.log(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });

                    })
            }
            catch (error) {
                console.log(error.message);
            }
        };
    })


    .controller('AdminMiniController', function ($scope, $stateParams, $ionicLoading, AdminStore, $ionicPopup) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });

        $scope.key = $stateParams.stadiumid;
        $scope.stadiumname = "";

        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;

        try {
            if (!$scope.nointernet) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyMiniStadiums($stateParams.stadiumid, function (leagues) {
                    $ionicLoading.hide();
                    $scope.myministadiums = leagues;

                    console.log(leagues);
                    if (leagues.length == 0) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Mini Stadiums Found'
                        });
                    }

                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })

                AdminStore.GetMyStadiumById($stateParams.stadiumid, function (leagues) {
                    console.log(leagues);
                    $scope.stadiumname = leagues.name;
                })
            }
        }
        catch (error) {
            console.log(error.message);
        }


    })

    .controller('AdminAddMiniController', function ($scope, $stateParams, $ionicLoading, AdminStore, $ionicPopup) {

        $scope.ministadium =
            {
                name: "",
                typefloor: "indoor",
                type: "grass",
                price: "100",
                photo: "",
                width: "",
                length: "",
                numplayers: ""
            }

        $scope.addministadium = function () {
            try {

                AdminStore.AddMiniStadium($stateParams.stadiumid, $scope.ministadium)
                    .then(function (value) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'New Stadium Added'
                        });
                        $state.go("app.adminpagedetails");
                    }, function (error) {
                        console.log(error.message);

                        alertPopup.then(function (res) {
                            // Custom functionality....
                        });
                        //$scope.allfreestadiums.

                    })
            }
            catch (error) {
                console.log(error.message);
            }
        };
    })

    .controller('AdminScheduleController', function ($scope, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {

        //  debugger;

        //   AdminStore.SendNotification("****Your Booking at TEST!!!!!" , '950ea5dd-46cb-446a-991f-4bb74fc6592b')

        /*var stadium =  {
           "ClosingTime" : "23:59",
           "OpeningTime" : "17:00",
           "RestrictedTime1" : "20:00",
           "RestrictedTime2" : "21:30",
           "admin" : "",
           "cancelationpolicy" : "sometext",
           "city" : "Jal el Dib",
           "cordovaaccuracy" : 0,
           "cordovaaltitude" : 0,
           "cordovaaltitudeAccuracy" : 0,
           "cordovalatitude" : 33.910675,
           "cordovalongitude" : 35.584254,
           "description" : "long description",
           "email" : "someemail",
           "indoor" : 1,
           "locationarea" : "beirut",
           "locationcity" : "beirut",
           "locationtelephone" : "01555666",
           "ministadiums" : {
             "Small" : {
               "cancellation" : 24,
               "description" : "Dofa",
               "length" : "",
               "numplayers" : 5,
               "numplayers1" : 5,
               "photo" : "http://www.sundul.com/wp-content/uploads/2013/02/Bikin-Stadion-Baru-Inter-Milan-Siap-Hengkang-Dari-San-Siro.jpg",
               "price" : 90000,
               "rating" : "0",
               "type" : "Indoor",
               "typefloor" : "Grass",
               "width" : 80
             },  
             "Big" : {
               "cancellation" : 24,
               "description" : "aaa",
               "length" : "",
               "numplayers" : 5,
               "numplayers1" : 6,
               "photo" : "https://sportsimagepro.files.wordpress.com/2011/02/hull-fc-v-hull-kingston-rovers-29942.jpg",
               "price" : 100000,
               "rating" : "0",
               "type" : "Indoor",
               "typefloor" : "Clay",
               "width" : 54
             }
           },
           "name" : "Vclub2",
           "numberofstadium" : 10,
           "outdoor" : 1,
           "photo" : "http://www.sundul.com/wp-content/uploads/2013/02/Bikin-Stadion-Baru-Inter-Milan-Siap-Hengkang-Dari-San-Siro.jpg",
           "rating" : 8,
           "telephone" : "03333333",
           "water" : 1
         }
         updates['/stadiums/Footers'] = stadium;
         updates['/stadiumsinfo/Footers'] = stadium;
        
         return firebase.database().ref().update(updates);*/

        $scope.$on("$ionicView.afterEnter", function (event, data) {


            $timeout(function () {

                try {

                    var user = firebase.auth().currentUser;
                    var query = firebase.database().ref('/admins/' + user.uid).once('value', function (adminsnapshot) {
                        window.plugins.OneSignal.getIds(function (ids) {

                            var updates = {};

                            updates['/admins/' + user.uid + '/devicetoken/' + ids.userId] = true;
                            updates['/stadiums/' + adminsnapshot.child("key").val() + '/devicetoken/' + ids.userId] = true;
                            updates['/stadiumsinfo/' + adminsnapshot.child("key").val() + '/devicetoken/' + ids.userId] = true;


                            firebase.database().ref().update(updates).then(function () {
                            }).catch(function (error) {
                                this.errorMessage = 'Error - ' + error.message
                            });
                        });
                    })

                }
                catch (err) {
                    alert(err.message);
                }
            }, 4000)

        })


        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        var today = new Date();
        $scope.nointernet = false;

        $scope.search = {
            date: today
        }

        $scope.SelectedBooking = {};

        $scope.scheduleswithday = [];
        $scope.scheduleswithdayArray = [];

        // .fromTemplate() method
        var template1 = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover1 = $ionicPopover.fromTemplate(template1, {
            scope: $scope
        });


        $ionicPopover.fromTemplateUrl('templates/my-popover-editbooking.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover1 = popover;
        });


        $scope.openEditPopover = function ($event, item) {
            $scope.SelectedBooking = item;
            $scope.popover1.show($event);

        };

        $scope.Loading = true;

        $scope.number_format = function (number, decimals, dec_point, thousands_sep) {

            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                toFixedFix = function (n, prec) {
                    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                    var k = Math.pow(10, prec);
                    return Math.round(n * k) / k;
                },
                s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        }


        try {
            var today = new Date();

            var onsearch = {
                date: today
            };

            if (!$scope.nointernet) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyStadiumsByDay(onsearch, function (leagues) {

                    $scope.Loading = false;
                    $ionicLoading.hide();
                    $scope.scheduleswithday = leagues;

                    $scope.scheduleswithday.total = 0;
                    $scope.scheduleswithday.forEach(function (element) {
                        $scope.scheduleswithday.total += element.price;
                    }, this);

                    $scope.scheduleswithday.total = $scope.number_format($scope.scheduleswithday.total);

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.scheduleswithdayArray = $scope.scheduleswithday;

                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })
            }
        }
        catch (error) {
            console.log(error.message);
        }


        $scope.gogamedetails = function (gameid) {


            $state.go('app.gamedetails',
                {
                    gameid: gameid.challengekey
                })


        }

        $scope.ReloadPage = function () {
            $scope.search.date = $scope.search.date == null ? new Date() : $scope.search.date;
            if (!$scope.nointernet) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $scope.Loading = true;
                AdminStore.GetMyStadiumsByDay($scope.search, function (leagues) {
                    console.log(leagues);
                    $scope.Loading = false;
                    $ionicLoading.hide();
                    $scope.scheduleswithday = leagues;

                    $scope.scheduleswithday.total = 0;
                    $scope.scheduleswithday.forEach(function (element) {
                        if (!(element.iscombined && element.minikey != element.relatedto))
                            $scope.scheduleswithday.total += element.price;
                    }, this);

                    $scope.scheduleswithday.total = $scope.number_format($scope.scheduleswithday.total);

                    if (leagues.length == 0) {
                        $scope.nostadium = true;
                    }
                    else {
                        $scope.nostadium = false;
                    }

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $scope.scheduleswithdayArray = $scope.scheduleswithday;

                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })
            }

        };

        $scope.goback = function () {

            //  alert($scope.search.date)

            var date = new Date();

            date.setFullYear($scope.search.date.getFullYear());
            date.setMonth($scope.search.date.getMonth());
            date.setDate($scope.search.date.getDate());
            date.setHours($scope.search.date.getHours());
            date.setMinutes($scope.search.date.getMinutes());

            date.setDate($scope.search.date.getDate() - 1);

            $scope.search.date = date;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.ReloadPage();
        }

        $scope.gofront = function () {
            var date = new Date();

            date.setFullYear($scope.search.date.getFullYear());
            date.setMonth($scope.search.date.getMonth());
            date.setDate($scope.search.date.getDate());
            date.setHours($scope.search.date.getHours());
            date.setMinutes($scope.search.date.getMinutes());

            date.setDate($scope.search.date.getDate() + 1);

            $scope.search.date = date;

            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.ReloadPage();
        }



        var indexedTeams = [];
        $scope.playersToFilter = function () {
            indexedTeams = [];
            return $scope.scheduleswithday;
        };

        $scope.filterTeams = function (player) {
            var teamIsNew = indexedTeams.indexOf(player.minikey) == -1;
            if (teamIsNew) {
                indexedTeams.push(player.minikey);
            }
            return teamIsNew;
        };


        $scope.editmode = false;

        $scope.GoEditMode = function () {
            $scope.editmode = !$scope.editmode;
        }

        $scope.setToday = function () {
            $scope.search.date = new Date();
            $scope.ReloadPage();
        }

        $scope.DeleteBooking = function (type) {

            var message = ""

            if (type == 0) {
                message = 'Are You Sure You Want To Cancel?'
            }
            else
                if (type == 1) {
                    message = 'Are you sure you want to cancel due weather?'
                }
                else
                    if (type == 2) {
                        message = 'Are You Sure He Did Not Show Up?'
                    }
                    else {
                        message = 'Are You Sure You Want To Cancel All?'
                    }

            var confirmPopup = $ionicPopup.confirm({
                title: 'Show Up',
                template: message
            });
            confirmPopup.then(function (res) {

                if (res) {
                    if (type != 3) {

                        if ($scope.SelectedBooking.iscombined) {

                            var RelatedTo = $scope.SelectedBooking.relatedto;
                            var MainBooking = {};

                            $scope.scheduleswithday.forEach(function (element) {
                                if (element.minikey == RelatedTo) {
                                    MainBooking = element;
                                }
                            }, this);

                            $scope.scheduleswithday.forEach(function (element) {
                                if (element.relatedto == $scope.SelectedBooking.relatedto) {

                                    AdminStore.DeleteBooking(element, type)
                                        .then(function (value) {

                                        }, function (error) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: error.message
                                            });

                                            alertPopup.then(function (res) {
                                            });

                                        })
                                }
                            }, this);


                            AdminStore.GetCustomerByCode($scope.SelectedBooking.user, function (result) {

                                /// PLAYER TOKENS

                                var Tokens = [];
                                if (result.hasOwnProperty("devicetoken")) {
                                    for (var k in result.devicetoken) {
                                        if (result.devicetoken.hasOwnProperty(k)) {
                                            Tokens.push(k);
                                        }
                                    }
                                }
                                AdminStore.SendNotification("Your Booking at " + $scope.SelectedBooking.stadiumname
                                    + " on "
                                    + $scope.SelectedBooking.fullstartdate.toString()
                                    + " Has Been Cancelled - Call " + $scope.SelectedBooking.admintelephone, Tokens)

                                if (result == "") {
                                    alert("Could Not Update User Infos");
                                }
                                else {

                                    var updates = {};
                                    var user = firebase.auth().currentUser;

                                    if (type == 0) {

                                        result.cancelled = result.cancelled * 1 + 1;
                                        updates['/players/' + MainBooking.user + '/upcomingmatches/' + MainBooking.daykey + '/cancelled'] = true;

                                    }
                                    else
                                        if (type == 1) {

                                            result.cancelledweather = result.cancelledweather * 1 + 1;
                                        }
                                        else {
                                            result.didnotshowup = result.didnotshowup * 1 + 1;
                                            updates['/players/' + MainBooking.user + '/upcomingmatches/' + MainBooking.daykey + '/didnotshowup'] = true;

                                        }
                                    firebase.database().ref().update(updates);

                                    AdminStore.UpdateScores(result)
                                    {
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Cancelled',
                                            template: 'Successfully Cancelled'
                                        });
                                        $scope.popover1.hide();
                                    }
                                }


                            });
                        }
                        else {
                            var CustomerKey = $scope.SelectedBooking.user;
                            var DayKey = $scope.SelectedBooking.daykey;

                            AdminStore.DeleteBooking($scope.SelectedBooking, type)
                                .then(function (value) {
                                    AdminStore.GetCustomerByCode($scope.SelectedBooking.user, function (result) {

                                        var Tokens = [];
                                        if (result.hasOwnProperty("devicetoken")) {
                                            for (var k in result.devicetoken) {
                                                if (result.devicetoken.hasOwnProperty(k)) {
                                                    Tokens.push(k);
                                                }
                                            }
                                        }

                                        AdminStore.SendNotification("Your Booking at " + $scope.SelectedBooking.stadiumname + " on "
                                            + $scope.SelectedBooking.fullstartdate.toString()
                                            + " Has Been Cancelled - Call " + $scope.SelectedBooking.admintelephone, Tokens)
                                        var updates = {};
                                        var user = firebase.auth().currentUser;
                                        if (result == "") {
                                            alert("Could Not Update User Infos");
                                        }
                                        else {

                                            if (type == 0) {

                                                result.cancelled = result.cancelled * 1 + 1;
                                                updates['/players/' + CustomerKey + '/upcomingmatches/' + DayKey + '/cancelled'] = true;

                                            }
                                            else
                                                if (type == 1) {

                                                    result.cancelledweather = result.cancelledweather * 1 + 1;
                                                }
                                                else {
                                                    result.didnotshowup = result.didnotshowup * 1 + 1;
                                                    updates['/players/' + CustomerKey + '/upcomingmatches/' + DayKey + '/didnotshowup'] = true;

                                                }
                                            firebase.database().ref().update(updates);
                                            AdminStore.UpdateScores(result)
                                            {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Cancelled',
                                                    template: 'Successfully Cancelled'
                                                });
                                                $scope.popover1.hide();
                                            }
                                        }


                                    });


                                }, function (error) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.message
                                    });

                                    alertPopup.then(function (res) {
                                    });

                                })
                        }

                    }
                    else {
                        AdminStore.GetBookingsByRecurringId($scope.SelectedBooking, function (recurringresult) {

                            var counter = 0;

                            if ($scope.SelectedBooking.iscombined) {
                                $scope.scheduleswithdayArray.forEach(function (element) {
                                    if (element.relatedto == $scope.SelectedBooking.relatedto) {

                                        counter++;

                                    }
                                }, this);
                            }
                            AdminStore.DeleteRecurringBooking(recurringresult).then(function (results) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Cancelled',
                                    template: 'Successfully Cancelled'
                                });

                                AdminStore.GetCustomerByCode($scope.SelectedBooking.user, function (result) {

                                    if (result == "") {
                                        alert("Could Not Update User Infos");
                                    }
                                    else {

                                        var updates = {};
                                        var user = firebase.auth().currentUser;


                                        result.cancelled = result.cancelled * 1 + (recurringresult.length / counter);
                                        // updates['/players/' + $scope.SelectedBooking.user + '/upcomingmatches/' + $scope.SelectedBooking.daykey + '/cancelled'] = true;


                                        firebase.database().ref().update(updates);


                                        AdminStore.UpdateScores(result)
                                        {
                                            $scope.popover1.hide();
                                        }
                                    }


                                });
                            }, this);


                        }, function (error) {

                        })
                    }
                } else {

                }

            });

        }

        $scope.EditBooking = function () {

            $scope.popover1.hide();

            $state.go('app.adminaddbookings', {
                Booking: this.SelectedBooking
            });
        }

    })

    .controller('AdminBalanceController', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


        var user = firebase.auth().currentUser;
        var id = user.uid;

        $scope.mybalances = [];

        var today = new Date();


        $scope.search = {
            date: today
        }

        $scope.ReloadPage = function () {
            $scope.totalbalance = 0.0;
            try {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyBalances($scope.search.date.getMonth() + 1, function (leagues) {
                    $ionicLoading.hide();
                    $scope.mybalances = leagues;

                    if (leagues.length == 0) {


                    }
                    else {
                        var perc = 0.00;

                        if (perc >= 15) {
                            perc = 0.15;
                        }
                        else {
                            perc = 10.0 + (0.25 * leagues.length);
                        }


                        var total = 0;
                        for (var i = 0; i < leagues.length; i++) {
                            $scope.mybalances[i].percentage = perc;
                            $scope.mybalances[i].total = leagues[i].price * (perc / 100);
                            total = total + Number(leagues[i].price * perc / 100);
                        }
                        $scope.totalbalance = total.toFixed(2);

                    }
                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })
            }
            catch (error) {
                console.log(error.message);
            }

        }

        $scope.ReloadPage();


        $scope.goback = function () {

            //  alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() - 1);
            $scope.ReloadPage();

        }

        $scope.gofront = function () {
            // alert($scope.search.date)
            $scope.search.date.setMonth($scope.search.date.getMonth() + 1);
            $scope.ReloadPage();


        }

    })

    .controller('AdminHistory', function ($scope, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state) {


        var user = firebase.auth().currentUser;
        var id = user.uid;

        $scope.mybalances = [];
        //alert($scope.search.date);



        var today = new Date();


        $scope.search = {
            date: today
        }


        $scope.ReloadPage = function () {
            try {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyBalances($scope.search.date.getMonth(), function (leagues) {
                    $ionicLoading.hide();
                    $scope.mybalances = leagues;

                    if (leagues.length == 0) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Schedule Yet'
                        });

                    }
                    else {
                        var total = 0;
                        for (var i = 0; i < leagues.length; i++) {
                            total = total + Number(leagues[i].total);
                        }
                        $scope.totalbalance = total.toFixed(2);

                    }
                }, function (error) {
                    $ionicLoading.hide();
                    console.log(error.message);
                })
            }
            catch (error) {
                console.log(error.message);
            }
        }

        $scope.ReloadPage();


        $scope.goback = function () {


            $scope.search.date.setMonth($scope.search.date.getMonth() - 1);
            $scope.ReloadPage();
        }

        $scope.gofront = function () {

            $scope.search.date.setMonth($scope.search.date.getMonth() + 1);
            $scope.ReloadPage();

        }



        //var commentsRef = firebase.database().ref('/stadiums');
        //commentsRef.on('child_added', function (data) {

        //});


    })

    .controller('AdminAddBooking', function ($scope, $ionicPopover, $ionicHistory, AdminStore, $ionicPopup, $ionicLoading, $timeout, $state, pickerView) {

        /** End picker view stufgf**/
        $scope.extrainfo = {
            bookingprice: 85000,
            duration: "90",
            recurring: "Once"
        }

        $scope.stadiumdata =
            {
                customer: "",
                name: "",
                telephone: "",
                key: "",
                subkey: ""

            }

        $scope.newcustomer = {
            name: "",
            lastname: "",
            email: "",
            telephone: "",
            key: ""
        }

        $scope.notselected = false;

        $scope.mybalances = [];
        //alert($scope.search.date);
        $scope.customers = [];

        $scope.selectedcustomer = {};

        $scope.searchtel = {
            currenttelephone: ""
        };

        $scope.IsEditMode = false;
        $scope.CurrentBooking = $state.params.Booking;

        $scope.Title = "Add a Booking"

        if ($scope.CurrentBooking != null || $scope.CurrentBooking != undefined) {

            $scope.IsEditMode = true;
            $scope.Title = "Edit Booking";
            $scope.searchtel.currenttelephone = $scope.CurrentBooking.telephone;

            $scope.extrainfo.bookingprice = $scope.CurrentBooking.price;
            //$scope.stadiumdata.customer =
            //$scope.stadiumdata.name =
            //$scope.stadiumdata.telephone = $scope.CurrentBooking.telephone;

        }


        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }

        });


        /** picker view stuff **/
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        tomorrow.setHours(21);
        tomorrow.setMinutes(0);
        tomorrow.setMilliseconds(0);
        tomorrow.setSeconds(0);

        $scope.search = {
            date: tomorrow,
            text: "Tomorrow, 9:00PM" //- " + ($scope.myprofile.favstadium != null && $scope.myprofile.favstadium != "" ?$scope.myprofile.favstadium:"Near me")
        };

        var options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };

        if ($scope.IsEditMode) {
            $scope.search.date = $scope.CurrentBooking.fullstartdate;
            $scope.search.text = $scope.CurrentBooking.fullstartdate.toLocaleTimeString("en-us", options);
        }

        function getDateFromDayName(selectedDay) {
            var selectedDate = new Date();
            if (selectedDay == "Tomorrow") {
                selectedDate.setDate(selectedDate.getDate() + 1);
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            if (selectedDay == "Today") {
                selectedDate.setDate(selectedDate.getDate());
                return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
            }
            selectedDate.setDate(selectedDate.getDate() + 2);
            for (var i = 0; i < 7; i++) {
                if (weekdayFull[selectedDate.getDay()] == selectedDay)
                    return weekday[selectedDate.getDay()] + monthChar[selectedDate.getMonth()] + " " + selectedDate.getDate();
                selectedDate.setDate(selectedDate.getDate() + 1);
            }
        }

        var stadiums = [];
        $scope.allfreestadiums = [];
        $scope.gotlocation = false;


        //toRad function
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
        }


        $scope.openPickerView = function openPickerView() {

            var picker = pickerView.show({
                titleText: '', // default empty string
                doneButtonText: 'OK', // dafault 'Done'
                cancelButtonText: 'Close', // default 'Cancel'
                items: [{
                    values: dateArrayThingy,
                    defaultIndex: 0
                }, {
                    values: [' 7:00 AM ', ' 7:30 AM ', ' 8:00 AM ', ' 8:30 AM ', ' 9:00 AM ', ' 9:30 AM ', ' 10:00 AM ', ' 10:30 AM', ' 11:00 AM ', ' 11:30 AM ', ' 12:00 PM ', ' 12:30 PM ', ' 1:00 PM ', ' 1:30 PM ', ' 2:00 PM ', ' 2:30 PM ', ' 3:00 PM ', ' 3:30 PM ', ' 4:00 PM ', ' 4:30 PM ', ' 5:00 PM ', ' 5:30 PM ', ' 6:00 PM ', ' 6:30 PM ', ' 7:00 PM ', ' 7:30 PM ', ' 8:00 PM', ' 8:30 PM ', ' 9:00 PM ', ' 9:30 PM ', ' 10:00 PM ', ' 10:30 PM ', ' 11:00 PM', ' 11:30 PM '],
                    defaultIndex: 27
                }/*, {
        values: stadiums,
        defaultIndex: 0
    }
    */
                ]
            });

            if (picker) {
                picker.then(function pickerViewFinish(output) {
                    if (output) {
                        // output is Array type
                        var correctDate;
                        var selectedDate = output[0];
                        var selectedTime = output[1];
                        if (!Date.parse(selectedDate) || Date.parse(selectedDate) === undefined || Date.parse(selectedDate) === null) {

                            selectedDate = getDateFromDayName(selectedDate);

                        }
                        else
                            console.log("why?");
                        var hima = (new Date());
                        var constructedDate = selectedDate + ", " + hima.getFullYear() + selectedTime;

                        if (new Date(constructedDate).getTime() < hima.getTime()) {

                            var hours = Math.abs(new Date(constructedDate) - hima) / 36e5;

                            if (hours >= 24)
                                constructedDate = selectedDate + ", " + ((new Date()).getFullYear() + 1) + selectedTime;
                        }
                        $scope.search.date = new Date(constructedDate);
                        console.log($scope.search.date);
                        $scope.search.text = output.join(" - ");
                    }
                });
            }



        };

        //Cleanup the picker when we're done with it!
        $scope.$on('$destroy', function () {
            //$scope.openPickerView.picker.hide();
            console.log("hello");
            pickerView.close();
            $scope.openPickerView = 0;
        });


        $scope.addcustomer = function () {
            if (!$scope.nointernet) {
                if ($scope.newcustomer.name === "" || $scope.newcustomer.telephone === "") {

                    alert("please fill some info");
                    $scope.notselected = true;
                }
                else {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    var query = firebase.database().ref('/admins/' + id + '/mycustomers').orderByChild("telephone").equalTo($scope.newcustomer.telephone.trim());

                    query.once('value', function (snapshot) {

                        if (snapshot.exists()) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'This Number Already Exists'
                            });
                        }
                        else {
                            var newPostKey = firebase.database().ref().child('players').push().key;
                            AdminStore.AddUser($scope.newcustomer, newPostKey).then(function (value) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Customer Saved'
                                });

                                alertPopup.then(function (res) {
                                    $scope.newcustomer.key = newPostKey;
                                    $scope.closePopover1($scope.newcustomer);
                                })

                            }, function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: error.message
                                });

                            })
                        }


                    })

                }
            }
        }

        // .fromTemplate() method
        var template1 = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover1 = $ionicPopover.fromTemplate(template1, {
            scope: $scope
        });


        $ionicPopover.fromTemplateUrl('templates/my-popover-addcustomer.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover1 = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover1.show($event);

        };

        // .fromTemplate() method
        var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });



        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/my-popover-search.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function ($event) {
            $scope.popover.show($event);

        };
        $scope.closePopover = function (item) {
            console.log(item);
            try {
                $scope.searchtel.currenttelephone = item.telephone;
                $scope.popover.hide();


                var cancelled = 0;
                var cancelledweather = 0;
                var didnotshowup = 0;

                for (i = 0; i < $scope.customers.length; i++) {

                    if (item.telephone == $scope.customers[i].telephone) {

                        cancelled += $scope.customers[i].cancelled;

                        cancelledweather += $scope.customers[i].cancelledweather;
                        didnotshowup += $scope.customers[i].didnotshowup;

                        $scope.currentUser = $scope.customers[i];
                        $scope.selectedcustomer = $scope.customers[i];
                        console.log($scope.selectedcustomer.bookings);
                        $scope.stadiumdata.customer = item.key;
                        $scope.stadiumdata.telephone = item.telephone;
                        $scope.stadiumdata.firstname = item.firstname;
                        $scope.selectedcustomer.firstname = item.firstname;

                        $scope.notselected = false;

                    }
                }

                $scope.selectedcustomer.cancelled = cancelled;
                $scope.selectedcustomer.cancelledweather = cancelledweather;
                $scope.selectedcustomer.didnotshowup = didnotshowup;

                $scope.newcustomer = {
                    name: "",
                    lastname: "",
                    email: "",
                    telephone: "",
                    key: ""
                }


            }
            catch (error) {
                console.log(error.message);
            }

        };

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });




        //comment1

        try {

            AdminStore.GetCustomers(function (leagues) {

                $scope.customers = leagues;

                if ($scope.IsEditMode) {

                    for (i = 0; i < $scope.customers.length; i++) {

                        if ($scope.searchtel.currenttelephone == $scope.customers[i].telephone) {

                            $scope.selectedcustomer = $scope.customers[i];
                            $scope.stadiumdata.customer = $scope.customers[i].key;
                            $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                            $scope.stadiumdata.firstname = $scope.customers[i].firstname;
                            $scope.notselected = false;
                        }
                    }
                }

                AdminStore.GetMyStadiums(function (stadiums) {

                    $scope.mystadiums = stadiums;
                    console.log(stadiums);
                    if (stadiums.length == 0) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Stadiums Found'
                        });

                    }

                    else {
                        var stadid = stadiums[0].key;
                        $scope.stadiumdata.key = stadid;
                        AdminStore.GetMyMiniStadiums(stadid, function (ministadiums) {

                            $scope.myministadiums = ministadiums;


                            if (ministadiums.length == 0) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'No Mini Stadiums Found'
                                });


                            }
                            else {
                                try {
                                    $scope.stadiumdata.subkey = $scope.myministadiums[0].name;
                                    $scope.$digest();
                                }
                                catch (error) {
                                    alert(error.message)
                                }

                            }

                            if ($scope.CurrentBooking != null || $scope.CurrentBooking != undefined) {

                                $scope.stadiumdata.key = $scope.CurrentBooking.key;
                                $scope.stadiumdata.subkey = $scope.CurrentBooking.minikey;

                                $scope.$apply();

                            }


                            AdminStore.GetMyCustomers(function (mycustomers) {
                                console.log(mycustomers);
                                $ionicLoading.hide();
                                $scope.mycustomers = mycustomers;

                            });

                        }, function (error) {
                            console.log(error.message);
                        })
                    }
                    $scope.$apply();

                })
            }, function (error) {
                console.log(error.message);
            })
        }
        catch (error) {
            console.log(error.message);
        }




        $scope.closePopover1 = function (item) {
            $scope.searchtel.currenttelephone = item.telephone;
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            try {
                AdminStore.GetCustomers(function (leagues) {
                    $ionicLoading.hide();
                    $scope.customers = leagues;
                    $scope.LoadCustomer();
                    $scope.popover1.hide();
                })


            }
            catch (error) {
                console.log(error.message);
            }

        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.popover1.remove();
        });

        $scope.LoadCustomer = function () {
            for (i = 0; i < $scope.customers.length; i++) {
                if ($scope.searchtel.currenttelephone == $scope.customers[i].telephone) {

                    $scope.selectedcustomer = $scope.customers[i];
                    $scope.stadiumdata.customer = $scope.customers[i].key;
                    $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                    $scope.stadiumdata.firstname = $scope.customers[i].firstname;
                    $scope.notselected = false;
                    break;
                }
            }
            $scope.newcustomer = {
                name: "",
                lastname: "",
                email: "",
                telephone: "",
                key: ""
            }

        }

        $scope.LoadCustomer1 = function () {
            if ($scope.searchtel.currenttelephone.length == 8) {

                console.log($scope.customers);

                var cancelled = 0;
                var cancelledweather = 0;
                var didnotshowup = 0;
                var found = 0;

                for (i = 0; i < $scope.customers.length; i++) {
                    if ($scope.searchtel.currenttelephone == $scope.customers[i].telephone) {

                        cancelled += $scope.customers[i].cancelled;
                        cancelledweather += $scope.customers[i].cancelledweather;
                        didnotshowup += $scope.customers[i].didnotshowup;

                        $scope.selectedcustomer = $scope.customers[i];

                        $scope.stadiumdata.customer = $scope.customers[i].key;
                        $scope.stadiumdata.telephone = $scope.customers[i].telephone;
                        $scope.stadiumdata.firstname = $scope.customers[i].firstname;

                        $scope.notselected = false;
                        found = true;
                    }
                }

                if (!found) {
                    $scope.notselected = true;
                }
                else {

                    $scope.mycustomers.forEach(element => {
                        if ($scope.selectedcustomer.telephone == element.telephone) {

                            $scope.selectedcustomer.firstname = element.firstname;
                            $scope.stadiumdata.customer = element.key;
                            $scope.stadiumdata.telephone = element.telephone;
                            $scope.stadiumdata.firstname = element.firstname;
                        }
                    });


                    $scope.selectedcustomer.cancelled = cancelled;
                    $scope.selectedcustomer.cancelledweather = cancelledweather;
                    $scope.selectedcustomer.didnotshowup = didnotshowup;
                }

                $scope.newcustomer = {
                    name: "",
                    lastname: "",
                    email: "",
                    telephone: "",
                    key: ""
                }
            }
            else {
                $scope.selectedcustomer = {};
                $scope.stadiumdata.customer = "";
                $scope.stadiumdata.telephone = "";
                $scope.stadiumdata.firstname = "";
                $scope.notselected = true;
            }


        }



        $scope.addbooking = function () {



            if (!$scope.nointernet) {
                try {

                    $scope.stadiumdata.key = $scope.stadiumdata.key.trim();
                    $scope.stadiumdata.subkey = $scope.stadiumdata.subkey.trim();
                    $scope.stadiumdata.customer = $scope.stadiumdata.customer.trim();
                    // $scope.stadiumdata.firstname = $scope.stadiumdata.firstname.trim();

                    if ($scope.stadiumdata.key === "" || $scope.stadiumdata.subkey.trim() == "" || $scope.stadiumdata.customer === "") {

                        alert("please fill some info");
                        if ($scope.stadiumdata.customer === "") {
                            $scope.notselected = true;
                        }
                    }
                    else if ($scope.notselected == true) {
                        alert("Please Select a Customer");
                    }
                    else {


                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Reserve Stadium',
                            template: 'Are you sure you want to book ' + $scope.stadiumdata.subkey + ' at ' + '<br>' + $scope.search.date.toDateString() + '?</br>'
                        });

                        confirmPopup.then(function (res) {
                            if (res) {

                                /*$ionicLoading.show({
                                    content: 'Saving Customer',
                                    animation: 'fade-in',
                                    showBackdrop: true,
                                    maxWidth: 200,
                                    showDelay: 0
                                });*/

                                var details = {};

                                for (i = 0; i < $scope.myministadiums.length; i++) {

                                    if ($scope.myministadiums[i].key == $scope.stadiumdata.subkey) {
                                        details = {
                                            price: $scope.extrainfo.bookingprice,
                                            duration: $scope.extrainfo.duration,
                                            recurring: $scope.extrainfo.recurring,
                                            percentage: "1",
                                            type: "B",
                                            nettotal: 0,
                                            photo: $scope.myministadiums[i].photo,
                                            stadiumname: $scope.myministadiums[i].name2,
                                            combined: $scope.myministadiums[i].combined,
                                            iscombined: $scope.myministadiums[i].iscombined,
                                            telephone: $scope.stadiumdata.telephone
                                        };
                                        break;
                                    }
                                }



                                if (!$scope.IsEditMode) {

                                    AdminStore.AddBooking($scope.stadiumdata, $scope.search, details)
                                        .then(function (value) {

                                            $scope.stadiumdata =
                                                {
                                                    customer: "",
                                                    name: "",
                                                    telephone: "",
                                                    key: "",
                                                    subkey: ""

                                                }
                                            $scope.searchtel = {
                                                currenttelephone: ""
                                            };

                                            $scope.selectedcustomer = {};
                                            //$ionicLoading.hide();

                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'Successfully Booked'
                                            }).then(function () {
                                                $ionicHistory.goBack();
                                            });

                                        }, function (error) {
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Error',
                                                template: "Schedule Conflict. Please Choose Another Time"
                                            });


                                        })
                                }
                                else {


                                    if ($scope.CurrentBooking.iscombined) {

                                        var RelatedTo = $scope.CurrentBooking.relatedto;
                                        var MainBooking = {};

                                        $scope.scheduleswithday.forEach(function (element) {
                                            if (element.minikey == RelatedTo) {
                                                MainBooking = element;
                                            }
                                        }, this);

                                        $scope.scheduleswithday.forEach(function (element) {
                                            if (element.relatedto == $scope.CurrentBooking.relatedto) {

                                                AdminStore.DeleteBooking(element, 0)

                                                    .then(function (value) {

                                                    }, function (error) {
                                                        var alertPopup = $ionicPopup.alert({
                                                            title: 'Error',
                                                            template: error.message
                                                        });

                                                        alertPopup.then(function (res) {
                                                        });

                                                    })
                                            }
                                        }, this);
                                    }
                                    else {
                                        var CustomerKey = $scope.CurrentBooking.user;
                                        var DayKey = $scope.CurrentBooking.daykey;

                                        AdminStore.DeleteBooking($scope.CurrentBooking, 0)
                                            .then(function (value) {

                                                AdminStore.AddBooking($scope.stadiumdata, $scope.search, details)
                                                    .then(function (value) {

                                                        $scope.stadiumdata =
                                                            {
                                                                customer: "",
                                                                name: "",
                                                                telephone: "",
                                                                key: "",
                                                                subkey: ""

                                                            }
                                                        $scope.searchtel = {
                                                            currenttelephone: ""
                                                        };

                                                        $scope.selectedcustomer = {};
                                                        var alertPopup = $ionicPopup.alert({
                                                            title: 'Success',
                                                            template: 'Successfully Booked'
                                                        }).then(function () {
                                                            $ionicHistory.goBack();
                                                        });

                                                    }, function (error) {
                                                        var alertPopup = $ionicPopup.alert({
                                                            title: 'Error',
                                                            template: "Schedule Conflict. Please Choose Another Time"
                                                        });


                                                    })

                                            })

                                    }
                                }
                            } else {

                            }

                        });
                    }

                }
                catch (error) {
                    console.log(error.message);
                }
            }

        }


        $scope.changeprice = function () {

            for (i = 0; i < $scope.myministadiums.length; i++) {
                if ($scope.myministadiums[i].key == $scope.stadiumdata.subkey.trim()) {
                    $scope.extrainfo.bookingprice = $scope.myministadiums[i].price;
                    break;

                }
            }





        }


    }).factory('pickerView', ['$compile', '$rootScope', '$timeout', '$q', '$ionicScrollDelegate', '$ionicBackdrop',
        function ($compile, $rootScope, $timeout, $q, $ionicScrollDelegate, $ionicBackdrop) {

            var i, j, k, tmpVar;

            var domBody, pickerCtnr, pickerInfo;

            var isInit, isShowing;

            var setElementRotate = function setElementRotate(elemList, ni) {
                if (ni < 0 || ni === undefined) { return; }

                if (ni - 2 >= 0)
                    angular.element(elemList[ni - 2]).removeClass('pre-select');
                if (ni - 1 >= 0)
                    angular.element(elemList[ni - 1]).removeClass('selected').addClass('pre-select');

                angular.element(elemList[ni]).removeClass('pre-select').addClass('selected');
                if (ni + 1 < elemList.length)
                    angular.element(elemList[ni + 1]).removeClass('selected').addClass('pre-select');
                if (ni + 2 < elemList.length)
                    angular.element(elemList[ni + 2]).removeClass('pre-select');
            };

            var init = function init() {
                if (isInit) { return; }

                var template =
                    '<div class="picker-view"> ' +
                    '<div class="picker-accessory-bar">' +
                    '<a class="button button-clear" on-tap="pickerEvent.onCancelBuuton()" ng-bind-html="pickerOptions.cancelButtonText"></a>' +
                    '<h3 class="picker-title" ng-bind-html="pickerOptions.titleText"></h3>' +
                    '<a class="button button-clear" on-tap="pickerEvent.onDoneBuuton()" ng-bind-html="pickerOptions.doneButtonText"></a>' +
                    '</div>' +
                    '<div class="picker-content">' +
                    '<ion-scroll ng-repeat="(idx, item) in pickerOptions.items track by $index" ' +
                    'class="picker-scroll" ' +
                    'delegate-handle="{{ \'pickerScroll\' + idx }}" ' +
                    'direction="y" ' +
                    'scrollbar-y="false" ' +
                    'has-bouncing="true" ' +
                    'overflow-scroll="false" ' +
                    'on-touch="pickerEvent.scrollTouch(idx)" ' +
                    'on-release="pickerEvent.scrollRelease(idx)" ' +
                    'on-scroll="pickerEvent.scrollPicking(event, scrollTop, idx)">' +
                    '<div ng-repeat="val in item.values track by $index" ng-bind-html="val"></div>' +
                    '</ion-scroll>' +
                    '</div>' +
                    '</div>';

                pickerCtnr = $compile(template)($rootScope);
                pickerCtnr.addClass('hide');

                ['webkitAnimationStart', 'animationstart'].forEach(function runAnimStartHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationStart() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // Before Show Picker View
                            $ionicBackdrop.retain();
                            isShowing = true;
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // Before Hide Picker View
                            isShowing = false;
                        }
                    }, false);
                });

                ['webkitAnimationEnd', 'animationend'].forEach(function runAnimEndHandle(eventKey) {
                    pickerCtnr[0].addEventListener(eventKey, function whenAnimationEnd() {
                        if (pickerCtnr.hasClass('picker-view-slidein')) {
                            // After Show Picker View
                            pickerCtnr.removeClass('picker-view-slidein');
                        } else if (pickerCtnr.hasClass('picker-view-slideout')) {
                            // After Hide Picker View
                            pickerCtnr.addClass('hide').removeClass('picker-view-slideout');
                            $ionicBackdrop.release();
                        }
                    }, false);
                });

                if (!domBody) { domBody = angular.element(document.body); }
                domBody.append(pickerCtnr);
                isInit = true;
            };

            var dispose = function dispose() {
                pickerCtnr.remove();

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                pickerCtnr = pickerInfo = i = j = k = tmpVar = null;

                isInit = isShowing = false;
            };

            var close = function close() {
                if (!isShowing) { return; }

                pickerCtnr.addClass('picker-view-slideout');
            };

            var show = function show(opts) {
                if (!isInit || typeof opts !== 'object') { return undefined; }

                var pickerShowDefer = $q.defer();

                opts.titleText = opts.titleText || '';
                opts.doneButtonText = opts.doneButtonText || 'Done';
                opts.cancelButtonText = opts.cancelButtonText || 'Cancel';

                pickerInfo = [];
                for (i = 0; i < opts.items.length; i++) {
                    if (opts.items[i].defaultIndex === undefined) {
                        opts.items[i].defaultIndex = 0;
                    }

                    // push a empty string to last, because the scroll height problem
                    opts.items[i].values.push('&nbsp;');

                    pickerInfo.push({
                        scrollTopLast: undefined,
                        scrollMaxTop: undefined,
                        eachItemHeight: undefined,
                        nowSelectIndex: opts.items[i].defaultIndex,
                        output: opts.items[i].values[opts.items[i].defaultIndex],
                        isTouched: false,
                        isFixed: false,
                        scrollStopTimer: null
                    });
                }

                for (k in $rootScope.pickerOptions) { delete $rootScope.pickerOptions[k]; }
                delete $rootScope.pickerOptions;
                for (k in $rootScope.pickEvent) { delete $rootScope.pickEvent[k]; }
                delete $rootScope.pickEvent;

                $rootScope.pickerOptions = opts;
                $rootScope.pickerEvent = {
                    onDoneBuuton: function onDoneBuuton() {
                        var pickerOutput = (function () {
                            var totalOutput = [];
                            for (i = 0; i < $rootScope.pickerOptions.items.length; i++) {
                                totalOutput.push(pickerInfo[i].output);
                            }
                            return totalOutput;
                        })();
                        pickerShowDefer.resolve(pickerOutput);
                        close();
                    },
                    onCancelBuuton: function onCancelBuuton() {
                        pickerShowDefer.resolve();
                        close();
                    },
                    scrollTouch: function scrollTouch(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = true;
                        pickerInfo[pickerIdx].isFixed = false;
                    },
                    scrollRelease: function scrollRelease(pickerIdx) {
                        pickerInfo[pickerIdx].isTouched = false;
                    },
                    scrollPicking: function scrollPicking(e, scrollTop, pickerIdx) {
                        if (!$rootScope.pickerOptions) { return; }

                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollTopLast = scrollTop;

                            // update the scrollMaxTop (only one times)
                            if (pickerInfo[pickerIdx].scrollMaxTop === undefined) {
                                pickerInfo[pickerIdx].scrollMaxTop = e.target.scrollHeight - e.target.clientHeight + e.target.firstElementChild.offsetTop;
                            }

                            // calculate Select Index
                            tmpVar = Math.round(pickerInfo[pickerIdx].scrollTopLast / pickerInfo[pickerIdx].eachItemHeight);

                            if (tmpVar < 0) {
                                tmpVar = 0;
                            } else if (tmpVar > e.target.firstElementChild.childElementCount - 2) {
                                tmpVar = e.target.firstElementChild.childElementCount - 2;
                            }

                            if (pickerInfo[pickerIdx].nowSelectIndex !== tmpVar) {
                                pickerInfo[pickerIdx].nowSelectIndex = tmpVar;
                                pickerInfo[pickerIdx].output = $rootScope.pickerOptions.items[pickerIdx].values[pickerInfo[pickerIdx].nowSelectIndex];

                                // update item states
                                setElementRotate(e.target.firstElementChild.children,
                                    pickerInfo[pickerIdx].nowSelectIndex);
                            }
                        }


                        if (pickerInfo[pickerIdx].scrollStopTimer) {
                            $timeout.cancel(pickerInfo[pickerIdx].scrollStopTimer);
                            pickerInfo[pickerIdx].scrollStopTimer = null;
                        }
                        if (!pickerInfo[pickerIdx].isFixed) {
                            pickerInfo[pickerIdx].scrollStopTimer = $timeout(function () {
                                $rootScope.pickerEvent.scrollPickStop(pickerIdx);
                            }, 80);
                        }
                    },
                    scrollPickStop: function scrollPickStop(pickerIdx) {
                        if (pickerInfo[pickerIdx].isTouched || pickerIdx === undefined) {
                            return;
                        }

                        pickerInfo[pickerIdx].isFixed = true;

                        // check each scroll position
                        for (j = $ionicScrollDelegate._instances.length - 1; j >= 1; j--) {
                            if ($ionicScrollDelegate._instances[j].$$delegateHandle !== ('pickerScroll' + pickerIdx)) { continue; }

                            // fixed current scroll position
                            tmpVar = pickerInfo[pickerIdx].eachItemHeight * pickerInfo[pickerIdx].nowSelectIndex;
                            if (tmpVar > pickerInfo[pickerIdx].scrollMaxTop) {
                                tmpVar = pickerInfo[pickerIdx].scrollMaxTop;
                            }
                            $ionicScrollDelegate._instances[j].scrollTo(0, tmpVar, true);
                            break;
                        }
                    }
                };

                (function listenScrollDelegateChanged(options) {
                    var waitScrollDelegateDefer = $q.defer();

                    var watchScrollDelegate = $rootScope.$watch(function getDelegate() {
                        return $ionicScrollDelegate._instances;
                    }, function delegateChanged(instances) {
                        watchScrollDelegate(); // remove watch callback
                        watchScrollDelegate = null;

                        var waitingScrollContentUpdate = function waitingScrollContentUpdate(prIdx, sDele) {
                            $timeout(function contentRefresh() {
                                watchScrollDelegate = $rootScope.$watch(function getUpdatedScrollView() {
                                    return sDele.getScrollView();
                                }, function scrollViewChanged(sView) {
                                    watchScrollDelegate();
                                    watchScrollDelegate = null;

                                    pickerInfo[prIdx].eachItemHeight = sView.__content.firstElementChild.clientHeight;

                                    // padding the first item
                                    sView.__container.style.paddingTop = (pickerInfo[prIdx].eachItemHeight * 1.5) + 'px';

                                    // scroll to default index (no animation)
                                    sDele.scrollTo(0, pickerInfo[prIdx].eachItemHeight * options.items[prIdx].defaultIndex, true);

                                    // update item states
                                    setElementRotate(sView.__content.children,
                                        options.items[prIdx].defaultIndex);
                                });
                            }, 20);
                        };

                        var dele;
                        for (i = 0; i < options.items.length; i++) {
                            dele = null;
                            for (j = instances.length - 1; j >= 1; j--) {
                                if (instances[j].$$delegateHandle === undefined) { continue; }

                                if (instances[j].$$delegateHandle === ('pickerScroll' + i)) {
                                    dele = instances[j];
                                    break;
                                }
                            }

                            if (dele) { waitingScrollContentUpdate(i, dele); }
                        }

                        waitScrollDelegateDefer.resolve();
                    });

                    return waitScrollDelegateDefer.promise;
                })(opts).then(function preparePickerViewFinish() {
                    if (!isShowing) {
                        pickerCtnr.removeClass('hide').addClass('picker-view-slidein');
                    }
                });

                pickerShowDefer.promise.close = close;
                return pickerShowDefer.promise;
            };

            var getIsInit = function getIsInit() { return isInit; };
            var getIsShowing = function getIsShowing() { return isShowing; };

            ionic.Platform.ready(init); // when DOM Ready, init Picker View

            return {
                init: init,
                dispose: dispose,
                show: show,
                close: close,

                isInit: getIsInit,
                isShowing: getIsShowing
            };
        }])







    .controller('AdminPromotions', function ($scope, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });



        try {


            if (!$scope.nointernet) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                AdminStore.GetMyStadiums(function (leagues) {
                    $scope.mystadiums = leagues;

                    AdminStore.GetPromotions($scope.mystadiums[0].key, function (leagues) {
                        $ionicLoading.hide();
                        $scope.mypromotions = leagues;
                        console.log(leagues);

                    }, function (error) {
                        console.log(error);
                    })



                })
            }
        }
        catch (error) {
            console.log(error);
        }

        $scope.deletepromotion = function (item) {

            if (!$scope.nointernet) {
                try {
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    AdminStore.DeletePromotion(item)
                        .then(function (value) {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Promotion Successfully Deleted'
                            });
                        }, function (error) {
                            console.log(error.message);

                            alertPopup.then(function (res) {
                                // Custom functionality....
                            });
                            //$scope.allfreestadiums.

                        })
                }
                catch (error) {
                    console.log(error.message);
                }

            }
        }





    })

    .controller('MenuController', function ($scope, $state, $stateParams, $ionicPopup, $ionicLoading) {
        $scope.logout = function () {



            try {

                var user = firebase.auth().currentUser;
                var query = firebase.database().ref('/admins/' + user.uid).once('value', function (adminsnapshot) {
                    window.plugins.OneSignal.getIds(function (ids) {

                        var updates = {};

                        updates['/admins/' + user.uid + '/devicetoken/' + ids.userId] = true;
                        updates['/stadiums/' + adminsnapshot.child("key").val() + '/devicetoken/' + ids.userId] = true;
                        updates['/stadiumsinfo/' + adminsnapshot.child("key").val() + '/devicetoken/' + ids.userId] = true;


                        firebase.database().ref().update(updates).then(function () {

                            firebase.auth().signOut().then(function () {
                                $state.go('signin');
                            }, function (error) {
                                console.log(error.message);
                            });

                        }).catch(function (error) {

                            this.errorMessage = 'Error - ' + error.message

                        });
                    });
                })



                // window.plugins.OneSignal.setSubscription(false);


            }
            catch (error) {
                console.log(error.message);
            }
        }

    })


    .controller('GameDetailsController', function ($scope, /*HomeStore*/ $ionicPopup, $ionicLoading, $state, $stateParams, AdminStore, $timeout) {

        console.log($state.params.gameid);

        $scope.loadingphase = false;
        $scope.isadmin = false;
        $scope.first = true;
        $scope.currentteam = "";


        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;


        $scope.myplayers = [];

        $scope.gameid = $state.params.gameid;

        //alert($scope.gameid);

        $scope.opponent = "" //for game details title

        $scope.notloaded = true;
        try {
            $scope.profile = {};

            $scope.user = firebase.auth().currentUser;
            $scope.myid = $scope.user.uid;


            AdminStore.GetChallengeByKey($scope.myid, $scope.gameid, function (challengedetails) {

                if (challengedetails.hasOwnProperty("key")) {
                    $scope.challenge = challengedetails;

                    //alert(JSON.stringify($scope.challenge)); 

                    if ($scope.challenge.team1adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = true;
                        $scope.currentteam = $scope.challenge.team1key;
                        $scope.opponent = $scope.challenge.team2name;

                    }
                    else if ($scope.challenge.team2adminid === $scope.myid) {
                        $scope.isadmin = true;
                        $scope.first = false;
                        $scope.currentteam = $scope.challenge.team2key;
                        $scope.opponent = $scope.challenge.team1name;
                    }
                    else {
                        $scope.isadmin = false;
                    }
                    $scope.$apply();


                    $scope.notloaded = false;

                    var oppositecaptain = $scope.first ? $scope.challenge.team2adminid : $scope.challenge.team1adminid;
                    firebase.database().ref('/playersinfo/' + oppositecaptain).on('value', function (snapshot) {
                        if (snapshot.exists()) {

                            $scope.challenge.adminname = snapshot.val().firstname + " " + snapshot.val().lastname;
                            $scope.challenge.adminphoto = snapshot.val().photoURL == "" ? 'img/PlayerProfile.png' : snapshot.val().photoURL;
                            $scope.challenge.admintelephon = snapshot.val().telephone;

                            $scope.challenge.lastseen =
                                {
                                    year: 0,
                                    month: 0,
                                    day: 0,
                                    hour: 0,
                                    minute: 0
                                };
                            $scope.challenge.lastseen.year = snapshot.val().lastseen.loginyear;
                            $scope.challenge.lastseen.month = snapshot.val().lastseen.loginmonth;
                            $scope.challenge.lastseen.day = snapshot.val().lastseen.loginday;
                            $scope.challenge.lastseen.hour = snapshot.val().lastseen.loginhour;
                            $scope.challenge.lastseen.minute = snapshot.val().lastseen.loginminute;

                            $scope.challenge.lastseen.date = new Date();
                            $scope.challenge.lastseen.date.setMinutes(snapshot.val().lastseen.loginminute);
                            $scope.challenge.lastseen.date.setFullYear(snapshot.val().lastseen.loginyear);
                            $scope.challenge.lastseen.date.setMonth(snapshot.val().lastseen.loginmonth);
                            $scope.challenge.lastseen.date.setHours(snapshot.val().lastseen.loginhour);
                            $scope.challenge.lastseen.date.setDate(snapshot.val().lastseen.loginday);

                            var difference = (new Date() - $scope.challenge.lastseen.date) / 1000 / 60;

                            if (difference < 20) {
                                $scope.challenge.lastseen.text = "Online";
                            }
                            else
                                if (difference <= 60) {
                                    $scope.challenge.lastseen.text = Math.floor(difference) + " mins. ago";
                                }
                                else
                                    if (difference <= 24 * 60) {
                                        $scope.challenge.lastseen.text = Math.floor(difference / 60) + " hrs. ago";
                                    }
                                    else
                                        if (difference >= 24 * 60 && difference <= 48 * 60) {
                                            $scope.challenge.lastseen.text = "Yesterday";
                                        }
                                        else {
                                            $scope.challenge.lastseen.text = (Math.floor((difference / 60 / 24))) + " days ago";
                                        }


                        }
                    })

                    firebase.database().ref('/teampoints/' + $scope.challenge.team1key).on('value', function (snapshot) {
                        if (snapshot.exists()) {

                            $scope.challenge.team1rank = snapshot.val().rating;
                            $scope.challenge.team1rating = snapshot.val().rank;

                            switch ($scope.challenge.team1rank) {
                                case 1:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'st';
                                    break;
                                case 2:
                                    $scope.challenge.team1rankkdescription = $scope.challenge.team1rank + 'nd';
                                    break;
                                case 3:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'rd';
                                    break;

                                default:
                                    $scope.challenge.team1rankdescription = $scope.challenge.team1rank + 'th';
                                    break;
                            }


                            firebase.database().ref('/teampoints/' + $scope.challenge.team2key).on('value', function (snapshot) {
                                if (snapshot.exists()) {

                                    $scope.challenge.team2rank = snapshot.val().rating;
                                    $scope.challenge.team2rating = snapshot.val().rank;

                                    switch ($scope.challenge.team2rank) {
                                        case 1:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'st';
                                            break;
                                        case 2:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'nd';
                                            break;
                                        case 3:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'rd';
                                            break;

                                        default:
                                            $scope.challenge.team2rankdescription = $scope.challenge.team2rank + 'th';
                                            break;
                                    }

                                    var range = $scope.challenge.team1rating - $scope.challenge.team2rating;

                                    var difficulty = "";
                                    var difficultytext = "";
                                    switch (true) {
                                        case range <= 100 && range >= -100:
                                            $scope.challenge.difficulty = "Medium.png";
                                            $scope.challenge.difficultytext = "Medium";
                                            break;
                                        case range < -100 && range > -200:
                                            $scope.challenge.difficulty = "Hard.png";
                                            $scope.challenge.difficultytext = "Hard";
                                            break;
                                        case range <= -200:
                                            $scope.challenge.difficulty = "Extreme.png";
                                            $scope.challenge.difficultytext = "Extreme";
                                            break;
                                        case range > 100 && range <= 200:
                                            $scope.challenge.difficulty = "Easy.png";
                                            $scope.challenge.difficultytext = "Easy";
                                            break;
                                        case range > 200:
                                            $scope.challenge.difficulty = "VeryEasy.png";
                                            $scope.challenge.difficultytext = "Very Easy";
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            })



                        }
                    })



                    $scope.$apply();

                }
                else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Team not Found',
                        template: 'Looks like your admin decided to delete this game'
                    }).then(function () {
                        $state.go('app.homepage');
                    })
                }

            })

        } catch (error) {
            console.log(error.message);
        }

        $scope.CancelChallenge = function (challenge) {
            try {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Decline',
                    template: 'Are you sure you want to Cancel the game?'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        /*HomeStore.DeleteChallenge(challenge).then(function () {
    
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: 'Challenge Cancelled'
                            }).then(function () {
                                $state.go('app.homepage');
                            })
    
                        }, function (error) {
                            console.log(error.message);
                        })*/
                    }

                })

            } catch (error) {
                console.log(error.message);
            }
        }

        $scope.SelectWinner = function (Winner) {

            var message = "";

            switch (Winner) {
                case 1:
                    message = "Are you sure you want to select " + $scope.challenge.team1name + " " + "as a winner?"
                    break;
                case 2:
                    message = "Are you sure you want to select " + $scope.challenge.team2name + " " + "as a winner?"
                    break;
                case 3:
                    message = "Are you sure the match ended with a draw?"
                    break;

                default:
                    break;
            }

            var confirmPopup = $ionicPopup.confirm({
                template: message
            });
            confirmPopup.then(function (res) {
                AdminStore.ChooseWinner($scope.challenge, Winner).then(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Game Result Saved'
                    });
                }, function (error) {

                })
            })

        }

        $scope.gotoadd = function () {
            $state.go("app.teamadd");
        }



    })


    .controller('AdminAddPromotions', function ($scope, $ionicPopover, $ionicHistory, AdminStore, $ionicPopup, $ionicLoading) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });

        $scope.year = '2016';
        $scope.month = '2016';
        $scope.day = '2016';
        $scope.hours = '2016';
        $scope.minutes = '2016';

        $scope.starttime = new Date($scope.year, $scope.month, $scope.day, 9, 0, 0, 0);

        $scope.endtime = new Date($scope.year, $scope.month, $scope.day, 21, 0, 0, 0);

        $scope.promotion =
            {
                stadium: "",
                ministadium: "",
                date: "Monday",
                starttime: $scope.starttime,
                startminute: "",
                price: "",
                endtime: $scope.endtime,
                endminute: "",
                discount: 0,
                newprice: "50000",
                weekly: false
            }



        if (!$scope.nointernet) {
            try {

                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });

                AdminStore.GetMyStadiums(function (leagues) {
                    $scope.mystadiums = leagues;
                    $scope.promotion.stadium = $scope.mystadiums[0].key;

                    AdminStore.GetMyMiniStadiums($scope.promotion.stadium, function (leagues) {
                        $ionicLoading.hide();
                        $scope.myministadiums = leagues;

                    }, function (error) {
                        console.log(error.message);
                    })

                    console.log(error.message);


                })
            }
            catch (error) {
                console.log(error.message);
            }
        }
        $scope.changeprice = function () {
            for (i = 0; i < $scope.myministadiums.length; i++) {
                if ($scope.myministadiums[i].name == $scope.promotion.ministadium.trim()) {
                    $scope.promotion.price = $scope.promotion.newprice = $scope.myministadiums[i].price;
                    break;

                }
            }
        }

        $scope.RefreshDiscount = function () {
            var disc = ((1 - ($scope.promotion.newprice / $scope.promotion.price)) * 100);
            $scope.promotion.discount = Number(disc.toFixed(2));
        }


        $scope.addpromotion = function () {
            if (!$scope.nointernet) {
                try {
                    if ($scope.promotion.name.trim() == ""
                        || $scope.promotion.stadium.trim() == ""
                        || $scope.promotion.ministadium.trim() == ""
                    ) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please fill all the information'
                        });
                    }
                    else
                        if ($scope.promotion.starttime >= $scope.promotion.endtime) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Start Time Cannot Be Greater Than End Time'
                            });
                        }
                        else {
                            var daynumber = 0;
                            switch ($scope.promotion.date) {

                                case "Monday":
                                    daynumber = 1;
                                    break;

                                case "Tuesday":
                                    daynumber = 2;
                                    break;

                                case "Wednesday":
                                    daynumber = 3;
                                    break;

                                case "Thursday":
                                    daynumber = 4;
                                    break;

                                case "Friday":
                                    daynumber = 5;
                                    break;

                                case "Saturday":
                                    daynumber = 6;
                                    break;

                                case "Sunday":
                                    daynumber = 0;
                                    break;
                                case "All":
                                    daynumber = 7;
                                    break;
                            }

                            var d = new Date();
                            if (!$scope.promotion.weekly) {

                                $scope.promotion.starttime.setDate(d.getDate());
                                $scope.promotion.starttime.setFullYear(d.getFullYear());
                                $scope.promotion.starttime.setMonth(d.getMonth());

                                $scope.promotion.endtime.setDate(d.getDate());
                                $scope.promotion.endtime.setFullYear(d.getFullYear());
                                $scope.promotion.endtime.setMonth(d.getMonth());

                                if (daynumber == 7) {

                                    $scope.promotion.starttime.setDate(d.getDate() + (daynumber + 7 - d.getDay()) % 7);
                                    $scope.promotion.endtime.setDate(d.getDate() + (daynumber + 7 - d.getDay()) % 7);
                                }
                                else {

                                    $scope.promotion.starttime.setDate(d.getDate() + (daynumber + 7 - d.getDay()) % 7);
                                    $scope.promotion.endtime.setDate(d.getDate() + (daynumber + 7 - d.getDay()) % 7);

                                }
                            }


                            AdminStore.AddPromotion($scope.promotion)
                                .then(function (value) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Promotion Added'
                                    });
                                    alertPopup.then(function (res) {
                                        $ionicHistory.goBack();
                                    })
                                }, function (error) {
                                    console.log(error.message);

                                })
                        }
                }
                catch (error) {
                    console.log(error.message);
                }
            }
        }

    })


    .controller('CustomerController', function ($scope, $state, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $ionicFilterBar) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });

        if (!$scope.nointernet) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            AdminStore.GetMyCustomers(function (mycustomers) {
                console.log(mycustomers);
                $ionicLoading.hide();
                $scope.mycustomers = mycustomers;
                $scope.filteredCustomers = $scope.mycustomers;
                //console.log($scope.mycustomers);
                console.log($scope.filteredCustomers);
            }, function (error) {
                $ionicLoading.hide();
            });
        }

        $scope.OpenCustomerDetails = function (item) {
            $state.go('app.customerdetails', {
                Customer: item
            });
        }

        //Filter bar stuff
        var filterBarInstance;

        //$scope.$digest();
        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.mycustomers,
                update: function (filteredItems, filterText) {
                    if (filterText != "" && filterText != null) {
                        console.log("filterText is: " + filterText)
                        $scope.filteredCustomers = filteredItems;
                    }
                    else {
                        console.log("filterText non empty is: " + filterText)
                        $scope.filteredCustomers = $scope.mycustomers;
                    }
                }//,
                //filterProperties: ['displayname', 'firstname', 'lastname']
            });
        };


        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        //------------filter bar stuff ----/
    })

    .controller('CustomerDetailsController', function ($scope, $ionicHistory, $state, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading, $stateParams) {
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });
        $scope.Customer = $state.params.Customer;
        console.log($scope.Customer);
        $scope.SaveCustomer = function () {

            try {
                if (!$scope.nointernet) {
                    AdminStore.SaveCustomer($scope.Customer).then(function (value) {

                        var alertPopup = $ionicPopup.alert({
                            title: 'Success',
                            template: 'Customer Saved'
                        });

                        alertPopup.then(function (res) {
                            $ionicHistory.goBack();
                        })

                    }, function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error.message
                        });

                    })
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

        $scope.DeleteCustomer = function () {

            try {
                if (!$scope.nointernet) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Show Up',
                        template: "Are you sure you want to delete this customer?"
                    });
                    confirmPopup.then(function (res) {

                        if (res) {
                            AdminStore.DeleteCustomer($scope.Customer).then(function (value) {

                                var alertPopup = $ionicPopup.alert({
                                    title: 'Success',
                                    template: 'Customer Deleted'
                                });

                                alertPopup.then(function (res) {
                                    $ionicHistory.goBack();
                                })

                            }, function (error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: error.message
                                });

                            })
                        }

                    })
                }

            }
            catch (error) {
                console.log(error.message)
            }
        }
    })

    .controller('FeedBackController', function ($scope, $ionicHistory, $state, $ionicPopup, $ionicLoading, $stateParams) {

        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });

        $scope.error = false;
        $scope.loading = false;
        $scope.feedbacktext =
            {
                text: ""
            };

        $scope.savefeedback = function () {
            if (!$scope.nointernet) {
                $scope.loading = true;

                if ($scope.feedbacktext.text.length > 10) {
                    var user = firebase.auth().currentUser;
                    var id = user.uid;

                    if (id !== null && id != '' && id !== undefined) {

                        var updates = {};

                        var newPostKey = firebase.database().ref().child('/feedback/' + id).push().key;

                        updates['/feedback/' + id + '/' + newPostKey] =
                            {
                                text: $scope.feedbacktext.text
                            }
                        firebase.database().ref().update(updates).then(function (res) {
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: "Thank you for your feedback <3"
                            }).then(function () {
                                $scope.loading = false;
                                $state.go("app.adminbookings");
                            });


                        }, function (error) {
                            $scope.loading = false;
                        });

                    }
                }
                else {
                    $scope.error = true;
                }
            }

        }
    })

    .controller('CustomerCreateController', function ($scope, $ionicHistory, $ionicPopover, AdminStore, $ionicPopup, $ionicLoading) {
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                $scope.nointernet = false;
            }
            else {
                $ionicLoading.hide();
                $scope.nointernet = true;
            }
            $scope.$apply();
        });
        $scope.newcustomer = {
            name: "",
            lastname: "",
            email: "",
            telephone: "",
            key: ""
        }

        $scope.notselected = false;

        $scope.addcustomer = function () {
            if (!$scope.nointernet) {
                if ($scope.newcustomer.name === "" || $scope.newcustomer.telephone === "") {

                    alert("please fill some info");
                    $scope.notselected = true;
                }
                else {
                    try {

                        var user = firebase.auth().currentUser;
                        var id = user.uid;

                        var query = firebase.database().ref('/admins/' + id + '/mycustomers').orderByChild("telephone").equalTo($scope.newcustomer.telephone.trim());

                        query.once('value', function (snapshot) {

                            if (snapshot.exists()) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Error',
                                    template: 'This Number Already Exists'
                                });
                            }
                            else {
                                var newPostKey = firebase.database().ref().child('players').push().key;
                                AdminStore.AddUser($scope.newcustomer, newPostKey).then(function (value) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Success',
                                        template: 'Customer Saved'
                                    });

                                    alertPopup.then(function (res) {
                                        $ionicHistory.goBack();
                                    })
                                }, function (error) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: error.message
                                    });

                                })
                            }


                        })


                    }
                    catch (error) {
                        console.log(error.message)
                    }
                }
            }

        }
    })
var weekday = new Array(7);
weekday[0] = "Su, ";
weekday[1] = "Mo, ";
weekday[2] = "Tu, ";
weekday[3] = "We, ";
weekday[4] = "Th, ";
weekday[5] = "Fr, ";
weekday[6] = "Sa, ";

var weekdayFull = new Array(7);
weekdayFull[0] = "Sunday";
weekdayFull[1] = "Monday";
weekdayFull[2] = "Tuesday";
weekdayFull[3] = "Wednesday";
weekdayFull[4] = "Thursday";
weekdayFull[5] = "Friday";
weekdayFull[6] = "Saturday";


monthChar = new Array(12);
monthChar[0] = "Jan";
monthChar[1] = "Feb";
monthChar[2] = "Mar";
monthChar[3] = "Apr";
monthChar[4] = "May";
monthChar[5] = "Jun";
monthChar[6] = "Jul";
monthChar[7] = "Aug";
monthChar[8] = "Sep";
monthChar[9] = "Oct";
monthChar[10] = "Nov";
monthChar[11] = "Dec";


var nesheDate = new Date();
var dateArrayThingy = new Array();
dateArrayThingy.push("Today");
dateArrayThingy.push("Tomorrow");
//alert(nesheDate.getDay());
nesheDate.setDate(nesheDate.getDate() + 1);
for (i = 0; i < 5; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    dateArrayThingy.push(weekdayFull[nesheDate.getDay()]);
}
for (i = 0; i < 100; i++) {
    nesheDate.setDate(nesheDate.getDate() + 1);
    //alert(weekday[nesheDate.getDay()]);
    var day = weekday[nesheDate.getDay()];
    var month = monthChar[nesheDate.getMonth()];
    var dayInMonth = nesheDate.getDate();
    dateArrayThingy.push(day + " " + month + " " + dayInMonth);
}
