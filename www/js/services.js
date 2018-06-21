
angular.module('football.services', [])
    .factory('AdminStore', function ($ionicPopup, $http, $q, $ionicLoading) {
        var Availables = [];
        var SchedulesByDay = [];
        var MyStadiums = [];
        var MyMiniStadiums = [];
        var MyBalances = [];
        var Customers = [];
        var MyPromotions = [];
        var MyCustomers = [];

        var customerinfo = {};

        var notificationtoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMjMzM2FhYy1jNjBjLTQyNTItYjI1ZS05MmY0ZGQ5OGRhNmYifQ.QCuKlXbH3CczgW-bScCoPVVhPcdf_peZadTRIZFL4j0';
        var notificationurl = 'https://onesignal.com/api/v1/notifications';
        var notificationprofile = 'arinaprofile';

        return {
            GetMyStadiums: function (callback) {
                MyStadiums = [];

                var user = firebase.auth().currentUser;

                var id = user.uid;
                firebase.database().ref('/admins/' + id + '/stadiums').once('value', function (snapshot) {

                    // alert("test");
                    snapshot.forEach(function (mainstadiumSnapshot) {
                        //alert(mainstadiumSnapshot.child("name").val());
                        var Data = {
                            "key": mainstadiumSnapshot.key,
                            "name": mainstadiumSnapshot.key,
                            "photo": mainstadiumSnapshot.child("Photo").val()

                        };
                        MyStadiums.push(Data);

                    });

                    callback(MyStadiums);
                }, function (error) {

                });

                //alert(Availables.length());
                return Availables;
            },
            GetMyStadiumById: function (stadiumid, callback) {


                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/stadiumsinfo/' + stadiumid).once('value', function (snapshot) {

                    var Data = {
                        "key": snapshot.key,
                        "name": snapshot.child("name").val(),
                    };
                    callback(Data);
                }, function (error) {

                });

                //alert(Availables.length());
                return Availables;
            },
            GetMyMiniStadiums: function (stadiumid, callback) {


                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/stadiums/' + stadiumid + '/ministadiums').once('value', function (snapshot) {
                    MyMiniStadiums = [];
                    // alert("test");
                    snapshot.forEach(function (mainstadiumSnapshot) {

                        var rating = 0;
                        var NumberOfChildren = 0;

                        if (mainstadiumSnapshot.child("rated").exists()) {

                            var RateList = mainstadiumSnapshot.child("rated").val();

                            for (var k in RateList) {

                                if (RateList[k].rated == 1) {
                                    rating += RateList[k].rate;
                                    NumberOfChildren += 1;
                                }
                            }

                            if (NumberOfChildren != 0) {
                                rating = rating / NumberOfChildren;
                            }
                        }

                        //alert(mainstadiumSnapshot.child("name").val());
                        var Data = {
                            "key": mainstadiumSnapshot.key,
                            "name": mainstadiumSnapshot.key,
                            "name2": mainstadiumSnapshot.child("description").val(),
                            "photo": mainstadiumSnapshot.child("photo").val(),
                            "photo1": mainstadiumSnapshot.child("photo1").val(),
                            "photo2": mainstadiumSnapshot.child("photo2").val(),
                            "photo3": mainstadiumSnapshot.child("photo3").val(),
                            "photo4": mainstadiumSnapshot.child("photo4").val(),
                            "endhour": mainstadiumSnapshot.child("endhour").val(),
                            "endminute": mainstadiumSnapshot.child("endminute").val(),
                            "price": mainstadiumSnapshot.child("price").val(),
                            "starthour": mainstadiumSnapshot.child("starthour").val(),
                            "startminute": mainstadiumSnapshot.child("startminute").val(),
                            "type": mainstadiumSnapshot.child("type").val(),
                            "rating": rating,
                            //"freetimes": freetimes,
                            "SortPoints": 0,
                            "latitude": snapshot.child("cordovalatitude").val(),
                            "longitude": snapshot.child("cordovalongitude").val(),
                            "iscombined": mainstadiumSnapshot.child("iscombined").val(),
                            "combined": mainstadiumSnapshot.child("combined").val(),
                            "city": snapshot.child("city").val(),
                            "telephone": snapshot.child("telephone").val(),
                            "typefloor": mainstadiumSnapshot.child("typefloor").val(),
                            "numofplayers": mainstadiumSnapshot.child("numplayers1").val(),
                            "numberofrating": NumberOfChildren
                        };
                        Data.Photos = [];

                        if (Data.photo != null || Data.photo != undefined) {
                            if (Data.photo != '') {
                                Data.Photos.push({ URL: Data.photo });
                            }
                        }
                        if (Data.photo1 != null || Data.photo1 != undefined) {
                            if (Data.photo1 != '') {
                                Data.Photos.push({ URL: Data.photo1 });
                            }
                        }
                        if (Data.photo2 != null || Data.photo2 != undefined) {
                            if (Data.photo2 != '') {
                                Data.Photos.push({ URL: Data.photo2 });
                            }
                        }
                        if (Data.photo3 != null || Data.photo3 != undefined) {
                            if (Data.photo3 != '') {
                                Data.Photos.push({ URL: Data.photo3 });
                            }
                        }
                        if (Data.photo4 != null || Data.photo4 != undefined) {
                            if (Data.photo4 != '') {
                                Data.Photos.push({ URL: Data.photo4 });
                            }
                        }

                        MyMiniStadiums.push(Data);



                    });

                    callback(MyMiniStadiums);
                }, function (error) {

                });

                //alert(Availables.length());
                return Availables;
            },

            GetMyStadiumsByDay: function (search, callback) {


                //alert(search.date.getMonth());
                //alert("TEST");
                SchedulesByDay = [];
                var user = firebase.auth().currentUser;


                var id = user.uid;

                //alert(id);

                var year = search.date.getFullYear();
                var month = search.date.getMonth();
                var day = search.date.getDate();

                firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {
                    SchedulesByDay = [];
                    snapshot.forEach(function (ministadiums) {
                        //var mininame = ministadiums.child("name").val();
                        ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                            if (miniministadiums.child('schedules/' + year + '/' + month + '/' + day).exists()) {
                                miniministadiums.child('schedules/' + year + '/' + month + '/' + day).forEach(function (minischedule) {

                                    var color = "white";
                                    if (minischedule.child('bookedadmin').exists()) {
                                        if (minischedule.child('bookedadmin').val()) {
                                            var color = "lightgray";
                                        }
                                    }
                                    if (minischedule.child('maindata').val()) {
                                        var startdate = minischedule.child("fullstartdate").val();

                                        var startdate = new Date();


                                        startdate.setMinutes(minischedule.child('minute').val());
                                        startdate.setFullYear(year);
                                        startdate.setDate(minischedule.child('day').val());
                                        startdate.setMonth(month);
                                        startdate.setHours(minischedule.child('hour').val());

                                        var enddate = new Date();

                                        enddate.setMinutes(minischedule.child('minute').val());
                                        enddate.setFullYear(year);
                                        enddate.setDate(minischedule.child('day').val());
                                        enddate.setMonth(month);
                                        enddate.setHours(minischedule.child('hour').val());

                                        enddate.setMinutes(enddate.getMinutes() + minischedule.child('duration').val() * 1);

                                        var Data =
                                        {

                                            "daykey": minischedule.key,
                                            "key": ministadiums.key,
                                            "name": minischedule.child("name").val(),

                                            "minikey": miniministadiums.key,
                                            "mininame": miniministadiums.child("description").val(),
                                            "day": day,
                                            "month": month,
                                            "year": year,
                                            "fullenddate": enddate,
                                            "fullstartdate": startdate,

                                            "starthour": minischedule.child('hour').val(),
                                            "startminute": minischedule.child('minute').val() == 0 ? "00" : minischedule.child('minute').val(),

                                            "firstname": minischedule.child("firstname").val(),
                                            "user": minischedule.child("uid").val(),
                                            "userid": minischedule.child("usercode").val(),
                                            "username": "",
                                            "telephone": minischedule.child("telephone").val(),
                                            //"telephone": miniministadiums.child("telephone").val(),
                                            "price": minischedule.child("price").val(),
                                            "color": color,
                                            "references": minischedule.child("references").val(),
                                            "isrecurring": minischedule.child("isrecurring").val(),
                                            "recurringkey": minischedule.child("recurringkey").val(),
                                            "onlyrecurring": minischedule.child("onlyrecurring").val(),
                                            "minute": minischedule.child("minute").val(),
                                            "hour": minischedule.child("hour").val(),
                                            "type": minischedule.child("type").val(),
                                            "combined": miniministadiums.child("combined").val(),
                                            "relatedto": miniministadiums.child("relatedto").val(),
                                            "iscombined": minischedule.child("iscombined").val(),
                                            "stadiumname": ministadiums.child("name").val()

                                        };

                                        if (minischedule.child("type").val() == "T") {
                                            Data.challengekey = minischedule.child("challengekey").val();
                                        }

                                        SchedulesByDay.push(Data);
                                    }



                                });
                            }
                        });

                    });
                    callback(SchedulesByDay);
                }, function (error) {
                    console.log(error);
                    callback(SchedulesByDay);
                });

            },

            GetBookingsByRecurringId: function (Booking, callback) {

                console.log(Booking);
                SchedulesByDay = [];
                var user = firebase.auth().currentUser;

                var id = user.uid;

                firebase.database().ref('/stadiums/' + Booking.key + '/ministadiums').once('value', function (stadium) {
                    SchedulesByDay = [];
                    stadium.forEach(function (ministadiums) {

                        ministadiums.child("schedules").forEach(function (years) {
                            //var mininame = ministadiums.child("name").val();
                            years.forEach(function (months) {

                                months.forEach(function (days) {

                                    days.forEach(function (schedules) {

                                        if (schedules.child('maindata').val()) {

                                            if (Booking.recurringkey == schedules.child("recurringkey").val()) {


                                                var startdate = schedules.child("fullstartdate").val();
                                                var startdate = new Date();


                                                startdate.setMinutes(schedules.child('minute').val());
                                                startdate.setFullYear(schedules.child('year').val());
                                                startdate.setDate(schedules.child('day').val());
                                                startdate.setMonth(schedules.child('month').val());
                                                startdate.setHours(schedules.child('hour').val());

                                                if (startdate > new Date()) {
                                                    var enddate = new Date();

                                                    enddate.setMinutes(schedules.child('minute').val());
                                                    enddate.setFullYear(schedules.child('year').val());
                                                    enddate.setDate(schedules.child('day').val());
                                                    enddate.setMonth(schedules.child('month').val());
                                                    enddate.setHours(schedules.child('hour').val());

                                                    enddate.setMinutes(enddate.getMinutes() + schedules.child('duration').val() * 1);


                                                    var Data =
                                                    {

                                                        "daykey": schedules.key,
                                                        "key": Booking.key,
                                                        "name": schedules.child("name").val(),

                                                        "minikey": ministadiums.key,
                                                        "mininame": schedules.child("description").val(),
                                                        "day": schedules.child("day").val(),
                                                        "month": schedules.child("month").val(),
                                                        "year": schedules.child("year").val(),
                                                        "minute": schedules.child("minute").val(),
                                                        "hour": schedules.child("hour").val(),
                                                        "fullenddate": enddate,
                                                        "fullstartdate": startdate,

                                                        "starthour": schedules.child('hour').val(),
                                                        "startminute": schedules.child('minute').val() == 0 ? "00" : schedules.child('minute').val(),

                                                        "firstname": schedules.child("firstname").val(),
                                                        "references": schedules.child("references").val(),

                                                        "isrecurring": schedules.child("isrecurring").val(),
                                                        "recurringkey": schedules.child("recurringkey").val(),
                                                        "onlyrecurring": schedules.child("onlyrecurring").val(),

                                                        "references": schedules.child("references").val()


                                                    };

                                                    SchedulesByDay.push(Data);
                                                }
                                            }

                                        }
                                    })

                                });
                            })
                        });

                    })


                    callback(SchedulesByDay);
                }, function (error) {

                });

            },

            GetMyBalances: function (month, callback) {


                MyBalances = [];
                var user = firebase.auth().currentUser;
                var id = user.uid;

                try {

                    firebase.database().ref('/stadiums').orderByChild("admin").equalTo(id).on('value', function (snapshot) {

                        MyBalances = [];
                        snapshot.forEach(function (ministadiums) {

                            ministadiums.child("ministadiums").forEach(function (miniministadiums) {


                                if (miniministadiums.child('schedules').exists()) {

                                    miniministadiums.child('schedules').forEach(function (yearschedule) {


                                        yearschedule.forEach(function (monthschedule) {

                                            if (monthschedule.key == month) {

                                                monthschedule.forEach(function (dayschedule) {

                                                    dayschedule.forEach(function (schedule, i) {

                                                        if (schedule.child('maindata').val()) {
                                                            var total;
                                                            var price;
                                                            var booked = false;

                                                            if (dayschedule.child('bookedadmin').exists()) {

                                                                if (minischedule.child('bookedadmin').val()) {
                                                                    price = schedule.child("price").val();
                                                                    total = schedule.child("price").val();

                                                                }
                                                                else {

                                                                    booked = true;
                                                                }

                                                            }
                                                            else {

                                                                booked = true;

                                                            }
                                                            price = schedule.child("price").val();
                                                            total = schedule.child("price").val();
                                                            var Data =
                                                            {
                                                                "key": ministadiums.key,
                                                                "minikey": miniministadiums.key,

                                                                "reservationnum": schedule.key,
                                                                "type": schedule.child("type").val(),

                                                                "year": schedule.child("year").val(),
                                                                "month": (schedule.child("month").val() + 1),
                                                                "day": schedule.child("day").val(),
                                                                "hour": schedule.child("hour").val(),
                                                                "minute": schedule.child("minute").val() == 0 ? "00" : schedule.child("minute").val(),
                                                                //"telephone": miniministadiums.child("telephone").val(),
                                                                "price": price,
                                                                "percentage": 0,
                                                                "total": total.toFixed(2),
                                                                "perc": 0

                                                            };
                                                            MyBalances.push(Data);
                                                        }
                                                    });
                                                });

                                            }

                                        });
                                    });
                                }//if


                            });
                        });
                        callback(MyBalances);
                    }, function (error) {

                    });
                }
                catch (error) {

                }

            },

            AddStadium: function (stadiums) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var stadium = {
                    admin: id,
                    name: stadiums.name,
                    telephone: stadiums.telephone != null ? stadiums.telephone : "",
                    city: stadiums.city != null ? stadiums.city : "",
                    address1: stadiums.address1 != null ? stadiums.address1 : "",
                    address2: stadiums.address2 != null ? stadiums.address2 : "",
                    email: stadiums.email != null ? stadiums.email : "",
                    description: stadiums.description != null ? stadiums.description : "",
                    cancelationpolicy: stadiums.cancelationpolicy != null ? stadiums.city : "",
                    rating: 0,
                    water: true,
                    photo: ""

                };
                var newPostKey = firebase.database().ref().child('stadiums').push().key;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/stadiums/' + stadiums.name] = stadium;
                updates['/admins/' + id + '/stadiums/' + stadiums.name] = stadium;

                return firebase.database().ref().update(updates);
            },

            AddMiniStadium: function (key, stadiums) {

                // Get a key for a new Post.
                try {

                    var user = firebase.auth().currentUser;
                    var id = user.uid;


                    var stadium = {

                        description: stadiums.name,
                        width: stadiums.width != null ? stadiums.width : "",
                        length: stadiums.heigth != null ? stadiums.heigth : "",

                        price: stadiums.price != null ? stadiums.price : "",
                        type: stadiums.type != null ? stadiums.type : "",
                        typefloor: stadiums.typefloor != null ? stadiums.typefloor : "",

                        photo: stadiums.photo != null ? stadiums.photo : "",
                        rating: "0",
                        numplayers: stadiums.numplayers

                    };

                    var newPostKey = firebase.database().ref().child('/stadiums/' + key + '/ministadiums/').push().key;

                    var updates = {};
                    updates['/stadiums/' + key + '/ministadiums/' + newPostKey] = stadium;
                    updates['/stadiumsinfo/' + key + '/ministadiums/' + newPostKey] = stadium;

                    return firebase.database().ref().update(updates);
                }

                catch (error) {

                }
            },
            GetCustomers: function (callback) {
                Customers = [];
                try {
                    firebase.database().ref('/players').on('value', function (snapshot) {
                        Customers = [];
                        snapshot.forEach(function (PlayerSnapshot) {
                            var numbookings = 0;
                            var showedUp = 0;
                            if (PlayerSnapshot.child("upcomingmatches").exists()) {
                                numbookings = PlayerSnapshot.child("upcomingmatches").numChildren();
                            }
                            var allBookings = [];
                            allBookings = PlayerSnapshot.child("upcomingmatches");
                            allBookings.forEach(function (match) {
                                if (match.child("fullstartdate").exists() && match.child("didnotshowup").exists() && match.child("cancelled").exists()) {
                                    var matchDate = new Date(match.child("fullstartdate").val());
                                    var xshowup = match.child("didnotshowup").val();
                                    var canceld = match.child("cancelled").val();
                                    var now = new Date();
                                    if (matchDate < now && !xshowup && !canceld) {
                                        showedUp++;
                                    }
                                }
                            });

							/**for(i=0; i < numbookings; i++)
							{
								var curBooking = allBookings[i];
								if("fullstartdate" in curBooking && "cancelled" in curBooking && "didnotshowup" in curBooking)
								{
									if(curBooking.fullstartdate < new Date() && !curBooking.cancelled && !curBooking.didnotshowup)
									{
										showedUp++;
										console.log(allBookings[i].fullstartdate);
									}
								}								
							}**/

                            var Data = {
                                "key": PlayerSnapshot.key,
                                "firstname": PlayerSnapshot.child("firstname").val(),
                                "lastname": PlayerSnapshot.child("lastname").val(),
                                "email": PlayerSnapshot.child("email").val(),
                                "telephone": PlayerSnapshot.child("telephone").val(),
                                "bookings": numbookings - PlayerSnapshot.child("cancelled").val() - PlayerSnapshot.child("didnotshowup").val(),
                                "cancelled": PlayerSnapshot.child("cancelled").val(),
                                "didnotshowup": PlayerSnapshot.child("didnotshowup").val(),
                                "cancelledweather": PlayerSnapshot.child("cancelledweather").val(),
                                "showedUp": showedUp

                            };
                            Customers.push(Data);

                        });

                        callback(Customers);
                    }, function (error) {

                    });
                }
                catch (error) {

                }

                return Customers;
            },
            GetCustomerByCode: function (code, callback) {
                customerinfo = {};
                try {
                    firebase.database().ref('/players/' + code).once('value', function (snapshot) {

                        if (snapshot.exists()) {
                            var numbookings = 0;

                            var Data = {
                                "key": snapshot.key,
                                "firstname": snapshot.child("firstname").val(),
                                "lastname": snapshot.child("lastname").val(),
                                "email": snapshot.child("email").val(),
                                "telephone": snapshot.child("telephone").val(),
                                //  "bookings": numbookings,
                                "showedup": snapshot.child("showedup").val(),
                                "cancelled": snapshot.child("cancelled").val(),
                                "didnotshowup": snapshot.child("didnotshowup").val(),
                                "cancelledweather": snapshot.child("cancelledweather").val(),
                                "devicetoken": snapshot.child("devicetoken").val()

                            };
                            customerinfo = Data;
                        }

                        callback(customerinfo);
                    }, function (error) {

                    });
                }
                catch (error) {

                }

                return Customers;
            },

            UpdateScores: function (customer) {

                var updates = {};
                updates['/players/' + customer.key + '/cancelledweather'] = customer.cancelledweather;
                updates['/players/' + customer.key + '/didnotshowup'] = customer.didnotshowup;
                updates['/players/' + customer.key + '/cancelled'] = customer.cancelled;

                return firebase.database().ref().update(updates);

            },

            GetMyCustomers: function (callback) {
                MyCustomers = [];

                var user = firebase.auth().currentUser;


                var id = user.uid;
                try {
                    firebase.database().ref('/admins/' + id + '/mycustomers').on('value', function (snapshot) {
                        MyCustomers = [];
                        snapshot.forEach(function (PlayerSnapshot) {
                            var Data = {
                                "key": PlayerSnapshot.key,
                                "firstname": PlayerSnapshot.child("firstname").val(),
                                "telephone": PlayerSnapshot.child("telephone").val(),

                            };
                            MyCustomers.push(Data);

                        });

                        callback(MyCustomers);
                    }, function (error) {

                    });
                }
                catch (error) {

                }
                //alert(Availables.length());
                return Customers;
            },

            AddBooking: function (stadiumdata, search, details) {

                try {

                    var maindate = new Date();
                    var tempdate = new Date();

                    maindate.setFullYear(search.date.getFullYear());
                    maindate.setDate(search.date.getDate());
                    maindate.setMonth(search.date.getMonth());
                    maindate.setHours(search.date.getHours());
                    maindate.setMinutes(search.date.getMinutes());

                    tempdate.setFullYear(search.date.getFullYear());
                    tempdate.setDate(search.date.getDate());
                    tempdate.setMonth(search.date.getMonth());
                    tempdate.setHours(search.date.getHours());
                    tempdate.setMinutes(search.date.getMinutes());

                    var year = search.date.getFullYear();
                    var month = search.date.getMonth();
                    var day = search.date.getDate();

                    var hour = search.date.getHours();
                    var minute = search.date.getMinutes();

                    var key = stadiumdata.key;
                    var subkey = stadiumdata.subkey;

                    var username = stadiumdata.firstname;


                    var adminuser = firebase.auth().currentUser;

                    var adminid = adminuser.uid;

                    var id = stadiumdata.customer;

                    var counter = 0;

                    switch (details.recurring) {
                        case 'Once':
                            counter = 1;
                            break;
                        case '4 weeks':
                            counter = 4;
                            break;
                        case '6 weeks':
                            counter = 6;
                            break;
                        case '8 weeks':
                            counter = 8;
                            break;
                        case '10 weeks':
                            counter = 10;
                            break;
                        case '16 weeks':
                            counter = 16;
                            break;
                        case '24 weeks':
                            counter = 24;
                            break;
                        default:
                            break;
                    }
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};

                    var recurringkey = "";
                    if (counter != 1) {
                        var recurringkey = firebase.database().ref().child('stadiums').push().key;
                    }

                    for (var index = 0; index < counter; index++) {

                        var newkey = subkey
                            + year.toString()
                            + month.toString()
                            + day.toString()
                            + hour.toString()
                            + minute.toString()

                        var mainkey = newkey;


                        var postData = {
                            usercode: id,
                            name: username,
                            telephone: stadiumdata.telephone,
                            hour: hour,
                            minute: minute,
                            day: day,
                            discount: "0",
                            month: month,
                            nettotal: "",
                            price: details.price,
                            starthour: "",
                            startmin: "",
                            teamone: "",
                            teamonescore: "",
                            teamtwo: "",
                            teamtwoscore: "",
                            year: year,
                            percentage: "0",
                            type: "B",
                            total: details.price,
                            bookedadmin: true,
                            duration: details.duration,
                            maindata: true,
                            fullstartdate: search.date,
                            fullenddate: "",
                            references: "",
                            telephone: details.telephone,
                            combined: details.combined,
                            reservationnumber: details.stadiumname.charAt(0) + subkey.charAt(0) + year.toString() + month.toString() + day.toString() + hour.toString() + minute.toString(),
                            isrecurring: counter != 1,
                            recurringkey: recurringkey,
                            onlyrecurring: recurringkey,
                            iscombined: details.iscombined,
                            cancelled: false,
                            didnotshowup: false
                        };

                        var extraslots = {
                            usercode: id,
                            type: "B",
                            maindata: false
                        };

                        updates['/players/' + id + '/upcomingmatches/' + newkey] = postData;


                        var numslots = details.duration / 30;
                        var references = [];

                        for (i = 1; i < numslots; i++) {
                            maindate.setMinutes(maindate.getMinutes() + 30);

                            newkey = subkey +
                                maindate.getFullYear().toString() +
                                maindate.getMonth().toString() +
                                maindate.getDate().toString() +
                                maindate.getHours().toString() +
                                maindate.getMinutes().toString()

                            var refdata = {
                                key: newkey
                            }
                            references.push(refdata);

                            var extrakeys = [];
                            if (details.iscombined) {
                                for (var itemkey in details.combined) {
                                    extrakeys.push(itemkey);
                                }
                                extrakeys.forEach(function (element) {

                                    newkey = element +
                                        maindate.getFullYear().toString() +
                                        maindate.getMonth().toString() +
                                        maindate.getDate().toString() +
                                        maindate.getHours().toString() +
                                        maindate.getMinutes().toString()

                                    var refdata = {
                                        key: newkey
                                    }

                                    references.push(refdata);

                                    updates['/stadiums/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                    updates['/stadiumshistory/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                                }, this);
                            }
                            newkey = subkey +
                                maindate.getFullYear().toString() +
                                maindate.getMonth().toString() +
                                maindate.getDate().toString() +
                                maindate.getHours().toString() +
                                maindate.getMinutes().toString()

                            var refdata = {
                                key: newkey
                            }
                            updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;
                            updates['/stadiumshistory/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + newkey] = extraslots;

                        }

                        postData.references = references;

                        var accountinfo = {
                            usercode: id,
                            hour: hour,
                            minute: minute,
                            day: day,
                            discount: "0",
                            month: month,
                            nettotal: "",
                            price: details.price,
                            starthour: "",
                            startmin: "",
                            year: year,
                            percentage: "0",
                            type: "B",
                            year: year,
                            total: details.price,
                            bookedadmin: true,
                            fullstartdate: maindate,
                            fullenddate: "",
                            iscombined: details.iscombined
                        };



                        updates['/stadiums/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                        updates['/stadiumshistory/' + key + '/ministadiums/' + subkey + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;

                        var keys = [];
                        if (details.iscombined) {
                            for (var itemkey in details.combined) {
                                keys.push(itemkey);
                            }

                            keys.forEach(function (element) {

                                var mainkey = element
                                    + year.toString()
                                    + month.toString()
                                    + day.toString()
                                    + hour.toString()
                                    + minute.toString()

                                updates['/stadiums/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                                updates['/stadiumshistory/' + key + '/ministadiums/' + element + '/schedules/' + year + '/' + month + '/' + day + '/' + mainkey] = postData;
                            }, this);
                        }


                        maindate.setHours(tempdate.getHours());
                        maindate.setMinutes(tempdate.getMinutes());

                        maindate.setDate(maindate.getDate() + 7);

                        var year = maindate.getFullYear();
                        var month = maindate.getMonth();
                        var day = maindate.getDate();

                        var hour = maindate.getHours();
                        var minute = maindate.getMinutes();

                    }

                    updates['/players/' + id + '/upcomingmatches/' + mainkey] = postData;
                    updates['/accounting/' + id + '/' + mainkey] = accountinfo;

                    return firebase.database().ref().update(updates);
                }
                catch (error) {
                }

            },
            DeleteBooking: function (booking, type) {

                var updates = {};

                var user = firebase.auth().currentUser;

                var id = user.uid;

                /*var counter = 1;
                if (booking.isrecurring) {
                    counter = 54;
                }*/

                //for (var index = 0; index < counter; index++) {

                var newkey = booking.minikey
                    + booking.year.toString()
                    + booking.month.toString()
                    + booking.day.toString()
                    + booking.hour.toString()
                    + booking.minute.toString();

                updates['/stadiums/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + newkey] = null;

                updates['/stadiumshistory/' + booking.key
                    + '/ministadiums/' + booking.minikey
                    + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + newkey] = null;



                booking.references.forEach(function (element) {

                    updates['/stadiums/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                    updates['/stadiumshistory/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                }, this);

                updates['/players/' + booking.user + '/upcomingmatches/' + booking.daykey] = null;

                /*var BookDate = new Date();
                BookDate.setFullYear(booking.year);
                BookDate.setMonth(booking.month);
                BookDate.setDate(booking.day);
            
                BookDate.setDate(BookDate.getDate() + 7);
            
                booking.year = BookDate.getFullYear();
                booking.month = BookDate.getMonth();
                booking.day = BookDate.getDate();*/

                //}

                return firebase.database().ref().update(updates);

            },
            DeleteRecurringBooking: function (book) {
                var updates = {};
                book.forEach(function (booking) {

                    var user = firebase.auth().currentUser;

                    var id = user.uid;

                    updates['/stadiums/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.daykey] = null;

                    updates['/stadiumshistory/' + booking.key
                        + '/ministadiums/' + booking.minikey
                        + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + booking.daykey] = null;



                    booking.references.forEach(function (element) {

                        updates['/stadiums/' + booking.key
                            + '/ministadiums/' + booking.minikey
                            + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                        updates['/stadiumshistory/' + booking.key
                            + '/ministadiums/' + booking.minikey
                            + '/schedules/' + booking.year + '/' + booking.month + '/' + booking.day + '/' + element.key] = null;

                    }, this);
                }, this);

                //console.log(updates);

                return firebase.database().ref().update(updates);

            },
            AddUser: function (newuser, newPostKey) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                if (newuser != null) {
                    var usertoadd =
                    {
                        email: newuser.email,
                        winstreak: 0,
                        userdescription: "",
                        telephone: newuser.telephone,
                        enableinvitations: true,
                        highestrating: 1500,
                        firstname: newuser.name,
                        lastname: newuser.lastname,
                        status: "0",
                        playposition: "Defender",
                        displayname: "",
                        favouritesport: "football",
                        middlename: "",
                        ranking: 100,
                        cancelled: 0,
                        cancelledweather: 0,
                        didnotshowup: 0

                    }

                    var mycustomer =
                    {
                        uid: newPostKey,
                        telephone: newuser.telephone,
                        firstname: newuser.name,
                        lastname: newuser.lastname,

                    }

                    var updates = {};

                    var ready = false;
                    try {

                        updates['/players/' + newPostKey] = usertoadd;
                        updates['/playersinfo/' + newPostKey] = usertoadd;
                        updates['/telephones/' + newuser.telephone] = mycustomer;
                        updates['/admins/' + id + '/mycustomers/' + newPostKey] = mycustomer;
                        return firebase.database().ref().update(updates);

                    }
                    catch (error) {

                    }


                }


            },
            AddPromotion: function (promotion) {

                if (promotion != null) {
                    var daynumber = 0;
                    switch (promotion.date) {

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

                    promotion.startyear = promotion.starttime.getFullYear();
                    promotion.startmonth = promotion.starttime.getMonth();
                    promotion.startday = promotion.starttime.getDate();
                    promotion.starthour = promotion.starttime.getHours();
                    promotion.startminute = promotion.starttime.getMinutes();



                    promotion.endyear = promotion.endtime.getFullYear();
                    promotion.endmonth = promotion.endtime.getMonth();
                    promotion.endday = promotion.endtime.getDate();
                    promotion.endhour = promotion.endtime.getHours();
                    promotion.endminute = promotion.endtime.getMinutes();

                    promotion.daynumber = daynumber;
                    promotion.DateIssued = new Date();


                    var promkey = firebase.database().ref().child('/promotions/' + promotion.stadium + '/' + promotion.ministadium).push().key;
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/promotions/' + promotion.stadium + '/' + promotion.ministadium + '/' + promkey] = promotion;


                    return firebase.database().ref().update(updates);
                }

            },
            GetPromotions: function (key, callback) {

                var user = firebase.auth().currentUser;

                var id = user.uid;
                //alert(id);
                firebase.database().ref('/promotions/' + key).on('value', function (snapshot1) {

                    MyPromotions = [];
                    // alert("test");

                    if (snapshot1.exists()) {

                        snapshot1.forEach(function (snapshot) {

                            snapshot.forEach(function (promotions) {


                                var Data = {
                                    key: promotions.key,
                                    name: promotions.child("name").val(),
                                    stadium: key,
                                    ministadium: snapshot.key,
                                    date: promotions.child("date").val(),
                                    starttime: promotions.child("starttime").val(),
                                    endtime: promotions.child("endtime").val(),
                                    discount: promotions.child("discount").val(),
                                    weekly: promotions.child("weekly").val(),
                                    newprice: promotions.child("newprice").val(),

                                    startyear: promotions.child("startyear").val(),
                                    startdate: promotions.child("startdate").val(),
                                    startmonth: promotions.child("startmonth").val(),
                                    starthour: promotions.child("starthour").val(),
                                    startminute: promotions.child("startminute").val(),
                                    DateIssued: new Date(promotions.child("DateIssued").val()),
                                };

                                MyPromotions.push(Data);

                            })

                        })
                    }

                    callback(MyPromotions);
                }, function (error) {
                    console.log(error);
                });

                return Availables;
            },
            DeletePromotion: function (promotion) {

                if (promotion != null) {
                    //alert(newPostKey);
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/promotions/' + promotion.stadium + '/' + promotion.ministadium + '/' + promotion.key] = null;


                    return firebase.database().ref().update(updates);
                }

            },
            SaveCustomer: function (Customer) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var updates = {};
                updates['/admins/' + id + '/mycustomers/' + Customer.key + '/telephone'] = Customer.telephone;
                updates['/admins/' + id + '/mycustomers/' + Customer.key + '/firstname'] = Customer.firstname;

                updates['/players/' + Customer.key + '/telephone'] = Customer.telephone;
                updates['/players/' + Customer.key + '/firstname'] = Customer.firstname;

                updates['/playersinfo/' + Customer.key + '/telephone'] = Customer.telephone;
                updates['/playersinfo/' + Customer.key + '/firstname'] = Customer.firstname;

                return firebase.database().ref().update(updates);

            },
            DeleteCustomer: function (Customer) {

                var user = firebase.auth().currentUser;
                var id = user.uid;

                var updates = {};
                updates['/admins/' + id + '/mycustomers/' + Customer.key] = null;
                updates['/players/' + Customer.key] = null;
                updates['/playersinfo/' + Customer.key] = null;

                return firebase.database().ref().update(updates);

            },
            GetChallengeByKey: function (myid, key, callback) {

                try {
                    ChallengeDetails = {};
                    var team1players = [];
                    var team2players = [];
                    firebase.database().ref('/challenges/' + key).once('value', function (challenges) {

                        if (challenges.exists()) {

                            var challengedate = new Date();


                            var isadmin = challenges.child("admin").val() == myid;

                            challengedate.setMinutes(challenges.child("minute").val());
                            challengedate.setFullYear(challenges.child("year").val());
                            challengedate.setDate(challenges.child("day").val());
                            challengedate.setMonth(challenges.child("month").val());
                            challengedate.setHours(challenges.child("hour").val());

                            if (challenges.child("team1players").exists()) {

                                challenges.child("team1players").forEach(function (pl) {

                                    var data = {

                                        key: pl.key,
                                        status: pl.child("status").val()

                                    }
                                    team1players.push(data);

                                })

                            }

                            if (challenges.child("team2players").exists()) {

                                challenges.child("team2players").forEach(function (p2) {

                                    var data2 = {

                                        key: p2.key,
                                        status: p2.child("status").val()

                                    }
                                    team2players.push(data2);

                                })

                            }

                            var challengedata = {
                                key: challenges.key,
                                accepted: challenges.child("accepted").val(),
                                day: challenges.child("day").val(),
                                hour: challenges.child("hour").val(),
                                minute: challenges.child("minute").val(),
                                month: challenges.child("month").val(),
                                stadiums: challenges.child("stadiums").val(),
                                team1adminid: challenges.child("team1adminid").val(),
                                team1key: challenges.child("team1key").val(),
                                team1logo: challenges.child("team1logo").val(),
                                team1name: challenges.child("team1name").val(),
                                team1rank: challenges.child("team1rank").val(),
                                team1jersey: challenges.child("team1jersey").val(),

                                team2adminid: challenges.child("team2adminid").val(),
                                team2key: challenges.child("team2key").val(),
                                team2logo: challenges.child("team2logo").val(),
                                team2name: challenges.child("team2name").val(),
                                team2rank: challenges.child("team2rank").val(),
                                team2jersey: challenges.child("team2jersey").val(),

                                challengeradmin: challenges.child("challengeradmin").val(),
                                year: challenges.child("year").val(),
                                date: challengedate,
                                isadmin: isadmin,
                                team1players: team1players,
                                team2players: team2players,

                                adminphoto: challenges.child("adminphoto").val(),
                                admintelephon: challenges.child("admintelephon").val(),
                                adminname: challenges.child("adminname").val(),
                                numplayers: challenges.child("numplayers").val()


                            }

                            ChallengeDetails = challengedata;
                        }
                        console.log(ChallengeDetails);
                        // alert(JSON.stringify(ChallengeDetails));
                        callback(ChallengeDetails);

                    }, function (error) {

                    });

                } catch (error) {

                }

            },

            ChooseWinner: function (Challenge, Winner) {
                var updates = {};

                var mainkey = Challenge.stadiums.ministadiumkey
                    + Challenge.year.toString()
                    + Challenge.month.toString()
                    + Challenge.day.toString()
                    + Challenge.hour.toString()
                    + Challenge.minute.toString();

                switch (Winner) {
                    case 1:
                        //updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 1;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 1;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 1;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 2;
                        break;

                    case 2:
                        //updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 2;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 2;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 2;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 1;

                        break;

                    case 3:
                        // updates['/stadiums/' + Challenge.stadiums.stadiumkey + '/ministadiums/' + Challenge.stadiums.ministadiumkey + '/schedules/' + Challenge.year + '/' + Challenge.month + '/' + Challenge.day + '/' + mainkey + '/status'] = 3;
                        updates['/challenges/' + Challenge.challengekey + '/status'] = 3;
                        updates['/teams/' + Challenge.team1key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 3;
                        updates['/teams/' + Challenge.team2key + '/upcominteamgmatches/' + Challenge.key + '/status'] = 3;
                        break;

                    default:
                        break;
                }

                return firebase.database().ref().update(updates);

            },
            SendNotification: function (_message, devicetokens, atTime) {


                var message = {
                    app_id: "233d6f63-8ead-4ee7-8e69-03f4088a075a",
                    contents: { "en": _message },
                    include_player_ids: devicetokens
                };

                var headers = {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic MTg2NTRmZmUtOTBiYS00OGI3LWJmOTUtNzNiMzU1NTFkZGYy"
                };

                if (atTime === undefined) {
                    console.log("devliery time not passed");
                }
                else {
                    message.send_after = atTime;
                    //message.delayed_option =timezone;
                    //message.delivery_time_of_day=atTime;
                }

                var req = {
                    method: 'POST',
                    url: notificationurl,
                    headers: headers,
                    data: message,
                    headings: { "en": "English Title", "es": "Spanish Title" }

                }

                $http(req).then(function () {

                }, function (error) {

                });


            },

        }
    })