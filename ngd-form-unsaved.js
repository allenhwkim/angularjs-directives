/**
 * show unsaved changes warning on the form if changed and not submitted
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive('ngdFormUnsaved',['$window', function($window) {
  return {
    restrict: 'A',
    require: 'form', // we must require form to get access to formController
    link: function(scope, formElement, attrs, formController) {
      /** 
       * when form is submitted, set onSubmit flag, so that no warning to show up
       */
      formElement.bind('submit', function() {
        formController.onSubmit = true;
      });
      var prevHandler = $window.onbeforeunload;
      var onbeforeunloadFunc = function(event) {
        event.preventDefault();
        prevHandler && prevHandler(event);
        if (!formController.onSubmit && formController.$dirty) {
          return attrs.ngdFormUnsaved || "Are You Sure?";
        } 
      }
      $window.onbeforeunload = onbeforeunloadFunc;
    } // link
  };
}]);
