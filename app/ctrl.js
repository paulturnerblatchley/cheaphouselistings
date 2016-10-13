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
app.controller('ListingCtrl', [
    '$scope',
    'listings',
    'auth',
    function($scope, listings, auth) {
        $scope.listings = listings.listings;
        $scope.addListing = function() {
            listings.create({
                address: $scope.address,
                city: $scope.city,
                price: $scope.price,
                sqft: $scope.sqft,
                lotsize: $scope.lotsize,
                beds: $scope.beds,
                baths: $scope.baths,
            });
            $scope.address = '';
            $scope.city = '';
            $scope.price = '';
            $scope.sqft = '';
            $scope.lotsize = '';
            $scope.beds = '';
            $scope.baths = '';
        };
    }
]


/*function($scope, $rootScope, $routeParams, $location, $http, auth) {
    $scope.listings = {};
    $scope.newlisting = {};
    $scope.newlisting = {address: '', city: '', price: '', sqft: '', lotsize: '', beds: '', baths: '', images: '', listdesc: ''};
    $scope.newListing = function(listing) {
        auth.post('new-listing', {
            listing: listing
        }).then(function (results) {
            auth.toast(results);
            if (results.status == "success") {
                $location.path('listings/' + results.lid);
            }
        });
    };
}*/

);

// navbar controller
app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);