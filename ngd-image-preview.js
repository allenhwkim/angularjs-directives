/**
 * To preview images by adding/removing image files from controller scope
 */
app.directive("ngdImagePreview", function () {
  var ImagePreview = function(s, e, a) {
    this.scope = s;
    this.element = e;
    this.attrs = a;
    this.images = [];
    this.add = function(files) {
      console.log('files', files);
      var _this = this;
      files = files.length ? files : [files];
      console.log('files', files);
      for (var i = 0; i< files.length; i++) {
        var reader = new FileReader();
        reader.onload = function(event) {
          var image = new Image();
          image.src = event.target.result;
          image.width = 250;
          if (_this.images.indexOf(image.src) == -1) {
            _this.images.push(image.src);
            _this.element[0].appendChild(image);
          }
        };
        reader.readAsDataURL(files[i]);
      };
    };
    this.clear = function() {
      this.element.empty();
    }
    return this;
  };
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      scope.imagePreview = new ImagePreview(scope, element, attrs);
    } // link
  }; // return
});

