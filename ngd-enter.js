/**
 * use Enter Key pressed on element
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

