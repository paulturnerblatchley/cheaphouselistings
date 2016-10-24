
var serviceBase = 'api/v1/';

app.factory("auth", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var o = {};
        o.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        o.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        o.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        o.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        o.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return o;
}]);

app.factory("listings", ['$http', 'auth', 'toaster',
    function($http, auth, toaster) {


        var o = {
            listings: []
        };

        o.getListings = function(q) {
          return $http.get(serviceBase + q).then(function(results) {
            
            o.listings = results.data;

            for(i=0; i<results.data.length;i++) {
              o.listings[i].images = results.data[i].images.split(', ');
            }
            
            
            return results.data;
          });
        };

        return o;
    }
]);

app.factory("singlelisting", ['$http',
  function($http) {
      var o = {
        listing: []
      };

      o.get = function(q, lid) {
        return $http.get(serviceBase + q).then(function(results) {
          for(i=0;i<results.data.length;i++){
              if (results.data[i].lid == lid) {
                o.listing = results.data[i];

                o.listing.images = results.data[i].images.split(', ');
              }
          }

        });
      };
      return o;
  }
]);

app.factory("searchListings", ['$http',
  function($http) {
      var o = {
        listings: []
      };

      o.get = function(q, city) {
        return $http.get(serviceBase + q).then(function(results) {
          var count = 0;
          var noResults = [];
          o.listings = [];
          for(i=0;i<results.data.length;i++){
              if (results.data[i].city == city) {
                o.listings.push(results.data[i]);
                o.listings[i-count].images = results.data[i].images.split(', ');
              } else if (count == results.data.length) {
                return noResults;
              } else {
                count++;
              }
          }
          return o.listings;
        });
      };
      return o;
  }
]);

app.factory("Data",['$resource','$localStorage', '$sessionStorage', 
  function($resource,$localStorage,$sessionStorage) {
      return function(link) {
          return $resource(serviceBase+link,{},{
              postImage: {
                method:'POST',
                transformRequest: formDataObject,
                headers: {'Content-Type':undefined, enctype:'multipart/form-data'}
              },
              two_query:{
                url:serviceBase+link,
                method:'GET',isArray:false,
                params:{
                  company_code:'@company_code',
                  event_code:'@event_code'
                }
              }
          });
          function formDataObject (data) {
            var fd = new FormData();
            angular.forEach(data, function(value, key) {
              console.log
                fd.append(key, value);
            });
            return fd;
          }
      }
}
]);