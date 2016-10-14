var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'toaster']);

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
            .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'authCtrl'
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
        $rootScope.authenticated = false;
        auth.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
                $rootScope.isadmin = results.isadmin;
            } else {
                $rootScope.authenticated = false;
                $rootScope.uid = '';
                $rootScope.name = 'Guest';
                $rootScope.email = '';
                $rootScope.isadmin = 0;
            }
        });
    });
});
