app.factory("auth", ['$http', 'toaster',
    function ($http, toaster) { // This service connects to our REST API

        var serviceBase = 'api/v1/';

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

        var serviceBase = 'api/v1/';

        var o = {
            listings: []
        };

        o.getAll = function() {
            return $http.get(serviceBase + 'listings').success(function(data) {
                angular.copy(data, o.listings);
            });
        };

        o.create = function(listing) {
            return $http.post(serviceBase + 'listings', listing)
            .then(function(res) {
                o.listings.push(res);
                toaster.pop(res.data.status, "", res.data.message, 10000, 'trustedHtml');
            });
        };

        return o;
    }
]);