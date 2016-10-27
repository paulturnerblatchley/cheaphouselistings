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
    $scope.isLoggedIn = function() {
        if ($rootScope.authenticated) {
            return true;
        } else {
            return false;
        }
    };
    $scope.isAdmin = function() {
        if ($rootScope.isadmin == 1) {
            return true;
        } else {
            return false;
        }
    };
    $scope.logout = function () {
        auth.get('logout').then(function (results) {
            auth.toast(results);
            $location.path('login');
        });
    };
});

// listing controller
app.controller('ListingCtrl', function($scope, $rootScope, $route, $location, $http, $localStorage, $sessionStorage, auth, listings, singlelisting, searchListings, savedListings, Data) {
    $scope.listings = listings.listings;
    $scope.newlisting = {};
    $scope.newlisting = {address: '', city: '', price: '', sqft: '', lotsize: '', beds: '', baths: '', listdesc: '', images: ''};
    $scope.newListing = function(listing) {
        var f = document.getElementById('file').files;
        for (i=0; i<f.length; i++) {
            if (i == 0) {
                listing.images += f[i].name;
            } else {
                listing.images += ", " + f[i].name;
            }
        }
        listing.address = listing.address;
        listing.city = listing.city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        listing.price = listing.price.replace(/\$|,/g, '');
        listing.beds = parseInt(listing.beds);
        listing.baths = parseInt(listing.baths);
        auth.post('listings', {
            listing: listing
        }).then(function (results) {
            auth.toast(results)
            if (results.status == "success") {
                $location.path('listings/' + results.lid);
            }
        });
    };

    $scope.uploadFile = function() {
        var files = [];
        for (i=0;i<$scope.myFile.length;i++) {
            files.push($scope.myFile[i]);
            Data('uploader').postImage(files[i], function(response) {
            });
        }
    };

    $scope.s = singlelisting.listing;

    $scope.searchRes = searchListings.listings;
    $scope.saved = savedListings.listings;

    $scope.hasSavedListings = function() {
      console.log($scope.saved);
      if ($scope.saved[0] != null) {
        return true;
      } else {
        return false;
      }
    }

    $scope.$storage = $localStorage;
    $scope.setParams = function(city,price,beds,baths) {
        delete $scope.$storage.city;
        delete $scope.$storage.price;
        delete $scope.$storage.beds;
        delete $scope.$storage.baths;
        var citySearch = city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        $scope.$storage.city = citySearch;
        $scope.$storage.price = price;
        $scope.$storage.beds = beds;
        $scope.$storage.baths = baths;
        if ($location.url() != '/listings/search-results') {
            $location.path('listings/search-results');
        } else {
            $route.reload();
        }
    };


    $scope.noResults = function() {
        if($scope.searchRes[0] == null) {
            return true;
        }
    };


    // allows users to save listings to their dashboard
    $scope.saveListing = function(listing) {
        auth.post('saveListing', {
            listing: listing
        }).then(function(results){
            auth.toast(results);
        });
    };

});

app.controller('FormCtrl', function($scope) {

});
