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
                controller: 'MainCtrl',
                role: '0'
            })
            .when('/listings', {
                title: 'Listings',
                templateUrl: 'partials/listings.html',
                controller: 'ListingCtrl'
            })
            .when('/listings/new-listing', {
                title: 'Create A New Listing',
                templateUrl: 'partials/new-listing.html',
                controller: 'ListingCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
}])
.run(function ($rootScope, $location, auth) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.authenticated = false;
        auth.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
            } else {
                var nextUrl = next.$$route.originalPath;
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                    $location.path("/login");
                }
            }
        });
    });
});
