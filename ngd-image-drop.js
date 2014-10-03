/**
 * To perform action when image is dragged and dropped on and element
 * You can drop image from your file browser as a file or web browser as a url
 */
var NGD = NGD || angular.module('ngd', []);
NGD.directive("ngdImageDrop", ['$parse', function ($parse) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var ngdImageDrop = $parse(attrs.ngdImageDrop); 

      element.bind("dragover", function (e) {
        e.preventDefault();
        element.addClass("dragover");
      });

      element.bind("dragleave", function(e) {
        e.preventDefault();
        angular.element(document.body).removeClass('dragover');
      });
      
      element.bind("drop", function (e) {
        e.preventDefault();
        element.removeClass('dragover');
        var files = [];
        for (var i=0; i<e.dataTransfer.files.length; i++) {
          if (e.dataTransfer.files[i].type.match("image")) {
            files.push(e.dataTransfer.files[i]);
          }
        }
        if (files.length > 0) {
          console.log('files', {files: files});
          scope.$emit("ngd-image-dropped", {files: (files.length ? files : [files])});
          scope.$apply(ngdImageDrop(scope));
        }

        var url = e.dataTransfer.getData('URL');
        if (url.match(/\.(png|gif|jpg)$/)) {
          console.log('url', {url: url});
          scope.$emit("ngd-image-dropped", {url:url});
          scope.$apply(ngdImageDrop(scope));
        }
      });
    }
  };
}]);

