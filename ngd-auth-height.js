/**
 * Set the height of textarea automatically by the height of contents
 */
app.directive('ngdAutoHeight', function() {
  return {
    restrict: 'A',
    //require: 'textarea', // we must require form to get access to formController
    link: function($scope, elem) {
      setTimeout( function() { // Expand the textarea as soon as it is added to the DOM
        if ( elem.val() ) {
          var height = elem[0].scrollHeight + 2;
          elem.css({height:height+'px'});
        }
      }, 0);
    }
  };
});

