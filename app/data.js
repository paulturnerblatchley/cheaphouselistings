var serviceBase = 'api/v1/';

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

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

app.factory("properties", ['$http', 'auth', 'toaster',
    function($http, auth, toaster) {


        var o = {
            properties: []
        };

        o.getProperties = function(q) {
          return $http.get(serviceBase + q).then(function(results) {
            o.properties = results.data;
            var images = {};
            $http.get(serviceBase + 'propertyImages').then(function(res) {
                for(var j=0;j<res.data.length;j++) {
                  if(!images[res.data[j].pid]) {
                    images[res.data[j].pid] = [];
                    images[res.data[j].pid].push(res.data[j].image_name);
                  } else {
                    images[res.data[j].pid].push(res.data[j].image_name);
                  }
                }
                for (i = 0; i < o.properties.length; i++) {
                  var id = o.properties[i].pid;
                  o.properties[i].images = images[id];
                }
            });
            for(var i=0; i<results.data.length;i++) {
              o.properties[i].purchase_cost = o.properties[i].purchase_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");      
              o.properties[i].pid = parseInt(results.data[i].pid);

              if(o.properties[i].pool_spa == 0) {
                o.properties[i].pool_spa = "No";
              } else {
                o.properties[i].pool_spa = "Yes";
              }

              if(o.properties[i].is_listed == 0) {
                o.properties[i].is_listed = "No";
              } else {
                o.properties[i].is_listed = "Yes";
              }

              if (o.properties[i].listing_date == "0000-00-00") {
                o.properties[i].listing_date = "";
              } else {
                var d = o.properties[i].listing_date.split("-");
                o.properties[i].listing_date = d[1] + "/" + d[2] + "/" + d[0];
              }

              if (o.properties[i].purchase_close_date == "0000-00-00") {
                o.properties[i].purchase_close_date = "";
              } else {
                var d = o.properties[i].purchase_close_date.split("-");
                o.properties[i].purchase_close_date = d[1] + "/" + d[2] + "/" + d[0];
              }

              if (o.properties[i].sale_close_date == "0000-00-00") {
                o.properties[i].sale_close_date = "";
              } else {
                var d = o.properties[i].sale_close_date.split("-");
                o.properties[i].sale_close_date = d[1] + "/" + d[2] + "/" + d[0];
              }
            }

            return results.data;
          });
        };

        return o;
    }
]);

app.factory("singleproperty", ['$http',
  function($http) {
      var o = {
        property: []
      };

      o.get = function(q, pid) {
        return $http.get(serviceBase + q).then(function(results) {
          for(i=0;i<results.data.length;i++){
              if (results.data[i].pid == pid) {
                o.property = results.data[i];
                o.property.purchase_cost = o.property.purchase_cost.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if(o.property.pool_spa == 0) {
                  o.property.pool_spa = "No";
                } else {
                  o.property.pool_spa = "Yes";
                }
                if(o.property.is_listed == 0) {
                  o.property.is_listed = "No";
                } else {
                  o.property.is_listed = "Yes";
                }
                
                if (o.property.listing_date == "0000-00-00") {
                  o.property.listing_date = "";
                } else {
                  var d = o.property.listing_date.split("-");
                  o.property.listing_date = d[1] + "/" + d[2] + "/" + d[0];
                }

                if (o.property.purchase_close_date == "0000-00-00") {
                  o.property.purchase_close_date = "";
                } else {
                  var d = o.property.purchase_close_date.split("-");
                  o.property.purchase_close_date = d[1] + "/" + d[2] + "/" + d[0];
                }

                if (o.property.sale_close_date == "0000-00-00") {
                  o.property.sale_close_date = "";
                } else {
                  var d = o.property.sale_close_date.split("-");
                  o.property.sale_close_date = d[1] + "/" + d[2] + "/" + d[0];
                }
              }
          }
          var images = {};
          $http.get(serviceBase + 'propertyImages').then(function(res) {
            for(var j=0;j<res.data.length;j++) {
              if(!images[res.data[j].pid]) {
                images[res.data[j].pid] = [];
                images[res.data[j].pid].push(res.data[j].image_name);
              } else {
                images[res.data[j].pid].push(res.data[j].image_name);
              }
            }
            o.property.images = images[o.property.pid];
          });
        });
      };
      return o;
  }
]);

app.factory("savedProperties", ['$http',
  function($http) {
    var o = {
      properties: []
    };

    o.get = function(q, pid) {
      o.properties.splice(0, o.properties.length);
      return $http.get(serviceBase + q).then(function(results) {
        for(i=0;i<results.data.length;i++){
            if (results.data[i].pid == pid) {
              results.data[i].price = results.data[i].price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              results.data[i].images = results.data[i].images.split(', ').clean("");
              o.properties.push(results.data[i]);

            }
        }
        return o.properties;
      });
    };
    return o;
  }
]);

app.factory("searchProperties", ['$http',
  function($http) {
      var o = {
        properties: []
      };

      o.get = function(q, city, price, beds, baths) {
        return $http.get(serviceBase + q).then(function(results) {
          var count = 0,
              noResults = [],
              priceMin,
              priceMax;
          o.properties = [];
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
                  o.properties.push(results.data[i]);
                } else if (count == results.data.length) {
                  return noResults;
                } else {
                  count++;
                }
            }
          } else {
            for(i=0;i<results.data.length;i++){
                if (results.data[i].city == city && results.data[i].beds == beds && results.data[i].baths == baths && priceMin <= results.data[i].price <= priceMax) {
                  o.properties.push(results.data[i]);
                  o.properties[i-count].images = results.data[i].images.split(', ');
                } else if (count == results.data.length) {
                  return noResults;
                } else {
                  count++;
                }
            }
          }
          return o.properties;
        });
      };
      return o;
  }
]);

app.factory("rehab", ['$http',
  function($http) {
    var o = {
      rehab: []
    };

    o.get = function(q, pid) {
      return $http.get(serviceBase + q).then(function(results) {
        for(i in results.data) {
          if (results.data[i].pid == pid) {
            o.rehab = results.data[i]
            o.rehab.bath = [];
            o.rehab.demo = [];
            o.rehab.drywall = [];
            o.rehab.electrical = [];
            o.rehab.ext_paint = [];
            o.rehab.fixtures = [];
            o.rehab.flooring = [];
            o.rehab.framing = [];
            o.rehab.garage_door = [];
            o.rehab.hardscape = [];
            o.rehab.hvac = [];
            o.rehab.int_paint = [];
            o.rehab.kitchen = [];
            o.rehab.landscaping = [];
            o.rehab.plumbing = [];
            o.rehab.pool_spa = [];
            o.rehab.roof = [];
            o.rehab.sales_clean = [];
            o.rehab.stucco = [];
            o.rehab.windows = [];
            for (j in o.rehab) {
              if (/\d{4}-\d{2}-\d{2}/.test(o.rehab[j])) {
                o.rehab[j] = moment(o.rehab[j])._d;
                if (o.rehab[j] == "Invalid Date") {
                  delete o.rehab[j];
                }
              }
              if (o.rehab.hasOwnProperty(j)) {
                if (j.startsWith("bath")) {
                  var prop = j.replace("bath_", "");
                  o.rehab.bath[prop] = o.rehab[j];
                  if (j != "bath") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("demo")) {
                  var prop = j.replace("demo_", "");
                  o.rehab.demo[prop] = o.rehab[j];
                  if (j != "demo") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("drywall")) {
                  var prop = j.replace("drywall_", "");
                  o.rehab.drywall[prop] = o.rehab[j];
                  if (j != "drywall") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("electrical")) {
                  var prop = j.replace("electrical_", "");
                  o.rehab.electrical[prop] = o.rehab[j];
                  if (j != "electrical") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("ext_paint")) {
                  var prop = j.replace("ext_paint_", "");
                  o.rehab.ext_paint[prop] = o.rehab[j];
                  if (j != "ext_paint") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("fixtures")) {
                  var prop = j.replace("fixtures_", "");
                  o.rehab.fixtures[prop] = o.rehab[j];
                  if (j != "fixtures") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("flooring")) {
                  var prop = j.replace("flooring_", "");
                  o.rehab.flooring[prop] = o.rehab[j];
                  if (j != "flooring") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("framing")) {
                  var prop = j.replace("framing_", "");
                  o.rehab.framing[prop] = o.rehab[j];
                  if (j != "framing") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("garage_door")) {
                  var prop = j.replace("garage_door_", "");
                  o.rehab.garage_door[prop] = o.rehab[j];
                  if (j != "garage_door") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("hvac")) {
                  var prop = j.replace("hvac_", "");
                  o.rehab.hvac[prop] = o.rehab[j];
                  if (j != "hvac") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("hardscape")) {
                  var prop = j.replace("hardscape_", "");
                  o.rehab.hardscape[prop] = o.rehab[j];
                  if (j != "hardscape") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("int_paint")) {
                  var prop = j.replace("int_paint_", "");
                  o.rehab.int_paint[prop] = o.rehab[j];
                  if (j != "int_paint") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("kitchen")) {
                  var prop = j.replace("kitchen_", "");
                  o.rehab.kitchen[prop] = o.rehab[j];
                  if (j != "kitchen") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("landscaping")) {
                  var prop = j.replace("landscaping_", "");
                  o.rehab.landscaping[prop] = o.rehab[j];
                  if (j != "landscaping") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("plumbing")) {
                  var prop = j.replace("plumbing_", "");
                  o.rehab.plumbing[prop] = o.rehab[j];
                  if (j != "plumbing") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("pool_spa")) {
                  var prop = j.replace("pool_spa_", "");
                  o.rehab.pool_spa[prop] = o.rehab[j];
                  if (j != "pool_spa") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("roof")) {
                  var prop = j.replace("roof_", "");
                  o.rehab.roof[prop] = o.rehab[j];
                  if (j != "roof") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("sales_clean")) {
                  var prop = j.replace("sales_clean_", "");
                  o.rehab.sales_clean[prop] = o.rehab[j];
                  if (j != "sales_clean") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("stucco")) {
                  var prop = j.replace("stucco_", "");
                  o.rehab.stucco[prop] = o.rehab[j];
                  if (j != "stucco") {
                    delete o.rehab[j];
                  }
                } else if (j.startsWith("windows")) {
                  var prop = j.replace("windows_", "");
                  o.rehab.windows[prop] = o.rehab[j];
                  if (j != "windows") {
                    delete o.rehab[j];
                  }
                }
              }
            }
          }
        }
        for(i in o.rehab) {
          if (i.includes("_")) {
            o.rehab[i].name = i.replace("_"," ");
          } else {
            o.rehab[i].name = i;
          }
        }
         console.log(o.rehab);
      });
     
    }
    return o;
  }
]);

app.service('GanttData', function GanttData() {
  return {
    getGanttData: function($scope) {
      return [
            {name: 'Timeline', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.planned_start, to: $scope.r.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.actual_start, to: $scope.r.actual_finish}
                ]
            },
            {name: 'Bathrooms', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.bath.planned_start, to: $scope.r.bath.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.bath.actual_start, to: $scope.r.bath.actual_finish}
              ]
            },
            {name: 'Demo-Trashout', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.demo.planned_start, to: $scope.r.demo.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.demo.actual_start, to: $scope.r.demo.actual_finish}
                ]
            },
            {name: 'Plumbing', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.plumbing.planned_start, to: $scope.r.plumbing.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.plumbing.actual_start, to: $scope.r.plumbing.actual_finish}
                ]
            },
            {name: 'Electrical', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.electrical.planned_start, to: $scope.r.electrical.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.electrical.actual_start, to: $scope.r.electrical.actual_finish}
                ]
            },
            {name: 'Framing', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.framing.planned_start, to: $scope.r.framing.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.framing.actual_start, to: $scope.r.framing.actual_finish}
                ]
            },
            {name: 'Drywall', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.drywall.planned_start, to: $scope.r.drywall.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.drywall.actual_start, to: $scope.r.drywall.actual_finish}
                ]
            },
            {name: 'Windows', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.windows.planned_start, to: $scope.r.windows.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.windows.actual_start, to: $scope.r.windows.actual_finish}
                ]
            },
            {name: 'Roof', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from:$scope.r.roof.planned_start, to: $scope.r.roof.planned_finish},
                {name: 'Actual', classes: "actual", from:$scope.r.roof.actual_start, to: $scope.r.roof.actual_finish}
                ]
            },
            {name: 'HVAC', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.hvac.planned_start, to: $scope.r.hvac.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.hvac.actual_start, to: $scope.r.hvac.actual_finish}
              ]
            },
            {name: 'Flooring', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.flooring.planned_start, to: $scope.r.flooring.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.flooring.actual_start, to: $scope.r.flooring.actual_finish}
              ]
            },
            {name: 'Interior Paint', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.int_paint.planned_start, to: $scope.r.int_paint.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.int_paint.actual_start, to: $scope.r.int_paint.actual_finish}
              ]
            },
            {name: 'Kitchen', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.kitchen.planned_start, to: $scope.r.kitchen.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.kitchen.actual_start, to: $scope.r.kitchen.actual_finish}
              ]
            },
            {name: 'Fixtures', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.fixtures.planned_start, to: $scope.r.fixtures.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.fixtures.actual_start, to: $scope.r.fixtures.actual_finish}
              ]
            },
            {name: 'Exterior Paint', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.ext_paint.planned_start, to: $scope.r.ext_paint.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.ext_paint.actual_start, to: $scope.r.ext_paint.actual_finish}
              ]
            },
            {name: 'Stucco', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.stucco.planned_start, to: $scope.r.stucco.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.stucco.actual_start, to: $scope.r.stucco.actual_finish}
              ]
            },
            {name: 'Landscaping', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.landscaping.planned_start, to: $scope.r.landscaping.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.landscaping.actual_start, to: $scope.r.landscaping.actual_finish}
              ]
            },
            {name: 'Hardscape/Fence', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.hardscape.planned_start, to: $scope.r.hardscape.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.hardscape.actual_start, to: $scope.r.hardscape.actual_finish}
              ]
            },
            {name: 'Garage Door', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.garage_door.planned_start, to: $scope.r.garage_door.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.garage_door.actual_start, to: $scope.r.garage_door.actual_finish}
              ]
            },
            {name: 'Pool/Spa', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.pool_spa.planned_start, to: $scope.r.pool_spa.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.pool_spa.actual_start, to: $scope.r.pool_spa.actual_finish}
              ]
            },
            {name: 'Sales Clean', color: '#f5f5f5', height: '4em', tasks: [
                {name: 'Planned', classes: "expected", from: $scope.r.sales_clean.planned_start, to: $scope.r.sales_clean.planned_finish},
                {name: 'Actual', classes: "actual", from: $scope.r.sales_clean.actual_start, to: $scope.r.sales_clean.actual_finish}
              ]
        }];
    }
  }
});

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
                fd.append(key, value);
            });
            return fd;
          }
      }
}
]);

app.factory("comments", ['$http',
    function($http) {

        var o = {
            comments: []
        };

        o.get = function(q, pid) {
          return $http.get(serviceBase + q).then(function(results) {
            o.comments = [];
            for(i=0;i<results.data.length;i++){
                if (results.data[i].properties_pid == pid) {
                  o.comments.push(results.data[i]);
                }
            }
            $http.get(serviceBase + "users").then( function(res) {
              for(i=0;i<res.data.length;i++){
                for(j=0;j<o.comments.length;j++) {
                  if (res.data[i].uid == o.comments[j].users_uid) {
                    o.comments[j].username = res.data[i].name;
                  }
                }
              }
            });
            for(j=0;j<o.comments.length;j++) {
              // Split timestamp into [ Y, M, D, h, m, s ]
              var t = o.comments[j].created.split(/[- :]/);
              if (t[3]>12) {
                t[3] = t[3] - 12;
                t[5] = "PM";
              } else {
                t[5] = "AM"
              }
              var editedTime = t[1] + "/" + t[2] + "/" + t[0] + 
                          " at " + t[3] + ":" + t[4] + t[5];
              o.comments[j].created = editedTime;
            }
          });
        }

        return o;

    }
]);

/*app.factory("rehabActivityLog", ['$http',
    function($http) {

        var o = {
            log: []
        };

        o.get = function(q, pid) {
          return $http.get(serviceBase + q).then(function(results) {
            o.log = [];
            for(i=0;i<results.data.length;i++){
                if (results.data[i].pid == pid) {
                  o.log.push(results.data[i]);
                }
            }
            $http.get(serviceBase + "users").then( function(res) {
              for(i=0;i<res.data.length;i++){
                for(j=0;j<o.log.length;j++) {
                  if (res.data[i].uid == o.log[j].users_uid) {
                    o.log[j].username = res.data[i].name;
                  }
                }
              }
            });
            for(j=0;j<o.log.length;j++) {
              // Split timestamp into [ Y, M, D, h, m, s ]
              var t = o.log[j].created.split(/[- :]/);
              if (t[3]>12) {
                t[3] = t[3] - 12;
                t[5] = "PM";
              } else {
                t[5] = "AM"
              }
              var editedTime = t[1] + "/" + t[2] + "/" + t[0] + 
                          " at " + t[3] + ":" + t[4] + t[5];
              o.log[j].created = editedTime;
            }
          });
        }

        return o;

    }
]);*/