/**
 * To preview images by adding/removing image files from controller scope
 */
var NGD  = NGD || angular.module('ngd', []);
NGD.directive("ngdImagePreview", function() {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {

      element.attr('draggable', true); // so that, we can remove it
      element.bind('dragleave', function(e)  {
        if (e.target.tagName == "IMG") {
          e.target.parentNode.removeChild(e.target);
        }
      });

      scope.$on('ngd-image-dropped', function(event, options) {
        var getImage = function(src) {
          var width = attrs.ngdImagePreviewWidth || attrs.width;
          var height = attrs.ngdImagePreviewHeight || attrs.height;
          var image = new Image();
          image.src = src;
          width && (image.width = width);
          height && (image.height = height);
          return image;
        }
        var fileOnLoad = function(event) {
          var image = getImage(event.target.result);
          var imgEl = element[0].querySelector("img[src=\""+event.target.result+"\"]");
          if (!imgEl) {
            element[0].appendChild(image);
          }
        };
        if (options.files) {
          for (var i = 0; i< options.files.length; i++) {
            var file = options.files[i];
            var fileReader = new FileReader();
            fileReader.onload = fileOnLoad;
            fileReader.readAsDataURL(file);
          }
        } else if (options.url) {
          var imgEl = element[0].querySelector("img[src=\""+options.url+"\"]");
          if (!imgEl) {
            var image = getImage(options.url);
            element[0].appendChild(image);
          }
        }
      });
    } // link
  }; // return
});
