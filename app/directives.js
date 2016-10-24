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