/**
 * To perform action when image is pasted to the document
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive("ngdImagePaste",['$parse', '$http', function($parse, $http) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var ngdImagePaste = $parse(attrs.ngdImagePaste); 

      element.bind("paste", function (e) {
        var imageFiles = [];
        var items =  (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log('items.length', items.length);
        for (var i=0; i<items.length; i++) {
        console.log('items[i]', items[i]);
          if (items[i].getAsFile().type.match("image")) {
            console.log('adding');
            imageFiles.push(items[i].getAsFile());
          }
        }
        if (imageFiles.length > 0) {
          console.log('emitting');
          scope.$emit('ngd-image-dropped', {files: imageFiles});
          scope.$apply(ngdImagePaste(scope));
        }
      }); // bind
    } // link
  }; // return
}]);

