app.controller('ViewCtrl', function($scope, $rootScope) {
  $scope.$on('$viewContentLoaded', function() {
    $rootScope.ready = '1';
  });
  $scope.isReady = function() {
    if ($rootScope.ready == '1') {
      return true;
    } else {
      return false;
    }
  }
});

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
    $scope.hideMenu = function() {
      var nav = document.getElementById("navbar");
      if (nav.className == "navbar-collapse collapse") {
          nav.className = "navbar-collapse collapse in";
      } else {
        nav.className = "navbar-collapse collapse";
      }
    };
});

// listing controller
app.controller('ListingCtrl', function($scope, $route, $location, $http, $localStorage, $sessionStorage, auth, listings, singlelisting, searchListings, savedListings, Data) {
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
            auth.toast(results);
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

    $scope.deleteFile = function(img) {
      var ok = confirm("Are you sure you want to delete this image?");
      if (ok) {
        auth.post('deleteImage', {
          img:img
        }).then(function(res){
            auth.toast(res);
            if (res.status == "success") {
              var index = $scope.s.images.indexOf(img);
              if (index > -1) {
                $scope.s.images.splice(index, 1);
              }
            }
            $route.reload();
        });
      }
    };

    $scope.deleteListing = function(listing) {
        var ok = confirm("Are you sure you want to delete this listing?");
        if (ok) {
          auth.post('deleteListing', {
            listing: listing
          }).then(function(res){
              auth.toast(res);
              $location.path('listings/');
          });
        }
    };

    $scope.s = singlelisting.listing;

    $scope.searchRes = searchListings.listings;
    $scope.saved = savedListings.listings;

    $scope.hasSavedListings = function() {
      if ($scope.saved[0] != null) {
        return true;
      } else {
        return false;
      }
    }

    $scope.$storage = $localStorage;
    $scope.priceOptions = [
        { name: '$0 - $100,000', value: '0' },
        { name: '$100,000 - $300,000', value: '1' },
        { name: '$300,000 - $500,000', value: '3' },
        { name: '$500,000 - $1,000,000', value: '5' },
        { name: '$1,000,000+', value: '10' }
    ];
    $scope.bedOptions = [
        { name: '1 Bed', value: '1' },
        { name: '2 Beds', value: '2' },
        { name: '3 Beds', value: '3' },
        { name: '4 Beds', value: '4' },
        { name: '5+ Beds', value: '5' }
    ];
    $scope.bathOptions = [
        { name: '1 Bath', value: '1' },
        { name: '2 Baths', value: '2' },
        { name: '3 Baths', value: '3' },
        { name: '4 Baths', value: '4' },
        { name: '5+ Baths', value: '5' }
    ];
    $scope.priceQ = $scope.priceOptions[0].value;
    $scope.beds = $scope.bedOptions[0].value;
    $scope.baths = $scope.bathOptions[0].value;
    $scope.setParams = function(city,priceQ,beds,baths) {
        delete $scope.$storage.city;
        delete $scope.$storage.priceQ;
        delete $scope.$storage.beds;
        delete $scope.$storage.baths;
        var citySearch = city.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        $scope.$storage.city = citySearch;
        $scope.$storage.priceQ = priceQ;
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

    $scope.updateListing = function(s) {
      var f = document.getElementById('file').files;
      for (i=0; i<f.length; i++) {
        s.images += ", " + f[i].name;
      }
      auth.post('editListing', {
        listing: s
      }).then( function(results) {
          auth.toast(results);
          $route.reload();
      });
    };

    $scope.listingFilters = {};
    console.log($scope.listingFilters.city);
    $scope.price = {max:100000000};
    $scope.sqft = {min:0};
    $scope.lotsize = {min:0};
});

app.controller('FormCtrl', function($scope, $http, auth, singlelisting) {
    $scope.formData = {};
    $scope.getUser = function() {
        auth.get('session').then( function(res) {
            $scope.user = res;
            $scope.formData.name = $scope.user.name;
            $scope.formData.email = $scope.user.email;
            $scope.formData.phone = $scope.user.phone;
        });
    };

    $scope.getUser();


    $scope.formData.listing = singlelisting.listing.address;

    $scope.submitInquiry = function(formData) {
        auth.post('formSend',{
            formData: formData
        }).then(function(data) {
            auth.toast(data);
        })
    }
});
