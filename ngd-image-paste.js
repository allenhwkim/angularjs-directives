/**
 * To perform action when image is pasted to the document
 */
app.directive("ngdImagePaste", function ($parse, $http) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var onImagePaste = $parse(attrs.onImagePaste); 

      element.bind("paste", function (e) {
        var imageFiles = [];
        var items =  (event.clipboardData || event.originalEvent.clipboardData).items;
        for (var i=0; i<items.length; i++) {
          if (items[i].getAsFile().type.match("image")) {
            imageFiles.push(items[i].getAsFile());
          }
        }
        if (imageFiles.length > 0) {
          scope.$emit("imagePaste", imageFiles);
          scope.$apply(onImagePaste(scope));
        }
      }); // bind
    } // link
  }; // return
});

