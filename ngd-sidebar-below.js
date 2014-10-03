/**
 * Set top position below the given element
 */
var NGD = NGD || angular.module('ngd',[]);

NGD.directive('ngdSidebarBelow', function($window) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var header = document.querySelector(attrs.ngdSidebarBelow);
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
        throw "ngd-sidebar-below, no element found by value";
      } // if
    } // link
  }; // return
});
