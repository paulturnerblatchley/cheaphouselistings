var app = angular.module('chl', 
    ['ngRoute', 
     'ngAnimate', 
     'ngResource', 
     'ngStorage', 
     'toaster', 
     'ngMap', 
     'ngTouch', 
     'ui.grid', 
     'ui.grid.resizeColumns', 
     'ui.grid.moveColumns', 
     'ui.grid.selection', 
     'LocalStorageModule', 
     'ui.grid.saveState',
     'ang-drag-drop',
     'gantt',
     'gantt.sortable',
     'gantt.table',
     'gantt.movable', 
     'gantt.tooltips',
     'gantt.tree']);

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                title: 'Login',
                role: '0',
                templateUrl: 'partials/login.html',
                controller: 'authCtrl'
            })
            .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })
            .when('/add-user', {
                title: 'Add User',
                templateUrl: 'partials/add-user.html',
                controller: 'authCtrl',
                resolve: {
                    checkAdmin: function(auth, $location) {
                        auth.get('session').then(function (results) {
                        if(results.isadmin == 1) {
                            $location.path('/add-user');
                        } else {
                            $location.path('/login');
                        }
                        })
                    }
                }
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'PropertyCtrl',
                resolve: {
                    getSavedProperties: ['auth', 'savedProperties', '$location', function(auth, savedProperties, $location) {
                        return auth.get('session').then(function(results) {
                            if (results.uid == "") {
                                $location.path('/login');
                            } else {
                                var pid = results.savedProperties.split(",");
                                for (i = 1; i < pid.length; i++) {
                                  savedProperties.get('properties', pid[i]).then(function(res) {
                                  });
                                }
                            }
                        });
                    }],
                    getSettings: function(auth, $rootScope) {
                        auth.get('session').then(function (results) {
                                $rootScope.settings = results.settings;
                        });
                    }
                }

            })
            .when('/', {
                title: 'Home',
                templateUrl: 'partials/home.html',
                controller: 'PropertyCtrl',
                resolve: {
                    setRoute: function($rootScope) {
                        $rootScope.addInfo = {};
                        $rootScope.bodylayout = "home";
                    },
                    isLoggedIn: function(auth, $location, $rootScope) {
                        auth.get('session').then(function (results) {
                            if (results.uid) {
                                $rootScope.settings = results.settings;
                                $location.path('/');
                            } else {
                                $location.path('/login');
                            }
                        });
                    },
                    getProperties: ['properties', function(properties) {
                    return properties.getProperties('properties');
                    }]
                }
            })
            .when('/properties', {
                title: 'Properties',
                resolve: {
                    isLoggedIn: function(auth, $location, $rootScope) {
                        auth.get('session').then(function (results) {
                            if (results.uid) {
                                $rootScope.settings = results.settings;
                                $location.path('/');
                            } else {
                                $location.path('/login');
                            }
                        });
                    }
                }
                /*templateUrl: 'partials/properties.html',
                controller: 'PropertyCtrl',
                resolve: {
                  getProperties: ['properties', function(properties) {
                    return properties.getProperties('properties');
                  }]
                }*/
            })
            .when('/properties/new-property', {
                title: 'Create A New Property',
                templateUrl: 'partials/new-property.html',
                controller: 'PropertyCtrl',
                resolve: {
                    isLoggedIn: function(auth, $location) {
                        auth.get('session').then(function (results) {
                            if (results.uid) {
                                $location.path('/properties/new-property');
                            } else {
                                $location.path('/login');
                            }
                        });
                    }
                }
            })
            .when('/properties/search-results', {
              title: 'Search Results',
              templateUrl: 'partials/search-results.html',
              controller: 'PropertyCtrl',
              resolve: {
                getParams: function( $localStorage ) {
                  $city = $localStorage.city;
                  $priceQ = $localStorage.priceQ;
                  $beds = $localStorage.beds;
                  $baths = $localStorage.baths;
                },
                getResults: ['searchProperties', function(searchProperties) {
                    return searchProperties.get('properties', $city, $priceQ, $beds, $baths).then(function(res){
                        return res;
                    });
                }]
              }
            })
            .when('/properties/:pid', {
              title: 'Single Property',
              templateUrl: 'partials/single-property.html',
                controller: 'PropertyCtrl',
              resolve: {
                isLoggedIn: function(auth, $location) {
                        auth.get('session').then(function (results) {
                            if (!results.uid) {
                                $location.path('/login');
                            }
                        });
                    },
                getpid: function( $route ) {
                  $r = $route.current.params.pid;
                },
                getSingleProperty: ['singleproperty', function(singleproperty) {
                  return singleproperty.get('properties', $r);
                }],
                getPropertyComments: ['comments', function(comments) {
                  return comments.get('comments', $r);
                }]
              }
            })
            .when('/properties/:pid/rehab', {
                title: 'Property Rehab Information',
                templateUrl: 'partials/rehab.html',
                controller: 'PropertyCtrl',
                resolve: {
                    isLoggedIn: function(auth, $location) {
                            auth.get('session').then(function (results) {
                                if (!results.uid) {
                                    $location.path('/login');
                                }
                            });
                        },
                    getpid: function( $route ) {
                      $r = $route.current.params.pid;
                    },
                    getSingleProperty: ['singleproperty', function(singleproperty) {
                      return singleproperty.get('properties', $r);
                    }],
                    getRehab: ['rehab', function(rehab) {
                        return rehab.get('rehab', $r);
                    }]/*,
                    getRehabLogs: ['comments', function(comments) {
                      return comments.get('comments', $r);
                    }]*/
              }
            })
            .when('/properties/:pid/edit', {
                title: 'Edit Property',
                templateUrl: 'partials/edit-property.html',
                controller: 'PropertyCtrl',
                resolve: {
                    getpid: function( $route ) {
                      $r = $route.current.params.pid;
                    },
                    getSingleProperty: ['singleproperty', function(singleproperty) {
                      return singleproperty.get('properties', $r);
                    }],
                    getPropertyComments: ['comments', function(comments) {
                      return comments.get('comments', $r);
                    }],
                    checkAdmin: function(auth, $location) {
                        auth.get('session').then(function (results) {
                            if(results.isadmin == 1) {
                                $location.path('/properties/' + $r + '/edit');
                            } else {
                                $location.path('/properties/' + $r);
                            }
                        })
                    }
                    
              }
            })
            .otherwise({
                redirectTo: '/'
            });
    }
])
.run(function ($rootScope, $location, auth) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        $rootScope.bodylayout = "";
        $rootScope.ready = '0';
        auth.get('session').then(function (results) {
            if (results.uid) {
                $rootScope.authenticated = true;
                $rootScope.uid = results.uid;
                $rootScope.name = results.name;
                $rootScope.email = results.email;
                $rootScope.phone = results.phone;
                $rootScope.isadmin = results.isadmin;
                $rootScope.savedProperties = results.savedProperties;
                $rootScope.settings = results.settings;
            } else {
                $rootScope.authenticated = false;
                $rootScope.uid = '';
                $rootScope.name = 'Guest';
                $rootScope.email = '';
                $rootScope.phone = '';
                $rootScope.isadmin = 0;
                $rootScope.savedProperties = '';
            }
        });
    });
});
