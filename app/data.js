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
              o.listings[i].price = o.listings[i].price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

                o.listing.price = o.listing.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

              }
          }

        });
      };
      return o;
  }
]);

app.factory("savedListings", ['$http',
  function($http) {
    var o = {
      listings: []
    };

    o.get = function(q, lid) {
      o.listings.splice(0, o.listings.length);
      return $http.get(serviceBase + q).then(function(results) {

        for(i=0;i<results.data.length;i++){
            if (results.data[i].lid == lid) {
              results.data[i].price = results.data[i].price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              o.listings.push(results.data[i]);
            }
        }
        return o.listings;
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

      o.get = function(q, city, price, beds, baths) {
        return $http.get(serviceBase + q).then(function(results) {
          var count = 0,
              noResults = [],
              priceMin,
              priceMax;
          o.listings = [];
          switch (price) {
            case '0':
              priceMin = 0;
              priceMax = 100000;
              break;
            case '1':
              priceMin = 100000;
              priceMax = 300000;
              break;
            case '3':
              priceMin = 300000;
              priceMax = 500000;
              break;
            case '5':
              priceMin = 500000;
              priceMax = 1000000;
              break;
            case '10':
              priceMin = 1000000;
              priceMax = 1000000000;
              break;
          }
          if (city != "" && typeof price === "undefined" && typeof beds === "undefined" && typeof baths === "undefined"){

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
          } else {
            for(i=0;i<results.data.length;i++){
                if (results.data[i].city == city && results.data[i].beds == beds && results.data[i].baths == baths && priceMin <= results.data[i].price <= priceMax) {
                  o.listings.push(results.data[i]);
                  o.listings[i-count].images = results.data[i].images.split(', ');
                } else if (count == results.data.length) {
                  return noResults;
                } else {
                  count++;
                }
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
