/**
 * show unsaved changes warning on the form if changed and not submitted
 */
app.directive('ngdUnsavedChangesWarning', function($window) {
  return {
    restrict: 'A',
    require: 'form', // we must require form to get access to formController
    link: function(scope, formElement, attrs, formController) {
      var onSubmit = false;
      var confirmMessage = attrs.unsavedChangesWarning || "Are You Sure?";
      formElement.bind('submit', function() {
        onSubmit = true;
      });
      
      scope.$on('$locationChangeStart', function(event) {
        if (!onSubmit && formController.$dirty && !$window.confirm(confirmMessage)) {
          event.preventDefault(); 
        }
      });
    }
  };
});

