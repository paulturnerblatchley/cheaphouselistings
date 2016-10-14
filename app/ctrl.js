// user auth controller
app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, auth) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        auth.post('login', {
            customer: customer
        }).then(function (results) {
            auth.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',phone:''};
    $scope.signUp = function (customer) {
        auth.post('signUp', {
            customer: customer
        }).then(function (results) {
            auth.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        auth.get('logout').then(function (results) {
            auth.toast(results);
            $location.path('login');
        });
    }
});

// listing controller
app.controller('ListingCtrl', function($scope, $rootScope, $routeParams, $location, $http, auth, listings, singlelisting) {
    $scope.listings = listings.listings;
    $scope.newlisting = {};
    $scope.newlisting = {address: '', city: '', price: '', sqft: '', lotsize: '', beds: '', baths: ''};
    $scope.newListing = function(listing) {
        auth.post('listings', {
            listing: listing
        }).then(function (results) {
            auth.toast(results)
            if (results.status == "success") {
                $location.path('listings/' + results.lid);
            }
        });
    };
    $scope.s = singlelisting.listing;
});
