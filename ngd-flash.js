var NGD = NGD || angular.module('ngd',[]);
NGD.factory('NgdFlash', function($window) {
  return {
    push: function(msg) {
      $window.sessionStorage.ngdFlashMessage = msg;
    },
    pull: function() {
      var msg = $window.sessionStorage.ngdFlashMessage;
      (msg) && (delete $window.sessionStorage.ngdFlashMessage);
      return msg;
    }
  }
});
NGD.directive('ngdFlash', function(NgdFlash) {
  return {
    restrict: 'A',
    link: function($scope, elem, attrs) {
      var msg = NgdFlash.pull();
      elem.html(msg);
    }
  };
});
