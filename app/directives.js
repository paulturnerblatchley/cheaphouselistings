app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }
});

app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password
                var e2 = scope.$eval(attrs.passwordMatch);
                if(e2!=null)
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var isMultiple = attrs.multiple;
          var modelSetter = model.assign;
          element.bind('change', function(){
            var img = [];
            angular.forEach(element[0].files, function (item) {
                var value = {
                    lastModified: item.lastModified,
                    lastModifiedDate: item.lastModifiedDate,
                    name: item.name,
                    size: item.size,
                    type: item.type,
                    img: item
                };
                img.push(value);
            });
             scope.$apply(function(){
                if (isMultiple) {
                    modelSetter(scope, img);
                } else {
                    modelSetter(scope, img[0]);
                }
             });
          });
       }
    };
 }]);

app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

app.filter('priceFilter', function() {
  return function(listings, max) {
    var out = [];
    for (i = 0; i < listings.length; i++){
      priceNum = parseInt(listings[i].price.replace(',', ''), 10);

      if(priceNum <= max) {
        out.push(listings[i]);
      }
      
    }
    
    return out;
  }
});

app.filter('sqftFilter', function() {
  return function(listings, min) {
    var out = [];
    for (i = 0; i < listings.length; i++){
      sqftNum = parseInt(listings[i].sqft.replace(',', ''), 10);

      if(sqftNum >= min) {
        out.push(listings[i]);
      }
      
    }
    
    return out;
  }
});

app.filter('lotsizeFilter', function() {
  return function(listings, min) {
    var out = [];
    for (i = 0; i < listings.length; i++){
      lotsizeNum = parseInt(listings[i].lotsize.replace(',', ''), 10);

      if(lotsizeNum >= min) {
        out.push(listings[i]);
      }
      
    }
    
    return out;
  }
});