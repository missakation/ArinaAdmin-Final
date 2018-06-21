angular.module('football.controllers', [])


    .factory('LoginStore', function () {
        var TempItems = [];
        var myaccount =
        {
            code: "00001"
        };

        return {

            AddUser: function (newuser, username) {

                if (newuser != null) {
                    var usertoadd =
                    {
                        uid: newuser.uid,
                        email: newuser.email,
                        winstreak: 0,
                        userdescription: "",
                        telephone: "",
                        enableinvitations: true,
                        highestrating: 1500,
                        firstname: "",
                        lastname: "",
                        status: "0",
                        playposition: "Defender",
                        displayname: username,
                        favouritesport: "football",
                        middlename: "",
                        ranking: 100

                    }
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/players/' + newuser.uid + '/'] = usertoadd;
                    updates['/admins/' + newuser.uid + '/'] = usertoadd;


                    return firebase.database().ref().update(updates);
                }

            }

        }

    })

    .controller('FirstPageController', function ($scope, $ionicPopover, $ionicHistory, $ionicPopup, $ionicLoading, $state, $timeout) {


        try {

            $timeout(function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                var user = firebase.auth().currentUser;
                if (user) {

                    $state.go('app.adminbookings');

                } else {
                    $state.go('signin');
                }

            }, 3000);

        }
        catch (error) {
            alert(error.message);

        }

    })



    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {



    })

    .controller('LoginController', function ($scope, $ionicModal, $ionicHistory, $ionicPopup, $timeout, $state, LoginStore) {

        var user = firebase.auth().currentUser;

        if (user) {
            $state.go("app.adminbookings");
        } else {

        }
        $scope.loginData = {};
        $scope.LoadingSigning = false;


        $scope.email = '';
        $scope.displayname = '';
        $scope.password = '';


        $scope.registerusername = '';
        $scope.registerpassword = '';


        $scope.Register = function (username) {


            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).then(function (user) {
                var newuser = firebase.auth().currentUser;
                var name, email, photoUrl, uid;

                if (user != null) {

                    LoginStore.AddUser(newuser, $scope.displayname);

                    var alertPopup = $ionicPopup.alert({
                        title: 'Account Registed',
                        template: 'Thank you for registering. You will be redirected to the homepage'
                    });

                    alertPopup.then(function () {
                        $state.go("app.adminpage");
                    });



                }

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                $ionicPopup.alert({
                    title: 'Warning',
                    template: errorMessage
                });

                //alert(errorMessage);


            });
        };


        $scope.LogIn = function (username) {

            $scope.LoadingSigning = true;

            if (!$scope.registerusername || !$scope.registerpassword) {
                $scope.LoadingSigning = false;
                return;
            }

            firebase.auth()
                .signInWithEmailAndPassword(
                    $scope.registerusername,
                    $scope.registerpassword)
                .then(function (user) {

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go("app.adminbookings");
                    $scope.LoadingSigning = false;

                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    $scope.LoadingSigning = false;

                    $ionicPopup.alert({
                        title: 'Warning',
                        template: 'Oops! You Entered the wrong Email or password'
                    });

                    // alert(errorMessage);
                });
        };


        $scope.FacebookLogin = function () {
            try {
                // alert("test1");
                var auth = firebase.auth();
                // alert("test2");
                facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], //first argument is an array of scope permissions
                    function (userData) {

                        if (userData.authResponse) {
                            facebookConnectPlugin.api('me/?fields=email,gender,name,first_name,last_name', ["public_profile"],
                                function (infoesult) {

                                    alert(JSON.stringify(infoesult));
                                    alert('Good to see you, ' +
                                        infoesult.email + infoesult.name + '.');
                                });

                        }

                        facebookConnectPlugin.getAccessToken(function (token) {
                            //alert("Token: " + token);
                            var credential = firebase.auth.FacebookAuthProvider.credential(token);
                            firebase.auth().signInWithCredential(credential).then(function (result) {

                                $state.go('app.adminpage');

                            }).catch(function (error) {
                                // Handle Errors here.
                                alert("test3");
                                alert(error.code);
                                alert(error.message);
                                // ...
                            });
                        });



                    },
                    function (error) {
                        alert(error);

                        alert(JSON.stringify(error));
                    }
                )
            }
            catch (error) {
                alert(error.message);
            }

        };

        $scope.GoToRegister = function () {
            $state.go('registerpage');
        };

        //firebase.auth().onAuthStateChanged(function (user) {
        //    if (user) {
        //        var user = firebase.auth().currentUser;
        //        var name, email, photoUrl, uid;

        //        if (user != null) {
        //            alert(user.displayName);
        //            alert(user.email);
        //            alert(user.photoURL);
        //            alert(user.uid);  // The user's ID, unique to the Firebase project. Do NOT use
        //            // this value to authenticate with your backend server, if
        //            // you have one. Use User.getToken() instead.
        //        }
        //    } else {
        //        //alert("user signed out");
        //    }
        //});





    })

    .controller('SignInCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggaess', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })



    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggaess', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('FeedBackController', ['$scope', function ($scope) {

        $scope.submit = function () {
            //$scope.list.push(this.text);
            //$scope.text = '';
            alert("Yo")
            $scope.text = 'tee';

        };
    }])

    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.example = {
            text: 'guest',
            word: /^\s*\w*\s*$/
        };
    }])

    .controller('SubmitSearch', function ($scope, $ionicModal, $timeout, $state) {
        alert("Yo"); $scope.submit = function () {


            $state.go('availablestadiums');
        };
    })

    ;
