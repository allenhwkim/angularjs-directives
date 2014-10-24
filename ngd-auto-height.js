/**
 * Set the height of textarea automatically by the height of contents
 */
var NGD = NGD || angular.module('ngd',[]);
NGD.directive('ngdAutoHeight', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, elem) {
      $timeout( function() { // Expand the textarea as soon as it is added to the DOM
        if ( elem.html() ) {
          var height = elem[0].scrollHeight;
          elem.css({height:height+'px'});
        }
      }, 100);
    }
  };
});
