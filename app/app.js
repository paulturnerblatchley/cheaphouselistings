var app = angular.module('chl', ['ngRoute', 'ngAnimate', 'ngResource', 'ngStorage', 'toaster']);

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                title: 'Login',
                templateUrl: 'partials/login.html',
                controller: 'authCtrl'
            })
            .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'ListingCtrl',
                resolve: {
                    getSavedListings: ['auth', 'savedListings', function(auth, savedListings) {
                        return auth.get('session').then(function(results) {
                            var lid = results.savedListings.split(",");
                            for (i = 1; i < lid.length; i++) {
                              savedListings.get('listings', lid[i]).then(function(res) {
                              });
                            }
                        });
                    }]
                }

            })
            .when('/', {
                title: 'Home',
                templateUrl: 'partials/home.html',
                role: '0'
            })
            .when('/listings', {
                title: 'Listings',
                templateUrl: 'partials/listings.html',
                controller: 'ListingCtrl',
                resolve: {
                  getListings: ['listings', function(listings) {
                    return listings.getListings('listings');
                  }]
                }
            })
            .when('/listings/new-listing', {
                title: 'Create A New Listing',
                templateUrl: 'partials/new-listing.html',
                controller: 'ListingCtrl',
                resolve: {
                    checkAdmin: function(auth, $location) {
                        auth.get('session').then(function (results) {
                        if(results.isadmin == 1) {
                            $location.path('/listings/new-listing');
                        } else {
                            $location.path('/listings');
                        }
                        })
                    }
                }
            })
            .when('/listings/search-results', {
              title: 'Search Results',
              templateUrl: 'partials/search-results.html',
              controller: 'ListingCtrl',
              resolve: {
                getParams: function( $localStorage ) {
                  $city = $localStorage.city;
                  $priceQ = $localStorage.priceQ;
                  $beds = $localStorage.beds;
                  $baths = $localStorage.baths;
                },
                getResults: ['searchListings', function(searchListings) {
                    return searchListings.get('listings', $city, $priceQ, $beds, $baths).then(function(res){
                        return res;
                    });
                }]
              }
            })
            .when('/listings/:lid', {
              title: 'Single Listing',
              templateUrl: 'partials/single-listing.html',
              controller: 'ListingCtrl',
              resolve: {
                getLid: function( $route ) {
                  $r = $route.current.params.lid;
                },
                getSingleListing: ['singlelisting', function(singlelisting) {
                  return singlelisting.get('listings', $r);
                }]
              }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
])
.run(function ($rootScope, $location, auth) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
      $rootScope.ready = '0';
        auth.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
                $rootScope.phone = results.phone;
                $rootScope.isadmin = results.isadmin;
                $rootScope.savedListings = results.savedListings;
            } else {
                $rootScope.authenticated = false;
                $rootScope.uid = '';
                $rootScope.name = 'Guest';
                $rootScope.email = '';
                $rootScope.phone = '';
                $rootScope.isadmin = 0;
                $rootScope.savedListings = '';
            }
        });
    });
});
