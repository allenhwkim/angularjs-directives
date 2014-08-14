/**
 * To perform action when image is dragged on the document
 */
app.directive("ngdImageDrop", function ($parse) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var onImageDrop = $parse(attrs.onImageDrop); 

      angular.element(document).bind("dragover", function (e) {
        e.preventDefault();
        angular.element(document.body).addClass("dragOver");
      });

      element.bind("dragleave", function(e) {
        e.preventDefault();
        angular.element(document.body).removeClass('dragOver');
      }).bind("drop", function (e) {
        e.preventDefault();
        console.log('e.dataTransfer.files', e.dataTransfer.files);
        angular.element(document.body).removeClass('dragOver');
        var files = [];
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          if (e.dataTransfer.files[i].type.match("image")) {
            files.push(e.dataTransfer.files[i]);
          }
        }
        if (files.length > 0) {
          scope.$emit("imageDrop", files);
          scope.$apply(onImageDrop(scope));
        }
      });
    }
  };
});

