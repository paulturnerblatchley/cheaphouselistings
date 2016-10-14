
var serviceBase = 'api/v1/';

app.factory("auth", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var obj = {};
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);

app.factory("listings", ['$http', 'auth', 'toaster',
    function($http, auth, toaster) {


        var o = {
            listings: []
        };

        o.getListings = function(q) {
          return $http.get(serviceBase + q).then(function(results) {
            o.listings = results.data;
            return results.data;
          });
        };

        return o;
    }
]);

app.factory("singlelisting", ['$http',
  function($http) {
      var s = {
        listing: []
      };

      s.get = function(q, lid) {
        return $http.get(serviceBase + q).then(function(results) {
          for(i=0;i<results.data.length;i++){
              if (results.data[i].lid == lid) {
                s.listing = results.data[i];
              }
          }

        });
      };
      return s;
  }
]);
