/**
 * Set top position under the given element
 */
var NGD = NGD || angular.module('ngd',[]);

NGD.directive('ngdFixedUnder', ['$window', function($window) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var header = document.querySelector(attrs.ngdFixedUnder);
      if (header) {
        angular.element($window).bind('scroll', function() {
          var rect = header.getBoundingClientRect();
          if (parseFloat(rect.bottom)<0) {
            element.css({position:'fixed', top: 0});
          } else {
            element.css({position:'absolute', top: null});
          }
        });
      } else {
        throw "ngd-fixed-under, no element found by value";
      } // if
    } // link
  }; // return
}]);
