/**
 * use Enter Key pressed on element
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdEnter', ['$parse', '$rootScope', function ($parse, $rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, controller) {
      var fn = $parse(attrs.ngdEnter);
      element.on('keypress', function(event) {
        if (event.which === 13) {
          var callback = function() {
            fn(scope, {$event:event});
          };
          if ($rootScope.$$phase) {
            scope.$evalAsync(callback);
          } else {
            scope.$apply(callback);
          }
        }
      });
     }
  };
}]);
